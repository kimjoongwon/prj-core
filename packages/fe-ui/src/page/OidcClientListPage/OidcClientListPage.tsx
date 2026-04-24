"use client";

import type {
	InputConfig,
	MetaDataGridQueryStates,
	MetaDataGridSetQueryStates,
} from "@cocrepo/type";
import {
	buildOidcClientTableColumns,
	MetaDataGrid,
	PageTitleBar,
	Surface,
	VStack,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";

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

export const idpConsoleOidcClientsPageQueryInputs = [...leftInputs];

export interface OidcClientListPageQueryStates
	extends MetaDataGridQueryStates {
	take: number;
	skip: number;
	search: string;
}
export type OidcClientListPageSetQueryStates = MetaDataGridSetQueryStates;

export interface OidcClientListPageClient {
	id: string;
	clientId: string;
	name: string;
	tokenEndpointAuthMethod: string;
	grantTypes: string[];
	isActive: boolean;
	createdAt: string | Date | null;
}

export interface OidcClientListPageProps {
	oidcClients: OidcClientListPageClient[];
	totalCount: number;
	isLoading: boolean;
	queryStates: OidcClientListPageQueryStates;
	setQueryStates: OidcClientListPageSetQueryStates;
	onClickCreateButton: () => void;
}

const oidcClientTableColumns =
	buildOidcClientTableColumns<OidcClientListPageClient>();

export const OidcClientListPage = observer(({
		oidcClients,
		totalCount,
		isLoading,
		queryStates,
		setQueryStates,
		onClickCreateButton,
	}: OidcClientListPageProps) => {
		return (
			<VStack gap={5}>
				<PageTitleBar
					title="OIDC 클라이언트"
					description="시스템에 등록된 OIDC 클라이언트를 관리합니다."
					actions={
						<Button
							color="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onClickCreateButton}
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
	});
