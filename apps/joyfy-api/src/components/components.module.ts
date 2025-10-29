import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';
import { FollowModule } from './follow/follow.module';
import { BoardArticleModule } from './board-article/board-article.module';
import { MemberModule } from './member/member.module';
import { CourseModule } from './course/course.module';
import { NoticeModule } from './notice/notice.module';
import { FaqModule } from './faq/faq.module';
// import { NotificationModule } from './notification/notification.module';

@Module({
	imports: [
		CourseModule,
		AuthModule,
		CommentModule,
		LikeModule,
		ViewModule,
		FollowModule,
		BoardArticleModule,
		MemberModule,
		NoticeModule,
		FaqModule,
		// NotificationModule,
	],
})
export class ComponentsModule {}
