import { Injectable } from "@nestjs/common";
import { CreateSessionDto, Prisma, QuerySessionDto } from "@shared/schema";
import { SessionsRepository } from "../../repository/sessions.repository";

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

	updateById(id: string, data: Prisma.SessionUpdateInput) {
		return this.repository.update({ where: { id }, data });
	}

	removeById(id: string) {
		return this.repository.update({
			where: { id },
			data: { removedAt: new Date() },
		});
	}
}
