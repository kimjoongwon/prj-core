import { ClsServiceManager } from 'nestjs-cls';
import { LanguageCode } from '../constants/language-code.constant';
import { UserDto } from '../dtos/user.dto';
import { TenantDto } from '../dtos/tenant.dto';

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

  static getTenant(): UserDto | undefined {
    return ContextProvider.get<UserDto>(ContextProvider.tenantKey);
  }
}
