import { makeAutoObservable } from 'mobx';
import {
  AppRouterInstance,
  NavigateOptions,
  PrefetchOptions,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Path } from 'path-parser';
import { Paths } from '../constants/Paths';
import { isEmpty } from 'lodash-es';
import { isObjectEmpty } from '../utils';
interface CoCRouterArgs<T> {
  url: Paths;
  params?: T;
  queryString?: string;
  options?: NavigateOptions;
  prefetchOptions?: PrefetchOptions | undefined;
}

export class routerStore {
  router: AppRouterInstance | null = null;
  constructor() {
    makeAutoObservable(this);
  }

  setRouter(router: AppRouterInstance) {
    this.router = router;
  }

  getUrlWithParamsAndQueryString<T extends object>(
    url: Paths,
    params?: T,
    queryString?: string,
  ) {
    const path = new Path(url);
    let pathWithParams = '';

    if (isObjectEmpty(params)) {
      pathWithParams = url;
    } else {
      pathWithParams = path.build(params);
    }

    if (queryString) {
      pathWithParams = pathWithParams + '?' + queryString;
    }
    return pathWithParams as Paths;
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

export const router = new routerStore();
