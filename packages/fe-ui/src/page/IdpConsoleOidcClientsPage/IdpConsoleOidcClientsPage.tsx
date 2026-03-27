"use client";

import { useGetOidcClients } from "@cocrepo/api/idp/oidc-clients";
import type { InputConfig } from "@cocrepo/type";
import {
	MetaDataGrid,
	oidcClientTableColumns,
	PageTitleBar,
	Surface,
	useMetaDataGridQueryStates,
	VStack,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";

function OidcClientsPage() {
	return <OidcClientsPageClient />;
}

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
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);

	const { data: response, isLoading } = useGetOidcClients({
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
	});

	const oidcClients = response?.data ?? [];
	const meta = response?.meta;
	const totalCount = meta?.totalCount ?? 0;

	return (
		<VStack gap={5}>
			<PageTitleBar
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
			/>
			<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
				<MetaDataGrid
					config={{
						entity: "OidcClient",
						data: oidcClients,
						totalCount,
						isLoading,
						queryStates,
						setQueryStates,
						columns: oidcClientTableColumns,
						leftInputs,
						emptyMessage: "등록된 OIDC 클라이언트가 없습니다.",
					}}
				/>
			</Surface>
		</VStack>
	);
}

export const IdpConsoleOidcClientsPage = observer(OidcClientsPage);

export default IdpConsoleOidcClientsPage;
