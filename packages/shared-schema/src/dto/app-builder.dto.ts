import { ClassField } from "../decorator";
import { RouteDto } from "./route.dto";

export class AppBuilderDto {
	@ClassField(() => RouteDto, { isArray: true })
	routes: RouteDto[];
}
