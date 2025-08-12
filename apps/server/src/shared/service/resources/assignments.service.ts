import { Injectable } from "@nestjs/common";
import {
	CreateAssignmentDto,
	Prisma,
	QueryAssignmentDto,
	UpdateAssignmentDto,
} from "@shared/schema";
import { AssignmentsRepository } from "../../repository/assignments.repository";

@Injectable()
export class AssignmentsService {
	constructor(private readonly repository: AssignmentsRepository) {}

	getById(id: string) {
		return this.repository.findUnique({
			where: { id },
		});
	}

	create(createAssignmentDto: CreateAssignmentDto) {
		return this.repository.create({
			data: createAssignmentDto,
		});
	}

	updateById(id: string, updateAssignmentDto: UpdateAssignmentDto) {
		return this.repository.update({
			where: { id },
			data: updateAssignmentDto,
		});
	}

	async getManyByQuery(query: QueryAssignmentDto) {
		const args = query.toArgs<Prisma.AssignmentFindManyArgs>();
		const countArgs = query.toCountArgs<Prisma.AssignmentCountArgs>();
		const assignments = await this.repository.findMany(args);
		const count = await this.repository.count(countArgs);
		return {
			assignments,
			count,
		};
	}

	deleteById(id: string) {
		return this.repository.delete({
			where: { id },
		});
	}

	removeById(id: string) {
		return this.repository.update({
			where: { id },
			data: { removedAt: new Date() },
		});
	}
}
