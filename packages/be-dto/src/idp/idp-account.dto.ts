import {
	BooleanField,
	ClassField,
	DateField,
	DateFieldOptional,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class IdpAccountAccessGrantDto {
	@UUIDField({ description: "테넌트 ID" })
	tenantId!: string;

	@UUIDField({ description: "접근 대상 Space ID" })
	spaceId!: string;

	@StringField({ description: "접근 대상 Space 이름" })
	spaceName!: string;

	@StringFieldOptional({
		nullable: true,
		description: "접근 대상 Space 라벨",
	})
	spaceLabel!: string | null;

	@UUIDField({ description: "부여된 Role ID" })
	roleId!: string;

	@StringField({ description: "부여된 Role 식별자" })
	roleName!: string;

	@StringFieldOptional({
		nullable: true,
		description: "부여된 Role 표시명",
	})
	roleDisplayName!: string | null;

	@DateField({ description: "권한 부여일" })
	grantedAt!: Date;

	@DateFieldOptional({ nullable: true, description: "권한 변경일" })
	updatedAt!: Date | null;
}

/**
 * IDP 계정 정보 DTO (보안 필드 포함)
 */
export class IdpAccountDto {
	@UUIDField({ description: "사용자 ID" })
	id!: string;

	@StringField({ description: "이름" })
	name!: string;

	@StringField({ description: "이메일" })
	email!: string;

	@BooleanField({ description: "활성 상태" })
	isActive!: boolean;

	@NumberField({ description: "로그인 실패 횟수" })
	failedLoginAttempts!: number;

	@BooleanField({ description: "영구 잠금 여부" })
	isPermanentlyLocked!: boolean;

	@DateFieldOptional({ nullable: true, description: "일시 잠금 해제 시간" })
	lockedUntil!: Date | null;

	@BooleanField({ description: "비밀번호 변경 필요 여부" })
	mustChangePassword!: boolean;

	@DateFieldOptional({ nullable: true, description: "마지막 로그인 시간" })
	lastLoginAt!: Date | null;

	@StringFieldOptional({ nullable: true, description: "마지막 로그인 IP" })
	lastLoginIp!: string | null;

	@DateField({ description: "가입일" })
	createdAt!: Date;
}

/**
 * IDP 계정 상세 DTO (접근 권한 포함)
 */
export class IdpAccountDetailDto extends IdpAccountDto {
	@ClassField(() => IdpAccountAccessGrantDto, {
		each: true,
		isArray: true,
		description: "계정에 부여된 Space/Role 접근 권한 목록",
	})
	accessGrants!: IdpAccountAccessGrantDto[];
}

export class IdpAccountAccessGrantFormOptionItemDto {
	@ApiProperty({
		description: "옵션 값",
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	value!: string;

	@ApiProperty({ description: "옵션 라벨", example: "본사" })
	label!: string;

	@ApiPropertyOptional({
		description: "보조 설명",
		example: "서울 강남구",
	})
	description?: string;
}

export class IdpAccountAccessGrantFormUiPathsDto {
	@ApiProperty({ description: "읽기 전용 경로 목록", type: [String] })
	readOnlyPaths!: string[];

	@ApiProperty({ description: "숨김 경로 목록", type: [String] })
	hiddenPaths!: string[];

	@ApiProperty({ description: "비활성 경로 목록", type: [String] })
	disabledPaths!: string[];
}

export class IdpAccountAccessGrantFormFieldMetaDto {
	@ApiPropertyOptional({ description: "필드 라벨", example: "Space" })
	label?: string;
}

export class IdpAccountAccessGrantFormSchemaDto {
	@ApiProperty({ description: "스키마 키", example: "idp-account-access" })
	key!: string;

	@ApiProperty({ description: "스키마 라벨", example: "접근 권한 부여" })
	label!: string;

	@ApiProperty({ description: "스키마 대상 경로", type: [String] })
	paths!: string[];
}

export class IdpAccountAccessGrantFormBootstrapDto {
	@ApiProperty({
		description: "폼 모드",
		enum: ["CREATE"],
		example: "CREATE",
	})
	mode!: "CREATE";

	@ApiProperty({
		description: "초기 폼 객체",
		type: "object",
		additionalProperties: true,
	})
	defaultObject!: Record<string, unknown>;

	@ApiProperty({
		description: "경로별 선택 옵션",
		type: "object",
		additionalProperties: {
			type: "array",
			items: {
				$ref: "#/components/schemas/IdpAccountAccessGrantFormOptionItemDto",
			},
		},
	})
	options!: Record<string, IdpAccountAccessGrantFormOptionItemDto[]>;

	@ApiProperty({
		description: "UI 제어 경로",
		type: IdpAccountAccessGrantFormUiPathsDto,
	})
	ui!: IdpAccountAccessGrantFormUiPathsDto;

	@ApiProperty({
		description: "경로별 필드 메타",
		type: "object",
		additionalProperties: {
			$ref: "#/components/schemas/IdpAccountAccessGrantFormFieldMetaDto",
		},
	})
	fieldMeta!: Record<string, IdpAccountAccessGrantFormFieldMetaDto>;

	@ApiProperty({
		description: "AI 스키마 목록",
		type: [IdpAccountAccessGrantFormSchemaDto],
	})
	aiSchemas!: IdpAccountAccessGrantFormSchemaDto[];
}

export class GrantIdpAccountAccessDto {
	@UUIDField({ description: "권한을 부여할 Space ID" })
	spaceId!: string;

	@UUIDField({ description: "부여할 Role ID" })
	roleId!: string;
}
