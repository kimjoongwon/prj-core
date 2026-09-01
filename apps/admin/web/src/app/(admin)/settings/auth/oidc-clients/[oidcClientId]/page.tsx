"use client";

import {
	useDeleteOidcClient,
	useGetOidcClient,
	useToggleActiveOidcClient,
} from "@cocrepo/api/core/oidc-clients";
import type { OidcClientLoginUi } from "@cocrepo/type";
import {
	Button,
	OidcClientEditScreen,
	type OidcClientFormState,
} from "@cocrepo/ui";
import { ArrowLeft, Edit, Power, PowerOff, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";

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
				<div className="flex flex-wrap gap-2">
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
				</div>
			}
		>
			{client ? (
				<SectionLike title="상태 정보">
					<dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<Info
							label="활성 상태"
							value={client.isActive ? "활성" : "비활성"}
						/>
						<Info
							label="등록일"
							value={new Date(client.createdAt).toLocaleString("ko-KR")}
						/>
					</dl>
				</SectionLike>
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

function SectionLike({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section>
			<h3 className="mb-4 text-lg font-semibold">{title}</h3>
			{children}
		</section>
	);
}

function Info({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border border-border bg-background/60 p-3">
			<dt className="text-xs text-muted">{label}</dt>
			<dd className="mt-1 break-all text-sm font-medium">{value}</dd>
		</div>
	);
}
