import { ACTION_ERRORS } from "@cocrepo/constant";
import { Action } from "@cocrepo/entity";
import type { Prisma } from "@cocrepo/prisma";
import { ActionsRepository } from "@cocrepo/repository";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";

/**
 * Action 서비스
 *
 * CASL Action을 관리합니다.
 * DDD 원칙에 따라 Action은 행위의 완전한 정의를 가집니다.
 *
 * ✅ 단일 Repository 의존
 * ❌ 다른 도메인 Repository 의존 금지
 */
@Injectable()
export class ActionService {
	private readonly logger = new Logger(ActionService.name);

	constructor(private readonly repository: ActionsRepository) {}

	/**
	 * 모든 Action 조회
	 *
	 * @returns Action 배열
	 */
	async getAllActions(): Promise<Action[]> {
		this.logger.debug("모든 Action 조회");
		return this.repository.findAll();
	}

	/**
	 * 그룹별 Action 조회
	 *
	 * @param group - Action 그룹 (crud, visibility, bulk, workflow)
	 * @returns Action 배열
	 */
	async getActionsByGroup(group: string): Promise<Action[]> {
		this.logger.debug(`그룹별 Action 조회: group=${group}`);
		return this.repository.findByGroup(group);
	}

	/**
	 * CRUD Action 목록 조회
	 *
	 * @returns CRUD Action 배열
	 */
	async getCrudActions(): Promise<Action[]> {
		return this.repository.findByGroup("crud");
	}

	/**
	 * Visibility Action 목록 조회 (마스킹 포함)
	 *
	 * @returns Visibility Action 배열
	 */
	async getVisibilityActions(): Promise<Action[]> {
		return this.repository.findByGroup("visibility");
	}

	/**
	 * ID로 Action 조회
	 *
	 * @param id - Action ID
	 * @returns Action
	 * @throws NotFoundException
	 */
	async getActionById(id: string): Promise<Action> {
		this.logger.debug(`ID로 Action 조회: id=${id.slice(-8)}`);

		const action = await this.repository.findById(id);
		if (!action) {
			throw new NotFoundException(ACTION_ERRORS.NOT_FOUND);
		}

		return action;
	}

	/**
	 * 이름으로 Action 조회
	 *
	 * @param name - Action 이름
	 * @returns Action
	 * @throws NotFoundException
	 */
	async getActionByName(name: string): Promise<Action> {
		this.logger.debug(`이름으로 Action 조회: name=${name}`);

		const action = await this.repository.findByName(name);
		if (!action) {
			throw new NotFoundException(ACTION_ERRORS.NOT_FOUND);
		}

		return action;
	}

	/**
	 * 여러 이름으로 Action 조회
	 *
	 * @param names - Action 이름 배열
	 * @returns Action 배열
	 */
	async getActionsByNames(names: string[]): Promise<Action[]> {
		this.logger.debug(`여러 이름으로 Action 조회: count=${names.length}`);
		return this.repository.findByNames(names);
	}

	/**
	 * Action 생성
	 *
	 * @param data - Action 생성 데이터
	 * @returns 생성된 Action
	 */
	async createAction(data: Prisma.ActionUncheckedCreateInput): Promise<Action> {
		this.logger.debug(`Action 생성: name=${data.name}`);
		return this.repository.create(data);
	}

	/**
	 * Action 수정
	 *
	 * @param id - Action ID
	 * @param data - 수정 데이터
	 * @returns 수정된 Action
	 */
	async updateAction(
		id: string,
		data: Prisma.ActionUncheckedUpdateInput,
	): Promise<Action> {
		this.logger.debug(`Action 수정: id=${id.slice(-8)}`);

		// 존재 여부 확인
		await this.getActionById(id);

		return this.repository.updateById(id, data);
	}

	/**
	 * Action 삭제 (소프트 삭제)
	 *
	 * @param id - Action ID
	 * @returns 삭제된 Action
	 */
	async deleteAction(id: string): Promise<Action> {
		this.logger.debug(`Action 삭제: id=${id.slice(-8)}`);

		// 존재 여부 확인
		await this.getActionById(id);

		return this.repository.removeById(id);
	}

	/**
	 * 다중 Action 생성/업데이트 (upsert)
	 *
	 * @param actions - Action 데이터 배열
	 * @returns 생성/업데이트된 Action 배열
	 */
	async upsertActions(
		actions: Prisma.ActionUncheckedCreateInput[],
	): Promise<Action[]> {
		this.logger.debug(`다중 Action upsert: count=${actions.length}`);
		return this.repository.upsertMany(actions);
	}
}
