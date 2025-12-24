import {
	Profile,
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

	profiles?: Profile[];
	tenants?: Tenant[];
	associations?: UserAssociation[];

	/**
	 * 사용자의 메인 테넌트를 반환합니다
	 */
	getMainTenant(): Tenant | undefined {
		return this.tenants?.find((tenant) => tenant.main === true);
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
