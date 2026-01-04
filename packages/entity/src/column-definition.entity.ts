import type { ColumnDefinition as ColumnDefinitionEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Space } from "./space.entity";
import type { Subject } from "./subject.entity";

export class ColumnDefinition
	extends AbstractEntity
	implements ColumnDefinitionEntity
{
	entity!: string;
	field!: string;
	label!: string;
	sortOrder!: number;
	isRequired!: boolean;
	visibleOnDesktop!: boolean;
	visibleOnTablet!: boolean;
	visibleOnMobile!: boolean;
	sortable!: boolean;
	width!: string | null;
	minWidth!: string | null;
	spaceId!: string;
	subjectId!: string | null;
	space?: Space;
	subject?: Subject | null;
}
