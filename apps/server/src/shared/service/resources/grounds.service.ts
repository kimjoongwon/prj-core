import { CreateGroundDto, QueryGroundDto, UpdateGroundDto } from "@cocrepo/dto";
import { Ground } from "@cocrepo/entity";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { GroundsRepository } from "../../repository/grounds.repository";

@Injectable()
export class GroundsService {
	constructor(private readonly groundsRepository: GroundsRepository) {}

	async create(createGroundDto: CreateGroundDto): Promise<Ground> {
		const args = {
			data: createGroundDto,
			include: {
				space: true,
			},
		};
		return this.groundsRepository.create(args);
	}

	async getById(id: string): Promise<Ground> {
		const args = {
			where: { id },
			include: {
				space: true,
			},
		};
		return this.groundsRepository.findUnique(args);
	}

	async updateById(
		id: string,
		updateGroundDto: UpdateGroundDto,
	): Promise<Ground> {
		const args = {
			where: { id },
			data: updateGroundDto,
			include: {
				space: true,
			},
		};
		return this.groundsRepository.update(args);
	}

	async removeById(id: string): Promise<Ground> {
		const args = {
			where: { id },
			data: { removedAt: new Date() },
			include: {
				space: true,
			},
		};
		return this.groundsRepository.update(args);
	}

	async deleteById(id: string): Promise<Ground> {
		return this.groundsRepository.delete({
			where: { id },
		});
	}

	async getManyByQuery(
		query: QueryGroundDto,
	): Promise<{ grounds: Ground[]; count: number }> {
		const args = query?.toArgs() as Prisma.GroundFindManyArgs;

		args.include = {
			space: true,
		} as Prisma.GroundInclude;

		const countArgs = query.toCountArgs<Prisma.GroundCountArgs>();
		const grounds = await this.groundsRepository.findMany(args);
		const count = await this.groundsRepository.count(countArgs);

		return {
			grounds,
			count,
		};
	}
}
