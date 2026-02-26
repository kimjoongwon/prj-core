"use client";

import {
	useDeleteOidcClient,
	useGetOidcClient,
	useToggleActiveOidcClient,
} from "@cocrepo/api";
import {
	ActiveStatusCell,
	AuthMethodCell,
	ConfirmModal,
	DateTimeCell,
	PageSurface,
	SecretField,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Button, Chip, useDisclosure } from "@heroui/react";
import { ArrowLeft, Edit, Power, PowerOff, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface OidcClientDetailPageClientProps {
	oidcClientId: string;
}

/**
 * OIDC 클라이언트 상세 페이지 - 클라이언트 컴포넌트
 */
function OidcClientDetailPageClient({
	oidcClientId,
}: OidcClientDetailPageClientProps) {
	const router = useRouter();
	const deleteModal = useDisclosure();

	const { data: response, isLoading } = useGetOidcClient(oidcClientId);
	const client = response?.data;

	const { mutate: deleteClient, isPending: isDeleting } = useDeleteOidcClient({
		mutation: {
			onSuccess: () => {
				deleteModal.onClose();
				router.push("/oidc-clients" as Route);
			},
		},
	});

	const { mutate: toggleActive, isPending: isToggling } =
		useToggleActiveOidcClient({
			mutation: {
				onSuccess: () => {
					// React Query 자동 refetch
				},
			},
		});

	const onClickBackButton = () => {
		router.push("/oidc-clients" as Route);
	};

	const onClickEditButton = () => {
		router.push(`/oidc-clients/${oidcClientId}/edit` as Route);
	};

	const onClickToggleActive = () => {
		toggleActive({ oidcClientId });
	};

	const onClickDeleteConfirm = () => {
		deleteClient({ oidcClientId });
	};

	if (isLoading) {
		return (
			<PageSurface title="OIDC 클라이언트 상세" description="로딩 중...">
				<div className="flex items-center justify-center p-8">
					<span className="text-default-500">로딩 중...</span>
				</div>
			</PageSurface>
		);
	}

	if (!client) {
		return (
			<PageSurface
				title="OIDC 클라이언트 상세"
				description="클라이언트를 찾을 수 없습니다."
			>
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-default-500">클라이언트를 찾을 수 없습니다.</p>
					<Button variant="flat" onPress={onClickBackButton}>
						목록으로
					</Button>
				</div>
			</PageSurface>
		);
	}

	return (
		<PageSurface
			title={client.clientId}
			description={client.clientName}
			actions={
				<div className="flex gap-2">
					<Button
						variant="light"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={onClickBackButton}
					>
						목록으로
					</Button>
					<Button
						variant="flat"
						color="primary"
						startContent={<Edit className="h-4 w-4" />}
						onPress={onClickEditButton}
					>
						수정
					</Button>
					<Button
						variant="flat"
						color={client.isActive ? "warning" : "success"}
						startContent={
							client.isActive ? (
								<PowerOff className="h-4 w-4" />
							) : (
								<Power className="h-4 w-4" />
							)
						}
						isLoading={isToggling}
						onPress={onClickToggleActive}
					>
						{client.isActive ? "비활성화" : "활성화"}
					</Button>
					<Button
						variant="flat"
						color="danger"
						startContent={<Trash2 className="h-4 w-4" />}
						onPress={deleteModal.onOpen}
					>
						삭제
					</Button>
				</div>
			}
		>
			<VStack gap={4}>
				{/* 기본 정보 */}
				<SectionSurface>
					<div className="p-6">
						<h3 className="text-lg font-semibold mb-4">기본 정보</h3>
						<dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<dt className="text-sm text-default-500 mb-1">Client ID</dt>
								<dd className="font-mono">{client.clientId}</dd>
							</div>
							<div>
								<dt className="text-sm text-default-500 mb-1">Client Secret</dt>
								<dd>
									<SecretField value={client.clientSecret} />
								</dd>
							</div>
							<div>
								<dt className="text-sm text-default-500 mb-1">이름</dt>
								<dd>{client.clientName}</dd>
							</div>
							<div>
								<dt className="text-sm text-default-500 mb-1">활성 상태</dt>
								<dd>
									<ActiveStatusCell isActive={client.isActive} />
								</dd>
							</div>
							<div>
								<dt className="text-sm text-default-500 mb-1">등록일</dt>
								<dd>
									<DateTimeCell value={client.createdAt} />
								</dd>
							</div>
						</dl>
					</div>
				</SectionSurface>

				{/* 인증 설정 */}
				<SectionSurface>
					<div className="p-6">
						<h3 className="text-lg font-semibold mb-4">인증 설정</h3>
						<dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<dt className="text-sm text-default-500 mb-1">인증 방식</dt>
								<dd>
									<AuthMethodCell method={client.tokenEndpointAuthMethod} />
								</dd>
							</div>
							<div>
								<dt className="text-sm text-default-500 mb-1">Grant Types</dt>
								<dd>
									<div className="flex flex-wrap gap-1">
										{client.grantTypes.map((type: string) => (
											<Chip key={type} size="sm" variant="flat">
												{type}
											</Chip>
										))}
									</div>
								</dd>
							</div>
							<div>
								<dt className="text-sm text-default-500 mb-1">
									Response Types
								</dt>
								<dd>
									<div className="flex flex-wrap gap-1">
										{client.responseTypes.map((type: string) => (
											<Chip key={type} size="sm" variant="flat">
												{type}
											</Chip>
										))}
									</div>
								</dd>
							</div>
							<div>
								<dt className="text-sm text-default-500 mb-1">스코프</dt>
								<dd className="font-mono text-sm">{client.scope}</dd>
							</div>
						</dl>
					</div>
				</SectionSurface>

				{/* Redirect URIs */}
				<SectionSurface>
					<div className="p-6">
						<h3 className="text-lg font-semibold mb-4">Redirect URIs</h3>
						{client.redirectUris.length > 0 ? (
							<div className="space-y-2">
								{client.redirectUris.map((uri: string) => (
									<div
										key={uri}
										className="rounded-lg bg-content2 px-4 py-2 font-mono text-sm"
									>
										{uri}
									</div>
								))}
							</div>
						) : (
							<p className="text-default-400">
								등록된 Redirect URI가 없습니다.
							</p>
						)}
					</div>
				</SectionSurface>

				{/* 추가 정보 */}
				<SectionSurface>
					<div className="p-6">
						<h3 className="text-lg font-semibold mb-4">추가 정보</h3>
						<dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<dt className="text-sm text-default-500 mb-1">로고 URI</dt>
								<dd className="text-sm">{client.logoUri || "-"}</dd>
							</div>
							<div>
								<dt className="text-sm text-default-500 mb-1">정책 URI</dt>
								<dd className="text-sm">{client.policyUri || "-"}</dd>
							</div>
							<div>
								<dt className="text-sm text-default-500 mb-1">약관 URI</dt>
								<dd className="text-sm">{client.tosUri || "-"}</dd>
							</div>
						</dl>
					</div>
				</SectionSurface>
			</VStack>

			{/* 삭제 확인 모달 */}
			<ConfirmModal
				isOpen={deleteModal.isOpen}
				onClose={deleteModal.onClose}
				onConfirm={onClickDeleteConfirm}
				title="OIDC 클라이언트 삭제"
				message={
					<>
						<p>
							<strong>{client.clientId}</strong> 클라이언트를 삭제하시겠습니까?
						</p>
						<p className="text-sm text-danger mt-2">
							삭제된 클라이언트는 더 이상 인증에 사용할 수 없습니다.
						</p>
					</>
				}
				confirmText="삭제"
				confirmColor="danger"
				iconType="delete"
				loading={isDeleting}
			/>
		</PageSurface>
	);
}

export default observer(OidcClientDetailPageClient);
