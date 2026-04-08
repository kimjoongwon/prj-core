import {
	useMutation,
	useQuery,
	type QueryClient,
	type UseMutationOptions,
	type UseMutationResult,
	type UseQueryOptions,
	type UseQueryResult,
} from "@tanstack/react-query";
import { customIdpInstance } from "../../libs/customIdpAxios";
import type { ErrorType } from "../../libs/customIdpAxios";
import type { SpaceDto } from "../model/spaceDto";

type CurrentSpaceResponse = {
	data?: SpaceDto | null;
};

type SetCurrentSpacePayload = {
	spaceId: string;
};

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

function resolveDirectIdpApiBaseUrl() {
	const envUrl =
		typeof process !== "undefined"
			? process.env.NEXT_PUBLIC_IDP_API_URL
			: undefined;
	if (envUrl) {
		return envUrl;
	}

	if (typeof window === "undefined") {
		return undefined;
	}

	if (window.location.hostname === "localhost") {
		return `${window.location.protocol}//localhost:3007`;
	}

	return undefined;
}

function resolveCurrentSpaceRequestOptions(
	options?: SecondParameter<typeof customIdpInstance>,
) {
	const nextOptions = options ? { ...options } : {};
	if (!nextOptions.baseURL) {
		const directBaseUrl = resolveDirectIdpApiBaseUrl();
		if (directBaseUrl) {
			nextOptions.baseURL = directBaseUrl;
		}
	}

	if (nextOptions.baseURL && nextOptions.withCredentials === undefined) {
		nextOptions.withCredentials = true;
	}

	return nextOptions;
}

export const getCurrentSpace = (
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) =>
	customIdpInstance<CurrentSpaceResponse>(
		{
			url: "/api/v1/auth/current-space",
			method: "GET",
			signal,
		},
		resolveCurrentSpaceRequestOptions(options),
	);

export const getCurrentSpaceQueryKey = () =>
	["/api/v1/auth/current-space"] as const;

export function useGetCurrentSpace<
	TData = Awaited<ReturnType<typeof getCurrentSpace>>,
	TError = ErrorType<unknown>,
>(
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> {
	const queryOptions = options?.query;
	const requestOptions = options?.request;

	return useQuery(
		{
			queryKey: queryOptions?.queryKey ?? getCurrentSpaceQueryKey(),
			queryFn: ({ signal }) => getCurrentSpace(requestOptions, signal),
			...queryOptions,
		},
		queryClient,
	);
}

export const setCurrentSpace = (
	payload: SetCurrentSpacePayload,
	options?: SecondParameter<typeof customIdpInstance>,
) =>
	customIdpInstance<CurrentSpaceResponse>(
		{
			url: "/api/v1/auth/current-space",
			method: "POST",
			headers: { "Content-Type": "application/json" },
			data: payload,
		},
		resolveCurrentSpaceRequestOptions(options),
	);

export function useSetCurrentSpace<TError = ErrorType<unknown>, TContext = unknown>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof setCurrentSpace>>,
			TError,
			SetCurrentSpacePayload,
			TContext
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof setCurrentSpace>>,
	TError,
	SetCurrentSpacePayload,
	TContext
> {
	return useMutation(
		{
			mutationFn: (payload) => setCurrentSpace(payload, options?.request),
			...options?.mutation,
		},
		queryClient,
	);
}
