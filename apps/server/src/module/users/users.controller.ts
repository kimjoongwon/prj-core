import { CONTEXT_KEYS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	UpdateSelectedSpacePayloadDto,
	UpdateSelectedSpaceResponseDto,
} from "@cocrepo/dto";
import { User } from "@cocrepo/entity";
import { UsersService } from "@cocrepo/service";
import {
	Body,
	Controller,
	HttpStatus,
	Patch,
	UnauthorizedException,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { ClsService } from "nestjs-cls";

/**
 * Users 에러 메시지 상수
 */
const UsersErrorMessages = {
	USER_NOT_FOUND: "사용자를 찾을 수 없습니다",
	SPACE_ACCESS_DENIED:
		"해당 Space에 접근 권한이 없습니다. Tenant 목록을 확인해주세요.",
} as const;

@ApiTags("USERS")
@Controller()
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly cls: ClsService,
	) {}

	@Patch("me/selected-space")
	@ApiOperation({
		summary: "선택된 Space 변경",
		description:
			"현재 로그인한 사용자의 선택된 Space를 변경합니다. 변경하려는 Space는 사용자의 Tenant에 포함되어 있어야 합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: UpdateSelectedSpacePayloadDto,
		description: "변경할 Space ID",
	})
	@ApiErrors(
		{ status: 401, message: UsersErrorMessages.USER_NOT_FOUND },
		{ status: 403, message: UsersErrorMessages.SPACE_ACCESS_DENIED },
		500,
	)
	@ApiResponseEntity(UpdateSelectedSpaceResponseDto, HttpStatus.OK)
	@ResponseMessage("선택된 Space가 변경되었습니다")
	async updateSelectedSpace(
		@Body() dto: UpdateSelectedSpacePayloadDto,
	): Promise<UpdateSelectedSpaceResponseDto> {
		// CLS에서 현재 사용자 정보 가져오기
		const currentUser = this.cls.get<User>(CONTEXT_KEYS.AUTH_USER);

		if (!currentUser?.id) {
			throw new UnauthorizedException(UsersErrorMessages.USER_NOT_FOUND);
		}

		// Service 호출 - 도메인 모델(spaceId)을 전달
		const updatedSpaceId =
			await this.usersService.updateSelectedSpaceForCurrentUser(
				currentUser.id,
				dto.spaceId,
			);

		return plainToInstance(UpdateSelectedSpaceResponseDto, {
			selectedSpaceId: updatedSpaceId,
		});
	}
}
