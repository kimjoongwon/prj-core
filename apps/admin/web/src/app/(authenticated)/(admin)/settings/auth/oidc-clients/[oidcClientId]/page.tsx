"use client";

import {
	useDeleteOidcClient,
	useGetOidcClient,
	useToggleActiveOidcClient,
} from "@cocrepo/api/idp/oidc-clients";
import type { OidcClientLoginUi } from "@cocrepo/type";
import {
	Button,
	HStack,
	InfoList,
	OidcClientEditScreen,
	type OidcClientFormState,
	Section,
} from "@cocrepo/ui";
import { ArrowLeft, Edit, Power, PowerOff, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

export default observer(function OidcClientDetailRoute() {
	const oidcClientId = useParams<{ oidcClientId: string }>().oidcClientId;
	const router = useRouter();
	const { data: response, isLoading } = useGetOidcClient(oidcClientId);
	const client = response?.data;
	const state = client ? mapOidcClientFormState(client) : undefined;
	const { mutate: deleteClient, isPending: isDeleting } = useDeleteOidcClient({
		mutation: {
			onSuccess: () => {
				router.push("/settings/auth/oidc-clients" as Route);
			},
		},
	});
	const { mutate: toggleActive, isPending: isToggling } =
		useToggleActiveOidcClient();

	return (
		<OidcClientEditScreen
			title="OIDC Client 상세"
			description={
				client
					? `${client.clientId} Client 설정을 확인합니다.`
					: "OIDC Client를 찾을 수 없습니다."
			}
			state={state}
			readOnly
			isLoading={isLoading}
			notFound={!isLoading && !client}
			notFoundAction={
				<Button
					variant="tertiary"
					onPress={() => {
						router.push("/settings/auth/oidc-clients" as Route);
					}}
				>
					목록으로
				</Button>
			}
			actions={
				<HStack className="flex-wrap">
					<Button
						variant="ghost"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push("/settings/auth/oidc-clients" as Route);
						}}
					>
						목록으로
					</Button>
					{client ? (
						<>
							<Button
								variant="tertiary"
								startContent={<Edit className="h-4 w-4" />}
								onPress={() => {
									router.push(
										`/settings/auth/oidc-clients/${oidcClientId}/edit` as Route,
									);
								}}
							>
								수정
							</Button>
							<Button
								variant="tertiary"
								startContent={
									client.isActive ? (
										<PowerOff className="h-4 w-4" />
									) : (
										<Power className="h-4 w-4" />
									)
								}
								isLoading={isToggling}
								onPress={() => {
									toggleActive({ oidcClientId });
								}}
							>
								{client.isActive ? "비활성화" : "활성화"}
							</Button>
							<Button
								variant="tertiary"
								startContent={<Trash2 className="h-4 w-4" />}
								isLoading={isDeleting}
								onPress={() => {
									deleteClient({ oidcClientId });
								}}
							>
								삭제
							</Button>
						</>
					) : null}
				</HStack>
			}
		>
			{client ? (
				<Section>
					<Section.Header title="상태 정보" />
					<Section.Body>
						<InfoList
							items={[
								{
									key: "activeStatus",
									label: "활성 상태",
									value: client.isActive ? "활성" : "비활성",
								},
								{
									key: "createdAt",
									label: "등록일",
									value: new Date(client.createdAt).toLocaleString("ko-KR"),
								},
							]}
						/>
					</Section.Body>
				</Section>
			) : null}
		</OidcClientEditScreen>
	);
});

function mapOidcClientFormState(client: {
	clientId: string;
	clientSecret?: string | null;
	name: string;
	tokenEndpointAuthMethod: string;
	grantTypes: string[];
	responseTypes: string[];
	scope: string;
	isFirstParty: boolean;
	skipConsent: boolean;
	redirectUris: string[];
	loginUrl?: string | null;
	defaultReturnTo?: string | null;
	logoUri?: string | null;
	policyUri?: string | null;
	tosUri?: string | null;
	loginUi?: unknown;
}): OidcClientFormState {
	const loginUi = client.loginUi as OidcClientLoginUi | null | undefined;

	return {
		clientId: client.clientId,
		name: client.name,
		clientSecret: client.clientSecret || "",
		isPublic: client.tokenEndpointAuthMethod === "none",
		tokenEndpointAuthMethod: client.tokenEndpointAuthMethod,
		grantTypes: [...client.grantTypes],
		responseTypes: [...client.responseTypes],
		scope: client.scope,
		isFirstParty: client.isFirstParty,
		skipConsent: client.skipConsent,
		redirectUris:
			client.redirectUris.length > 0 ? [...client.redirectUris] : [""],
		loginUrl: client.loginUrl || "",
		defaultReturnTo: client.defaultReturnTo || "",
		logoUri: client.logoUri || "",
		policyUri: client.policyUri || "",
		tosUri: client.tosUri || "",
		useCustomLoginUi: Boolean(loginUi),
		loginUiVariant: loginUi?.variant ?? "default",
		loginUiHeadline: loginUi?.headline ?? "",
		loginUiDescription: loginUi?.description ?? "",
		loginUiBrandLabel: loginUi?.brandLabel ?? "",
		loginUiBrandColor: loginUi?.brandColor ?? "",
		loginUiShowIntroPanel: loginUi?.showIntroPanel ?? true,
		loginUiMobileFullScreen: loginUi?.mobileFullScreen ?? false,
		errors: {},
		redirectUriErrors: {},
	};
}
