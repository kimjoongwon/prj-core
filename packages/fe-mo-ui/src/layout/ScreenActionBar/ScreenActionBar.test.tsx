import { type ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { DesignSystemProvider } from "../../design-system/provider";
import { ScreenActionBar } from "./index";

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

describe("ScreenActionBar", () => {
  it("primary action을 실행해야 한다", () => {
    const onContinue = jest.fn();

    renderWithDesignSystem(
      <ScreenActionBar
        description="선택 내용을 확인해 주세요."
        onPressPrimaryAction={onContinue}
        primaryActionLabel="예약 계속하기"
      />,
    );

    fireEvent.press(screen.getByLabelText("예약 계속하기"));

    expect(onContinue).toHaveBeenCalledTimes(1);
    expect(screen.getByText("선택 내용을 확인해 주세요.")).toBeTruthy();
  });

  it("loading 상태에서는 loading label과 disabled 상태를 적용해야 한다", () => {
    renderWithDesignSystem(
      <ScreenActionBar
        isPrimaryActionLoading
        onPressPrimaryAction={() => undefined}
        primaryActionLabel="예약하기"
        primaryActionLoadingLabel="예약 중..."
      />,
    );

    expect(screen.getByText("예약 중...")).toBeTruthy();
    expect(
      screen.getByLabelText("예약 중...").props.accessibilityState,
    ).toEqual(
      expect.objectContaining({
        disabled: true,
      }),
    );
  });
});
