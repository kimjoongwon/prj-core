import { PartialType } from "@nestjs/swagger";
import { CreateUserClassificationDto } from "../create/create-user-classification.dto";

export class UpdateUserClassificationDto extends PartialType(
	CreateUserClassificationDto,
) {}
