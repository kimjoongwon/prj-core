import type { LanguageCode, TenantDto, UserDto } from '@shared/schema';
import type { PageTypes } from '@shared/types';
import { ClsServiceManager } from 'nestjs-cls';

export class ContextProvider {
  private static readonly nameSpace = 'request';

  private static readonly authUserKey = 'user_key';

  private static readonly languageKey = 'language_key';

  private static readonly tenantKey = 'tenant_key';

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

  static setAuthUser(user: UserDto): void {
    ContextProvider.set(ContextProvider.authUserKey, user);
  }

  static setLanguage(language: string): void {
    ContextProvider.set(ContextProvider.languageKey, language);
  }

  static setTenant(tenant: TenantDto): void {
    ContextProvider.set(ContextProvider.tenantKey, tenant);
  }

  static setTanancyId(tenantId: string): void {
    ContextProvider.set('tenantId', tenantId);
  }

  static setServiceId(serviceId: string): void {
    ContextProvider.set('serviceId', serviceId);
  }

  static getServiceId(): string {
    return ContextProvider.get('serviceId');
  }

  static getTenancyId(): string {
    return ContextProvider.get('tenantId');
  }

  static setTenantId(tenantId: string): void {
    ContextProvider.set('tenantId', tenantId);
  }
  static getTenantId(): string {
    return ContextProvider.get('tenantId');
  }

  static getLanguage(): LanguageCode | undefined {
    return ContextProvider.get<LanguageCode>(ContextProvider.languageKey);
  }

  static getAuthUser(): UserDto | undefined {
    return ContextProvider.get<UserDto>(ContextProvider.authUserKey);
  }

  static setAuthUserId(userId: string): void {
    ContextProvider.set('userId', userId);
  }

  static getAuthUserId(): string {
    return ContextProvider.get('userId');
  }

  static getTenant(): TenantDto | undefined {
    return ContextProvider.get<TenantDto>(ContextProvider.tenantKey);
  }

  static setToken(token: string): void {
    ContextProvider.set('token', token);
  }
  static getToken(): string {
    return ContextProvider.get('token');
  }

  static setServiceName(serviceName: string): void {
    ContextProvider.set('serviceName', serviceName);
  }
  static getServiceName(): string {
    return ContextProvider.get('serviceName');
  }

  static setPageContext(pageContext: PageTypes): void {
    ContextProvider.set('pageContext', pageContext);
  }

  static getPageContext(): PageTypes {
    return ContextProvider.get('pageContext');
  }

  static setSpaceId(spaceId: string): void {
    ContextProvider.set('spaceId', spaceId);
  }

  static getSpaceId(): string {
    return ContextProvider.get('spaceId');
  }

  static getSpaceNumber(): string {
    return ContextProvider.get('spaceNumber');
  }
  static setSpaceNumber(spaceNumber: string): void {
    ContextProvider.set('spaceNumber', spaceNumber);
  }
}
