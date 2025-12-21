import { FileClassification as FileClassificationEntity } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";
import { Category } from "./category.entity";
import { File } from "./file.entity";

export class FileClassification extends AbstractEntity implements FileClassificationEntity {
	categoryId!: string;
	fileId!: string;

	category?: Category;
	file?: File;
}
