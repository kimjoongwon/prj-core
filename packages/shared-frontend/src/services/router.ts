import { makeAutoObservable, reaction } from 'mobx';
import {
  AppRouterInstance,
  NavigateOptions,
  PrefetchOptions,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Path } from 'path-parser';
import { Paths } from '../constants/Paths';
import { isObjectEmpty } from '../utils';
import { Galaxy } from './galaxy';

interface CoCRouterArgs<T> {
  url: Paths;
  params?: T;
  queryString?: string;
  options?: NavigateOptions;
  prefetchOptions?: PrefetchOptions | undefined;
}

export class Router {
  pathname: string = window.location.pathname;

  constructor(
    readonly galaxy: Galaxy,
    readonly nextRouter: AppRouterInstance,
  ) {
    makeAutoObservable(this);
    this.galaxy = galaxy;
    this.nextRouter = nextRouter;

    reaction(
      () => this.pathname,
      pathname => this.setPathname(pathname),
    );
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

    this.pathname = pathWithParams;

    return pathWithParams as Paths;
  }

  push<T extends object>(cocRouterArgs: CoCRouterArgs<T>) {
    const { params, url, queryString, options } = cocRouterArgs;
    const urlWithParamsAndQueryString = this.getUrlWithParamsAndQueryString(
      url,
      params,
      queryString,
    );

    this.setPathname(urlWithParamsAndQueryString);

    this.nextRouter?.push(urlWithParamsAndQueryString, options);
  }

  setPathname(pathname: string) {
    this.pathname = pathname;
  }

  replace<T extends object>(cocRouterArgs: CoCRouterArgs<T>) {
    const { params, url, queryString, options } = cocRouterArgs;

    const urlWithParamsAndQueryString = this.getUrlWithParamsAndQueryString(
      url,
      params,
      queryString,
    );

    this.setPathname(urlWithParamsAndQueryString);
    this.nextRouter?.replace(urlWithParamsAndQueryString, options);
  }

  back() {
    this.nextRouter?.back();
    setTimeout(() => {
      this.setPathname(window.location.pathname);
    }, 500);
  }

  forward() {
    this.nextRouter?.forward();
    setTimeout(() => {
      this.setPathname(window.location.pathname);
    }, 500);
  }
}
