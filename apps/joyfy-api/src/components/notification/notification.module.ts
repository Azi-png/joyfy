import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import NotificationSchema from '../../schemas/Notification.model';
import MemberSchema from '../../schemas/Member.model';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';

import { AuthModule } from '../auth/auth.module';
import { NotificationGateway } from './notification.gateway';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Notification', schema: NotificationSchema },
			{ name: 'Member', schema: MemberSchema },
		]),
		AuthModule,
	],
	providers: [NotificationService, NotificationResolver, NotificationGateway],
	exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
