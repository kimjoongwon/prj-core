import {
	CreateRoutineDto,
	QueryRoutineDto,
	UpdateRoutineDto,
} from "@cocrepo/dto";
import { Prisma } from "@cocrepo/prisma";
import { Injectable } from "@nestjs/common";
import { RoutinesRepository } from "../../repository/routines.repository";

@Injectable()
export class RoutinesService {
	constructor(private readonly repository: RoutinesRepository) {}

	async create(createRoutineDto: CreateRoutineDto) {
		const routine = await this.repository.create({
			data: createRoutineDto,
		});

		return routine;
	}

	async getManyByQuery(query: QueryRoutineDto) {
		const args = query.toArgs<Prisma.RoutineFindManyArgs>();
		const countArgs = query.toCountArgs<Prisma.RoutineCountArgs>();
		const items = await this.repository.findMany(args);
		const count = await this.repository.count(countArgs);

		return {
			items,
			count,
		};
	}

	getById(id: string) {
		return this.repository.findUnique({ where: { id } });
	}

	updateById(id: string, updateRoutineDto: UpdateRoutineDto) {
		return this.repository.update({
			where: { id },
			data: updateRoutineDto,
		});
	}

	deleteById(id: string) {
		return this.repository.delete({ where: { id } });
	}

	removeById(id: string) {
		return this.repository.update({
			where: { id },
			data: { removedAt: new Date() },
		});
	}
}
