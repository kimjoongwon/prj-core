"use client";

import type { useMetaDataGridQueryStates } from "@cocrepo/hook";
import type { InputConfig } from "@cocrepo/type";
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

export type IdpConsoleOidcClientsPageQueryStates = ReturnType<
	typeof useMetaDataGridQueryStates
>[0];
export type IdpConsoleOidcClientsPageSetQueryStates = ReturnType<
	typeof useMetaDataGridQueryStates
>[1];

export interface IdpConsoleOidcClientsPageClient {
	id: string;
	clientId: string;
	name: string;
	tokenEndpointAuthMethod: string;
	grantTypes: string[];
	isActive: boolean;
	createdAt: string | Date | null;
}

export interface IdpConsoleOidcClientsPageProps {
	oidcClients: IdpConsoleOidcClientsPageClient[];
	totalCount: number;
	isLoading: boolean;
	queryStates: IdpConsoleOidcClientsPageQueryStates;
	setQueryStates: IdpConsoleOidcClientsPageSetQueryStates;
	onClickCreateButton: () => void;
}

const oidcClientTableColumns =
	buildOidcClientTableColumns<IdpConsoleOidcClientsPageClient>();

export const IdpConsoleOidcClientsPage = observer(({
		oidcClients,
		totalCount,
		isLoading,
		queryStates,
		setQueryStates,
		onClickCreateButton,
	}: IdpConsoleOidcClientsPageProps) => {
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
