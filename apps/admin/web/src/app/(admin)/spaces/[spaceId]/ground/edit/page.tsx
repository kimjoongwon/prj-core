"use client";

import {
	type GroundDto,
	useGetSpaceGround,
	useUpdateSpaceGround,
} from "@cocrepo/api/core/spaces";
import { GroundEditPage } from "@cocrepo/ui";
import { addToast } from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type GroundEditPageParams = {
	spaceId: string;
};

const AdminSpacesSpaceIdGroundEditRoute = observer(() => {
	const { spaceId } = useParams<GroundEditPageParams>();
	const router = useRouter();
	const state = useLocalObservable(() => ({
		name: "",
		label: "",
		address: "",
		phone: "",
		email: "",
		businessNo: "",
		contentLanguageCode: "ko_KR",
		errors: {} as Record<string, string>,
		isInitialized: false,
	}));

	const { data: response, isLoading } = useGetSpaceGround(spaceId);
	const ground = response?.data as GroundDto | undefined;

	useEffect(() => {
		if (ground && !state.isInitialized) {
			state.name = ground.name;
			state.label = ground.label ?? "";
			state.address = ground.address;
			state.phone = ground.phone;
			state.email = ground.email;
			state.businessNo = ground.businessNo;
			state.contentLanguageCode = ground.space?.contentLanguageCode ?? "ko_KR";
			state.isInitialized = true;
		}
	}, [ground, state]);

	const { mutate: updateSpaceGround, isPending } = useUpdateSpaceGround({
		mutation: {
			onSuccess: () => {
				addToast({
					title: "시설 정보 수정 성공",
					description: "시설 detail이 성공적으로 수정되었습니다.",
					color: "success",
				});
				router.push(`/spaces/${spaceId}/ground` as Route);
			},
			onError: (error) => {
				addToast({
					title: "시설 정보 수정 실패",
					description:
						error.message || "시설 detail 수정 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	const onClickCancelButton = () => {
		router.push(`/spaces/${spaceId}/ground` as Route);
	};

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

	const onChangeContentLanguageSelect = (value: string) => {
		state.contentLanguageCode = value;
		delete state.errors.contentLanguageCode;
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
		if (!state.contentLanguageCode) {
			errors.contentLanguageCode = "콘텐츠 언어를 선택해주세요.";
		}

		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}

		updateSpaceGround({
			spaceId,
			data: {
				name: state.name.trim(),
				label: state.label.trim() || null,
				address: state.address.trim(),
				phone: state.phone.trim(),
				email: state.email.trim(),
				contentLanguageCode: state.contentLanguageCode as
					| "ko_KR"
					| "en_US"
					| "zh_CN"
					| "ja_JP",
			},
		});
	};

	return (
		<GroundEditPage
			groundName={ground?.name}
			name={state.name}
			label={state.label}
			address={state.address}
			phone={state.phone}
			email={state.email}
			businessNo={state.businessNo}
			contentLanguageCode={state.contentLanguageCode}
			errors={state.errors}
			isLoading={isLoading}
			isNotFound={!isLoading && !ground}
			isSubmitPending={isPending}
			onChangeNameInput={onChangeNameInput}
			onChangeLabelInput={onChangeLabelInput}
			onChangeAddressInput={onChangeAddressInput}
			onChangePhoneInput={onChangePhoneInput}
			onChangeEmailInput={onChangeEmailInput}
			onChangeContentLanguageSelect={onChangeContentLanguageSelect}
			onClickCancelButton={onClickCancelButton}
			onClickSaveButton={onClickSaveButton}
		/>
	);
});

export default AdminSpacesSpaceIdGroundEditRoute;
