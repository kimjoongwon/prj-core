"use client";

import { useCreateSpace } from "@cocrepo/api/core/spaces";
import { SpaceCreatePage } from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

const AdminSpacesNewRoute = observer(() => {
	const router = useRouter();
	const state = useLocalObservable(() => ({
		name: "",
		label: "",
		address: "",
		phone: "",
		email: "",
		businessNo: "",
		errors: {} as Record<string, string>,
	}));

	const { mutate: createSpace, isPending } = useCreateSpace({
		mutation: {
			onSuccess: (response) => {
				addToast({
					title: "공간 등록 성공",
					description: "공간과 시설 detail이 성공적으로 등록되었습니다.",
					color: "success",
				});
				const spaceId = response?.data?.id;
				if (spaceId) {
					router.push(`/spaces/${spaceId}/ground` as Route);
					return;
				}
				router.push("/spaces" as Route);
			},
			onError: (error) => {
				addToast({
					title: "공간 등록 실패",
					description: error.message || "공간 등록 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	const onChangeNameInput = (value: string) => {
		state.name = value;
		delete state.errors.name;
	};

	const onChangeLabelInput = (value: string) => {
		state.label = value;
	};

	const onChangeAddressInput = (value: string) => {
		state.address = value;
		delete state.errors.address;
	};

	const onChangePhoneInput = (value: string) => {
		state.phone = value;
		delete state.errors.phone;
	};

	const onChangeEmailInput = (value: string) => {
		state.email = value;
		delete state.errors.email;
	};

	const onChangeBusinessNoInput = (value: string) => {
		state.businessNo = value;
		delete state.errors.businessNo;
	};

	const onClickCancelButton = () => {
		router.push("/spaces" as Route);
	};

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
		} else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(state.email)) {
			errors.email = "올바른 이메일 형식을 입력해주세요.";
		}
		if (!state.businessNo.trim()) {
			errors.businessNo = "사업자등록번호를 입력해주세요.";
		} else if (!/^\\d{3}-\\d{2}-\\d{5}$/.test(state.businessNo)) {
			errors.businessNo = "형식에 맞게 입력해주세요. (예: 000-00-00000)";
		}

		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}

		createSpace({
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
		<SpaceCreatePage
			name={state.name}
			label={state.label}
			address={state.address}
			phone={state.phone}
			email={state.email}
			businessNo={state.businessNo}
			errors={state.errors}
			isSubmitPending={isPending}
			onChangeNameInput={onChangeNameInput}
			onChangeLabelInput={onChangeLabelInput}
			onChangeAddressInput={onChangeAddressInput}
			onChangePhoneInput={onChangePhoneInput}
			onChangeEmailInput={onChangeEmailInput}
			onChangeBusinessNoInput={onChangeBusinessNoInput}
			onClickCancelButton={onClickCancelButton}
			onClickSaveButton={onClickSaveButton}
		/>
	);
});

export default AdminSpacesNewRoute;
