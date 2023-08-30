import { NavigateOptions } from 'next/dist/shared/lib/app-router-context'
import { PrefetchOptions } from 'next/dist/shared/lib/router/router'
import { useRouter } from 'next/navigation'
import { Path } from 'path-parser'

export const LOGIN_PAGE_PATH = '/auth/login' as const
export const USERS_PAGE_PATH = '/admin/dashboard/users' as const
export const USER_PAGE_PATH = '/admin/dashboard/users/:userId' as const

export type Paths =
  | typeof LOGIN_PAGE_PATH
  | typeof USERS_PAGE_PATH
  | typeof USER_PAGE_PATH

interface CoCRouterArgs<T> {
  url: Paths
  params?: T
  queryString?: string
  options?: NavigateOptions
  prefetchOptions?: PrefetchOptions | undefined
}

export const useCoCRouter = <T extends object>() => {
  const router = useRouter()

  const getUrlWithParamsAndQueryString = (
    url: string,
    params?: T,
    queryString?: string,
  ) => {
    const path = new Path(url)
    let pathWithParams = path.build(params)
    if (queryString) {
      pathWithParams + '?' + queryString
    }

    return pathWithParams
  }

  return {
    /**
     * @if url: 'lecture/card/:cardId/cubes/:cubeId'
     * @if params: { cubeId: 'CUBE-13i', cardId: 'CARD-75x' }
     */
    getUrlWithParams: getUrlWithParamsAndQueryString,
    push: (cocRouterArgs: CoCRouterArgs<T>) => {
      const { params, url, queryString, options } = cocRouterArgs

      const urlWithParamsAndQueryString = getUrlWithParamsAndQueryString(
        url,
        params,
        queryString,
      )

      router.push(urlWithParamsAndQueryString, options)
    },
    replace: (cocRouterArgs: CoCRouterArgs<T>) => {
      const { params, url, queryString, options } = cocRouterArgs

      const urlWithParamsAndQueryString = getUrlWithParamsAndQueryString(
        url,
        params,
        queryString,
      )

      router.replace(urlWithParamsAndQueryString, options)
    },
    back: () => router.back(),
    forward: () => router.forward(),
    prefetch: (cocRouterArgs: CoCRouterArgs<T>) => {
      const { params, url, queryString } = cocRouterArgs

      const urlWithParamsAndQueryString = getUrlWithParamsAndQueryString(
        url,
        params,
        queryString,
      )
      router.prefetch(urlWithParamsAndQueryString)
    },
  }
}
