import { registerEnumType } from '@nestjs/graphql';

export enum FaqStatus {
	ACTIVE = 'ACTIVE',
	BLOCKED = 'BLOCKED',
	DELETED = 'DELETED',
}

registerEnumType(FaqStatus, {
	name: 'FaqStatus',
});

export enum FaqCategory {
	GENERAL = 'GENERAL',
	FOR_STUDENTS = 'FOR_STUDENTS',
	FOR_TEACHERS = 'FOR_TEACHERS',
	MEMBERSHIP = 'MEMBERSHIP',
	COMMUNITY = 'COMMUNITY',
	PAYMENT = 'PAYMENT',
	COURSE = 'COURSE',
	OTHERS = 'OTHERS',
}

registerEnumType(FaqCategory, {
	name: 'FaqCategory',
});
