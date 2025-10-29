import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from 'apps/joyfy-api/src/libs/dto/member/member';
import { Course } from 'apps/joyfy-api/src/libs/dto/course/course';
import { MemberStatus, MemberType } from 'apps/joyfy-api/src/libs/enums/member.enum';
import { CourseStatus } from 'apps/joyfy-api/src/libs/enums/course.enum';
import { Model } from 'mongoose';

@Injectable()
export class BatchService {
	constructor(
		@InjectModel('Course') private readonly courseModel: Model<Course>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
	) {}

	public async batchRollback(): Promise<void> {
		await this.courseModel
			.updateMany(
				{
					courseStatus: CourseStatus.ACTIVE,
				},
				{
					courseRank: 0,
				},
			)
			.exec();

		await this.memberModel
			.updateMany(
				{
					memberStatus: MemberStatus.ACTIVE,
					memberType: MemberType.TEACHER,
				},
				{
					memberRank: 0,
				},
			)
			.exec();
	}

	public async batchTopCourses(): Promise<void> {
		const courses: Course[] = await this.courseModel
			.find({
				courseStatus: CourseStatus.ACTIVE,
				courseRank: 0,
			})
			.exec();

		const promisedList = courses.map(async (ele: Course) => {
			const { _id, courseLikes: courseLikes, courseViews: courseViews } = ele;
			const rank = courseLikes * 2 + courseViews * 1;
			return await this.courseModel.findByIdAndUpdate(_id, { courseRank: rank });
		});
		await Promise.all(promisedList);
	}

	public async batchTopTeachers(): Promise<void> {
		const teachers: Member[] = await this.memberModel
			.find({
				memberType: MemberType.TEACHER,
				memberStatus: MemberStatus.ACTIVE,
				memberRank: 0,
			})
			.exec();

		const promisedList = teachers.map(async (ele: Member) => {
			const { _id, memberCourses: memberCourses, memberLikes, memberArticles, memberViews } = ele;
			const rank = memberCourses * 5 + memberArticles * 3 + memberLikes * 2 + memberViews * 1;
			return await this.memberModel.findByIdAndUpdate(_id, { memberRank: rank });
		});

		await Promise.all(promisedList);
		console.log('ww', promisedList);
	}

	public getHello(): string {
		return 'Welcome to Nestar BATCH Server!';
	}
}
