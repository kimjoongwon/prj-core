import {
	CreateSessionDto,
	QuerySessionDto,
	UpdateSessionDto,
} from "@cocrepo/dto";
import { Prisma } from "@cocrepo/prisma";
import { Injectable } from "@nestjs/common";
import { SessionsRepository } from "@cocrepo/repository";

@Injectable()
export class SessionsService {
	constructor(private readonly repository: SessionsRepository) {}

	getById(id: string) {
		return this.repository.findUnique({ where: { id } });
	}

	deleteById(id: string) {
		return this.repository.delete({ where: { id } });
	}

	create(createSessionDto: CreateSessionDto) {
		return this.repository.create({
			data: createSessionDto,
		});
	}

	async getManyByQuery(query: QuerySessionDto) {
		const args = query.toArgs<Prisma.SessionFindManyArgs>();
		const countArgs = query.toCountArgs<Prisma.SessionCountArgs>();
		const sessions = await this.repository.findMany(args);
		const count = await this.repository.count(countArgs);
		return {
			sessions,
			count,
		};
	}

	updateById(
		id: string,
		{ seq, timelineId, programs, timeline, ...data }: UpdateSessionDto,
	) {
		return this.repository.update({ where: { id }, data: data });
	}

	removeById(id: string) {
		return this.repository.update({
			where: { id },
			data: { removedAt: new Date() },
		});
	}
}
