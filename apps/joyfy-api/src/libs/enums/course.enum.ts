import { registerEnumType } from '@nestjs/graphql';

// export enum PropertyType {
// 	APARTMENT = 'APARTMENT',
// 	VILLA = 'VILLA',
// 	HOUSE = 'HOUSE',
// }

export enum CourseType {
	ENGLISH = 'ENGLISH',
	MATH = 'MATH',
	OTHER = 'OTHER',
	// SCIENCE = 'SCIENCE',
	// JUST_FOR_FUN = 'JUST_FOR_FUN',
	// MUSIC = 'MUSIC',
	// CODING = 'CODING',
	// LANGUAGES = 'LANGUAGES',
	// WORLD_LANGUAGES = 'WORLD_LANGUAGES',
	// SPORT = 'SPORT',
}
registerEnumType(CourseType, {
	name: 'CourseType',
});

// export enum PropertyStatus {
// 	ACTIVE = 'ACTIVE',
// 	SOLD = 'SOLD',
// 	DELETE = 'DELETE',
// }
export enum CourseStatus {
	ACTIVE = 'ACTIVE',
	CANCELLED = 'CANCELLED',
	DELETE = 'DELETE',
}

registerEnumType(CourseStatus, {
	name: 'CourseStatus',
});

export enum CourseLocation {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	INCHEON = 'INCHEON',
	DAEGU = 'DAEGU',
	GYEONGJU = 'GYEONGJU',
	GWANGJU = 'GWANGJU',
	CHONJU = 'CHONJU',
	DAEJON = 'DAEJON',
	JEJU = 'JEJU',
}
registerEnumType(CourseLocation, {
	name: 'CourseLocation',
});

export enum CourseFormat {
	GROUP_CLASS = 'GROUP_CLASS',
	ONE_ON_ONE_TUTORING = 'ONE_ON_ONE_TUTORING',
}

registerEnumType(CourseFormat, {
	name: 'CourseFormat',
});

export enum DaysOfWeek {
	MONDAY = 'MONDAY',
	TUESDAY = 'TUESDAY',
	WEDNESDAY = 'WEDNESDAY',
	THURSDAY = 'THURSDAY',
	FRIDAY = 'FRIDAY',
	SATURDAY = 'SATURDAY',
	SUNDAY = 'SUNDAY',
}

// GraphQL uchun ro‘yxatga olish
registerEnumType(DaysOfWeek, {
	name: 'DaysOfWeek', // GraphQL schema'dagi nomi
});
