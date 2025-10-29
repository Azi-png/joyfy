import { registerEnumType } from '@nestjs/graphql';

export enum NoticeCategory {
	FAQ = 'FAQ',
	TERMS = 'TERMS',
	INQUIRY = 'INQUIRY',
}
registerEnumType(NoticeCategory, {
	name: 'NoticeCategory',
});

export enum NoticeStatus {
	BLOCKED = 'BLOCKED',
	ACTIVE = 'ACTIVE',
	DELETED = 'DELETED',
}
registerEnumType(NoticeStatus, {
	name: 'NoticeStatus',
});
