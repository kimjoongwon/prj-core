import type { FileClassification as FileClassificationEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Category } from "./category.entity";
import type { File } from "./file.entity";

export class FileClassification
	extends AbstractEntity
	implements FileClassificationEntity
{
	categoryId!: string;
	fileId!: string;

	category?: Category;
	file?: File;
}
