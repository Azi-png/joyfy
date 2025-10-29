import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { MemberService } from '../member/member.service';
import { BoardArticleService } from '../board-article/board-article.service';

import { NotificationService } from '../notification/notification.service';
import { CommentInput, CommentsInquiry } from '../../libs/dto/comment/comment.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { Comments, Comment } from '../../libs/dto/comment/comment';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { StatisticModifier, T } from '../../libs/types/common';
import { lookupMember } from '../../libs/config';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';
import { CourseService } from '../course/course.service';
import { Course } from '../../libs/dto/course/course';

@Injectable()
export class CommentService {
	constructor(
		@InjectModel('Comment') private readonly commentModel: Model<Comment | null>,
		private readonly memberService: MemberService,
		private readonly courseService: CourseService,
		private readonly boardArticleService: BoardArticleService,
		private readonly notificationService: NotificationService,
	) {}

	// createComment
	public async createComment(memberId: ObjectId, input: CommentInput): Promise<Comment> {
		input.memberId = memberId;
		let result: Comment | null = null;

		try {
			result = await this.commentModel.create(input);
			console.log('[DEBUG] Comment created:', result?._id, 'by', memberId);
		} catch (err) {
			console.log('ERROR on service Model of createComment', err?.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}

		// Notification faqat COURSE comment'lari uchun
		if (input.commentGroup === CommentGroup.COURSE) {
			try {
				console.log('🔍 Creating notification for course comment...');

				const course = await this.courseService.findById(input.commentRefId);
				console.log('🔍 Course found:', {
					_id: course._id,
					courseTitle: course.courseTitle,
					memberId: course.memberId,
				});

				const courseOwnerId = course.memberId;
				const isOwnerComment = String(courseOwnerId) === String(memberId);

				console.log('🔍 Notification check:', {
					courseOwner: String(courseOwnerId),
					commentAuthor: String(memberId),
					isOwnerComment,
				});
				const { courseTitle } = course;

				if (courseOwnerId && !isOwnerComment) {
					console.log('📧 Creating notification for course owner...');
					// 1. Comment yozgan userni topamiz
					const member = await this.memberService.findById(memberId);
					const memberNick = member?.memberNick || 'Someone';

					const notification = await this.notificationService.notify({
						receiverId: courseOwnerId,
						authorId: memberId,
						type: NotificationType.COMMENT,
						group: NotificationGroup.COURSE,
						title: `Your course got a comment from ${memberNick}`,
						desc: `${memberNick} commented on your course "${courseTitle}": "${(input.commentContent || '').trim()}"`,
						courseId: input.commentRefId as any,
						refId: result._id as any,
					});

					console.log('✅ Notification created:', notification._id);
				} else {
					console.log(
						'⚠️ Notification not created:',
						isOwnerComment ? 'Owner commenting on own course' : 'No course owner found',
					);
				}
			} catch (err) {
				console.error('❌ Failed to create notification:', err);
			}
		}

		// Stats updates
		switch (input.commentGroup) {
			case CommentGroup.COURSE:
				await this.courseService.courseStatsEditor({
					_id: input.commentRefId,
					targetKey: 'courseComments',
					modifier: 1,
				});
				break;
			case CommentGroup.ARTICLE:
				await this.boardArticleService.boardArticleStatsEditor({
					_id: input.commentRefId,
					targetKey: 'articleComments',
					modifier: 1,
				});
				break;
			case CommentGroup.MEMBER:
				await this.memberService.memberStatsEditor({
					_id: input.commentRefId,
					targetKey: 'memberComments',
					modifier: 1,
				});
				break;
		}

		if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED);
		return result;
	}

	// updateComment
	public async updateComment(memberId: ObjectId, input: CommentUpdate): Promise<Comment> {
		const { _id } = input;
		const result = await this.commentModel.findOneAndUpdate(
			{ _id, memberId: memberId, commentStatus: CommentStatus.ACTIVE },
			input,
			{ new: true },
		);
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	// getComments
	public async getComments(memberId: ObjectId, input: CommentsInquiry): Promise<Comments> {
		const { commentRefId } = input.search;
		const match: T = { commentRefId: commentRefId, commentStatus: CommentStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.commentModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
							{
								$lookup: {
									from: 'comments',
									localField: '_id',
									foreignField: 'parentId',
									as: 'replies',
								},
							},
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	// removeCommentByUser
	public async removeCommentByUser(memberId: ObjectId, commentId: ObjectId): Promise<Comment> {
		const result = await this.commentModel.findOneAndUpdate(
			{ _id: commentId, memberId: memberId, commentStatus: CommentStatus.ACTIVE },
			{ commentStatus: CommentStatus.DELETE },
			{ new: true },
		);

		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		await this.commentModel.updateMany(
			{ parentId: commentId, commentStatus: CommentStatus.ACTIVE },
			{ commentStatus: CommentStatus.DELETE },
		);

		return result;
	}

	/** ADMIN */

	// removeCommentByAdmin
	public async removeCommentByAdmin(commentId: ObjectId): Promise<Comment> {
		const search: T = { _id: commentId, commentStatus: CommentStatus.DELETE };
		const result = await this.commentModel.findOneAndDelete(search).exec();
		await this.commentModel.updateMany({ parentId: commentId }, { commentStatus: CommentStatus.DELETE });
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
		return result;
	}

	// commentStatsEditor
	public async commentStatsEditor(input: StatisticModifier): Promise<Comment | null> {
		const { _id, targetKey, modifier } = input;
		const updated = await this.commentModel
			.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true })
			.lean()
			.exec();

		return updated as Comment | null;
	}

	// ---- helpers ----
	private mapCommentGroupToNotificationGroup(group: CommentGroup): NotificationGroup {
		switch (group) {
			case CommentGroup.COURSE:
				return NotificationGroup.COURSE;
			case CommentGroup.ARTICLE:
				return NotificationGroup.ARTICLE;
			case CommentGroup.MEMBER:
				return NotificationGroup.MEMBER;
			default:
				return NotificationGroup.COMMENT;
		}
	}
}
