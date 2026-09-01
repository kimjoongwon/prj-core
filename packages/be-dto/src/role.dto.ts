import {
	ClassField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Role } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { RoleAssignmentResponseDto } from "./role-assignments";
import { RoleAssociationDto } from "./role-association.dto";
import { RoleClassificationDto } from "./role-classification.dto";

export class RoleDto
	extends AbstractDto
	implements DomainEntityModel<Role, "roleId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly roleId?: never;

	@StringField({
		description: "역할 식별자",
		maxLength: 50,
		pattern: "^[A-Z][A-Z0-9_]*$",
		message:
			"역할 식별자는 영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다",
	})
	name: string;

	@StringFieldOptional({ nullable: true, description: "표시명", maxLength: 50 })
	displayName: string | null;

	@StringFieldOptional({ nullable: true, description: "설명", maxLength: 200 })
	description: string | null;

	@ClassField(() => RoleClassificationDto, { nullable: true })
	classification?: RoleClassificationDto;

	@ClassField(() => RoleAssociationDto, { nullable: true, isArray: true })
	associations?: RoleAssociationDto[];

	@ClassField(() => RoleAssignmentResponseDto, {
		required: false,
		isArray: true,
		description: "역할에 연결된 정책 할당 목록",
	})
	assignments?: RoleAssignmentResponseDto[];
}
