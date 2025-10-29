import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Courses, Course } from '../../libs/dto/course/course';
import { Direction, Message } from '../../libs/enums/common.enum';
import {
	TeacherCoursesInquiry,
	AllCoursesInquiry,
	OrdinaryInquiry,
	CoursesInquiry,
	CourseInput,
} from '../../libs/dto/course/course.input';
import { MemberService } from '../member/member.service';
import { StatisticModifier, T } from '../../libs/types/common';
import { ViewService } from '../view/view.service';
import { CourseStatus } from '../../libs/enums/course.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { CourseUpdate } from '../../libs/dto/course/course.update';
import * as moment from 'moment';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { LikeService } from '../like/like.service';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
@Injectable()
export class CourseService {
	constructor(
		@InjectModel('Course') private readonly courseModel: Model<Course>,
		private memberService: MemberService,
		private viewService: ViewService,
		private likeService: LikeService,
	) {}
	public async findById(id: ObjectId): Promise<Course | null> {
		return this.courseModel.findById(id).exec();
	}

	public async createCourse(input: CourseInput): Promise<Course> {
		try {
			const result = await this.courseModel.create(input);
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberCourses',
				modifier: 1,
			});
			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getCourse(memberId: ObjectId, courseId: ObjectId): Promise<Course> {
		const search: T = {
			_id: courseId,
			courseStatus: CourseStatus.ACTIVE,
		};

		const targetCourse: Course = await this.courseModel.findOne(search).lean().exec();
		if (!targetCourse) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: courseId, viewGroup: ViewGroup.COURSE };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.courseStatsEditor({ _id: courseId, targetKey: 'courseViews', modifier: 1 });
				targetCourse.courseViews++;
			}

			// meLiked

			const likeInput = { memberId: memberId, likeRefId: courseId, likeGroup: LikeGroup.COURSE };
			targetCourse.meLiked = await this.likeService.checkLikeExistence(likeInput);
		}

		targetCourse.memberData = await this.memberService.getMember(null, targetCourse.memberId);
		return targetCourse;
	}

	public async courseStatsEditor(input: StatisticModifier): Promise<Course> {
		const { _id, targetKey, modifier } = input;
		return await this.courseModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
	}

	public async updateCourse(memberId: ObjectId, input: CourseUpdate): Promise<Course> {
		let { courseStatus: courseStatus, cancelledAt, deletedAt } = input;

		const search: any = {
			_id: input._id,
			memberId: memberId,
			courseStatus: CourseStatus.ACTIVE,
		};

		if (courseStatus === CourseStatus.CANCELLED) {
			cancelledAt = moment().toDate();
		} else if (courseStatus === CourseStatus.DELETE) {
			deletedAt = moment().toDate();
		}

		const result = await this.courseModel
			.findOneAndUpdate(search, input, {
				new: true,
			})
			.exec();

		if (!result) {
			throw new InternalServerErrorException(Message.UPDATE_FAILED);
		}

		if (cancelledAt || deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberCourses',
				modifier: -1,
			});
		}

		return result;
	}

	public async getCourses(memberId: ObjectId, input: CoursesInquiry): Promise<Courses> {
		const match: T = { courseStatus: CourseStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		this.shapeMatchQuery(match, input);
		console.log('match:', match);

		const result = await this.courseModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							// meLiked
							lookupAuthMemberLiked(memberId),
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	private shapeMatchQuery(match: T, input: CoursesInquiry): void {
		const {
			memberId,
			locationList,
			durationList,
			agesList,
			typeList,
			formatList,
			periodsRange,
			pricesRange,
			agesRange,
			options,
			text,
		} = input.search;

		if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
		if (locationList && locationList.length) match.courseLocation = { $in: locationList };
		if (durationList && durationList.length) match.courseDuration = { $in: durationList };
		if (agesList && agesList.length) match.courseAge = { $in: agesList };
		if (typeList && typeList.length) match.courseType = { $in: typeList };
		if (formatList && formatList.length) match.courseFormat = { $in: formatList };

		if (pricesRange) match.coursePrice = { $gte: pricesRange.start, $lte: pricesRange.end };
		if (periodsRange) match.createdAt = { $gte: periodsRange.start, $lte: periodsRange.end };
		if (agesRange) match.courseFormat = { $gte: agesRange.start, $lte: agesRange.end };

		if (text) match.courseTitle = { $regex: new RegExp(text, 'i') };
		if (options) {
			match['$or'] = options.map((ele) => {
				return { [ele]: true };
			});
		}
	}

	public async getFavorites(memberId: ObjectId, input: OrdinaryInquiry): Promise<Courses> {
		return await this.likeService.getFavoriteCourses(memberId, input);
	}

	public async getVisited(memberId: ObjectId, input: OrdinaryInquiry): Promise<Courses> {
		return await this.viewService.getVisitedCourses(memberId, input);
	}

	public async getTeacherCourses(memberId: ObjectId, input: TeacherCoursesInquiry): Promise<Courses> {
		const { courseStatus: courseStatus } = input.search;
		if (courseStatus === CourseStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);

		const match: T = {
			memberId: memberId,
			courseStatus: courseStatus ?? { $ne: CourseStatus.DELETE },
		};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.courseModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async likeTargetCourse(memberId: ObjectId, likeRefId: ObjectId): Promise<Course> {
		const target: Course = await this.courseModel.findOne({ _id: likeRefId, courseStatus: CourseStatus.ACTIVE }).exec();
		if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const input: LikeInput = {
			memberId: memberId,
			likeRefId: likeRefId,
			likeGroup: LikeGroup.COURSE,
		};

		const modifier: number = await this.likeService.toggleLike(input);
		const result = await this.courseStatsEditor({ _id: likeRefId, targetKey: 'courseLikes', modifier: modifier });

		if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
		return result;
	}

	public async getAllCoursesByAdmin(input: AllCoursesInquiry): Promise<Courses> {
		const { courseStatus: courseStatus, courseLocationList: courseLocationList } = input.search;

		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (courseStatus) match.courseStatus = courseStatus;
		if (courseLocationList) match.courseLocation = { $in: courseLocationList };

		const result = await this.courseModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async updateClassByAdmin(input: CourseUpdate): Promise<Course> {
		let { courseStatus: courseStatus, cancelledAt: soldAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			courseStatus: CourseStatus.ACTIVE,
		};

		if (courseStatus === CourseStatus.CANCELLED) soldAt = moment().toDate();
		else if (courseStatus === CourseStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.courseModel
			.findOneAndUpdate(search, input, {
				new: true,
			})
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (soldAt || deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberCourses',
				modifier: -1,
			});
		}

		return result;
	}

	public async removeCourseByAdmin(courseId: ObjectId): Promise<Course> {
		const search: T = { _id: courseId, courseStatus: CourseStatus.DELETE };
		const result = await this.courseModel.findOneAndDelete(search).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}
}
