import {
	CreateExerciseDto,
	QueryExerciseDto,
	UpdateExerciseDto,
} from "@cocrepo/dto";
import { Prisma } from "@cocrepo/prisma";
import { Injectable } from "@nestjs/common";
import { ExercisesRepository } from "@cocrepo/repository";
import { ContextService } from "../utils";

@Injectable()
export class ExercisesService {
	constructor(
		private readonly repository: ExercisesRepository,
		private readonly contextService: ContextService,
	) {}

	async create(createExerciseDto: CreateExerciseDto) {
		const tenantId = this.contextService.getTenantId();
		if (!tenantId) {
			throw new Error("No tenantId in context");
		}
		const { name, count, duration } = createExerciseDto;

		const exercise = await this.repository.create({
			data: {
				name,
				count,
				duration,
				task: {
					create: {
						tenantId,
					},
				},
			},
		});

		return exercise;
	}
	async getManyByQuery(query: QueryExerciseDto) {
		const args = query.toArgs<Prisma.ExerciseFindManyArgs>();
		const countArgs = query.toCountArgs<Prisma.ExerciseCountArgs>();
		const exercises = await this.repository.findMany(args);
		const count = await this.repository.count(countArgs);

		return {
			exercises,
			count,
		};
	}

	getById(id: string) {
		return this.repository.findUnique({ where: { id } });
	}

	updateById(id: string, updateExerciseDto: UpdateExerciseDto) {
		const { count, duration } = updateExerciseDto;
		return this.repository.update({
			where: { id },
			data: {
				count,
				duration,
			},
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
