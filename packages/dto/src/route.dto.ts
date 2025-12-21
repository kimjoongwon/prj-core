import { ClassField, StringField } from "@cocrepo/decorator";

export class RouteDto {
	@StringField()
	name: string;

	@StringField()
	relativePath: string;

	@StringField()
	fullPath: string;

	@StringField({ nullable: true })
	icon: string | null;

	@ClassField(() => RouteDto, { isArray: true, nullable: true })
	children: RouteDto[] | null;
}
