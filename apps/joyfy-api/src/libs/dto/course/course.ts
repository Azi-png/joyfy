import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { CourseFormat, CourseLocation, CourseStatus, CourseType } from '../../enums/course.enum';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';
import { CourseTime } from './coursetime';

@ObjectType()
export class Course {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => CourseType)
	courseType: CourseType;

	@Field(() => CourseStatus)
	courseStatus: CourseStatus;

	@Field(() => CourseLocation)
	courseLocation: CourseLocation;

	@Field(() => String)
	courseAddress: string;

	@Field(() => String)
	courseTitle: string;

	@Field(() => Number)
	coursePrice: number;

	@Field(() => CourseFormat)
	courseFormat: CourseFormat;

	@Field(() => Int)
	courseAge: number;

	@Field(() => Int)
	courseDuration: number;

	@Field(() => Int)
	courseViews: number;

	@Field(() => Int)
	courseLikes: number;

	@Field(() => Int)
	courseComments: number;

	@Field(() => Int)
	courseRank: number;

	@Field(() => [String])
	courseImages: string[];

	@Field(() => String, { nullable: true })
	courseDesc?: string;

	@Field(() => Boolean)
	isOnline: boolean;

	@Field(() => Boolean)
	isOffline: boolean;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => [CourseTime])
	courseTimes: CourseTime[];

	@Field(() => Int)
	courseDurationWeeks: number;

	@Field(() => Int)
	coursesPerWeek: number;

	@Field(() => Int)
	totalCourses: number;

	@Field(() => Date, { nullable: true })
	cancelledAt?: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date, { nullable: true })
	startDate?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
	//from aggregation

	@Field(() => [MeLiked], { nullable: true })
	meLiked?: MeLiked[];

	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Courses {
	@Field(() => [Course])
	list: Course[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
