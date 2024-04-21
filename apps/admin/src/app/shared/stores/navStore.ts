import { makeAutoObservable } from 'mobx';
import {
  AppRouterInstance,
  NavigateOptions,
  PrefetchOptions,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Path } from 'path-parser';
interface CoCRouterArgs<T> {
  url: Paths;
  params?: T;
  queryString?: string;
  options?: NavigateOptions;
  prefetchOptions?: PrefetchOptions | undefined;
}

export const ADMIN_PATH = '/admin' as const;
export const DASHBOARD_PAGE_PATH = `${ADMIN_PATH}/dashboard` as const;
export const ADMIN_AUTH_PATH = `${ADMIN_PATH}/auth` as const;
export const ADMIN_AUTH_LOGIN_PATH = `${ADMIN_AUTH_PATH}/login` as const;
export const ADMIN_SERVICE_NAME_PATH = `${ADMIN_PATH}/services/:serviceId` as const;
export const ADMIN_AUTH_SERVICE_CATEGORIES_PATH =
  `${ADMIN_SERVICE_NAME_PATH}/categories` as const;

export type Paths =
  | typeof DASHBOARD_PAGE_PATH
  | typeof ADMIN_AUTH_PATH
  | typeof ADMIN_AUTH_LOGIN_PATH
  | typeof ADMIN_SERVICE_NAME_PATH
  | typeof ADMIN_AUTH_SERVICE_CATEGORIES_PATH;

export class NavStore {
  router: AppRouterInstance | null = null;
  constructor() {
    makeAutoObservable(this);
  }

  getUrlWithParamsAndQueryString<T extends object>(
    url: Paths,
    params?: T,
    queryString?: string,
  ) {
    const path = new Path(url);
    let pathWithParams = path.build(params);
    if (queryString) {
      pathWithParams = pathWithParams + '?' + queryString;
    }
    return pathWithParams;
  }

  push<T extends object>(cocRouterArgs: CoCRouterArgs<T>) {
    const { params, url, queryString, options } = cocRouterArgs;
    const urlWithParamsAndQueryString = this.getUrlWithParamsAndQueryString(
      url,
      params,
      queryString,
    );

    this.router?.push(urlWithParamsAndQueryString, options);
  }
  replace<T extends object>(cocRouterArgs: CoCRouterArgs<T>) {
    const { params, url, queryString, options } = cocRouterArgs;

    const urlWithParamsAndQueryString = this.getUrlWithParamsAndQueryString(
      url,
      params,
      queryString,
    );

    this.router?.replace(urlWithParamsAndQueryString, options);
  }
  back() {
    this.router?.back();
  }
  forward() {
    this.router?.forward();
  }
}

export const navStore = new NavStore();
