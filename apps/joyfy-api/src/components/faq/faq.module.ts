import { AuthModule } from './../auth/auth.module';
// faq.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FaqResolver } from './faq.resolver';
import { FaqService } from './faq.service';

import { NotificationModule } from '../notification/notification.module';
import { FaqSchema } from '../../schemas/Faq.model';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Faq', schema: FaqSchema }]), AuthModule, NotificationModule],
	providers: [FaqResolver, FaqService],
	exports: [FaqService, MongooseModule],
})
export class FaqModule {}
