"use client";

import { PageSurface, SectionSurface, VStack } from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface UsersPageClientProps {
	initialPage: number;
}

/**
 * 회원 목록 페이지 - 클라이언트 컴포넌트 (TODO: API 구현 후 활성화)
 */
function UsersPageClient({ initialPage: _initialPage }: UsersPageClientProps) {
	const router = useRouter();

	const onClickNewButton = () => {
		router.push("/users/new" as Route);
	};

	return (
		<PageSurface
			title="회원 목록"
			description="시스템에 등록된 회원을 관리합니다."
			actions={
				<Button
					color="primary"
					startContent={<Plus className="h-4 w-4" />}
					onPress={onClickNewButton}
				>
					회원 등록
				</Button>
			}
		>
			<VStack gap={4}>
				<SectionSurface>
					<div className="flex flex-col items-center justify-center gap-4 py-16">
						<h2 className="text-xl font-semibold text-default-500">
							회원 목록 기능은 구현 예정입니다.
						</h2>
						<p className="text-default-400">
							회원 API 개발 완료 후 활성화됩니다.
						</p>
					</div>
				</SectionSurface>
			</VStack>
		</PageSurface>
	);
}

export default observer(UsersPageClient);
