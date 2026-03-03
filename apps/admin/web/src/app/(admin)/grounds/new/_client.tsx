"use client";

import { useCreateGround } from "@cocrepo/api";
import { Page, PageHeader, Section, SectionHeader, VStack } from "@cocrepo/ui";
import { addToast, Button, Input } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

/**
 * 시설 등록 페이지 - 클라이언트 컴포넌트
 */
function GroundNewPageClient() {
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
	}));

	// 등록 Mutation
	const { mutate: createGround, isPending } = useCreateGround({
		mutation: {
			onSuccess: (response) => {
				addToast({
					title: "시설 등록 성공",
					description: "시설이 성공적으로 등록되었습니다.",
					color: "success",
				});
				const groundId = response?.data?.id;
				if (groundId) {
					router.push(`/grounds/${groundId}` as Route);
				} else {
					router.push("/grounds" as Route);
				}
			},
			onError: (error) => {
				addToast({
					title: "시설 등록 실패",
					description: error.message || "시설 등록 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	/** 취소 버튼 클릭 핸들러 - 목록으로 이동 */
	const onClickCancelButton = () => {
		router.push("/grounds" as Route);
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

	/** 사업자등록번호 변경 핸들러 */
	const onChangeBusinessNo = (e: React.ChangeEvent<HTMLInputElement>) => {
		state.businessNo = e.target.value;
		delete state.errors.businessNo;
	};

	/** 등록 버튼 클릭 핸들러 - 유효성 검증 후 API 호출 */
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

		if (!state.businessNo.trim()) {
			errors.businessNo = "사업자등록번호를 입력해주세요.";
		} else if (!/^\d{3}-\d{2}-\d{5}$/.test(state.businessNo)) {
			errors.businessNo = "형식에 맞게 입력해주세요. (예: 000-00-00000)";
		}

		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}

		// spaceId는 서버에서 자동 생성하므로 빈 문자열 전달
		createGround({
			data: {
				name: state.name.trim(),
				label: state.label.trim() || null,
				address: state.address.trim(),
				phone: state.phone.trim(),
				email: state.email.trim(),
				businessNo: state.businessNo.trim(),
				spaceId: "",
			},
		});
	};

	return (
		<Page
			mode="content"
			top={
				<PageHeader
					title="시설 등록"
					description="새로운 시설을 등록합니다."
				/>
			}
		>
			<VStack gap={4}>
				<Section mode="content" top={<SectionHeader title="기본 정보" />}>
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
							placeholder="000-00-00000"
							value={state.businessNo}
							onChange={onChangeBusinessNo}
							isRequired
							isInvalid={!!state.errors.businessNo}
							errorMessage={state.errors.businessNo}
						/>
					</VStack>
				</Section>
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
						등록
					</Button>
				</div>
			</VStack>
		</Page>
	);
}

export default observer(GroundNewPageClient);
