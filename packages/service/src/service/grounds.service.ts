import { GroundsRepository } from "@cocrepo/repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GroundsService {
	constructor(private readonly repository: GroundsRepository) {}

	/**
	 * 모든 Ground 목록 조회
	 */
	getAll() {
		return this.repository.findAll();
	}

	/**
	 * ID로 Ground 조회
	 */
	getById(id: string) {
		return this.repository.findById(id);
	}

	/**
	 * 내 Space의 Ground 목록 조회
	 */
	getMyGrounds(spaceId: string) {
		return this.repository.findBySpaceId(spaceId);
	}
}
