import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FitnessCenterFormState } from "../../form/FitnessCenterForm";
import { FitnessCenterEditScreen } from "./FitnessCenterEditScreen";

const state = new FitnessCenterFormState({
	address: "address-1",
	businessNo: "123-45-67891",
	email: "member1@example.com",
	label: "샘플 label 1",
	name: "샘플 피트니스 센터 1",
	phone: "010-1234-5670",
	space: {
		contentLanguageCode: "ko_KR",
	},
});

describe("FitnessCenterEditScreen", () => {
	it("renders fitness center identity and contact fields in readOnly detail mode", () => {
		render(
			<FitnessCenterEditScreen
				title="샘플 피트니스 센터 1"
				description="피트니스 센터 기본 정보를 확인합니다."
				state={state}
				readOnly
				isLoading={false}
				isNotFound={false}
				isSubmitPending={false}
				onClickCancelButton={() => undefined}
			/>,
		);

		expect(
			screen.getByRole("heading", { name: "샘플 피트니스 센터 1" }),
		).toBeInTheDocument();
		expect(screen.getByDisplayValue("샘플 label 1")).toBeInTheDocument();
		expect(screen.getByDisplayValue("address-1")).toBeInTheDocument();
		expect(screen.getByDisplayValue("010-1234-5670")).toBeInTheDocument();
		expect(screen.getByDisplayValue("member1@example.com")).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "저장" }),
		).not.toBeInTheDocument();
	});
});
