import { LanguageCode } from "@cocrepo/constants";
import { TenantDto, UserDto } from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";

@Injectable()
export class ContextService {
  private static readonly namespace = "request";
  private static readonly authUserKey = "user_key";
  private static readonly languageKey = "language_key";
  private static readonly tenantKey = "tenant_key";
  private static readonly tokenKey = "token_key";
  private static readonly serviceNameKey = "service_name_key";

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

  getAuthUser(): UserDto | undefined {
    return this.getValue<UserDto>(ContextService.authUserKey);
  }

  setAuthUserId(userId: string | undefined): void {
    this.setValue("userId", userId);
  }

  getAuthUserId(): string | undefined {
    return this.getValue<string>("userId");
  }

  setLanguage(language: LanguageCode | undefined): void {
    this.setValue(ContextService.languageKey, language);
  }

  getLanguage(): LanguageCode | undefined {
    return this.getValue<LanguageCode>(ContextService.languageKey);
  }

  setTenant(tenant: TenantDto | undefined): void {
    this.setValue(ContextService.tenantKey, tenant);
  }

  getTenant(): TenantDto | undefined {
    return this.getValue<TenantDto>(ContextService.tenantKey);
  }

  getTenantId(): string | undefined {
    return this.getTenant()?.id;
  }

  getSpaceId(): string | undefined {
    return this.getTenant()?.spaceId;
  }

  setToken(token: string | undefined): void {
    this.setValue(ContextService.tokenKey, token);
  }

  getToken(): string | undefined {
    return this.getValue<string>(ContextService.tokenKey);
  }

  setServiceName(serviceName: string | undefined): void {
    this.setValue(ContextService.serviceNameKey, serviceName);
  }

  getServiceName(): string | undefined {
    return this.getValue<string>(ContextService.serviceNameKey);
  }
}
