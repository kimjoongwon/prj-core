import { EnumFieldKey } from "@cocrepo/decorator";
import { BASE_EXCLUDED_FIELDS } from "./base-excluded-fields";
import { QueryDto } from "./query.dto";

/**
 * Prisma 쿼리 변환을 지원하는 베이스 Query DTO
 *
 * 컨벤션 기반 자동 매핑으로 toPrismaWhere()를 기본 제공합니다.
 * 서브클래스에서 override하여 릴레이션 필터 등 커스텀 로직을 추가할 수 있습니다.
 *
 * ### 자동 매핑 규칙
 * | 필드 패턴 | 매핑 결과 |
 * |-----------|-----------|
 * | `*Id` (string) | 정확 매칭 (직접 값) |
 * | `*Ids` (array) | `{ in: values }` + 필드명 단수화 |
 * | `*From` / `*To` (Date) | `dateRangeFilter()` -> `*At` |
 * | 일반 string | `containsFilter()` (contains + insensitive) |
 * | 배열 (non-Ids) | `{ in: values }` |
 * | Enum/기타 | 직접 매핑 |
 *
 * ### 자동 제외
 * - `skip`, `take`, `sort`: 페이지네이션/정렬 전용
 * - `*SortOrder`: 정렬 관련 필드
 * - `excludeFromAutoMap()` 반환값: 서브클래스 커스텀 처리 필드
 *
 * @example 단순 DTO (자동 매핑만으로 충분)
 * ```ts
 * class QueryCategoryDto extends PrismaQueryDto<Prisma.CategoryWhereInput> {
 *   name?: string;          // -> containsFilter
 *   type?: CategoryTypes;   // -> 직접 매핑
 *   parentId?: string;      // -> 정확 매칭
 * }
 * ```
 *
 * @example 커스텀 + 자동 매핑 혼합
 * ```ts
 * class QueryUsersDto extends PrismaQueryDto<Prisma.UserWhereInput> {
 *   name?: string;          // -> 자동: containsFilter
 *   nickname?: string;      // -> 커스텀: profiles.some
 *
 *   protected excludeFromAutoMap() {
 *     return ["nickname", "roles", "status"];
 *   }
 *
 *   toPrismaWhere(baseWhere?) {
 *     const where = super.toPrismaWhere(baseWhere);
 *     if (this.nickname) where.profiles = { some: { nickname: this.containsFilter(this.nickname) } };
 *     return where;
 *   }
 * }
 * ```
 */
export class PrismaQueryDto<
	TWhere extends Record<string, unknown> = Record<string, unknown>,
> extends QueryDto {
	/**
	 * 자동 매핑에서 제외할 필드명 목록을 반환합니다.
	 * 서브클래스에서 override하여 커스텀 처리가 필요한 필드를 지정합니다.
	 */
	protected excludeFromAutoMap(): string[] {
		return [];
	}

	/**
	 * DTO 필드를 Prisma where 조건으로 자동 변환합니다.
	 * 서브클래스에서 override 시 super.toPrismaWhere()를 호출하면
	 * 자동 매핑 결과 위에 커스텀 로직을 추가할 수 있습니다.
	 *
	 * @param baseWhere 기본 where 조건 (Space 필터 등)
	 * @returns 완성된 Prisma where 객체
	 */
	toPrismaWhere(baseWhere?: Partial<TWhere>): TWhere {
		const where: Record<string, unknown> = { ...(baseWhere ?? {}) };
		const self = this as Record<string, unknown>;
		const prototype = Object.getPrototypeOf(this) as object;
		const customExcludes = new Set(this.excludeFromAutoMap());

		// *From 필드에서 처리한 *To 필드를 추적
		const processedDatePairs = new Set<string>();

		const ownKeys = Object.keys(self).filter(
			(key) =>
				!BASE_EXCLUDED_FIELDS.has(key) &&
				!customExcludes.has(key) &&
				!key.endsWith("SortOrder"),
		);

		for (const key of ownKeys) {
			const value = self[key];

			// undefined/null 값은 스킵
			if (value === undefined || value === null) continue;

			// 이미 날짜 쌍으로 처리된 *To 필드 스킵
			if (processedDatePairs.has(key)) continue;

			// 1. 날짜 범위 쌍: *From 패턴
			if (key.endsWith("From")) {
				const baseName = key.slice(0, -4); // "createdFrom" -> "created"
				const toKey = `${baseName}To`;
				const prismaKey = `${baseName}At`; // "createdAt"

				processedDatePairs.add(toKey);

				const fromValue = value instanceof Date ? value : undefined;
				const toValue =
					self[toKey] instanceof Date ? (self[toKey] as Date) : undefined;

				const dateRange = this.dateRangeFilter(fromValue, toValue);
				if (dateRange) where[prismaKey] = dateRange;
				continue;
			}

			// *To 패턴 (쌍 없이 단독 존재할 때)
			if (key.endsWith("To") && !processedDatePairs.has(key)) {
				const baseName = key.slice(0, -2); // "createdTo" -> "created"
				const fromKey = `${baseName}From`;
				// From이 없으면 단독 To 처리
				if (self[fromKey] === undefined) {
					const prismaKey = `${baseName}At`;
					const toValue = value instanceof Date ? value : undefined;
					const dateRange = this.dateRangeFilter(undefined, toValue);
					if (dateRange) where[prismaKey] = dateRange;
				}
				continue;
			}

			// 2. 배열 필드
			if (Array.isArray(value) && value.length > 0) {
				if (key.endsWith("Ids")) {
					// groupIds -> groupId (단수화)
					const singularKey = key.slice(0, -1);
					where[singularKey] = { in: value };
				} else {
					where[key] = { in: value };
				}
				continue;
			}

			// 3. ID 정확 매칭: *Id 패턴 (string)
			if (key.endsWith("Id") && typeof value === "string") {
				where[key] = value;
				continue;
			}

			// 4. 일반 문자열: 부분 일치 검색
			if (typeof value === "string") {
				if (Reflect.hasMetadata(EnumFieldKey, prototype, key)) {
					where[key] = value;
				} else {
					where[key] = this.containsFilter(value);
				}
				continue;
			}

			// 5. 그 외 (enum, boolean 등): 직접 매핑
			where[key] = value;
		}

		return where as TWhere;
	}

	/**
	 * 문자열 부분 일치 조건을 생성합니다 (contains + insensitive)
	 */
	protected containsFilter(value: string | undefined): object | undefined {
		if (!value) return undefined;
		return { contains: value, mode: "insensitive" };
	}

	/**
	 * 날짜 범위 조건을 생성합니다 (gte/lte)
	 */
	protected dateRangeFilter(
		from: Date | undefined,
		to: Date | undefined,
	): object | undefined {
		if (!from && !to) return undefined;
		return {
			...(from ? { gte: from } : {}),
			...(to ? { lte: to } : {}),
		};
	}

	/**
	 * removedAt 기반 상태 조건을 생성합니다
	 * @param isRemoved true면 삭제된 항목만, false면 활성 항목만
	 */
	protected removedAtFilter(isRemoved: boolean): { not: null } | null {
		return isRemoved ? { not: null } : null;
	}

	/**
	 * sort 배열을 Prisma orderBy 배열로 변환합니다. (JSON:API 컨벤션)
	 * - 부호 없음 = ASC: "name" -> { name: "asc" }
	 * - "-" prefix = DESC: "-createdAt" -> { createdAt: "desc" }
	 * 값이 없으면 기본값 [{ createdAt: "desc" }]를 반환합니다.
	 */
	toPrismaOrderBy(): Record<string, "asc" | "desc">[] {
		const self = this as Record<string, unknown>;

		if (Array.isArray(self.sort) && self.sort.length > 0) {
			return (self.sort as string[]).map((entry) => {
				if (entry.startsWith("-")) {
					return { [entry.slice(1)]: "desc" };
				}
				return { [entry]: "asc" };
			});
		}

		return [{ createdAt: "desc" }];
	}
}
