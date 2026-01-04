import type { Ground as GroundEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Space } from "./space.entity";

export class Ground extends AbstractEntity implements GroundEntity {
	name!: string;
	label!: string | null;
	address!: string;
	phone!: string;
	email!: string;
	businessNo!: string;
	spaceId!: string;
	logoImageFileId!: string | null;
	imageFileId!: string | null;
	space?: Space | null;
}
