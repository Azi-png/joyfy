import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_TEACHERS as BATCH_TOP_TEACHERS, BATCH_TOP_COURSES } from './lib/config';

@Controller()
export class BatchController {
	private logger: Logger = new Logger('BatchController');

	constructor(private readonly batchService: BatchService) {}

	@Timeout(1000)
	handleTimeout() {
		this.logger.debug('BATCH SERVER READY!');
	}

	@Cron('00 * * * * *', { name: BATCH_ROLLBACK })
	public async batchRollback() {
		try {
			this.logger['context'] = BATCH_ROLLBACK;
			this.logger.debug('EXECUTED!');
			await this.batchService.batchRollback();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('20 * * * * *', { name: BATCH_TOP_COURSES })
	public async batchTopCourses() {
		try {
			this.logger['context'] = BATCH_TOP_COURSES;
			this.logger.debug('EXECUTED!');
			await this.batchService.batchTopCourses();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('40 * * * * *', { name: BATCH_TOP_TEACHERS })
	public async batchTopTeachers() {
		try {
			this.logger['context'] = BATCH_TOP_TEACHERS;
			this.logger.debug('EXECUTED!');
			await this.batchService.batchTopTeachers();
		} catch (err) {
			this.logger.error(err);
		}
	}
}
