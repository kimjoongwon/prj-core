import { render, screen } from "@testing-library/react-native";
import { type ReactNode } from "react";
import { DesignSystemProvider } from "../../design-system/provider";
import { CommunityPostCard } from "./index";

const renderWithDesignSystem = (children: ReactNode) =>
	render(
		<DesignSystemProvider
			config={{
				animation: "disable-all",
				devInfo: {
					stylingPrinciples: false,
				},
				toast: false,
			}}
		>
			{children}
		</DesignSystemProvider>,
	);

describe("CommunityPostCard", () => {
	it("작성자, 작성 시각, 제목, 본문을 렌더링해야 한다", () => {
		renderWithDesignSystem(
			<CommunityPostCard
				authorName="민지 회원"
				createdAtLabel="방금 전"
				isMine
				text="오늘 저녁 수업 끝나고 스트레칭 같이 하실 분 계신가요?"
				title="저녁 수업 후 스트레칭"
			/>,
		);

		expect(screen.getByText("민지 회원")).toBeTruthy();
		expect(screen.getByText("방금 전")).toBeTruthy();
		expect(screen.getByText("저녁 수업 후 스트레칭")).toBeTruthy();
		expect(
			screen.getByText("오늘 저녁 수업 끝나고 스트레칭 같이 하실 분 계신가요?"),
		).toBeTruthy();
		expect(screen.getByText("내 글")).toBeTruthy();
	});
});
