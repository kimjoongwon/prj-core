import { Injectable, Scope } from "@nestjs/common";
import { LanguageCode, TenantDto, UserDto } from "@shared/schema";
import { ClsService } from "nestjs-cls";

@Injectable({ scope: Scope.REQUEST })
export class ContextService {
	private static readonly namespace = "request";
	private static readonly authUserKey = "user_key";
	private static readonly languageKey = "language_key";
	private static readonly tenantKey = "tenant_key";

	constructor(private readonly cls: ClsService) {}

	private getKey(key: string): string {
		return `${ContextService.namespace}.${key}`;
	}

	private setValue(key: string, value: unknown): void {
		this.cls.set(this.getKey(key), value);
	}

	private getValue<T>(key: string): T | undefined {
		return this.cls.get(this.getKey(key)) as T | undefined;
	}

	setAuthUser(user: UserDto | undefined): void {
		this.setValue(ContextService.authUserKey, user);
	}

	setLanguage(language: string | undefined): void {
		this.setValue(ContextService.languageKey, language);
	}

	setTenant(tenant: TenantDto | undefined): void {
		this.setValue(ContextService.tenantKey, tenant);
	}

	setTenantId(tenantId: string | undefined): void {
		this.setValue("tenantId", tenantId);
	}

	getTenantId(): string | undefined {
		return this.getValue<string>("tenantId");
	}

	getLanguage(): LanguageCode | undefined {
		return this.getValue<LanguageCode>(ContextService.languageKey);
	}

	getAuthUser(): UserDto | undefined {
		return this.getValue<UserDto>(ContextService.authUserKey);
	}

	setAuthUserId(userId: string | undefined): void {
		this.setValue("userId", userId);
	}

	getAuthUserId(): string | undefined {
		return this.getValue<string>("userId");
	}

	getTenant(): TenantDto | undefined {
		return this.getValue<TenantDto>(ContextService.tenantKey);
	}

	setToken(token: string | undefined): void {
		this.setValue("token", token);
	}

	getToken(): string | undefined {
		return this.getValue<string>("token");
	}

	setServiceName(serviceName: string | undefined): void {
		this.setValue("serviceName", serviceName);
	}

	getServiceName(): string | undefined {
		return this.getValue<string>("serviceName");
	}

	setSpaceId(spaceId: string | undefined): void {
		this.setValue("spaceId", spaceId);
	}

	getSpaceId(): string | undefined {
		return this.getValue<string>("spaceId");
	}

	setSpaceNumber(spaceNumber: string | undefined): void {
		this.setValue("spaceNumber", spaceNumber);
	}

	getSpaceNumber(): string | undefined {
		return this.getValue<string>("spaceNumber");
	}

	setAuthContext(context: {
		user?: UserDto;
		tenant?: TenantDto;
		tenantId?: string;
		spaceId?: string;
	}): void {
		if (context.user) {
			this.setAuthUser(context.user);
			this.setAuthUserId(context.user.id);
		} else {
			this.setAuthUser(undefined);
			this.setAuthUserId(undefined);
		}

		if (context.tenant) {
			this.setTenant(context.tenant);
		} else {
			this.setTenant(undefined);
		}

		if (context.tenantId !== undefined) {
			this.setTenantId(context.tenantId);
		} else {
			this.setTenantId(undefined);
		}

		if (context.spaceId !== undefined) {
			this.setSpaceId(context.spaceId);
		} else {
			this.setSpaceId(undefined);
		}
	}

	getAuthContext(): {
		user?: UserDto;
		tenant?: TenantDto;
		tenantId?: string;
		spaceId?: string;
	} | null {
		const user = this.getAuthUser();
		const tenant = this.getTenant();
		const tenantId = this.getTenantId();
		const spaceId = this.getSpaceId();

		if (!user && !tenant && !tenantId && !spaceId) {
			return null;
		}

		return {
			user,
			tenant,
			tenantId,
			spaceId,
		};
	}
}
