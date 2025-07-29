import { PartialType } from "@nestjs/swagger";
import { CreateFileDto } from "../create/create-file.dto";

export class UpdateFileDto extends PartialType(CreateFileDto) {}
