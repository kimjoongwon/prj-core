import { FileClassification } from "@prisma/client";
import { ClassField, UUIDField } from "../decorator";
import { AbstractDto, CategoryDto, FileDto } from ".";

export class FileClassificationDto
	extends AbstractDto
	implements FileClassification
{
	@UUIDField()
	fileId: string;

	@UUIDField()
	categoryId: string;

	@ClassField(() => CategoryDto, { required: false })
	category?: CategoryDto;

	@ClassField(() => FileDto, { required: false })
	file?: FileDto;
}
