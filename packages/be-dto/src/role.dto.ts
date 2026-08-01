import {
	BooleanField,
	ClassField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Role } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { RoleAssignmentResponseDto } from "./role-assignments";
import { RoleAssociationDto } from "./role-association.dto";
import { RoleClassificationDto } from "./role-classification.dto";

export class RoleDto extends AbstractDto implements DomainEntityModel<Role> {
	@StringField({
		description: "역할 식별자",
		maxLength: 50,
		pattern: "^[A-Z][A-Z0-9_]*$",
		message:
			"역할 식별자는 영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다",
	})
	name: string;

	@StringFieldOptional({ description: "표시명", maxLength: 50 })
	displayName: string | null;

	@StringFieldOptional({ description: "설명", maxLength: 200 })
	description: string | null;

	@BooleanField({ description: "시스템 역할 여부" })
	isSystem: boolean;

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
