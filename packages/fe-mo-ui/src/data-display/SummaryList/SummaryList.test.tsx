import { render, screen } from "@testing-library/react-native";
import { Text } from "../Text";
import { SummaryList } from "./index";

describe("SummaryList", () => {
	it("선택 요약 값과 비어 있는 필드 placeholder를 함께 렌더링해야 한다", () => {
		// Given
		render(
			<SummaryList
				footer={<Text>메모는 선택 사항입니다.</Text>}
				items={[
					{
						label: "예약 대상",
						value: "필라테스 클래스",
					},
					{
						helperText: "일정을 먼저 선택해 주세요.",
						label: "일정",
						placeholder: "일정 미선택",
					},
				]}
				title="예약 확인"
			/>,
		);

		// When & Then
		expect(screen.getByText("예약 확인")).toBeTruthy();
		expect(screen.getByText("필라테스 클래스")).toBeTruthy();
		expect(screen.getByText("일정 미선택")).toBeTruthy();
		expect(screen.getByText("일정을 먼저 선택해 주세요.")).toBeTruthy();
		expect(screen.getByText("메모는 선택 사항입니다.")).toBeTruthy();
	});

	it("값이 0인 요약 항목은 선택된 값으로 처리해야 한다", () => {
		// Given
		render(
			<SummaryList
				items={[
					{
						label: "잔여 좌석",
						value: 0,
					},
				]}
			/>,
		);

		// When & Then
		expect(screen.getByText("0")).toBeTruthy();
	});
});
