import { Schema } from 'mongoose';
import { CourseFormat, CourseLocation, CourseStatus, CourseType, DaysOfWeek } from '../libs/enums/course.enum';

const CourseSchema = new Schema(
	{
		// propertyType: {
		// 	type: String,
		// 	enum: CourseType,
		// 	required: true,
		// },

		courseType: {
			type: String,
			enum: CourseType,
			required: true,
		},

		// propertyStatus: {
		// 	type: String,
		// 	enum: CourseStatus,
		// 	default: CourseStatus.ACTIVE,
		// },

		courseStatus: {
			type: String,
			enum: CourseStatus,
			default: CourseStatus.ACTIVE,
		},

		// propertyLocation: {
		// 	type: String,
		// 	enum: CourseLocation,
		// 	required: true,
		// },
		courseLocation: {
			type: String,
			enum: CourseLocation,
			required: true,
		},

		// propertyAddress: {
		// 	type: String,
		// 	required: true,
		// },
		courseAddress: {
			type: String,
			required: true,
		},

		// propertyTitle: {
		// 	type: String,
		// 	required: true,
		// },

		courseTitle: {
			type: String,
			required: true,
		},

		// propertyPrice: {
		// 	type: Number,
		// 	required: true,
		// },

		coursePrice: {
			type: Number,
			required: true,
		},

		// propertySquare: {
		// 	type: Number,
		// 	required: true,
		// },

		courseFormat: {
			type: String,
			enum: CourseFormat,
			required: true,
		},

		// propertyBeds: {
		// 	type: Number,
		// 	required: true,
		// },

		courseAge: {
			type: Number,
			required: true,
		},

		// propertyRooms: {
		// 	type: Number,
		// 	required: true,
		// },

		courseDuration: {
			type: Number,
			required: true,
		},

		// propertyViews: {
		// 	type: Number,
		// 	default: 0,
		// },

		courseViews: {
			type: Number,
			default: 0,
		},

		courseLikes: {
			type: Number,
			default: 0,
		},

		courseComments: {
			type: Number,
			default: 0,
		},

		courseRank: {
			type: Number,
			default: 0,
		},

		courseImages: {
			type: [String],
			required: true,
		},

		courseDesc: {
			type: String,
		},

		// propertyBarter: {
		// 	type: Boolean,
		// 	default: false,
		// },
		isOnline: {
			type: Boolean,
			default: false,
		},

		// propertyRent: {
		// 	type: Boolean,
		// 	default: false,
		// },
		isOffline: {
			type: Boolean,
			default: false,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
		authorId: {
			type: Schema.Types.ObjectId,
			// required: true,
			ref: 'Member',
		},

		courseTimes: [
			{
				day: {
					type: String,
					enum: DaysOfWeek,
					required: true,
				},
				time: {
					type: String, // "17:00" formatida
					required: true,
				},
			},
		],

		// kurs davomiyligi
		courseDurationWeeks: {
			type: Number,
			required: true,
		},

		// haftasiga necha marta
		coursesPerWeek: {
			type: Number,
			required: true,
		},

		// umumiy darslar soni (autocalc)
		totalCourses: {
			type: Number,
			default: function () {
				return this.courseDurationWeeks * this.coursesPerWeek;
			},
		},

		//soldAt
		cancelledAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},

		//constructedAt
		startDate: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'courses' },
);

CourseSchema.index({ courseType: 1, courseLocation: 1, courseTitle: 1, coursePrice: 1 }, { unique: true });

export default CourseSchema;
