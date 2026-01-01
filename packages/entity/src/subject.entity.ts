import { Subject as SubjectEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import { Space } from "./space.entity";

export class Subject extends AbstractEntity implements SubjectEntity {
	spaceId!: string;
	name!: string;
	space?: Space;
}
