import { Prisma } from "@prisma/client";
import {
	CreateTimelineDto,
	QueryTimelineDto,
} from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";
import { TimelinesRepository } from "../../repository/timeline.repository";

@Injectable()
export class TimelinesService {
	constructor(private readonly repository: TimelinesRepository) {}

	getById(id: string) {
		return this.repository.findUnique({ where: { id } });
	}

	deleteById(id: string) {
		return this.repository.delete({ where: { id } });
	}

	create(createTimeline: CreateTimelineDto) {
		return this.repository.create({
			data: createTimeline,
		});
	}

	async getManyByQuery(query: QueryTimelineDto) {
		const args = query.toArgs<Prisma.TimelineFindManyArgs>();
		const countArgs = query.toCountArgs<Prisma.TimelineCountArgs>();
		const timelines = await this.repository.findMany(args);
		const count = await this.repository.count(countArgs);
		return {
			timelines,
			count,
		};
	}

	updateById(id: string, data: Prisma.TimelineUpdateInput) {
		return this.repository.update({ where: { id }, data });
	}

	removeById(id: string) {
		return this.repository.update({
			where: { id },
			data: { removedAt: new Date() },
		});
	}
}
