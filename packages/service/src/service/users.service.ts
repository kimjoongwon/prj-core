import { UsersRepository } from "@cocrepo/repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
	constructor(private readonly repository: UsersRepository) {}

	/**
	 * ID로 사용자 조회 (Tenant 정보 포함)
	 */
	getByIdWithTenants(id: string) {
		return this.repository.findByIdWithTenantsAndProfiles(id);
	}

	/**
	 * 인증용 유저 조회 (이메일 기반)
	 */
	findUserForAuth(email: string) {
		return this.repository.findByEmailWithTenantsAndProfiles(email);
	}
}
