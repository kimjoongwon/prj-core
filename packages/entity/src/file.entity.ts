import type { File as FileEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class File extends AbstractEntity implements FileEntity {
	parentId!: string | null;
	spaceId!: string;
	creatorId!: string | null;
	size!: number;
	mimeType!: string;
	url!: string;
	name!: string;
	space?: Space;
	creator?: User;
}
