import { File as FileEntity } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";

export class File extends AbstractEntity implements FileEntity {
	parentId!: string;
	tenantId!: string;
	size!: number;
	mimeType!: string;
	url!: string;
	name!: string;
}
