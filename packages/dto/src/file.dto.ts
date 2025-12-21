import { File } from "@prisma/client";
import { ClassField, NumberField, StringField, UUIDField } from "@cocrepo/decorator";
import { FileAssociation } from "@cocrepo/entity";
import { AbstractDto } from "./abstract.dto";
import { FileClassificationDto } from "./file-classification.dto";
import { TenantDto } from "./tenant.dto";

export class FileDto extends AbstractDto implements File {
	@UUIDField()
	parentId: string;

	@UUIDField()
	tenantId: string;

	@StringField()
	name: string;

	@NumberField()
	size: number;

	@StringField()
	mimeType: string;

	@StringField()
	url: string;

	@ClassField(() => TenantDto, { required: false })
	tenant?: TenantDto;

	@ClassField(() => FileClassificationDto, { required: false })
	classification?: FileClassificationDto;

	@ClassField(() => FileAssociation, {
		required: false,
		isArray: true,
		swagger: false,
	})
	associations?: FileAssociation[] | null;
}
