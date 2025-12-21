import { Subject as SubjectEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";

export class Subject extends AbstractEntity implements SubjectEntity {
	tenantId!: string;
	name!: string;
}
