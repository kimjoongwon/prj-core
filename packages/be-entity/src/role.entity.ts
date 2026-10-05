import {
	ClassField,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
	ULIDFieldMetadata,
} from "@cocrepo/decorator/field";
import { RoleSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { RoleAssignment } from "./role-assignment.entity";
import { RoleAssociation } from "./role-association.entity";
import { RoleClassification } from "./role-classification.entity";

@AbstractEntityFields()
export class Role extends RoleSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	@ULIDFieldMetadata()
	declare roleId: RoleSchema["roleId"];

	@StringFieldMetadata({
		description: "역할 식별자",
		maxLength: 50,
		pattern: "^[A-Z][A-Z0-9_]*$",
		message:
			"역할 식별자는 영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다",
	})
	declare name: RoleSchema["name"];

	@StringFieldOptionalMetadata({
		nullable: true,
		description: "표시명",
		maxLength: 50,
	})
	declare displayName: RoleSchema["displayName"];

	@StringFieldOptionalMetadata({
		nullable: true,
		description: "설명",
		maxLength: 200,
	})
	declare description: RoleSchema["description"];

	@ClassField(() => RoleClassification, { nullable: true })
	classification?: RoleClassification;

	@ClassField(() => RoleAssociation, { nullable: true, isArray: true })
	associations?: RoleAssociation[];

	@ClassField(() => RoleAssignment, {
		required: false,
		isArray: true,
		description: "역할에 연결된 정책 할당 목록",
	})
	assignments?: RoleAssignment[];
}
