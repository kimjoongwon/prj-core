import { PartialType } from "@nestjs/swagger";
import { CreateGroupDto } from "../create";

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
