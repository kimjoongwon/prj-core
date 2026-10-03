import { getTextContent } from "./text-content";

describe("getTextContent", () => {
	it("문자열 children을 정규화된 단일 문자열로 반환해야 한다", () => {
		expect(getTextContent(["  수업", " 시작 전  ", 10])).toBe("수업 시작 전 10");
	});

	it("React 요소가 섞인 children은 null을 반환해야 한다", () => {
		expect(getTextContent(["수업", <View key="view" />])).toBeNull();
	});

	it("빈 문자열과 공백만 있는 children은 null을 반환해야 한다", () => {
		expect(getTextContent("   ")).toBeNull();
		expect(getTextContent([null, undefined, false])).toBeNull();
	});
});

function View() {
	return null;
}
