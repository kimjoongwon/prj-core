import Axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://wallyops.com'
      : 'http://localhost:3005',
}); // use your own URL here or environment variable

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
  const promise = AXIOS_INSTANCE({
    withCredentials: true,
    ...config,
    ...options,
    headers,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;

// // // Or, in case you want to wrap the body type (optional)
// // // (if the custom instance is processing data before sending it, like changing the case for example)
// // export type BodyType<BodyData> = CamelCase<BodyData>;
// // custom-instance.ts

// const baseURL = 'http://localhost:3005/api'; // use your own URL here or environment variable

// export const customInstance = async <T>({
//   url,
//   method,
//   params,
//   data,
// }: {
//   url: string;
//   method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
//   params?: any;
//   // @ts-ignore
//   data?: BodyType<unknown>;
//   responseType?: string;
// }): Promise<T> => {
//   const response = await fetch(
//     `${baseURL}${url}` + new URLSearchParams(params),
//     {
//       method,
//       ...(data ? { body: JSON.stringify(data) } : {}),
//     },
//   );

//   return response.json();
// };

// export default customInstance;

// // In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
// // @ts-ignore
// export type ErrorType<Error> = AxiosError<Error>;
// // @ts-ignore
// export type BodyType<BodyData> = BodyData;
// // In case you want to wrap the body type (optional)
// // (if the custom instance is processing data before sending it, like changing the case for example)
// // @ts-ignore
// export type BodyType<BodyData> = CamelCase<BodyType>;
// NOTE: Supports cases where `content-type` is other than `json`
// const getBody = <T>(c: Response | Request): Promise<T> => {
//   const contentType = c.headers.get('content-type');

//   if (contentType && contentType.includes('application/json')) {
//     return c.json();
//   }

//   if (contentType && contentType.includes('application/pdf')) {
//     return c.blob() as Promise<T>;
//   }

//   return c.text() as Promise<T>;
// };

// // NOTE: Update just base url
// const getUrl = (contextUrl: string): string => {
//   const url = new URL(contextUrl);
//   const pathname = url.pathname;
//   const search = url.search;
//   const baseUrl =
//     process.env.NODE_ENV === 'production'
//       ? 'productionBaseUrl'
//       : 'http://localhost:3005/api';

//   const requestUrl = new URL(`${baseUrl}${pathname}${search}`);

//   return requestUrl.toString();
// };

// // NOTE: Add headers
// const getHeaders = (headers?: HeadersInit): HeadersInit => {
//   return {
//     ...headers,
//     Authorization: 'token',
//     'Content-Type': 'multipart/form-data',
//   };
// };

// export const customFetch = async <T>(
//   url: string,
//   options: RequestInit,
// ): Promise<T> => {
//   const requestUrl = getUrl(url);
//   const requestHeaders = getHeaders(options.headers);

//   const requestInit: RequestInit = {
//     ...options,
//     headers: requestHeaders,
//   };

//   const request = new Request(requestUrl, requestInit);
//   const response = await fetch(request);
//   const data = await getBody<T>(response);

//   return { status: response.status, data } as T;
// };
