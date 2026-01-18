"use client";

import { UserForm } from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useParams, useRouter } from "next/navigation";

/**
 * 회원 수정 페이지
 */
function UserEditPage() {
	const params = useParams();
	const router = useRouter();
	const userId = params.id as string;

	/**
	 * 뒤로가기
	 */
	const handleBack = () => {
		router.back();
	};

	return (
		<div className="space-y-6">
			{/* 뒤로가기 버튼 */}
			<Button
				variant="light"
				startContent={<ArrowLeft className="h-4 w-4" />}
				onPress={handleBack}
			>
				뒤로
			</Button>

			{/* 페이지 헤더 */}
			<div>
				<h1 className="text-2xl font-bold">회원 수정</h1>
				<p className="text-default-500">회원 정보를 수정합니다.</p>
			</div>

			{/* 수정 폼 */}
			<UserForm mode="edit" userId={userId} redirectPath={`/users/${userId}`} />
		</div>
	);
}

export default observer(UserEditPage);
