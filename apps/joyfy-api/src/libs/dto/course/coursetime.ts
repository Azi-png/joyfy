import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { DaysOfWeek } from '../../enums/course.enum';

// Input va Output uchun umumiy base class
@InputType('CourseTimeInput')
@ObjectType('CourseTimeObject')
export class CourseTime {
	@IsNotEmpty()
	@Field(() => DaysOfWeek)
	day: DaysOfWeek;

	@IsNotEmpty()
	@Field(() => String)
	time: string; // "17:00" formatida
}
