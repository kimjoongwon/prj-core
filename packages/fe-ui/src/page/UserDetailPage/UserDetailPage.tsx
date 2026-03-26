"use client";

import { DetailPage, DetailPageSurface, DetailSectionCard, PageTitleBar } from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";

export interface UserDetailPageProps {
	userId: string;
	onClickBackButton: () => void;
}

export function UserDetailPage({
	userId,
	onClickBackButton,
}: UserDetailPageProps) {
	return (
		<DetailPage
			top={
				<PageTitleBar
					title="회원 상세"
					description={`회원 ${userId}의 상세 조회 화면은 준비 중입니다.`}
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
			}
		>
			<DetailPageSurface>
				<DetailSectionCard>
					<div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
						<div>
							<p className="text-sm text-default-500">이용자 ID</p>
							<p className="mt-1 font-mono text-sm">{userId}</p>
						</div>
						<p className="text-default-500">
							이 상세 화면은 아직 구현 중이며, 최종 본문은 `detail/view`
							조합으로 확장됩니다.
						</p>
					</div>
				</DetailSectionCard>
			</DetailPageSurface>
		</DetailPage>
	);
}
