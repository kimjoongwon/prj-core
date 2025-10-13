import { Tenant as TenantEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { TenantDto } from "../dto";
import { AbstractEntity } from "./abstract.entity";
import { Role } from "./role.entity";
import { Space } from "./space.entity";
import { User } from "./user.entity";

@UseDto(TenantDto)
export class Tenant extends AbstractEntity<TenantDto> implements TenantEntity {
	main: boolean;
	spaceId: string;
	userId: string;
	roleId: string;
	space?: Space;
	user?: User;
	role?: Role;
}
