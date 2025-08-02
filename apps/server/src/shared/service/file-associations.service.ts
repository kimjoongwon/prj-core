import { Injectable } from "@nestjs/common";
import {
	CreateFileAssociationDto,
	Prisma,
	QueryFileAssociationDto,
	UpdateFileAssociationDto,
} from "@shared/schema";
import { FileAssociationsRepository } from "../repository/file-associations.repository";

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

	// 기존 custom 메서드들 유지
	getUnique(args: Prisma.FileAssociationFindUniqueArgs) {
		return this.repository.findUnique(args);
	}

	getFirst(args: Prisma.FileAssociationFindFirstArgs) {
		return this.repository.findFirst(args);
	}

	updateMany(args: Prisma.FileAssociationUpdateManyArgs) {
		return this.repository.updateMany(args);
	}

	update(args: Prisma.FileAssociationUpdateArgs) {
		return this.repository.update(args);
	}

	remove(id: string) {
		return this.repository.update({
			where: { id },
			data: { removedAt: new Date() },
		});
	}

	// 기존 컨트롤러 호환성을 위한 별도 메서드
	async getFileAssociationsByQuery(query: QueryFileAssociationDto) {
		const result = await this.getManyByQuery(query);
		return {
			fileAssociations: result.fileAssociations,
			count: result.count,
		};
	}
}
