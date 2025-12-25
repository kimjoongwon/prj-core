import { Prisma } from "@cocrepo/prisma";
import { PartialType } from "@nestjs/swagger";
import { CreateUserAssociationDto } from "../create/create-user-association.dto";

export class UpdateUserAssociationDto
	extends PartialType(CreateUserAssociationDto)
	implements Prisma.UserAssociationCreateInput
{
	id?: string | undefined;
	seq?: number | undefined;
	createdAt?: string | Date | undefined;
	updatedAt?: string | Date | null | undefined;
	removedAt?: string | Date | null | undefined;
	group: Prisma.GroupCreateNestedOneWithoutUserAssociationsInput;
	user: Prisma.UserCreateNestedOneWithoutAssociationsInput;
}
