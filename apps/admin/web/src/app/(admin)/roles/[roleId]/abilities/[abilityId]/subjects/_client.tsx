"use client";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

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
        <section><div className="flex items-start justify-between gap-4"><div><h1>{"Subject 관리"}</h1><p>{"권한의 대상(Subject)을 관리합니다."}</p></div><div>{<Button
                                    variant="light"
                                    startContent={<ArrowLeft className="h-4 w-4" />}
                                    onPress={onClickBackButton}>역할 상세로
                                                    </Button>}</div></div>
            <section>
                <div className="p-6">
                    <p className="text-default-500">권한 ID: <code className="font-mono">{abilityId}</code>
                    </p>
                    <p className="text-default-400 mt-4">Subject 관리 기능은 추후 구현 예정입니다.
                                            </p>
                </div>
            </section>
        </section>
    );
}

export default observer(AbilitySubjectsPageClient);
