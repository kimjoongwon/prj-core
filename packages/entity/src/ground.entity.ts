import { Ground as GroundEntity } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";
import { Space } from "./space.entity";

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
