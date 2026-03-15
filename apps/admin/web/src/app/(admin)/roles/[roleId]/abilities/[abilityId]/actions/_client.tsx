"use client";
import { Page, PageSurface, PageTitleBar, SectionSurface } from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface AbilityActionsPageClientProps {
	roleId: string;
	abilityId: string;
}

/**
 * Ability Action 관리 페이지 - 클라이언트 컴포넌트
 */
function AbilityActionsPageClient({
	roleId,
	abilityId,
}: AbilityActionsPageClientProps) {
	const router = useRouter();

	const onClickBackButton = () => {
		router.push(`/roles/${roleId}` as Route);
	};

	return (
		<Page
			top={
				<PageTitleBar
					title="Action 관리"
					description="권한의 액션(Action)을 관리합니다."
					actions={
						<Button
							variant="light"
							startContent={<ArrowLeft className="h-4 w-4" />}
							onPress={onClickBackButton}
						>
							역할 상세로
						</Button>
					}
				/>
			}
		>
			<PageSurface>
				<SectionSurface>
					<p className="text-default-500">
						권한 ID: <code className="font-mono">{abilityId}</code>
					</p>
					<p className="mt-4 text-default-400">
						Action 관리 기능은 추후 구현 예정입니다.
					</p>
				</SectionSurface>
			</PageSurface>
		</Page>
	);
}

export default observer(AbilityActionsPageClient);
