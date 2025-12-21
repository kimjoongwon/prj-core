import { File as FileEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";

export class File extends AbstractEntity implements FileEntity {
	parentId!: string;
	tenantId!: string;
	size!: number;
	mimeType!: string;
	url!: string;
	name!: string;
}
