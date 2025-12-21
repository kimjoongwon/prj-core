import { Prisma } from "@prisma/client";
import {
	CreateFileClassificationDto,
	QueryFileClassificationDto,
	UpdateFileClassificationDto,
} from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";
import { FileClassificationsRepository } from "../../repository/file-classifications.repository";

@Injectable()
export class FileClassificationsService {
	constructor(private readonly repository: FileClassificationsRepository) {}

	async create(createFileClassificationDto: CreateFileClassificationDto) {
		const fileClassification = await this.repository.create({
			data: createFileClassificationDto,
		});

		return fileClassification;
	}

	async getManyByQuery(query: QueryFileClassificationDto) {
		const args = query.toArgs<Prisma.FileClassificationFindManyArgs>();
		const countArgs = query.toCountArgs<Prisma.FileClassificationCountArgs>();
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

	updateById(
		id: string,
		updateFileClassificationDto: UpdateFileClassificationDto,
	) {
		return this.repository.update({
			where: { id },
			data: updateFileClassificationDto,
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
