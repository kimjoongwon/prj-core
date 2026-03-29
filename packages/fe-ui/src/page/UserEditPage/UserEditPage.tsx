"use client";

import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface UserEditPageProps {
	onClickBackButton: () => void;
}

export const UserEditPage = observer(function UserEditPage({
	onClickBackButton,
}: UserEditPageProps) {
	return (
		<div className="space-y-6">
			<Button
				variant="light"
				startContent={<ArrowLeft className="h-4 w-4" />}
				onPress={onClickBackButton}
			>
				뒤로
			</Button>

			<div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-content1 p-8">
				<h1 className="text-2xl font-bold">회원 수정</h1>
				<p className="text-default-500">이 기능은 구현 예정입니다.</p>
			</div>
		</div>
	);
});

UserEditPage.displayName = "UserEditPage";
