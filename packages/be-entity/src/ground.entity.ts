import type { Ground as GroundEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Company } from "./company.entity";
import type { Space } from "./space.entity";

export class Ground extends AbstractEntity implements GroundEntity {
	name!: string;
	label!: string | null;
	address!: string;
	phone!: string;
	email!: string;
	companyId!: string;
	imageFileId!: string | null;
	company?: Company;

	// Flattened API fields derived from Company for current Space/Ground screens.
	businessNo!: string;
	spaceId!: string;
	logoImageFileId!: string | null;
	space?: Space | null;
}
