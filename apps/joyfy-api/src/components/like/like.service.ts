import { Comment } from './../../libs/dto/comment/comment';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { OrdinaryInquiry } from '../../libs/dto/course/course.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupFavorite } from '../../libs/config';
import { Course, Courses } from '../../libs/dto/course/course';
import { NotificationService } from '../notification/notification.service'; // import NotificationService
import { NotificationType, NotificationGroup } from '../../libs/enums/notification.enum';
import { Member } from '../../libs/dto/member/member';
import { BoardArticle } from '../../libs/dto/board-article/board-article';

@Injectable()
export class LikeService {
	constructor(
		@InjectModel('Like') private readonly likeModel: Model<Like>,
		@InjectModel('Course') private readonly courseModel: Model<Course>,
		@InjectModel('BoardArticle') private readonly articleModel: Model<BoardArticle>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		@InjectModel('Comment') private readonly commentModel: Model<Comment>,
		private readonly notificationService: NotificationService,
	) {}

	// toggleLike
	public async toggleLike(input: LikeInput): Promise<number> {
		const search: T = { memberId: input.memberId, likeRefId: input.likeRefId };
		const exist = await this.likeModel.findOne(search).exec();
		let modifier = 1;

		if (exist) {
			await this.likeModel.findOneAndDelete(search).exec();
			modifier = -1;
		} else {
			try {
				await this.likeModel.create(input);

				const member = await this.memberModel.findById(input.memberId).exec();
				const memberNick = member?.memberNick || 'Someone';

				let notificationTitle = '';
				let notificationDesc = '';

				switch (input.likeGroup) {
					case LikeGroup.COURSE: {
						const course = await this.courseModel.findById(input.likeRefId).exec();
						const courseName = course?.courseTitle || 'your course';
						notificationTitle = `Your course got a like!`;
						notificationDesc = `${memberNick} liked your course: '${courseName}'.`;
						break;
					}
					case LikeGroup.ARTICLE: {
						const article = await this.articleModel.findById(input.likeRefId).exec();
						const articleTitle = article?.articleTitle || 'your article';
						notificationTitle = `Your article was liked!`;
						notificationDesc = `${memberNick} liked your article: '${articleTitle}'.`;
						break;
					}
					case LikeGroup.COMMENT: {
						const comment = await this.commentModel.findById(input.likeRefId).exec();
						const commentContent = comment?.commentContent || 'your comment';
						notificationTitle = `New Like Comment!`;
						notificationDesc = `${memberNick} liked your comment: '${commentContent}'.`;
						break;
					}
					case LikeGroup.MEMBER: {
						notificationTitle = `New Profile Like!`;
						notificationDesc = `${memberNick} liked your profile on ${new Date().toLocaleDateString()}.`;
						break;
					}
					default: {
						notificationTitle = `New Content Like!`;
						notificationDesc = `${memberNick} liked your content on ${new Date().toLocaleDateString()}.`;
					}
				}

				const receiverId = await this.getOwnerIdForLike(input);
				if (!receiverId) {
					console.warn('No receiverId found for like notification, skipping notification creation');
				} else if (receiverId.toString() === input.memberId.toString()) {
					console.log('User liked their own content, skipping notification');
				} else {
					console.log('Creating notification for receiverId:', receiverId.toString());

					await this.notificationService.createNotification({
						notificationType: NotificationType.LIKE,
						notificationGroup: this.mapLikeGroupToNotificationGroup(input.likeGroup),
						notificationTitle,
						notificationDesc,
						authorId: input.memberId,
						receiverId,
						courseId: input.likeGroup === LikeGroup.COURSE ? input.likeRefId : undefined,
						articleId: input.likeGroup === LikeGroup.ARTICLE ? input.likeRefId : undefined,
						commentId: input.likeGroup === LikeGroup.COMMENT ? input.likeRefId : undefined,
					});
				}
			} catch (err) {
				console.error('ERROR on toggleLike:', err);
				throw new BadRequestException(Message.CREATE_FAILED);
			}
		}
		console.log(`- Like Modifier ${modifier} -`);
		return modifier;
	}

	// mapLikeGroupToNotificationGroup
	private mapLikeGroupToNotificationGroup(likeGroup: LikeGroup): NotificationGroup {
		switch (likeGroup) {
			case LikeGroup.COURSE:
				return NotificationGroup.COURSE;
			case LikeGroup.ARTICLE:
				return NotificationGroup.ARTICLE;
			case LikeGroup.MEMBER:
				return NotificationGroup.MEMBER;
			default:
				return NotificationGroup.MEMBER;
		}
	}

	// getOwnerIdForLike
	private async getOwnerIdForLike(input: LikeInput): Promise<ObjectId> {
		switch (input.likeGroup) {
			case LikeGroup.MEMBER:
				return input.likeRefId;
			case LikeGroup.COURSE: {
				const course = await this.courseModel.findById(input.likeRefId).exec();
				if (!course) throw new BadRequestException(`Course not found: ${input.likeRefId}`);
				return course.memberId;
			}
			case LikeGroup.ARTICLE: {
				const article = await this.articleModel.findById(input.likeRefId).exec();
				if (!article) throw new BadRequestException(`Article not found: ${input.likeRefId}`);
				return article.memberId;
			}
			default:
				throw new BadRequestException(`Unsupported like group: ${input.likeGroup}`);
		}
	}

	// checkLikeExistence
	public async checkLikeExistence(input: LikeInput): Promise<MeLiked[]> {
		const { memberId, likeRefId } = input;
		const result = await this.likeModel.findOne({ memberId: memberId, likeRefId: likeRefId }).exec();
		return result ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }] : [];
	}

	// getFavoriteCourses
	public async getFavoriteCourses(memberId: ObjectId, input: OrdinaryInquiry): Promise<Courses> {
		const { page, limit } = input;
		const match: T = { likeGroup: LikeGroup.COURSE, memberId: memberId };

		const data: T = await this.likeModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'courses',
						localField: 'likeRefId',
						foreignField: '_id',
						as: 'favoriteCourse',
					},
				},
				{ $unwind: '$favoriteCourse' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupFavorite,
							{ $unwind: '$favoriteCourse.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		console.log('data:', data);
		const result: Courses = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele) => ele.favoriteCourse);
		return result;
	}
}
