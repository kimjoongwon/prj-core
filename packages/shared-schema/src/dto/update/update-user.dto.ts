import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "../create/create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {}
