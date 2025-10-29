import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Courses, Course } from '../../libs/dto/course/course';
import {
	TeacherCoursesInquiry,
	AllCoursesInquiry,
	OrdinaryInquiry,
	CoursesInquiry,
	CourseInput,
} from '../../libs/dto/course/course.input';
import { ObjectId } from 'mongoose';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { CourseUpdate } from '../../libs/dto/course/course.update';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver()
export class CourseResolver {
	constructor(private readonly courseService: CourseService) {}

	@Roles(MemberType.TEACHER)
	@UseGuards(RolesGuard)
	@Mutation(() => Course)
	public async createCourse(@Args('input') input: CourseInput, @AuthMember('_id') memberId: ObjectId): Promise<Course> {
		console.log('Mutation: createCourse');
		input.memberId = memberId;
		return await this.courseService.createCourse(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Course)
	public async getCourse(@Args('courseId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Course> {
		console.log('Query: getCourse');
		const courseId = shapeIntoMongoObjectId(input);
		return await this.courseService.getCourse(memberId, courseId);
	}

	@Roles(MemberType.TEACHER)
	@UseGuards(RolesGuard)
	@Mutation(() => Course)
	public async updateCourse(
		@Args('input') input: CourseUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Course> {
		console.log('Mutation: updateCourse');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.courseService.updateCourse(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query(() => Courses)
	public async getCourses(
		@Args('input') input: CoursesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Courses> {
		console.log('Query: getCourses');
		return await this.courseService.getCourses(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => Courses)
	public async getFavorites(
		@Args('input') input: OrdinaryInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Courses> {
		console.log('Query: getFavorites');
		return await this.courseService.getFavorites(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => Courses)
	public async getVisited(
		@Args('input') input: OrdinaryInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Courses> {
		console.log('Query: getVisited');
		return await this.courseService.getVisited(memberId, input);
	}

	@Roles(MemberType.TEACHER)
	@UseGuards(RolesGuard)
	@Query(() => Courses)
	public async getTeacherCourses(
		@Args('input') input: TeacherCoursesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Courses> {
		console.log('Query: getTeacherCourses');
		return await this.courseService.getTeacherCourses(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Course)
	public async likeTargetCourse(
		@Args('courseId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Course> {
		console.log('Mutation: likeTargetCourse');
		const likeRefId = shapeIntoMongoObjectId(input);
		return await this.courseService.likeTargetCourse(memberId, likeRefId);
	}

	/** ADMIN **/
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Courses)
	public async getAllCoursesByAdmin(
		@Args('input') input: AllCoursesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Courses> {
		console.log('Query: getAllCoursesByAdmin');
		return await this.courseService.getAllCoursesByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Course)
	public async updateClassByAdmin(@Args('input') input: CourseUpdate): Promise<Course> {
		console.log('Mutation: updateClassByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.courseService.updateClassByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Course)
	public async removeCourseByAdmin(@Args('courseId') input: string): Promise<Course> {
		console.log('Mutation: removeCourseByAdmin');
		const courseId = shapeIntoMongoObjectId(input);
		return await this.courseService.removeCourseByAdmin(courseId);
	}
}
