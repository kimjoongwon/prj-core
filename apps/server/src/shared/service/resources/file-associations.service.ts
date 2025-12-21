import {
	CreateFileAssociationDto,
	QueryFileAssociationDto,
	UpdateFileAssociationDto,
} from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { FileAssociationsRepository } from "../../repository/file-associations.repository";

@Injectable()
export class FileAssociationsService {
	constructor(private readonly repository: FileAssociationsRepository) {}

	async create(createFileAssociationDto: CreateFileAssociationDto) {
		const fileAssociation = await this.repository.create({
			data: createFileAssociationDto,
		});

		return fileAssociation;
	}

	async getManyByQuery(query: QueryFileAssociationDto) {
		const args = query.toArgs<Prisma.FileAssociationFindManyArgs>();
		const countArgs = query.toCountArgs<Prisma.FileAssociationCountArgs>();

		// Include file information like original BaseService
		const argsWithInclude = {
			...args,
			include: { file: true },
		};

		const fileAssociations = await this.repository.findMany(argsWithInclude);
		const count = await this.repository.count(countArgs);

		return {
			fileAssociations,
			count,
		};
	}

	getById(id: string) {
		return this.repository.findUnique({ where: { id } });
	}

	updateById(id: string, updateFileAssociationDto: UpdateFileAssociationDto) {
		return this.repository.update({
			where: { id },
			data: updateFileAssociationDto,
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
