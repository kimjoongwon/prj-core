import { PartialType } from "@nestjs/swagger";
import { SessionDto } from "../session.dto";

export class UpdateSessionDto extends PartialType(SessionDto) {}
