import { PartialType } from "@nestjs/swagger";
import { CreateFileClassificationDto } from "../create/create-file-classification.dto";

export class UpdateFileClassificationDto extends PartialType(
	CreateFileClassificationDto,
) {}
