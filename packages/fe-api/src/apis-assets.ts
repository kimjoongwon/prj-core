import {
	type MutationFunction,
	type QueryClient,
	type QueryFunction,
	type UseMutationOptions,
	type UseMutationResult,
	type UseQueryOptions,
	type UseQueryResult,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import type { BodyType, ErrorType } from "./libs/customAxios";
import { customInstance } from "./libs/customAxios";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export type AssetKind = "IMAGE" | "VIDEO" | "DOCUMENT";
export type AssetStatus = "UPLOADING" | "READY" | "FAILED";

export interface AssetDto {
	id: string;
	spaceId: string;
	folderId: string;
	kind: AssetKind;
	status: AssetStatus;
	originalName: string;
	storageKey: string;
	mimeType: string;
	sizeBytes: number;
	extension: string | null;
	checksum: string | null;
	metadata: unknown;
	creatorId: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface FolderDto {
	id: string;
	name: string;
	parentFolderId?: string | null;
}

export interface PageMeta {
	total?: number;
	take?: number;
	skip?: number;
}

export interface GetAssetsParams {
	take?: number;
	skip?: number;
	search?: string;
	kind?: AssetKind;
	status?: AssetStatus;
	folderId?: string;
	sort?: string[];
}

export interface GetAssets200AllOf {
	data: AssetDto[];
	meta?: PageMeta;
}

export interface GetAssetById200AllOf {
	data: AssetDto;
}

export interface GetFolders200AllOf {
	data: FolderDto[];
	meta?: PageMeta;
}

export interface MoveAssetDto {
	targetFolderId: string;
}

export const getAssets = (
	params?: GetAssetsParams,
	options?: SecondParameter<typeof customInstance>,
	signal?: AbortSignal,
) => {
	return customInstance<GetAssets200AllOf>(
		{
			url: "/api/v1/assets",
			method: "GET",
			params,
			signal,
		},
		options,
	);
};

export const getGetAssetsQueryKey = (params?: GetAssetsParams) =>
	["/api/v1/assets", params] as const;

export const useGetAssets = <
	TData = Awaited<ReturnType<typeof getAssets>>,
	TError = ErrorType<void>,
>(
	params?: GetAssetsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getAssets>>, TError, TData>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> => {
	const queryOptions = options?.query;
	const requestOptions = options?.request;
	const queryKey = queryOptions?.queryKey ?? getGetAssetsQueryKey(params);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getAssets>>> = ({
		signal,
	}) => getAssets(params, requestOptions, signal);

	return useQuery(
		{
			queryKey,
			queryFn,
			...queryOptions,
		},
		queryClient,
	);
};

export const prefetchGetAssetsQuery = async <
	TData = Awaited<ReturnType<typeof getAssets>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	params?: GetAssetsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getAssets>>, TError, TData>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = options?.query;
	const requestOptions = options?.request;

	await queryClient.prefetchQuery({
		queryKey: queryOptions?.queryKey ?? getGetAssetsQueryKey(params),
		queryFn: ({ signal }) => getAssets(params, requestOptions, signal),
		...queryOptions,
	});

	return queryClient;
};

export const getAssetById = (
	assetId: string,
	options?: SecondParameter<typeof customInstance>,
	signal?: AbortSignal,
) => {
	return customInstance<GetAssetById200AllOf>(
		{
			url: `/api/v1/assets/${assetId}`,
			method: "GET",
			signal,
		},
		options,
	);
};

export const getGetAssetByIdQueryKey = (assetId: string) =>
	["/api/v1/assets", assetId] as const;

export const useGetAssetById = <
	TData = Awaited<ReturnType<typeof getAssetById>>,
	TError = ErrorType<void>,
>(
	assetId: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getAssetById>>, TError, TData>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> => {
	const queryOptions = options?.query;
	const requestOptions = options?.request;
	const queryKey = queryOptions?.queryKey ?? getGetAssetByIdQueryKey(assetId);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getAssetById>>> = ({
		signal,
	}) => getAssetById(assetId, requestOptions, signal);

	return useQuery(
		{
			queryKey,
			queryFn,
			...queryOptions,
		},
		queryClient,
	);
};

export const prefetchGetAssetByIdQuery = async <
	TData = Awaited<ReturnType<typeof getAssetById>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	assetId: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getAssetById>>, TError, TData>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = options?.query;
	const requestOptions = options?.request;

	await queryClient.prefetchQuery({
		queryKey: queryOptions?.queryKey ?? getGetAssetByIdQueryKey(assetId),
		queryFn: ({ signal }) => getAssetById(assetId, requestOptions, signal),
		...queryOptions,
	});

	return queryClient;
};

export const removeAsset = (
	assetId: string,
	options?: SecondParameter<typeof customInstance>,
) => {
	return customInstance<void>(
		{
			url: `/api/v1/assets/${assetId}`,
			method: "DELETE",
		},
		options,
	);
};

export const getRemoveAssetMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof removeAsset>>,
		TError,
		{ assetId: string },
		TContext
	>;
	request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof removeAsset>>,
	TError,
	{ assetId: string },
	TContext
> => {
	const requestOptions = options?.request;

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof removeAsset>>,
		{ assetId: string }
	> = (props) => removeAsset(props.assetId, requestOptions);

	return { mutationFn, ...options?.mutation };
};

export const useRemoveAsset = <TError = ErrorType<void>, TContext = unknown>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof removeAsset>>,
			TError,
			{ assetId: string },
			TContext
		>;
		request?: SecondParameter<typeof customInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof removeAsset>>,
	TError,
	{ assetId: string },
	TContext
> => {
	const mutationOptions = getRemoveAssetMutationOptions(options);
	return useMutation(mutationOptions, queryClient);
};

export const moveAsset = (
	assetId: string,
	data: BodyType<MoveAssetDto>,
	options?: SecondParameter<typeof customInstance>,
) => {
	return customInstance<AssetDto>(
		{
			url: `/api/v1/assets/${assetId}/move`,
			method: "PATCH",
			data,
		},
		options,
	);
};

export const getMoveAssetMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof moveAsset>>,
		TError,
		{ assetId: string; data: BodyType<MoveAssetDto> },
		TContext
	>;
	request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof moveAsset>>,
	TError,
	{ assetId: string; data: BodyType<MoveAssetDto> },
	TContext
> => {
	const requestOptions = options?.request;

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof moveAsset>>,
		{ assetId: string; data: BodyType<MoveAssetDto> }
	> = (props) => moveAsset(props.assetId, props.data, requestOptions);

	return { mutationFn, ...options?.mutation };
};

export const useMoveAsset = <TError = ErrorType<void>, TContext = unknown>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof moveAsset>>,
			TError,
			{ assetId: string; data: BodyType<MoveAssetDto> },
			TContext
		>;
		request?: SecondParameter<typeof customInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof moveAsset>>,
	TError,
	{ assetId: string; data: BodyType<MoveAssetDto> },
	TContext
> => {
	const mutationOptions = getMoveAssetMutationOptions(options);
	return useMutation(mutationOptions, queryClient);
};

export const getFolders = (
	options?: SecondParameter<typeof customInstance>,
	signal?: AbortSignal,
) => {
	return customInstance<GetFolders200AllOf>(
		{
			url: "/api/v1/folders",
			method: "GET",
			signal,
		},
		options,
	);
};

export const getGetFoldersQueryKey = () => ["/api/v1/folders"] as const;

export const useGetFolders = <
	TData = Awaited<ReturnType<typeof getFolders>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getFolders>>, TError, TData>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> => {
	const queryOptions = options?.query;
	const requestOptions = options?.request;
	const queryKey = queryOptions?.queryKey ?? getGetFoldersQueryKey();

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getFolders>>> = ({
		signal,
	}) => getFolders(requestOptions, signal);

	return useQuery(
		{
			queryKey,
			queryFn,
			...queryOptions,
		},
		queryClient,
	);
};

export const prefetchGetFoldersQuery = async <
	TData = Awaited<ReturnType<typeof getFolders>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getFolders>>, TError, TData>
		>;
		request?: SecondParameter<typeof customInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = options?.query;
	const requestOptions = options?.request;

	await queryClient.prefetchQuery({
		queryKey: queryOptions?.queryKey ?? getGetFoldersQueryKey(),
		queryFn: ({ signal }) => getFolders(requestOptions, signal),
		...queryOptions,
	});

	return queryClient;
};
