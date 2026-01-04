import type { Subject as SubjectEntity, SubjectTypes } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";

export class Subject extends AbstractEntity implements SubjectEntity {
	name!: string;
	type!: SubjectTypes;
	label!: string | null;
	description!: string | null;
	parentId!: string | null;
	tenantId!: string;
	sortOrder!: number;
	parent?: Subject | null;
	children?: Subject[];
}
