import { type ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { DesignSystemProvider } from "../../design-system/provider";
import { OccurrencePicker } from "./index";

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaListener: ({ children }: { children: ReactNode }) => children,
  useSafeAreaInsets: () => ({
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  }),
}));

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

describe("OccurrencePicker", () => {
  it("ONE_TIME 세션의 고정 예약 일시를 선택된 항목으로 보여줘야 한다", () => {
    // Given
    const onChange = jest.fn();

    renderWithDesignSystem(
      <OccurrencePicker
        fixedDescription="세션 시작 시간이 예약 일시로 고정됩니다."
        fixedLabel="2026-05-06 10:00"
        fixedValue="2026-05-06T10:00:00.000Z"
        onChange={onChange}
        sessionType="ONE_TIME"
      />,
    );

    // When
    fireEvent.press(screen.getByLabelText("2026-05-06 10:00"));

    // Then
    expect(onChange).toHaveBeenCalledWith("2026-05-06T10:00:00.000Z");
    expect(screen.getByText("Fixed time")).toBeTruthy();
    expect(
      screen.getByLabelText("2026-05-06 10:00").props.accessibilityState,
    ).toEqual(
      expect.objectContaining({
        selected: true,
      }),
    );
  });

  it("RECURRING 세션에서 occurrence 옵션이 없으면 안내 메시지를 보여줘야 한다", () => {
    // Given
    renderWithDesignSystem(
      <OccurrencePicker
        recurringUnavailableMessage="반복 예약 일시는 서버 occurrence 목록 연동 후 선택할 수 있습니다."
        sessionType="RECURRING"
      />,
    );

    // When & Then
    expect(screen.getByText("Choose an occurrence")).toBeTruthy();
    expect(
      screen.getByText(
        "반복 예약 일시는 서버 occurrence 목록 연동 후 선택할 수 있습니다.",
      ),
    ).toBeTruthy();
  });
});
