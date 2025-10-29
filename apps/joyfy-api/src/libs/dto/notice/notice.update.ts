import { Field, InputType } from '@nestjs/graphql';
import { NoticeStatus } from '../../enums/notice.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class UpdateNoticeInput {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => NoticeStatus, { nullable: true })
	noticeStatus?: NoticeStatus;

	@Field({ nullable: true })
	noticeTitle?: string;

	@Field({ nullable: true })
	noticeContent?: string;
}
