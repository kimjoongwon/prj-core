"use client";

import type { OidcClientLoginUi } from "@cocrepo/type";
import {
	ConfirmModal,
	DateTimeCell,
	PageTitleBar,
	SecretField,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { useOverlayState } from "@heroui/react";
import { ArrowLeft, Edit, Power, PowerOff, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Chip } from "../../data-display/Chip/Chip";

const AUTH_METHOD_CONFIG = {
	client_secret_basic: { label: "Basic", color: "primary" },
	client_secret_post: { label: "Post", color: "secondary" },
	none: { label: "None (Public)", color: "warning" },
} as const;

function getAuthMethodConfig(method: string) {
	return (
		AUTH_METHOD_CONFIG[method as keyof typeof AUTH_METHOD_CONFIG] ?? {
			label: method,
			color: "default" as const,
		}
	);
}

export interface OidcClientDetailScreenClient {
	clientId: string;
	clientSecret?: string | null;
	name: string;
	isActive: boolean;
	isFirstParty: boolean;
	skipConsent: boolean;
	createdAt: string | Date | null;
	loginUrl?: string | null;
	defaultReturnTo?: string | null;
	tokenEndpointAuthMethod: string;
	grantTypes: string[];
	responseTypes: string[];
	scope: string;
	redirectUris: string[];
	logoUri?: string | null;
	policyUri?: string | null;
	tosUri?: string | null;
	loginUi?: OidcClientLoginUi | null;
}
export interface OidcClientDetailScreenProps {
	client?: OidcClientDetailScreenClient;
	isLoading: boolean;
	isDeleting: boolean;
	isToggling: boolean;
	onClickBackButton: () => void;
	onClickEditButton: () => void;
	onClickToggleActiveButton: () => void;
	onClickDeleteConfirmButton: () => void;
}
export const OidcClientDetailScreen = observer(
	({
		client,
		isLoading,
		isDeleting,
		isToggling,
		onClickBackButton,
		onClickEditButton,
		onClickToggleActiveButton,
		onClickDeleteConfirmButton,
	}: OidcClientDetailScreenProps) => {
		const deleteModal = useOverlayState();
		if (isLoading) {
			return (
				<VStack fullWidth>
					<PageTitleBar title="OIDC 클라이언트 상세" description="로딩 중..." />
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex items-center justify-center p-8">
									<span className="text-muted">로딩 중...</span>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		if (!client) {
			return (
				<VStack fullWidth>
					<PageTitleBar
						title="OIDC 클라이언트 상세"
						description="클라이언트를 찾을 수 없습니다."
					/>
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex flex-col items-center justify-center gap-4 p-8">
									<p className="text-muted">클라이언트를 찾을 수 없습니다.</p>
									<Button variant="flat" onPress={onClickBackButton}>
										목록으로
									</Button>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}

		const authMethodConfig = getAuthMethodConfig(
			client.tokenEndpointAuthMethod,
		);

		return (
			<VStack fullWidth>
				<PageTitleBar
					title={client.clientId || "OIDC 클라이언트 상세"}
					description={
						client.name || "등록된 OIDC 클라이언트 설정을 확인합니다."
					}
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
								onPress={onClickToggleActiveButton}
							>
								{client.isActive ? "비활성화" : "활성화"}
							</Button>
							<Button
								variant="flat"
								color="danger"
								startContent={<Trash2 className="h-4 w-4" />}
								onPress={deleteModal.open}
							>
								삭제
							</Button>
						</div>
					}
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack>
								<Section>
									<Section.Header>
										<PageTitleBar level={2} title="기본 정보" />
									</Section.Header>
									<Section.Body>
										<dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div>
												<dt className="text-sm text-muted mb-1">Client ID</dt>
												<dd className="font-mono">{client.clientId}</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">
													Client Secret
												</dt>
												<dd>
													<SecretField value={client.clientSecret} />
												</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">이름</dt>
												<dd>{client.name}</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">활성 상태</dt>
												<dd>
													<Chip
														color={client.isActive ? "success" : "default"}
														size="sm"
														variant="flat"
													>
														{client.isActive ? "활성" : "비활성"}
													</Chip>
												</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">
													클라이언트 신뢰 구분
												</dt>
												<dd>
													<Chip
														color={client.isFirstParty ? "primary" : "default"}
														size="sm"
														variant="flat"
													>
														{client.isFirstParty
															? "First-party"
															: "Third-party"}
													</Chip>
												</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">
													권한 동의 화면
												</dt>
												<dd>
													<Chip
														color={client.skipConsent ? "success" : "default"}
														size="sm"
														variant="flat"
													>
														{client.skipConsent ? "생략" : "표시"}
													</Chip>
												</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">등록일</dt>
												<dd>
													<DateTimeCell value={client.createdAt} />
												</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">
													로그인 화면 URL
												</dt>
												<dd className="font-mono text-sm break-all">
													{client.loginUrl || "-"}
												</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">
													기본 복귀 URL
												</dt>
												<dd className="font-mono text-sm break-all">
													{client.defaultReturnTo || "-"}
												</dd>
											</div>
										</dl>
									</Section.Body>
								</Section>
								<Section>
									<Section.Header>
										<PageTitleBar level={2} title="인증 설정" />
									</Section.Header>
									<Section.Body>
										<dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div>
												<dt className="text-sm text-muted mb-1">인증 방식</dt>
												<dd>
													<Chip
														color={authMethodConfig.color}
														size="sm"
														variant="flat"
													>
														{authMethodConfig.label}
													</Chip>
												</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">Grant Types</dt>
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
												<dt className="text-sm text-muted mb-1">
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
												<dt className="text-sm text-muted mb-1">스코프</dt>
												<dd className="font-mono text-sm">{client.scope}</dd>
											</div>
										</dl>
									</Section.Body>
								</Section>
								<Section>
									<Section.Header>
										<PageTitleBar level={2} title="Redirect URIs" />
									</Section.Header>
									<Section.Body>
										{client.redirectUris.length > 0 ? (
											<div className="space-y-2">
												{client.redirectUris.map((uri: string) => (
													<div
														key={uri}
														className="rounded-lg bg-surface-secondary px-4 py-2 font-mono text-sm"
													>
														{uri}
													</div>
												))}
											</div>
										) : (
											<p className="text-muted">
												등록된 Redirect URI가 없습니다.
											</p>
										)}
									</Section.Body>
								</Section>
								<Section>
									<Section.Header>
										<PageTitleBar level={2} title="로그인 화면 설정" />
									</Section.Header>
									<Section.Body>
										<dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div>
												<dt className="text-sm text-muted mb-1">사용 방식</dt>
												<dd>
													<Chip
														color={client.loginUi ? "primary" : "default"}
														size="sm"
														variant="flat"
													>
														{client.loginUi ? "커스텀" : "공통 로그인"}
													</Chip>
												</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">Variant</dt>
												<dd>{client.loginUi?.variant || "-"}</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">브랜드 라벨</dt>
												<dd>{client.loginUi?.brandLabel || "-"}</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">브랜드 컬러</dt>
												<dd className="font-mono text-sm">
													{client.loginUi?.brandColor || "-"}
												</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">헤드라인</dt>
												<dd>{client.loginUi?.headline || "-"}</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">
													데스크톱 소개 영역
												</dt>
												<dd>
													{client.loginUi
														? client.loginUi.showIntroPanel === false
															? "숨김"
															: "표시"
														: "-"}
												</dd>
											</div>
											<div className="md:col-span-2">
												<dt className="text-sm text-muted mb-1">설명 문구</dt>
												<dd>{client.loginUi?.description || "-"}</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">
													모바일 Full-screen
												</dt>
												<dd>
													{client.loginUi?.mobileFullScreen ? "사용" : "-"}
												</dd>
											</div>
										</dl>
									</Section.Body>
								</Section>
								<Section>
									<Section.Header>
										<PageTitleBar level={2} title="추가 정보" />
									</Section.Header>
									<Section.Body>
										<dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div>
												<dt className="text-sm text-muted mb-1">로고 URI</dt>
												<dd className="text-sm">{client.logoUri || "-"}</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">정책 URI</dt>
												<dd className="text-sm">{client.policyUri || "-"}</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">약관 URI</dt>
												<dd className="text-sm">{client.tosUri || "-"}</dd>
											</div>
										</dl>
									</Section.Body>
								</Section>
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
				<ConfirmModal
					isOpen={deleteModal.isOpen}
					onClose={deleteModal.close}
					onConfirm={onClickDeleteConfirmButton}
					title="OIDC 클라이언트 삭제"
					message={
						<>
							<p>
								<strong>{client.clientId}</strong>클라이언트를 삭제하시겠습니까?
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
			</VStack>
		);
	},
);
