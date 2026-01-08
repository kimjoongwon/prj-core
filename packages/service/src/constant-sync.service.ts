import { Subject } from "@cocrepo/entity";
import { SubjectTypes } from "@cocrepo/prisma";
import { SubjectsRepository } from "@cocrepo/repository";
import { Injectable, Logger } from "@nestjs/common";
import {
	ADMIN_FEATURE_ITEMS,
	ADMIN_NAV_ITEMS,
	type FeatureItemConfig,
	type NavItemConfig,
} from "@cocrepo/constant";

/**
 * 동기화 결과
 */
export interface ConstantSyncResult {
	/** 새로 생성된 Subject 수 */
	created: number;
	/** displayName이 업데이트된 Subject 수 */
	updated: number;
	/** 스킵된 Subject 수 (이미 존재하고 displayName이 동일한 경우) */
	skipped: number;
}

/**
 * 메뉴 아이템 정보 (평탄화된 구조)
 */
interface FlattenedMenuItem {
	/** Subject name (예: menu:dashboard) */
	name: string;
	/** 표시명 */
	displayName: string;
	/** 부모 메뉴의 Subject name (없으면 null) */
	parentSubjectName: string | null;
}

/**
 * @cocrepo/constant에서 Menu/Feature Subject를 동기화하는 서비스
 *
 * 앱 부트스트랩 시 상수 파일을 파싱하여 Subject 테이블에 동기화합니다.
 * - 새로운 Menu/Feature → INSERT
 * - displayName 변경 → UPDATE (항상 덮어씀)
 * - Constant에서 삭제된 항목 → 유지 (soft delete 안 함)
 *
 * @note SubjectSyncService(Prisma Entity/Column)와 달리 항상 덮어씁니다.
 *       Constant가 Source of Truth이므로 관리자 오버라이드를 허용하지 않습니다.
 */
@Injectable()
export class ConstantSyncService {
	private readonly logger = new Logger(ConstantSyncService.name);

	constructor(private readonly repository: SubjectsRepository) {}

	/**
	 * @cocrepo/constant에서 Menu/Feature Subject를 동기화합니다.
	 *
	 * @param tenantId - 시스템 테넌트 ID
	 * @returns 동기화 결과 (생성/업데이트/스킵 수)
	 */
	async syncFromConstant(tenantId: string): Promise<ConstantSyncResult> {
		this.logger.log("Constant Subject 동기화 시작...");

		const result: ConstantSyncResult = {
			created: 0,
			updated: 0,
			skipped: 0,
		};

		// 1. Menu Subject 동기화
		const menuItems = this.flattenNavItems(ADMIN_NAV_ITEMS);
		await this.syncMenuSubjects(menuItems, tenantId, result);

		// 2. Feature Subject 동기화
		await this.syncFeatureSubjects(ADMIN_FEATURE_ITEMS, tenantId, result);

		this.logger.log(
			`Constant Subject 동기화 완료: 생성=${result.created}, 업데이트=${result.updated}, 스킵=${result.skipped}`,
		);

		return result;
	}

	/**
	 * 트리 구조의 NavItemConfig를 평탄화합니다.
	 */
	private flattenNavItems(
		items: NavItemConfig[],
		parentSubjectName: string | null = null,
	): FlattenedMenuItem[] {
		const result: FlattenedMenuItem[] = [];

		for (const item of items) {
			result.push({
				name: item.subject,
				displayName: item.label,
				parentSubjectName,
			});

			// 자식이 있으면 재귀 호출
			if (item.children && item.children.length > 0) {
				const childItems = this.flattenNavItems(item.children, item.subject);
				result.push(...childItems);
			}
		}

		return result;
	}

	/**
	 * Menu Subject를 동기화합니다.
	 */
	private async syncMenuSubjects(
		menuItems: FlattenedMenuItem[],
		tenantId: string,
		result: ConstantSyncResult,
	): Promise<void> {
		this.logger.debug(`Menu Subject 동기화: ${menuItems.length}개 메뉴`);

		// 먼저 모든 Menu Subject를 조회하여 parentId 매핑 준비
		const existingMenuSubjects = await this.repository.findManyByType(
			SubjectTypes.Menu,
		);
		const menuSubjectMap = new Map<string, Subject>();
		for (const subject of existingMenuSubjects) {
			menuSubjectMap.set(subject.name, subject);
		}

		// 동기화 순서: 부모 → 자식 순으로 처리 (parentId 참조를 위해)
		// flattenNavItems가 이미 DFS 순서로 반환하므로 그대로 처리

		for (const menuItem of menuItems) {
			// 부모 Subject 조회 (이번 루프에서 생성된 것 포함)
			let parentId: string | null = null;
			if (menuItem.parentSubjectName) {
				const parentSubject = menuSubjectMap.get(menuItem.parentSubjectName);
				parentId = parentSubject?.id ?? null;
			}

			const createdOrUpdated = await this.upsertSubject(
				{
					name: menuItem.name,
					type: SubjectTypes.Menu,
					displayName: menuItem.displayName,
					tenantId,
					parentId,
				},
				result,
			);

			// 새로 생성된 경우 맵에 추가 (자식 처리를 위해)
			if (createdOrUpdated) {
				menuSubjectMap.set(menuItem.name, createdOrUpdated);
			}
		}
	}

	/**
	 * Feature Subject를 동기화합니다.
	 */
	private async syncFeatureSubjects(
		featureItems: FeatureItemConfig[],
		tenantId: string,
		result: ConstantSyncResult,
	): Promise<void> {
		this.logger.debug(`Feature Subject 동기화: ${featureItems.length}개 기능`);

		for (const feature of featureItems) {
			await this.upsertSubject(
				{
					name: feature.subject,
					type: SubjectTypes.Feature,
					displayName: feature.label,
					tenantId,
					parentId: null, // Feature는 평탄한 구조
				},
				result,
			);
		}
	}

	/**
	 * Subject를 upsert합니다.
	 *
	 * Constant 기반이므로 항상 덮어씁니다 (관리자 오버라이드 불가).
	 *
	 * - 존재하지 않으면 생성
	 * - 존재하고 displayName이 다르면 업데이트
	 * - 존재하고 displayName이 같으면 스킵
	 *
	 * @returns 생성/업데이트된 Subject 또는 null(스킵)
	 */
	private async upsertSubject(
		data: {
			name: string;
			type: SubjectTypes;
			displayName: string;
			tenantId: string;
			parentId?: string | null;
		},
		result: ConstantSyncResult,
	): Promise<Subject | null> {
		const existing = await this.repository.findByName(data.name);

		if (!existing) {
			// 새로 생성
			const created = await this.repository.create({
				name: data.name,
				type: data.type,
				displayName: data.displayName,
				tenantId: data.tenantId,
				parentId: data.parentId ?? null,
			});
			result.created++;
			this.logger.debug(`Subject 생성: ${data.name}`);
			return created;
		}

		// displayName 또는 parentId가 다르면 업데이트
		const needsUpdate =
			existing.displayName !== data.displayName ||
			existing.parentId !== (data.parentId ?? null);

		if (needsUpdate) {
			const updated = await this.repository.updateById(existing.id, {
				displayName: data.displayName,
				parentId: data.parentId ?? null,
			});
			result.updated++;
			this.logger.debug(
				`Subject 업데이트: ${data.name} → displayName="${data.displayName}"`,
			);
			return updated;
		}

		// 동일하면 스킵
		result.skipped++;
		return null;
	}
}
