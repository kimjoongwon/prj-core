import { UsersRepository } from "@cocrepo/repository";
import { ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
	constructor(private readonly repository: UsersRepository) {}

	/**
	 * ID로 사용자 조회 (Tenant 정보 포함)
	 */
	getByIdWithTenants(id: string) {
		return this.repository.findByIdWithRelations(id);
	}

	/**
	 * 인증용 유저 조회 (이메일 기반)
	 */
	findUserForAuth(email: string) {
		return this.repository.findByEmailWithRelations(email);
	}

	/**
	 * 현재 사용자의 선택된 Space를 변경합니다.
	 *
	 * 비즈니스 로직:
	 * 1. 사용자가 해당 Space에 접근 권한이 있는지 검증 (Tenant 확인)
	 * 2. 검증 통과 시 User.selectedSpaceId 업데이트
	 * 3. 업데이트된 selectedSpaceId 반환
	 *
	 * @param userId - 사용자 ID
	 * @param spaceId - 변경할 Space ID
	 * @returns 업데이트된 selectedSpaceId
	 * @throws ForbiddenException - Space 접근 권한이 없는 경우
	 */
	async updateSelectedSpaceForCurrentUser(
		userId: string,
		spaceId: string,
	): Promise<string> {
		// 1. Space 접근 권한 검증
		const hasAccess = await this.repository.existsTenantByUserAndSpace(
			userId,
			spaceId,
		);

		if (!hasAccess) {
			throw new ForbiddenException(
				"해당 Space에 접근 권한이 없습니다. Tenant 목록을 확인해주세요.",
			);
		}

		// 2. selectedSpaceId 업데이트
		const updatedSpaceId = await this.repository.updateSpaceId(userId, spaceId);

		return updatedSpaceId;
	}
}
