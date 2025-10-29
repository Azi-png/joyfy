import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { CourseFormat, CourseLocation, CourseStatus, CourseType, DaysOfWeek } from '../../enums/course.enum';
import { ObjectId } from 'mongoose';
import { availableOptions, availableCourseSorts as availableCourseSorts } from '../../config';
import { Direction } from '../../enums/common.enum';
import { CourseTime } from './coursetime';

@InputType()
export class CourseInput {
	@IsNotEmpty()
	@Field(() => CourseType)
	courseType: CourseType;

	@IsNotEmpty()
	@Field(() => CourseLocation)
	courseLocation: CourseLocation;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	courseAddress: string;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	courseTitle: string;

	@IsNotEmpty()
	@Field(() => Number)
	coursePrice: number;

	// @IsNotEmpty()
	// @Field(() => Number)
	// propertySquare: number;

	@IsNotEmpty()
	@Field(() => CourseFormat)
	courseFormat: CourseFormat;

	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Field(() => Int)
	courseAge: number;

	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Field(() => Int)
	courseDuration: number;

	@IsNotEmpty()
	@Field(() => [String])
	courseImages: string[];

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

	memberId: ObjectId;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	startDate?: Date;

	@IsNotEmpty()
	@Field(() => [CourseTime])
	courseTimes: CourseTime[];

	@IsNotEmpty()
	@Field(() => Int)
	courseDurationWeeks: number;

	@IsNotEmpty()
	@Field(() => Int)
	coursesPerWeek: number;
}

@InputType()
export class PricesRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
export class AgesRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
export class PeriodsRange {
	@Field(() => Date)
	start: Date;

	@Field(() => Date)
	end: Date;
}

@InputType()
class PISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@Field(() => [CourseLocation], { nullable: true })
	locationList?: CourseLocation[];

	@IsOptional()
	@Field(() => [CourseType], { nullable: true })
	typeList?: CourseType[];

	@IsOptional()
	@Field(() => [Int], { nullable: true })
	durationList?: Number[];

	@IsOptional()
	@Field(() => [Int], { nullable: true })
	agesList?: Number[];

	@IsOptional()
	@IsIn(availableOptions, { each: true })
	@Field(() => [String], { nullable: true })
	options?: string[];

	@IsOptional()
	@Field(() => PricesRange, { nullable: true })
	pricesRange?: PricesRange;

	@IsOptional()
	@Field(() => PeriodsRange, { nullable: true })
	periodsRange?: PeriodsRange;

	@IsOptional()
	@Field(() => AgesRange, { nullable: true })
	agesRange?: AgesRange;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;

	// ======= BU YANGI FIELD QO'SHILDI =======
	@IsOptional()
	@Field(() => [DaysOfWeek], { nullable: true })
	daysOfWeekList?: DaysOfWeek[];

	// ======= YOKI AGAR CourseFormat FIELD'I YO'Q BO'LSA =======
	@IsOptional()
	@Field(() => [CourseFormat], { nullable: true })
	formatList?: CourseFormat[];
}

@InputType()
export class CoursesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableCourseSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => PISearch)
	search: PISearch;
}

@InputType()
class APISearch {
	@IsOptional()
	@Field(() => CourseStatus, { nullable: true })
	courseStatus?: CourseStatus;
}

@InputType()
export class TeacherCoursesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableCourseSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => APISearch)
	search: APISearch;
}

@InputType()
class ALPISearch {
	@IsOptional()
	@Field(() => CourseStatus, { nullable: true })
	courseStatus?: CourseStatus;

	@IsOptional()
	@Field(() => [CourseLocation], { nullable: true })
	courseLocationList?: CourseLocation[];
}

@InputType()
export class AllCoursesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableCourseSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => ALPISearch)
	search: ALPISearch;
}

@InputType()
export class OrdinaryInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;
}
