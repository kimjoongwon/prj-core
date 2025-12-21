import { Prisma } from "@prisma/client";
import {
	CreateSubjectDto,
	QuerySubjectDto,
} from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";
import { SubjectsRepository } from "../../repository/subjects.repository";

@Injectable()
export class SubjectsService {
	constructor(private readonly repository: SubjectsRepository) {}

	getById(id: string) {
		return this.repository.findUnique({ where: { id } });
	}

	deleteById(id: string) {
		return this.repository.delete({ where: { id } });
	}

	create(createSubjectDto: CreateSubjectDto) {
		return this.repository.create({
			data: createSubjectDto,
		});
	}

	async getManyByQuery(query?: QuerySubjectDto) {
		const args = query?.toArgs();
		const countArgs = query?.toCountArgs<Prisma.SubjectCountArgs>();
		const subjects = args ? await this.repository.findMany(args) : [];
		const count = countArgs ? await this.repository.count(countArgs) : 0;
		return {
			subjects,
			count,
		};
	}

	updateById(id: string, data: Prisma.SubjectUpdateInput) {
		return this.repository.update({ where: { id }, data });
	}

	removeById(id: string) {
		return this.repository.update({
			where: { id },
			data: { removedAt: new Date() },
		});
	}
}
