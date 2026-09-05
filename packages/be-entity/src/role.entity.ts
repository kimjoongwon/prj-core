import {
	ClassField,
	StringField,
	StringFieldOptional,
	ULIDField,
} from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { RoleAssignment } from "./role-assignment.entity";
import { RoleAssociation } from "./role-association.entity";
import { RoleClassification } from "./role-classification.entity";

export class Role extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	@ULIDField()
	roleId!: string;

	@StringField({
		description: "역할 식별자",
		maxLength: 50,
		pattern: "^[A-Z][A-Z0-9_]*$",
		message:
			"역할 식별자는 영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다",
	})
	name!: string;

	@StringFieldOptional({ nullable: true, description: "표시명", maxLength: 50 })
	displayName!: string | null;

	@StringFieldOptional({ nullable: true, description: "설명", maxLength: 200 })
	description!: string | null;

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
