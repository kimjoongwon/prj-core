import type { ReactElement } from "react";
import { getTextContent, Text, type TextProps, wrapTextContent } from "./index";

jest.mock("react-native", () => ({
  Text: "Text",
}));

describe("Text", () => {
  const renderText = (props: TextProps): ReactElement<TextProps> =>
    (
      Text as unknown as {
        render: (props: TextProps, ref: null) => ReactElement;
      }
    ).render(props, null) as ReactElement<TextProps>;

  it("기본 body variant와 foreground tone을 적용해야 한다", () => {
    const text = renderText({
      children: "content",
    });

    expect(text.props.className).toContain("text-sm");
    expect(text.props.className).toContain("text-foreground");
  });

  it("className과 variant class를 함께 조합해야 한다", () => {
    const text = renderText({
      children: "content",
      className: "underline",
      tone: "muted",
      variant: "heading",
    });

    expect(text.props.className).toContain("text-lg");
    expect(text.props.className).toContain("text-muted");
    expect(text.props.className).toContain("underline");
  });

  it("문자열 children을 Text 콘텐츠로 정규화해야 한다", () => {
    expect(getTextContent(["  수업", " 시작 전  ", 10])).toBe(
      "수업 시작 전 10",
    );
  });

  it("문자열 children을 Text 컴포넌트로 감싸야 한다", () => {
    const wrapped = wrapTextContent("알림 받기", {
      variant: "label",
    }) as ReactElement<TextProps>;

    expect(wrapped.type).toBe(Text);
    expect(wrapped.props.children).toBe("알림 받기");
    expect(wrapped.props.variant).toBe("label");
  });
});
