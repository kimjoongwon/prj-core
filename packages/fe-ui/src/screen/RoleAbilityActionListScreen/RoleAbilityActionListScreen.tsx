"use client";

import { PageTitleBar, SectionSurface, VStack } from "@cocrepo/ui";
import { ArrowLeft } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
export interface RoleAbilityActionListScreenProps {
	abilityId: string;
	onClickBackButton: () => void;
}

/**
 * Ability Action 관리 페이지 - 클라이언트 컴포넌트
 */
export const RoleAbilityActionListScreen = observer(
	({ abilityId, onClickBackButton }: RoleAbilityActionListScreenProps) => {
		return (
			<VStack gap="section" fullWidth>
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

				<SectionSurface>
					<p className="text-muted">
						권한 ID: <code className="font-mono">{abilityId}</code>
					</p>
					<p className="mt-4 text-muted">
						Action 관리 기능은 추후 구현 예정입니다.
					</p>
				</SectionSurface>
			</VStack>
		);
	},
);
