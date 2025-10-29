import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	MEMBER = 'MEMBER',
	COURSE = 'COURSE',
	ARTICLE = 'ARTICLE',
	COMMENT = 'COMMENT',
}
registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
