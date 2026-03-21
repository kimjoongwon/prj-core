"use client";
import { DetailPage, DetailPageSurface, PageTitleBar, DetailSectionCard } from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter, useParams } from "next/navigation";

interface AbilitySubjectsPageClientProps {
	roleId: string;
	abilityId: string;
}

/**
 * Ability Subject 관리 페이지 - 클라이언트 컴포넌트
 */
function AbilitySubjectsPageClient({
	roleId,
	abilityId,
}: AbilitySubjectsPageClientProps) {
	const router = useRouter();

	const onClickBackButton = () => {
		router.push(`/roles/${roleId}` as Route);
	};

	return (
		<DetailPage
			top={
				<PageTitleBar
					title="Subject 관리"
					description="권한의 대상(Subject)을 관리합니다."
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
			<DetailPageSurface>
				<DetailSectionCard>
					<p className="text-default-500">
						권한 ID: <code className="font-mono">{abilityId}</code>
					</p>
					<p className="mt-4 text-default-400">
						Subject 관리 기능은 추후 구현 예정입니다.
					</p>
				</DetailSectionCard>
			</DetailPageSurface>
		</DetailPage>
	);
}

type AbilitySubjectsPageParams = {
	roleId: string;
	abilityId: string;
};

const AbilitySubjectsPage = observer(function AbilitySubjectsPage() {
	const { roleId, abilityId } = useParams<AbilitySubjectsPageParams>();

	return <AbilitySubjectsPageClient roleId={roleId} abilityId={abilityId} />;
});

export default AbilitySubjectsPage;
