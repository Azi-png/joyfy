import { registerEnumType } from '@nestjs/graphql';

export enum InquiryType {
	GENERAL = 'GENERAL',
	DELIVERY = 'DELIVERY',
	COURSE = 'COURSE',
	ACCOUNT = 'ACCOUNT',
}
registerEnumType(InquiryType, { name: 'InquiryType' });
