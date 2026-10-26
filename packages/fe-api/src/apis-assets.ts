import {
	type MutationFunction,
	type QueryClient,
	type QueryFunction,
	type UseMutationOptions,
	type UseMutationResult,
	type UseQueryOptions,
	type UseQueryResult,
	type UseSuspenseQueryOptions,
	type UseSuspenseQueryResult,
	useMutation,
	useQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { apiJsonStringify } from "./libs/apiFetchCore";
import type { BodyType, ErrorType } from "./libs/customFetch";
import { customFetch } from "./libs/customFetch";

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
	createdById: string | null;
	publicUrl: string | null;
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

export interface CreateFolderDto {
	name: string;
	parentFolderId?: string | null;
}

export interface CreateFolder201AllOf {
	data: FolderDto;
}

export interface UpdateFolderDto {
	name?: string;
	parentFolderId?: string | null;
}

export interface UpdateFolder200AllOf {
	data: FolderDto;
}

export interface UploadAsset201AllOf {
	data: AssetDto;
}

export const getFolders = (
	options?: SecondParameter<typeof customFetch>,
	signal?: AbortSignal,
) => {
	return customFetch<GetFolders200AllOf>("/api/v1/folders", {
		...options,
		method: "GET",
		signal: signal ?? options?.signal,
	});
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
		request?: SecondParameter<typeof customFetch>;
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
		request?: SecondParameter<typeof customFetch>;
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

export const getGetFoldersSuspenseQueryOptions = <
	TData = Awaited<ReturnType<typeof getFolders>>,
	TError = ErrorType<void>,
>(options?: {
	query?: Partial<
		UseSuspenseQueryOptions<
			Awaited<ReturnType<typeof getFolders>>,
			TError,
			TData
		>
	>;
	request?: SecondParameter<typeof customFetch>;
}): UseSuspenseQueryOptions<
	Awaited<ReturnType<typeof getFolders>>,
	TError,
	TData
> => {
	const queryOptions = options?.query;
	const requestOptions = options?.request;
	const queryKey = queryOptions?.queryKey ?? getGetFoldersQueryKey();

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getFolders>>> = ({
		signal,
	}) => getFolders(requestOptions, signal);

	return {
		queryKey,
		queryFn,
		...queryOptions,
	};
};

export const useGetFoldersSuspense = <
	TData = Awaited<ReturnType<typeof getFolders>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getFolders>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customFetch>;
	},
	queryClient?: QueryClient,
): UseSuspenseQueryResult<TData, TError> => {
	const queryOptions = getGetFoldersSuspenseQueryOptions(options);
	return useSuspenseQuery(queryOptions, queryClient);
};

export const createFolder = (
	data: BodyType<CreateFolderDto>,
	options?: SecondParameter<typeof customFetch>,
) => {
	return customFetch<CreateFolder201AllOf>("/api/v1/folders", {
		...options,
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: apiJsonStringify(data),
	});
};

export const getCreateFolderMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof createFolder>>,
		TError,
		{ data: BodyType<CreateFolderDto> },
		TContext
	>;
	request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof createFolder>>,
	TError,
	{ data: BodyType<CreateFolderDto> },
	TContext
> => {
	const mutationKey = ["createFolder"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: {
					...options,
					mutation: {
						...options.mutation,
						mutationKey,
					},
				}
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof createFolder>>,
		{ data: BodyType<CreateFolderDto> }
	> = (props) => {
		const { data } = props ?? {};
		return createFolder(data, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export const useCreateFolder = <TError = ErrorType<void>, TContext = unknown>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof createFolder>>,
			TError,
			{ data: BodyType<CreateFolderDto> },
			TContext
		>;
		request?: SecondParameter<typeof customFetch>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof createFolder>>,
	TError,
	{ data: BodyType<CreateFolderDto> },
	TContext
> => {
	const mutationOptions = getCreateFolderMutationOptions(options);
	return useMutation(mutationOptions, queryClient);
};

export const updateFolder = (
	folderId: string,
	data: BodyType<UpdateFolderDto>,
	options?: SecondParameter<typeof customFetch>,
) => {
	return customFetch<UpdateFolder200AllOf>(`/api/v1/folders/${folderId}`, {
		...options,
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: apiJsonStringify(data),
	});
};

export const getUpdateFolderMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof updateFolder>>,
		TError,
		{ folderId: string; data: BodyType<UpdateFolderDto> },
		TContext
	>;
	request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof updateFolder>>,
	TError,
	{ folderId: string; data: BodyType<UpdateFolderDto> },
	TContext
> => {
	const mutationKey = ["updateFolder"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: {
					...options,
					mutation: {
						...options.mutation,
						mutationKey,
					},
				}
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof updateFolder>>,
		{ folderId: string; data: BodyType<UpdateFolderDto> }
	> = (props) => {
		const { folderId, data } = props ?? {};
		return updateFolder(folderId, data, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export const useUpdateFolder = <TError = ErrorType<void>, TContext = unknown>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof updateFolder>>,
			TError,
			{ folderId: string; data: BodyType<UpdateFolderDto> },
			TContext
		>;
		request?: SecondParameter<typeof customFetch>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof updateFolder>>,
	TError,
	{ folderId: string; data: BodyType<UpdateFolderDto> },
	TContext
> => {
	const mutationOptions = getUpdateFolderMutationOptions(options);
	return useMutation(mutationOptions, queryClient);
};

export const removeFolder = (
	folderId: string,
	options?: SecondParameter<typeof customFetch>,
) => {
	return customFetch<void>(`/api/v1/folders/${folderId}`, {
		...options,
		method: "DELETE",
	});
};

export const getRemoveFolderMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof removeFolder>>,
		TError,
		{ folderId: string },
		TContext
	>;
	request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof removeFolder>>,
	TError,
	{ folderId: string },
	TContext
> => {
	const mutationKey = ["removeFolder"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: {
					...options,
					mutation: {
						...options.mutation,
						mutationKey,
					},
				}
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof removeFolder>>,
		{ folderId: string }
	> = (props) => {
		const { folderId } = props ?? {};
		return removeFolder(folderId, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export const useRemoveFolder = <TError = ErrorType<void>, TContext = unknown>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof removeFolder>>,
			TError,
			{ folderId: string },
			TContext
		>;
		request?: SecondParameter<typeof customFetch>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof removeFolder>>,
	TError,
	{ folderId: string },
	TContext
> => {
	const mutationOptions = getRemoveFolderMutationOptions(options);
	return useMutation(mutationOptions, queryClient);
};
