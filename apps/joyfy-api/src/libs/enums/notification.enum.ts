import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
	LIKE = 'LIKE',
	COMMENT = 'COMMENT',
	FOLLOW = 'FOLLOW',
	NEW_COURSE = 'NEW_COURSE',
	ORDER = 'ORDER',
	NOTICE = 'NOTICE',
	MESSAGE = 'MESSAGE',
}
registerEnumType(NotificationType, {
	name: 'NotificationType',
});

export enum NotificationStatus {
	WAIT = 'WAIT',
	READ = 'READ',
}
registerEnumType(NotificationStatus, {
	name: 'NotificationStatus',
});

export enum NotificationGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	COURSE = 'COURSE',
	COMMENT = 'COMMENT',
	NOTICE = 'NOTICE',
}
registerEnumType(NotificationGroup, {
	name: 'NotificationGroup',
});
