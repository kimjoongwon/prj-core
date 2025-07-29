import { PartialType } from "@nestjs/swagger";
import { CreateTimelineDto } from "../create";

export class UpdateTimelineDto extends PartialType(CreateTimelineDto) {}
