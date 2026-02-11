import { PartialType } from "@nestjs/swagger";
import { CreateSpaceDto } from "../create";

export class UpdateSpaceDto extends PartialType(CreateSpaceDto) {}
