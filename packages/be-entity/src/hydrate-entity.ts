import type { Constructor } from "@cocrepo/type";
import { Ability } from "./ability.entity";
import { Policy } from "./policy.entity";
import { PolicyEntry } from "./policy-entry.entity";
import { RoleAssignment } from "./role-assignment.entity";
import { UserStatus } from "./user-status.entity";

type NestedEntityConstructor = Constructor<object>;

const isObjectLike = (value: unknown): value is object =>
	value !== null && typeof value === "object";

const NESTED_ENTITY_KEYS: Record<
	string,
	Record<string, NestedEntityConstructor>
> = {
	Policy: { entries: PolicyEntry, roleAssignments: RoleAssignment },
	PolicyEntry: { ability: Ability },
	RoleAssignment: { policy: Policy },
	User: { status: UserStatus },
};

/**
 * Prisma projection 또는 plain object를 domain Entity prototype로 복원합니다.
 *
 * 관계는 암묵적으로 변환하지 않습니다. 순환·공유 참조가 필요한 권한
 * 그래프의 네 관계만 명시적으로 복원하며, 나머지 관계는 repository가
 * 이미 생성한 Entity를 그대로 전달합니다.
 */
export function hydrateEntity<TEntity>(
	EntityClass: Constructor<TEntity>,
	plainEntity: Partial<TEntity>,
): TEntity;
export function hydrateEntity<TEntity>(
	EntityClass: Constructor<TEntity>,
	plainEntity: Array<Partial<TEntity>>,
): TEntity[];
export function hydrateEntity<TEntity>(
	EntityClass: Constructor<TEntity>,
	plainEntity: unknown,
): TEntity | TEntity[];
export function hydrateEntity<TEntity>(
	EntityClass: Constructor<TEntity>,
	plainEntity: unknown,
): TEntity | TEntity[] {
	const hydratedEntities = new WeakMap<object, object>();

	const hydrate = <THydrated>(
		HydratedClass: Constructor<THydrated>,
		plainValue: unknown,
	): THydrated => {
		if (isObjectLike(plainValue)) {
			const existingEntity = hydratedEntities.get(plainValue);
			if (existingEntity) return existingEntity as THydrated;
		}

		const entity = new HydratedClass();
		if (!isObjectLike(entity)) return entity;
		if (!isObjectLike(plainValue)) return entity;

		hydratedEntities.set(plainValue, entity);
		Object.assign(entity, plainValue);
		const nestedKeys = NESTED_ENTITY_KEYS[HydratedClass.name] ?? {};
		for (const [relationKey, RelationClass] of Object.entries(nestedKeys)) {
			const relationValue = (plainValue as Record<string, unknown>)[
				relationKey
			];
			if (relationValue == null) continue;
			if (Array.isArray(relationValue)) {
				Reflect.set(
					entity,
					relationKey,
					relationValue.map((relationEntity) =>
						relationEntity && typeof relationEntity === "object"
							? hydrate(RelationClass, relationEntity)
							: relationEntity,
					),
				);
			} else if (typeof relationValue === "object") {
				Reflect.set(entity, relationKey, hydrate(RelationClass, relationValue));
			}
		}

		return entity;
	};

	if (Array.isArray(plainEntity)) {
		return plainEntity.map((plainItem) => hydrate(EntityClass, plainItem));
	}
	return hydrate(EntityClass, plainEntity);
}
