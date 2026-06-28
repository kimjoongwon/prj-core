import type { Company as CompanyEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Ground } from "./ground.entity";
import type { Space } from "./space.entity";

export class Company extends AbstractEntity implements CompanyEntity {
	name!: string;
	label!: string | null;
	address!: string;
	phone!: string;
	email!: string;
	businessNo!: string;
	spaceId!: string;
	logoImageFileId!: string | null;

	space?: Space;
	ground?: Ground | null;
}
