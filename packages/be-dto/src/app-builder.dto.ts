import { ClassField } from "@cocrepo/decorator/field";
import { RouteDto } from "./route.dto";

export class AppBuilderDto {
	@ClassField(() => RouteDto, { isArray: true })
	routes: RouteDto[];
}
