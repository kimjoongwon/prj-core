import { ClassField, UUIDField } from "@cocrepo/decorator";
import { FileAssociation } from "@cocrepo/prisma";
import { AbstractDto, FileDto } from ".";

export class FileAssociationDto extends AbstractDto implements FileAssociation {
	@UUIDField()
	groupId: string;

	@UUIDField()
	fileId: string;

	@ClassField(() => FileDto, { required: false, swagger: false })
	file?: FileDto;
}
