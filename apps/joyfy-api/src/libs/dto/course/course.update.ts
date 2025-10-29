import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { CourseFormat, CourseLocation, CourseStatus, CourseType } from '../../enums/course.enum';
import { ObjectId } from 'mongoose';
import { CourseTime } from './coursetime';

@InputType()
export class CourseUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => CourseType, { nullable: true })
	courseType?: CourseType;

	@IsOptional()
	@Field(() => CourseStatus, { nullable: true })
	courseStatus?: CourseStatus;

	@IsOptional()
	@Field(() => CourseLocation, { nullable: true })
	courseLocation?: CourseLocation;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	courseAddress?: string;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	courseTitle?: string;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	coursePrice?: number;

	@IsOptional()
	@Field(() => CourseFormat, { nullable: true })
	courseFormat?: CourseFormat;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Field(() => Int, { nullable: true })
	courseAge?: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Field(() => Int, { nullable: true })
	courseDuration?: number;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	courseImages?: string[];

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	courseDesc?: string;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	isOnline?: boolean;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	isOffline?: boolean;

	@IsOptional()
	@Field(() => [CourseTime], { nullable: true })
	courseTimes?: CourseTime[];

	@IsOptional()
	@IsInt()
	@Min(1)
	@Field(() => Int, { nullable: true })
	courseDurationWeeks?: number;

	// MUAMMO 2: Schema da courseClassesPerWeek, lekin bu yerda yo'q
	@IsOptional()
	@IsInt()
	@Min(1)
	@Field(() => Int, { nullable: true })
	coursesPerWeek?: number; // Bu qo'shilmagan edi

	cancelledAt?: Date;

	deletedAt?: Date;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	startDate?: Date;
}
