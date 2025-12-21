import { Subject as SubjectEntity } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";

export class Subject extends AbstractEntity implements SubjectEntity {
	tenantId!: string;
	name!: string;
}
