import {
	type QueryClient,
	type UseMutationOptions,
	type UseMutationResult,
	type UseQueryOptions,
	type UseQueryResult,
	useMutation,
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

export interface InquiryFormFieldAiMeta {
	fillable: boolean;
	defaultChecked?: boolean;
	reason?: string;
}

export interface InquiryFormFieldMeta {
	label?: string;
	ai?: InquiryFormFieldAiMeta;
}

export interface InquiryFormSchema {
	key: string;
	label: string;
	paths: string[];
	description?: string;
}

export interface InquiryCreateUpdateFormBootstrap {
	mode: "CREATE" | "UPDATE";
	defaultObject: Record<string, unknown>;
	options: Record<string, InquiryFormOptionItem[]>;
	ui: InquiryFormUiPaths;
	fieldMeta: Record<string, InquiryFormFieldMeta>;
	aiSchemas: InquiryFormSchema[];
}

export interface InquiryFormPatch {
	path: string;
	value: unknown;
}

export interface FillInquiryFormRequest {
	mode: "CREATE" | "UPDATE";
	schemaKey: string;
	selectedPaths: string[];
	currentObject: Record<string, unknown>;
	userPrompt?: string;
}

export interface FillInquiryFormResponse {
	patches: InquiryFormPatch[];
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

export const fillInquiryFormWithAi = (
	fillInquiryFormRequest: FillInquiryFormRequest,
	options?: RequestOptions,
	signal?: AbortSignal,
) => {
	return customInstance<ApiResponseEntity<FillInquiryFormResponse>>(
		{
			url: "/api/v1/inquiries/form/ai-fill",
			method: "POST",
			headers: { "Content-Type": "application/json" },
			data: fillInquiryFormRequest,
			signal,
		},
		options,
	);
};

export const useFillInquiryFormWithAi = <TError = Error, TContext = unknown>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof fillInquiryFormWithAi>>,
			TError,
			{ data: FillInquiryFormRequest },
			TContext
		>;
		request?: RequestOptions;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof fillInquiryFormWithAi>>,
	TError,
	{ data: FillInquiryFormRequest },
	TContext
> => {
	const mutationOptions = options?.mutation;

	return useMutation(
		{
			...(mutationOptions ?? {}),
			mutationFn: async (props) => {
				return fillInquiryFormWithAi(props.data, options?.request);
			},
		},
		queryClient,
	);
};
