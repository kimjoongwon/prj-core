import { CreateFileDto, QueryFileDto, UpdateFileDto } from "@cocrepo/dto";
import { Prisma } from "@cocrepo/prisma";
import { Injectable } from "@nestjs/common";
import { FilesRepository } from "../../repository/files.repository";

@Injectable()
export class FilesService {
	constructor(private readonly repository: FilesRepository) {}

	async create(createFileDto: CreateFileDto) {
		const file = await this.repository.create({
			data: createFileDto,
		});

		return file;
	}

	async getManyByQuery(query: QueryFileDto) {
		const args = query.toArgs<Prisma.FileFindManyArgs>();
		const countArgs = query.toCountArgs<Prisma.FileCountArgs>();
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

	updateById(id: string, updateFileDto: UpdateFileDto) {
		return this.repository.update({
			where: { id },
			data: updateFileDto,
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
