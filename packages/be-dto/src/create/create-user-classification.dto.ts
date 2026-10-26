import { UserClassification } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateUserClassificationDto extends PickType(UserClassification, [
	"categoryId",
	"userId",
] as const) {}
