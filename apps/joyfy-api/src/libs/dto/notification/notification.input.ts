import { Field, InputType } from '@nestjs/graphql';
import { NotificationGroup, NotificationType } from '../../enums/notification.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class CreateNotificationInput {
	@Field(() => NotificationType)
	notificationType: NotificationType;

	@Field(() => NotificationGroup)
	notificationGroup: NotificationGroup;

	@Field(() => String)
	notificationTitle: string;

	@Field(() => String, { nullable: true })
	notificationDesc?: string;

	@Field(() => String)
	receiverId: ObjectId;

	@Field(() => String)
	authorId: ObjectId;

	@Field(() => String, { nullable: true })
	courseId?: ObjectId;

	@Field(() => String, { nullable: true })
	articleId?: ObjectId;

	@Field(() => String, { nullable: true })
	commentId?: ObjectId;

	@Field(() => String, { nullable: true })
	refId?: ObjectId;

	@Field(() => String, { nullable: true })
	authorImage?: string; // ✅ qo‘shildi
}

@InputType()
export class NotificationSearchInput {
	@Field(() => NotificationType, { nullable: true })
	notificationType?: NotificationType;

	@Field(() => String, { nullable: true })
	ownerId?: string; // interpreted as receiverId filter in service
}

@InputType()
export class NotificationsInquiry {
	@Field(() => Number)
	page: number;

	@Field(() => Number)
	limit: number;

	@Field(() => NotificationSearchInput, { nullable: true })
	search?: NotificationSearchInput;
}

@InputType()
export class DeleteNotificationInput {
	@Field(() => String)
	id: string;
}
