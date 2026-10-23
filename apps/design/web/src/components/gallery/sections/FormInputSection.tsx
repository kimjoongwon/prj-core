"use client";

import {
	Checkbox,
	Link,
	RadioGroup,
	Select,
	Switch,
	TextArea,
	TextField,
} from "@cocrepo/ui";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { GalleryExample, GallerySection } from "../GallerySection";

/**
 * Checkbox·Switch·Select·RadioGroup은 state+path로 이 객체의 필드에 직접
 * 바인딩되고, TextField·TextArea만 value/onChange로 연결합니다.
 */
export function createFormInputSectionState() {
	const state = {
		siteName: "",
		memo: "",
		archiveView: "grid",
		isAgreementChecked: false,
		isPushEnabled: true,
		notificationMethod: "email",

		applySiteName(siteName: string | number) {
			state.siteName = String(siteName);
		},
		applyMemo(memo: string) {
			state.memo = memo;
		},
	};

	return makeAutoObservable(
		state,
		{},
		{ autoBind: true, name: "FormInputSectionState" },
	);
}

export type FormInputSectionState = ReturnType<
	typeof createFormInputSectionState
>;

const archiveViewOptions = [
	{ value: "grid", text: "갤러리 뷰" },
	{ value: "list", text: "리스트 뷰" },
];

const notificationMethodOptions = [
	{ value: "email", text: "이메일" },
	{ value: "sms", text: "문자" },
	{ value: "push", text: "푸시" },
];

const FormInputSection = observer(function FormInputSection() {
	const formInputState = useLocalObservable(createFormInputSectionState);

	return (
		<GallerySection
			id="form-inputs"
			title="입력·선택"
			description="텍스트 입력, 선택, 전환 컨트롤과 링크입니다."
		>
			<GalleryExample
				label="TextField"
				className="grid gap-3 sm:grid-cols-2"
			>
				<TextField
					label="사이트 이름"
					placeholder="예: Awwwards"
					description="북마크에 표시되는 이름입니다."
					isRequired
					value={formInputState.siteName}
					onChange={formInputState.applySiteName}
				/>
				<TextField
					label="미러 URL"
					placeholder="https://..."
					isInvalid
					errorMessage="https://로 시작해야 합니다."
				/>
			</GalleryExample>
			<GalleryExample label="TextArea">
				<TextArea
					label="메모"
					placeholder="이 링크에서 배울 점을 남겨주세요."
					minRows={3}
					value={formInputState.memo}
					onChange={formInputState.applyMemo}
				/>
			</GalleryExample>
			<GalleryExample label="Select">
				<Select
					label="아카이브 뷰"
					placeholder="뷰 선택"
					options={archiveViewOptions}
					state={formInputState}
					path="archiveView"
					className="max-w-64"
				/>
			</GalleryExample>
			<GalleryExample
				label="Checkbox · Switch · RadioGroup"
				className="flex flex-wrap items-start gap-8"
			>
				<Checkbox state={formInputState} path="isAgreementChecked">
					이용약관 동의
				</Checkbox>
				<Switch state={formInputState} path="isPushEnabled">
					푸시 알림
				</Switch>
				<RadioGroup
					label="알림 방법"
					options={notificationMethodOptions}
					state={formInputState}
					path="notificationMethod"
				/>
			</GalleryExample>
			<GalleryExample label="Link">
				<p className="text-sm leading-6">
					본문 안의 이동은 <Link href="/">Link 컴포넌트</Link>로 연결합니다.
				</p>
			</GalleryExample>
		</GallerySection>
	);
});

export default FormInputSection;
