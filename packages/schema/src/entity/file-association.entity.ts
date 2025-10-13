import {
	File,
	FileAssociation as FileAssociationEntity,
	Group,
} from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { FileAssociationDto } from "../dto/file-association.dto";
import { AbstractEntity } from "./abstract.entity";

@UseDto(FileAssociationDto)
export class FileAssociation
	extends AbstractEntity<FileAssociationDto>
	implements FileAssociationEntity
{
	groupId: string;
	fileId: string;
	file?: File;
	group?: Group;
}
