import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { Properties } from '../../libs/dto/property/property';
import { lookupFavorite } from '../../libs/config';
import { OrdinaryInquiry } from '../../libs/dto/property/property.input';
import { LikeGroup } from '../../libs/enums/like.enum';

@Injectable()
export class LikeService {
	constructor(@InjectModel('Like') private readonly likeModel: Model<Like>) {}

	public async toggleLike(input: LikeInput): Promise<number> {
		const search: T = { memberId: input.memberId, likeRefId: input.likeRefId },
			exist = await this.likeModel.findOne(search).exec();
		let modifier = 1;

		if (exist) {
			await this.likeModel.findOneAndDelete(search).exec();
			modifier = -1;
		} else {
			try {
				await this.likeModel.create(input);
			} catch (err) {
				console.log('Error, Service.model:', err.message);
				throw new BadRequestException(Message.CREATE_FAILED);
			}
		}

		console.log(`~ Like modifier ${modifier} ~`);
		return modifier;
	}

	public async checkLikeExistence(input: LikeInput): Promise<MeLiked[]> {
		const { memberId, likeRefId } = input;
		const result = await this.likeModel.findOne({ memberId: memberId, likeRefId: likeRefId }).exec();
		return result ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }] : [];
	}

	public async getFavoriteProperties(memberId: ObjectId, input: OrdinaryInquiry): Promise<Properties> {
		const { page, limit } = input;
		const match: T = { likeGroup: LikeGroup.PROPERTY, memberId: memberId };
		//"Shu odam yoqtirgan uylarnigina olib kel."

		const data: T = await this.likeModel
			.aggregate([
				{ $match: match }, //Yoqtirilganlar ichidan uylar (PROPERTY) va shu odamga tegishlilarini oladi.

				{ $sort: { updatedAt: -1 } }, //eng yangi yoqtirganlar avval chiqadi.
				{
					$lookup: {
						//uyni olib kelish
						from: 'properties', // properties collectionga boradi, uni id si bilan like ref id bilan solishtiradi mos klesa fav properti nomi bilan olib ke;adi
						localField: 'likeRefId',
						foreignField: '_id',
						as: 'favoriteProperty',
					},
				},
				{ $unwind: '$favoriteProperty' },
				{
					$facet: {
						//natijani ikkiga bo'lish
						list: [
							// asosiy royhat

							{ $skip: (page - 1) * limit },
							{ $limit: limit }, // bu sahifalash
							lookupFavorite, // memebrs collga borib osha propertyni egasini malumotini apkelavalamiz.
							{ $unwind: '$favoriteProperty.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		//“Bo‘sh idish tayyorlaymiz: ro‘yxat + umumiy soni bilan”
		const result: Properties = { list: [], metaCounter: data[0].metaCounter };
		// betta listni ichida 3ta narsa bor, 1-like hujjat, 2- qaysi propertyga bosilgani,3- osha propertyni egasi, lekin bizga hammasi kkmas bizga fqat propertyni ozi kk , shunga map qilib ichidan favourite propertyni ajratib olib uni resultga yozyapmiz ekan.
		result.list = data[0].list.map((ele) => ele.favoriteProperty);

		return result;
		//ohirida modify qilingan resultni juborvoramiz.
	}
}
