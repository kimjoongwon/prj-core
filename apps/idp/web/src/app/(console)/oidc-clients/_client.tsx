"use client";

import { useGetOidcClients, type OidcClientDto } from "@cocrepo/api";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	ActiveStatusCell,
	AuthMethodCell,
	DateTimeCell,
	GrantTypeCell,
	MetaDataGrid,
	PageSurface,
	RowActionsCell,
	SectionSurface,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";

/**
 * 컬럼 정의
 */
const columns: MetaDataGridColumnConfig<OidcClientDto>[] = [
	{
		field: "clientId",
		label: "Client ID",
		size: 200,
		isRequired: true,
		cell: ({ getValue }) => (
			<span className="font-mono text-sm">{getValue() as string}</span>
		),
	},
	{
		field: "clientName",
		label: "이름",
		size: 200,
	},
	{
		field: "tokenEndpointAuthMethod",
		label: "인증 방식",
		size: 150,
		cell: ({ getValue }) => (
			<AuthMethodCell method={getValue() as string} />
		),
	},
	{
		field: "grantTypes",
		label: "Grant Types",
		size: 200,
		cell: ({ getValue }) => (
			<GrantTypeCell types={getValue() as string[]} />
		),
	},
	{
		field: "isActive",
		label: "활성",
		size: 80,
		align: "center",
		cell: ({ getValue }) => (
			<ActiveStatusCell isActive={getValue() as boolean} />
		),
	},
	{
		field: "createdAt",
		label: "등록일",
		size: 150,
		cell: ({ getValue }) => (
			<DateTimeCell value={getValue() as string} />
		),
	},
	{
		field: "actions",
		label: "",
		size: 100,
		cell: ({ row }) => (
			<RowActionsCell
				id={row.original.id}
				basePath="/oidc-clients"
				showView
				showEdit={false}
				showDelete={false}
			/>
		),
	},
];

/**
 * 좌측 입력 정의 (검색)
 */
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "Client ID 또는 이름으로 검색...",
		props: {
			debounceMs: 300,
		},
	},
];

/**
 * OIDC 클라이언트 목록 페이지 - 클라이언트 컴포넌트
 */
function OidcClientsPageClient() {
	const [queryStates, setQueryStates] =
		useMetaDataGridQueryStates(leftInputs);

	const { data: response, isLoading } = useGetOidcClients({
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
	});

	const oidcClients = response?.data ?? [];
	const meta = response?.meta;
	const totalCount = meta?.totalCount ?? 0;

	return (
		<PageSurface
			title="OIDC 클라이언트"
			description="시스템에 등록된 OIDC 클라이언트를 관리합니다."
			actions={
				<Button
					as={Link}
					href="/oidc-clients/new"
					color="primary"
					startContent={<Plus className="h-4 w-4" />}
				>
					클라이언트 등록
				</Button>
			}
		>
			<SectionSurface>
				<MetaDataGrid
					config={{
						entity: "OidcClient",
						data: oidcClients,
						totalCount,
						isLoading,
						queryStates,
						setQueryStates,
						columns,
						leftInputs,
						emptyMessage: "등록된 OIDC 클라이언트가 없습니다.",
					}}
				/>
			</SectionSurface>
		</PageSurface>
	);
}

export default observer(OidcClientsPageClient);
