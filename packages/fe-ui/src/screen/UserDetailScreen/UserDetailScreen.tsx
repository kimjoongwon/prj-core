"use client";

import { PageTitleBar, Section, SectionSurface, VStack } from "@cocrepo/ui";
import { Spinner } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../input/Button/Button";
export interface UserDetailScreenUser {
	id: string;
	email?: string | null;
	name?: string | null;
	phone?: string | null;
	isActive?: boolean;
	removedAt?: string | null;
	lastLoginAt?: string | null;
	createdAt?: string | Date | null;
	updatedAt?: string | Date | null;
}
export interface UserDetailScreenProps {
	userId: string;
	user?: UserDetailScreenUser;
	isLoading?: boolean;
	onClickBackButton: () => void;
}
function formatDate(value?: string | Date | null) {
	if (!value) {
		return "-";
	}
	return new Date(value).toLocaleString("ko-KR");
}
export const UserDetailScreen = observer(
	({
		userId,
		user,
		isLoading = false,
		onClickBackButton,
	}: UserDetailScreenProps) => {
		const titleName = user?.name || user?.email || userId;
		if (isLoading) {
			return (
				<VStack fullWidth>
					<PageTitleBar
						title="회원 상세"
						description="회원 정보를 불러오는 중입니다."
					/>
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex items-center justify-center gap-2 p-8">
									<Spinner size="sm" />
									<span className="text-muted">로딩 중...</span>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		return (
			<VStack fullWidth>
				<PageTitleBar
					title={`회원 상세: ${titleName}`}
					description="회원 기본 정보를 확인합니다."
					actions={
						<Button
							variant="light"
							startContent={<ArrowLeft className="h-4 w-4" />}
							onPress={onClickBackButton}
						>
							목록으로
						</Button>
					}
				/>
				<SectionSurface>
					<Section>
						<Section.Header>
							<PageTitleBar level={2} title="기본 정보" />
						</Section.Header>
						<Section.Body>
							<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
								<Info label="회원 ID" value={user?.id || userId} />
								<Info label="이름" value={user?.name || "-"} />
								<Info label="이메일" value={user?.email || "-"} />
								<Info label="연락처" value={user?.phone || "-"} />
								<Info
									label="상태"
									value={
										user?.removedAt
											? "삭제됨"
											: user?.isActive === false
												? "비활성"
												: "사용 중"
									}
								/>
								<Info
									label="마지막 로그인"
									value={formatDate(user?.lastLoginAt)}
								/>
							</div>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
function Info({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border border-border bg-background/60 p-3">
			<p className="text-xs text-muted">{label}</p>
			<p className="mt-1 break-all text-sm font-medium">{value}</p>
		</div>
	);
}
UserDetailScreen.displayName = "UserDetailScreen";
