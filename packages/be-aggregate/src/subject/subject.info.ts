import type { SubjectFieldInfo } from "./subject-field.info";

export interface SubjectInfo {
	id: string;
	name: string;
	displayName: string | null;
	icon: string | null;
	group: string | null;
	order: number;
	isSystem: boolean;
	fields: SubjectFieldInfo[];
}
