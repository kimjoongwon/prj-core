import {
	ClassField,
	NumberField,
	StringField,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { FileAssociation } from "@cocrepo/entity";
import { File } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { FileClassificationDto } from "./file-classification.dto";
import { SpaceDto } from "./space.dto";

export class FileDto extends AbstractDto implements File {
	@UUIDFieldOptional()
	parentId: string | null;

	@UUIDField()
	spaceId: string;

	@UUIDFieldOptional()
	creatorId: string | null;

	@StringField()
	name: string;

	@NumberField()
	size: number;

	@StringField()
	mimeType: string;

	@StringField()
	url: string;

	@ClassField(() => SpaceDto, { required: false })
	space?: SpaceDto;

	@ClassField(() => FileClassificationDto, { required: false })
	classification?: FileClassificationDto;

	@ClassField(() => FileAssociation, {
		required: false,
		isArray: true,
		swagger: false,
	})
	associations?: FileAssociation[] | null;
}
