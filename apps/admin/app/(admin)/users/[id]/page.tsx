"use client";

import { Text } from "@cocrepo/ui";
import { Skeleton } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MOCK_MEMBERS } from "../_mocks/mockData";
import type { Member } from "../_stores";
import {
	MemberBasicInfo,
	MemberDetailHeader,
	MemberTenantInfo,
} from "./_components";

/**
 * 회원 상세 페이지
 *
 * 현재 목 데이터 사용 중
 * TODO: API 배포 후 useGetUserById 훅으로 교체
 */
export default function MemberDetailPage() {
	const router = useRouter();
	const params = useParams();
	const id = params.id as string;

	// 목 데이터 상태 (API 대체)
	const [isLoading, setIsLoading] = useState(true);
	const [member, setMember] = useState<Member | null>(null);
	const [error, setError] = useState<Error | null>(null);

	// 목 데이터 로드 (API 대체)
	useEffect(() => {
		const loadMockData = async () => {
			setIsLoading(true);
			try {
				// 실제 API 호출처럼 약간의 딜레이 추가
				await new Promise((resolve) => setTimeout(resolve, 300));

				// ID로 회원 찾기
				const foundMember = MOCK_MEMBERS.find((m) => m.id === id);
				setMember(foundMember || null);
			} catch (err) {
				setError(err as Error);
			} finally {
				setIsLoading(false);
			}
		};

		loadMockData();
	}, [id]);

	// 이벤트 핸들러
	const onClickBack = () => {
		router.push("/users");
	};

	const onClickEdit = () => {
		// TODO: 수정 모달 열기
		console.log("Edit member:", id);
	};

	const onClickDelete = () => {
		// TODO: 삭제 확인 모달 열기
		console.log("Delete member:", id);
	};

	// 로딩 상태
	if (isLoading) {
		return (
			<div className="flex flex-col gap-6 p-4 md:p-6">
				<div className="flex items-center gap-4">
					<Skeleton className="h-10 w-10 rounded-lg" />
					<div className="flex flex-col gap-2">
						<Skeleton className="h-8 w-48 rounded" />
						<Skeleton className="h-4 w-32 rounded" />
					</div>
				</div>
				<Skeleton className="h-64 w-full rounded-lg" />
				<Skeleton className="h-48 w-full rounded-lg" />
			</div>
		);
	}

	// 에러 상태
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-12">
				<Text className="text-lg text-danger">
					회원 정보를 불러오는 중 오류가 발생했습니다.
				</Text>
				<Text className="text-default-500">잠시 후 다시 시도해주세요.</Text>
			</div>
		);
	}

	// 데이터 없음
	if (!member) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-12">
				<Text className="text-lg text-default-500">
					회원을 찾을 수 없습니다.
				</Text>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 p-4 md:p-6">
			{/* 헤더 */}
			<MemberDetailHeader
				memberName={member.name}
				onClickBack={onClickBack}
				onClickEdit={onClickEdit}
				onClickDelete={onClickDelete}
			/>

			{/* 기본 정보 */}
			<MemberBasicInfo member={member} />

			{/* 소속 정보 */}
			{member.tenants && member.tenants.length > 0 && (
				<MemberTenantInfo tenants={member.tenants} />
			)}
		</div>
	);
}
