import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

/**
 * 비밀번호 변경 요청 DTO
 *
 * 현재 비밀번호 확인 후 새 비밀번호로 변경합니다.
 */
export class ChangePasswordDto {
	@ApiProperty({
		example: "OldPassword123!",
		description: "현재 비밀번호",
	})
	@IsNotEmpty({ message: "현재 비밀번호는 필수입니다." })
	@IsString()
	currentPassword: string;

	@ApiProperty({
		example: "NewPassword456!@",
		description: "새 비밀번호 (8자 이상, 대문자/소문자/숫자/특수문자 포함)",
	})
	@IsNotEmpty({ message: "새 비밀번호는 필수입니다." })
	@IsString()
	@MinLength(8, { message: "비밀번호는 8자 이상이어야 합니다." })
	newPassword: string;

	@ApiProperty({
		example: "NewPassword456!@",
		description: "새 비밀번호 확인",
	})
	@IsNotEmpty({ message: "비밀번호 확인은 필수입니다." })
	@IsString()
	confirmPassword: string;

	@ApiProperty({
		example: false,
		description: "다른 기기 세션 로그아웃 여부 (기본값: false)",
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	logoutOtherDevices?: boolean;
}
