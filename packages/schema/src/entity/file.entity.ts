import { File as FileEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { FileDto } from "../dto";
import { AbstractEntity } from "./abstract.entity";

@UseDto(FileDto)
export class File extends AbstractEntity<FileDto> implements FileEntity {
	parentId: string;
	tenantId: string;
	size: number;
	mimeType: string;
	url: string;
	name: string;
}
