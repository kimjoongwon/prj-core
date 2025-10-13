import { UserClassification as UserClassificationEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { UserClassificationDto } from "../dto";
import { AbstractEntity } from "./abstract.entity";

@UseDto(UserClassificationDto)
export class UserClassification
	extends AbstractEntity<UserClassificationDto>
	implements UserClassificationEntity
{
	categoryId: string;
	userId: string;
}
