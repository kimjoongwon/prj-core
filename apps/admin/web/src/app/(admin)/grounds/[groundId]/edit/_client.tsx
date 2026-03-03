"use client";

import { type GroundDto, useGetGround, useUpdateGround } from "@cocrepo/api";
import { Page, PageTitleBar, Section, VStack } from "@cocrepo/ui";
import { addToast, Button, Input, Spinner } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface GroundEditPageClientProps {
	groundId: string;
}

/**
 * 시설 수정 페이지 - 클라이언트 컴포넌트
 */
function GroundEditPageClient({ groundId }: GroundEditPageClientProps) {
	const router = useRouter();

	// 로컬 상태
	const state = useLocalObservable(() => ({
		name: "",
		label: "",
		address: "",
		phone: "",
		email: "",
		businessNo: "",
		errors: {} as Record<string, string>,
		isInitialized: false,
	}));

	// API 조회 (prefetch로 초기 데이터 보장)
	const { data: response, isLoading } = useGetGround(groundId);
	const ground = response?.data as GroundDto | undefined;

	// 초기 데이터 로딩
	useEffect(() => {
		if (ground && !state.isInitialized) {
			state.name = ground.name;
			state.label = ground.label ?? "";
			state.address = ground.address;
			state.phone = ground.phone;
			state.email = ground.email;
			state.businessNo = ground.businessNo;
			state.isInitialized = true;
		}
	}, [ground, state]);

	// 수정 Mutation
	const { mutate: updateGround, isPending } = useUpdateGround({
		mutation: {
			onSuccess: () => {
				addToast({
					title: "시설 수정 성공",
					description: "시설이 성공적으로 수정되었습니다.",
					color: "success",
				});
				router.push(`/grounds/${groundId}` as Route);
			},
			onError: (error) => {
				addToast({
					title: "시설 수정 실패",
					description: error.message || "시설 수정 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	/** 취소 버튼 클릭 핸들러 - 상세 페이지로 이동 */
	const onClickCancelButton = () => {
		router.push(`/grounds/${groundId}` as Route);
	};

	/** 시설명 변경 핸들러 */
	const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
		state.name = e.target.value;
		delete state.errors.name;
	};

	/** 라벨 변경 핸들러 */
	const onChangeLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
		state.label = e.target.value;
	};

	/** 주소 변경 핸들러 */
	const onChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
		state.address = e.target.value;
		delete state.errors.address;
	};

	/** 전화번호 변경 핸들러 */
	const onChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
		state.phone = e.target.value;
		delete state.errors.phone;
	};

	/** 이메일 변경 핸들러 */
	const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		state.email = e.target.value;
		delete state.errors.email;
	};

	/** 저장 버튼 클릭 핸들러 - 유효성 검증 후 API 호출 */
	const onClickSaveButton = () => {
		const errors: Record<string, string> = {};

		if (!state.name.trim()) {
			errors.name = "시설명을 입력해주세요.";
		}

		if (!state.address.trim()) {
			errors.address = "주소를 입력해주세요.";
		}

		if (!state.phone.trim()) {
			errors.phone = "전화번호를 입력해주세요.";
		}

		if (!state.email.trim()) {
			errors.email = "이메일을 입력해주세요.";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
			errors.email = "올바른 이메일 형식을 입력해주세요.";
		}

		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}

		updateGround({
			groundId,
			data: {
				name: state.name.trim(),
				label: state.label.trim() || null,
				address: state.address.trim(),
				phone: state.phone.trim(),
				email: state.email.trim(),
			},
		});
	};

	// 로딩 상태
	if (isLoading) {
		return (
			<Page
				top={<PageTitleBar title="시설 수정" description="로딩 중..." />}
			>
				<Section>
					<div className="flex items-center justify-center gap-2 p-8">
						<Spinner size="sm" />
						<span className="text-default-500">로딩 중...</span>
					</div>
				</Section>
			</Page>
		);
	}

	// 데이터 없음
	if (!ground) {
		return (
			<Page
				top={
					<PageTitleBar
						title="시설 수정"
						description="시설을 찾을 수 없습니다."
					/>
				}
			>
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-default-500">시설을 찾을 수 없습니다.</p>
					<Button variant="flat" onPress={onClickCancelButton}>
						목록으로
					</Button>
				</div>
			</Page>
		);
	}

	const pageHeader = (
		<PageTitleBar
			title="시설 수정"
			description={`${ground.name} 시설을 수정합니다.`}
		/>
	);

	return (
		<Page top={pageHeader}>
			<Section top={<PageTitleBar level={2} title="기본 정보" />}>
				<VStack gap={4}>
					<Input
						label="시설명"
						placeholder="시설명을 입력하세요"
						value={state.name}
						onChange={onChangeName}
						isRequired
						isInvalid={!!state.errors.name}
						errorMessage={state.errors.name}
					/>
					<Input
						label="라벨"
						placeholder="단축 라벨을 입력하세요 (선택)"
						value={state.label}
						onChange={onChangeLabel}
					/>
					<Input
						label="주소"
						placeholder="주소를 입력하세요"
						value={state.address}
						onChange={onChangeAddress}
						isRequired
						isInvalid={!!state.errors.address}
						errorMessage={state.errors.address}
					/>
					<Input
						label="전화번호"
						placeholder="전화번호를 입력하세요"
						type="tel"
						value={state.phone}
						onChange={onChangePhone}
						isRequired
						isInvalid={!!state.errors.phone}
						errorMessage={state.errors.phone}
					/>
					<Input
						label="이메일"
						placeholder="이메일을 입력하세요"
						type="email"
						value={state.email}
						onChange={onChangeEmail}
						isRequired
						isInvalid={!!state.errors.email}
						errorMessage={state.errors.email}
					/>
					<Input
						label="사업자등록번호"
						value={state.businessNo}
						isDisabled
						description="사업자등록번호는 수정할 수 없습니다."
					/>
					<div className="mt-4 flex justify-end gap-2">
						<Button
							variant="flat"
							onPress={onClickCancelButton}
							isDisabled={isPending}
						>
							취소
						</Button>
						<Button
							color="primary"
							onPress={onClickSaveButton}
							isLoading={isPending}
						>
							저장
						</Button>
					</div>
				</VStack>
			</Section>
		</Page>
	);
}

export default observer(GroundEditPageClient);
