import { RouteDto } from "./route.dto";
import { ClassField } from "../decorator";

export class AppBuilderDto {
  @ClassField(() => RouteDto, { isArray: true })
  routes: RouteDto[];
}
