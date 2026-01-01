import { File as FileEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import { Space } from "./space.entity";
import { User } from "./user.entity";

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
