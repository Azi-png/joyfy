import { Module } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { LikeService } from './like.service';
import { MongooseModule } from '@nestjs/mongoose';
import LikeSchema from '../../schemas/Like.model';
import CourseSchema from '../../schemas/Course.model';
import BoardArticleSchema from '../../schemas/BoardArticle.model';
import MemberSchema from '../../schemas/Member.model';
import CommentSchema from '../../schemas/Comment.model';
import NotificationSchema from '../../schemas/Notification.model'; // 🔥 qo‘shish kerak
import { NotificationGateway } from '../notification/notification.gateway'; // agar ishlatayotgan bo‘lsangiz

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Like', schema: LikeSchema },
			{ name: 'Course', schema: CourseSchema },
			{ name: 'BoardArticle', schema: BoardArticleSchema },
			{ name: 'Member', schema: MemberSchema },
			{ name: 'Comment', schema: CommentSchema },
			{ name: 'Notification', schema: NotificationSchema }, // 🔥 qo‘shildi
		]),
	],
	providers: [LikeService, NotificationService, NotificationGateway],
	exports: [LikeService],
})
export class LikeModule {}
