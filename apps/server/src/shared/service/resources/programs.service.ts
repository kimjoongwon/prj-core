import {
	CreateProgramDto,
	QueryProgramDto,
	UpdateProgramDto,
} from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { ProgramsRepository } from "../../repository/programs.repository";

@Injectable()
export class ProgramsService {
	constructor(private readonly repository: ProgramsRepository) {}

	async create(createProgramDto: CreateProgramDto) {
		const program = await this.repository.create({
			data: createProgramDto,
		});

		return program;
	}

	async getManyByQuery(query: QueryProgramDto) {
		const args = query.toArgs<Prisma.ProgramFindManyArgs>();
		const countArgs = query.toCountArgs<Prisma.ProgramCountArgs>();
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

	updateById(id: string, updateProgramDto: UpdateProgramDto) {
		return this.repository.update({
			where: { id },
			data: updateProgramDto,
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
