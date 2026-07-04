import {
	type QueryClient,
	type UseQueryOptions,
	type UseQueryResult,
	useQuery,
} from "@tanstack/react-query";
import { customInstance } from "./libs/customAxios";

type RequestOptions = Parameters<typeof customInstance>[1];

export interface InquiryFormOptionItem {
	value: string | number | boolean | null;
	label: string;
}

export interface InquiryFormUiPaths {
	readOnlyPaths: string[];
	hiddenPaths: string[];
	disabledPaths: string[];
}

export interface InquiryFormFieldMeta {
	label?: string;
}

export interface InquiryCreateUpdateFormBootstrap {
	mode: "CREATE" | "UPDATE";
	defaultObject: Record<string, unknown>;
	options: Record<string, InquiryFormOptionItem[]>;
	ui: InquiryFormUiPaths;
	fieldMeta: Record<string, InquiryFormFieldMeta>;
}

export interface ApiResponseEntity<TData> {
	httpStatus: number;
	message: string;
	data: TData;
	meta?: Record<string, unknown>;
}

export const getInquiryCreateForm = (
	options?: RequestOptions,
	signal?: AbortSignal,
) => {
	return customInstance<ApiResponseEntity<InquiryCreateUpdateFormBootstrap>>(
		{
			url: "/api/v1/inquiries/form/create",
			method: "GET",
			signal,
		},
		options,
	);
};

export const getGetInquiryCreateFormQueryKey = () => {
	return ["/api/v1/inquiries/form/create"] as const;
};

export function useGetInquiryCreateForm<
	TData = Awaited<ReturnType<typeof getInquiryCreateForm>>,
	TError = Error,
>(
	options?: {
		query?: Omit<
			UseQueryOptions<
				Awaited<ReturnType<typeof getInquiryCreateForm>>,
				TError,
				TData
			>,
			"queryKey" | "queryFn"
		>;
		request?: RequestOptions;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> {
	const queryOptions = options?.query;
	return useQuery(
		{
			queryKey: getGetInquiryCreateFormQueryKey(),
			queryFn: ({ signal }) => getInquiryCreateForm(options?.request, signal),
			...(queryOptions ?? {}),
		},
		queryClient,
	);
}

export const prefetchGetInquiryCreateFormQuery = async (
	queryClient: QueryClient,
	options?: { request?: RequestOptions },
): Promise<QueryClient> => {
	await queryClient.prefetchQuery({
		queryKey: getGetInquiryCreateFormQueryKey(),
		queryFn: ({ signal }) => getInquiryCreateForm(options?.request, signal),
	});

	return queryClient;
};

export const getInquiryUpdateForm = (
	inquiryId: string,
	options?: RequestOptions,
	signal?: AbortSignal,
) => {
	return customInstance<ApiResponseEntity<InquiryCreateUpdateFormBootstrap>>(
		{
			url: `/api/v1/inquiries/${inquiryId}/form/update`,
			method: "GET",
			signal,
		},
		options,
	);
};

export const getGetInquiryUpdateFormQueryKey = (inquiryId?: string) => {
	return [`/api/v1/inquiries/${inquiryId}/form/update`] as const;
};

export function useGetInquiryUpdateForm<
	TData = Awaited<ReturnType<typeof getInquiryUpdateForm>>,
	TError = Error,
>(
	inquiryId: string,
	options?: {
		query?: Omit<
			UseQueryOptions<
				Awaited<ReturnType<typeof getInquiryUpdateForm>>,
				TError,
				TData
			>,
			"queryKey" | "queryFn"
		>;
		request?: RequestOptions;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> {
	const queryOptions = options?.query;
	const enabled = Boolean(inquiryId) && (queryOptions?.enabled ?? true);

	return useQuery(
		{
			queryKey: getGetInquiryUpdateFormQueryKey(inquiryId),
			queryFn: ({ signal }) =>
				getInquiryUpdateForm(inquiryId, options?.request, signal),
			enabled,
			...(queryOptions ?? {}),
		},
		queryClient,
	);
}

export const prefetchGetInquiryUpdateFormQuery = async (
	queryClient: QueryClient,
	inquiryId: string,
	options?: { request?: RequestOptions },
): Promise<QueryClient> => {
	await queryClient.prefetchQuery({
		queryKey: getGetInquiryUpdateFormQueryKey(inquiryId),
		queryFn: ({ signal }) =>
			getInquiryUpdateForm(inquiryId, options?.request, signal),
	});

	return queryClient;
};
