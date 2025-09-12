import { Reflector } from "@nestjs/core";
import { $Enums } from "@shared/schema";

export const Roles = Reflector.createDecorator<$Enums.Roles[]>();
