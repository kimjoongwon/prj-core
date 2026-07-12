import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GroundFormState } from "../../form/GroundForm";
import { GroundEditScreen } from "./GroundEditScreen";

const state = new GroundFormState({
	address: "address-1",
	businessNo: "123-45-67891",
	email: "member1@example.com",
	label: "샘플 label 1",
	name: "샘플 시설 1",
	phone: "010-1234-5670",
	space: {
		contentLanguageCode: "ko_KR",
		createdAt: "2026-01-01T00:00:00.000Z",
		id: "space-1",
		removedAt: null,
		updatedAt: "2026-01-01T00:00:00.000Z",
	},
});

describe("GroundEditScreen", () => {
	it("renders ground identity and contact fields in readOnly detail mode", () => {
		render(
			<GroundEditScreen
				title="샘플 시설 1"
				description="시설 기본 정보를 확인합니다."
				state={state}
				readOnly
				isLoading={false}
				isNotFound={false}
				isSubmitPending={false}
				onClickCancelButton={() => undefined}
			/>,
		);

		expect(
			screen.getByRole("heading", { name: "샘플 시설 1" }),
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
