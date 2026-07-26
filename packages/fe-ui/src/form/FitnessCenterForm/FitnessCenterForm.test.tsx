import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { observable } from "mobx";
import { describe, expect, it } from "vitest";
import {
	FitnessCenterCreateCompanyFields,
	FitnessCenterForm,
	FitnessCenterFormState,
} from "./";

function createState(state?: Partial<FitnessCenterFormState>) {
	return observable(
		Object.assign(new FitnessCenterFormState(), {
			name: "샘플 센터",
			label: "샘플 라벨",
			address: "서울시 어딘가 1",
			phone: "02-123-4567",
			email: "center@example.com",
			imageFileId: "asset-image-1",
			contentLanguageCode: "ko_KR",
			errors: {},
			...state,
		}),
	);
}

describe("FitnessCenterForm", () => {
	it("renders only fitness center edit fields by default", () => {
		const state = createState();

		render(<FitnessCenterForm state={state} />);

		expect(screen.getByLabelText("센터명")).toHaveValue("샘플 센터");
		expect(screen.getByLabelText("라벨")).toHaveValue("샘플 라벨");
		expect(screen.getByLabelText("센터 주소")).toHaveValue("서울시 어딘가 1");
		expect(screen.getByLabelText("대표 전화번호")).toHaveValue("02-123-4567");
		expect(screen.getByLabelText("대표 이메일")).toHaveValue(
			"center@example.com",
		);
		expect(screen.getByLabelText("센터 이미지")).toHaveValue("asset-image-1");
		expect(screen.queryByLabelText("사업자등록번호")).not.toBeInTheDocument();
		expect(screen.queryByLabelText("회사 로고")).not.toBeInTheDocument();
	});

	it("clears field errors when a bound field changes", async () => {
		const state = createState({
			errors: {
				name: "센터명을 입력해주세요.",
			},
			name: "",
		});

		render(<FitnessCenterForm state={state} />);

		expect(screen.getByText("센터명을 입력해주세요.")).toBeInTheDocument();

		fireEvent.change(screen.getByLabelText("센터명"), {
			target: { value: "새 센터명" },
		});

		await waitFor(() => {
			expect(state.name).toBe("새 센터명");
			expect(state.errors.name).toBeUndefined();
		});
	});

	it("locks editable fields in readOnly mode", () => {
		const state = createState();

		render(<FitnessCenterForm state={state} readOnly />);

		expect(screen.getByLabelText("센터명")).toBeDisabled();
		expect(screen.getByLabelText("센터 주소")).toBeDisabled();
		expect(screen.getByLabelText("대표 전화번호")).toBeDisabled();
		expect(screen.getByLabelText("대표 이메일")).toBeDisabled();
		expect(screen.getByLabelText("센터 이미지")).toBeDisabled();
		expect(screen.getByLabelText("콘텐츠 언어")).toBeDisabled();
	});

	it("renders create-only company transition fields only when composed explicitly", () => {
		const state = createState({
			businessNo: "123-45-67890",
			logoImageFileId: "asset-logo-1",
		});

		render(<FitnessCenterCreateCompanyFields state={state} />);

		expect(screen.getByLabelText("사업자등록번호")).toHaveValue("123-45-67890");
		expect(screen.getByLabelText("회사 로고")).toHaveValue("asset-logo-1");
	});

	it("maps update dto without company transition fields", () => {
		const state = createState({
			name: "  새 센터명  ",
			label: "  대표 센터  ",
			address: "  서울시 강남구  ",
			phone: "  02-000-0000  ",
			email: "  manager@example.com  ",
			imageFileId: "  asset-image-2  ",
			businessNo: "123-45-67890",
			logoImageFileId: "asset-logo-1",
		});

		expect(state.toUpdateDto()).toEqual({
			name: "새 센터명",
			label: "대표 센터",
			address: "서울시 강남구",
			phone: "02-000-0000",
			email: "manager@example.com",
			imageFileId: "asset-image-2",
			contentLanguageCode: "ko_KR",
		});
	});
});
