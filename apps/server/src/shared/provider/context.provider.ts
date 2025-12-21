import { LanguageCode } from "@cocrepo/constants";
import { TenantDto, UserDto } from "@cocrepo/dto";
import { ClsServiceManager } from "nestjs-cls";

export class ContextProvider {
  private static readonly nameSpace = "request";
  private static readonly authUserKey = "user_key";
  private static readonly languageKey = "language_key";
  private static readonly tenantKey = "tenant_key";
  private static readonly tokenKey = "token_key";
  private static readonly serviceNameKey = "service_name_key";

  private static get<T>(key: string) {
    const store = ClsServiceManager.getClsService();
    return store.get<T>(ContextProvider.getKeyWithNamespace(key));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static set(key: string, value: any): void {
    const store = ClsServiceManager.getClsService();
    store.set(ContextProvider.getKeyWithNamespace(key), value);
  }

  private static getKeyWithNamespace(key: string): string {
    return `${ContextProvider.nameSpace}.${key}`;
  }

  static setAuthUser(user: UserDto | undefined): void {
    ContextProvider.set(ContextProvider.authUserKey, user);
  }

  static getAuthUser(): UserDto | undefined {
    return ContextProvider.get<UserDto>(ContextProvider.authUserKey);
  }

  static setAuthUserId(userId: string | undefined): void {
    ContextProvider.set("userId", userId);
  }

  static getAuthUserId(): string | undefined {
    return ContextProvider.get("userId");
  }

  static setLanguage(language: LanguageCode | undefined): void {
    ContextProvider.set(ContextProvider.languageKey, language);
  }

  static getLanguage(): LanguageCode | undefined {
    return ContextProvider.get<LanguageCode>(ContextProvider.languageKey);
  }

  static setTenant(tenant: TenantDto | undefined): void {
    ContextProvider.set(ContextProvider.tenantKey, tenant);
  }

  static getTenant(): TenantDto | undefined {
    return ContextProvider.get<TenantDto>(ContextProvider.tenantKey);
  }

  static getTenantId(): string | undefined {
    return ContextProvider.getTenant()?.id;
  }

  static getSpaceId(): string | undefined {
    return ContextProvider.getTenant()?.spaceId;
  }

  static setToken(token: string | undefined): void {
    ContextProvider.set(ContextProvider.tokenKey, token);
  }

  static getToken(): string | undefined {
    return ContextProvider.get(ContextProvider.tokenKey);
  }

  static setServiceName(serviceName: string | undefined): void {
    ContextProvider.set(ContextProvider.serviceNameKey, serviceName);
  }

  static getServiceName(): string | undefined {
    return ContextProvider.get(ContextProvider.serviceNameKey);
  }
}
