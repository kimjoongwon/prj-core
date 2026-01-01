import {
	Profile,
	Space,
	Tenant,
	UserAssociation,
	User as UserEntity,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";

export class User extends AbstractEntity implements UserEntity {
	name!: string;
	email!: string;
	phone!: string;
	password!: string;

	/**
	 * 현재 선택된 Space ID
	 */
	selectedSpaceId: string | null = null;

	/**
	 * 현재 선택된 Space (관계)
	 */
	selectedSpace?: Space | null;

	profiles?: Profile[];
	tenants?: Tenant[];
	associations?: UserAssociation[];

	/**
	 * 사용자의 현재 선택된 Space에 해당하는 테넌트를 반환합니다
	 */
	getCurrentTenant(): Tenant | undefined {
		if (!this.selectedSpaceId || !this.tenants) return undefined;
		return this.tenants.find(
			(tenant) => tenant.spaceId === this.selectedSpaceId,
		);
	}

	/**
	 * 사용자가 특정 테넌트에 속해 있는지 확인합니다
	 */
	hasTenantAccess(tenantId: string): boolean {
		if (!this.tenants) return false;
		return this.tenants.some((tenant) => tenant.id === tenantId);
	}

	/**
	 * 사용자가 활성 상태인지 확인합니다
	 */
	isActive(): boolean {
		return this.removedAt === null;
	}
}
