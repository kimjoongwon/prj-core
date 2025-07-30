import { Assignment as AssignmentEntity, Role, Tenant } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { AssignmentDto } from "../dto/assignment.dto";
import { AbstractEntity } from "./abstract.entity";

@UseDto(AssignmentDto)
export class Assignment
	extends AbstractEntity<AssignmentDto>
	implements AssignmentEntity
{
	roleId: string;
	tenantId: string;

	role?: Role;
	tenant?: Tenant;
}
