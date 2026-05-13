import { REQUEST_HEADER_KEYS } from "@cocrepo/constant";
import Axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

const DEFAULT_CORE_API_SERVER_BASE_URL =
  (typeof process !== "undefined"
    ? process.env.CORE_API_INTERNAL_URL
    : undefined) ?? "http://localhost:3006";

function resolveServerBaseUrl(url?: string) {
  if (typeof window !== "undefined" || !url?.startsWith("/")) {
    return undefined;
  }

  return DEFAULT_CORE_API_SERVER_BASE_URL;
}

// 브라우저에서는 같은 origin 상대경로를 사용하고,
// 서버 컴포넌트/SSR에서는 runtime env 기반 internal URL을 사용합니다.
export const AXIOS_INSTANCE = Axios.create({
  timeout: 10000, // 10초 타임아웃
  withCredentials: true, // 쿠키/인증 정보 포함
});

// PersistStore 참조 (앱 초기화 시 설정)
interface PersistStoreRef {
  accessToken?: string | null;
  accessTokenExpiresAt?: number | null;
  refreshToken?: string | null;
  refreshTokenExpiresAt?: number | null;
  spaceId?: string | null;
}
let persistStoreRef: PersistStoreRef | null = null;

type NativeRefreshHandler = () => Promise<void>;
let nativeRefreshHandler: NativeRefreshHandler | null = null;

interface LocaleStoreRef {
  languageCode?: string | null;
}
let localeStoreRef: LocaleStoreRef | null = null;

// 401 발생 시 리다이렉트할 로그인 URL (앱별 설정 가능)
let loginRedirectUrl = "/admin/auth/login";

/**
 * 401 토큰 만료 시 리다이렉트할 로그인 URL 설정
 * 앱 초기화 시 호출하여 앱별 로그인 경로를 지정합니다.
 */
export function setLoginRedirectUrl(url: string) {
  loginRedirectUrl = url;
}

/**
 * 토큰 갱신 응답의 만료 시간을 PersistStore에 반영하기 위한 Store 참조 설정
 * 앱 초기화 시 호출하여 Store 참조를 주입합니다.
 */
export function setApiPersistStore(store: PersistStoreRef) {
  persistStoreRef = store;
}

export function setApiNativeRefreshHandler(handler: NativeRefreshHandler | null) {
  nativeRefreshHandler = handler;
}

export function setApiLocaleStore(store: LocaleStoreRef) {
  localeStoreRef = store;
}

// 토큰 갱신 상태 관리
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  for (const { resolve, reject } of failedQueue) {
    if (error) {
      reject(error);
    } else {
      resolve(undefined);
    }
  }
  failedQueue = [];
};

const applyTokenRefreshData = (responseData?: {
  accessToken?: string;
  accessTokenExpiresAt?: number;
  refreshToken?: string;
  refreshTokenExpiresAt?: number;
}) => {
  if (!responseData || !persistStoreRef) {
    return;
  }

  persistStoreRef.accessToken =
    responseData.accessToken ?? persistStoreRef.accessToken ?? null;
  persistStoreRef.refreshToken =
    responseData.refreshToken ?? persistStoreRef.refreshToken ?? null;
  if (responseData.accessTokenExpiresAt) {
    persistStoreRef.accessTokenExpiresAt = responseData.accessTokenExpiresAt;
    persistStoreRef.refreshTokenExpiresAt = responseData.refreshTokenExpiresAt;
  }
};

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers);
  const accessToken = persistStoreRef?.accessToken;
  const refreshToken = persistStoreRef?.refreshToken;
  const spaceId = persistStoreRef?.spaceId;

  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (refreshToken && !headers.has(REQUEST_HEADER_KEYS.REFRESH_TOKEN)) {
    headers.set(REQUEST_HEADER_KEYS.REFRESH_TOKEN, refreshToken);
  }

  if (spaceId) {
    headers.set(REQUEST_HEADER_KEYS.SPACE_ID, spaceId);
  }

  const languageCode = localeStoreRef?.languageCode;
  if (languageCode) {
    headers.set(REQUEST_HEADER_KEYS.LANGUAGE, languageCode);
  }

  config.headers = headers;
  return config;
});

// Response 인터셉터: 401 토큰 갱신 + 409 에러 처리
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const isBrowser = typeof window !== "undefined";
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const canHandleRefresh = isBrowser || nativeRefreshHandler;

    if (
      canHandleRefresh &&
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // refresh 엔드포인트 자체의 401은 갱신 시도하지 않음
      if (
        originalRequest.url?.includes("/auth/token/refresh") ||
        originalRequest.url?.includes("/auth/native/token/refresh")
      ) {
        if (isBrowser && !nativeRefreshHandler) {
          window.location.href = loginRedirectUrl;
        }
        return Promise.reject(error);
      }

      // 이미 갱신 중이면 큐에 추가하여 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => AXIOS_INSTANCE(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        if (nativeRefreshHandler) {
          await nativeRefreshHandler();
        } else {
          const refreshResponse = await AXIOS_INSTANCE.post(
            "/api/v1/auth/token/refresh",
          );
          const responseData = (
            refreshResponse.data as {
              data?: {
                accessToken?: string;
                accessTokenExpiresAt?: number;
                refreshToken?: string;
                refreshTokenExpiresAt?: number;
              };
            }
          )?.data;
          applyTokenRefreshData(responseData);
        }
        processQueue(null);
        // 갱신 성공 → 원래 요청 재시도 (새 쿠키 자동 적용)
        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        if (isBrowser && !nativeRefreshHandler) {
          window.location.href = loginRedirectUrl;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 409 Conflict 에러 처리
    if (error.response?.status === 409) {
      const responseData = error.response.data as { message?: string };
      const errorMessage =
        responseData?.message || "충돌이 발생했습니다. 다시 시도해주세요.";
      console.error("409 Conflict Error:", errorMessage);

      // 에러 객체에 사용자 친화적인 메시지 추가
      error.message = errorMessage;
    }
    return Promise.reject(error);
  },
);

// add a second `options` argument here if you want to pass extra options to each generated query
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const headers = {
    ...config.headers,
    ...options?.headers,
  };
  const baseURL =
    options?.baseURL ?? config.baseURL ?? resolveServerBaseUrl(config.url);
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    headers,
    ...(baseURL ? { baseURL } : {}),
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
