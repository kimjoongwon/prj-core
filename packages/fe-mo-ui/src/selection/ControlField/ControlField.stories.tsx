import type { Meta, StoryObj } from "@storybook/react-native";
import { Description, FieldError, Label } from "heroui-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { ControlField } from "./index";

const meta = {
  title: "selection/ControlField",
  component: ControlField,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ControlField>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View className="w-[320px] rounded-xl border border-border bg-surface p-4">
      <ControlField isSelected onSelectedChange={() => undefined}>
        <ControlField.Indicator variant="switch" />
        <View className="flex-1 gap-1">
          <Label isRequired>푸시 알림</Label>
          <Description>예약 변경 알림을 모바일로 받습니다.</Description>
        </View>
      </ControlField>
    </View>
  ),
};

export const States: Story = {
  render: () => (
    <View className="w-[320px] gap-4 rounded-xl border border-border bg-surface p-4">
      <ControlField isSelected onSelectedChange={() => undefined}>
        <ControlField.Indicator variant="checkbox" />
        <View className="flex-1 gap-1">
          <Label>선택됨</Label>
          <Description>현재 활성화된 선택 항목입니다.</Description>
        </View>
      </ControlField>
      <ControlField isDisabled isSelected onSelectedChange={() => undefined}>
        <ControlField.Indicator variant="switch" />
        <View className="flex-1 gap-1">
          <Label>비활성</Label>
          <Description>권한이 없으면 조작할 수 없습니다.</Description>
        </View>
      </ControlField>
      <ControlField isInvalid onSelectedChange={() => undefined}>
        <ControlField.Indicator variant="radio" />
        <View className="flex-1 gap-1">
          <Label isInvalid>오류</Label>
          <FieldError isInvalid>하나 이상의 항목을 선택해야 합니다.</FieldError>
        </View>
      </ControlField>
    </View>
  ),
};

export const Composition: Story = {
  render: () => (
    <View className="w-[320px] gap-4 rounded-xl border border-border bg-surface p-4">
      <ControlField isSelected onSelectedChange={() => undefined}>
        {({ isSelected }) => (
          <>
            <ControlField.Indicator variant="checkbox" />
            <View className="flex-1 gap-1">
              <Label>약관 동의</Label>
              <Description>
                {isSelected ? "동의 상태입니다." : "필수 약관을 확인해주세요."}
              </Description>
            </View>
          </>
        )}
      </ControlField>
      <Text tone="muted">
        children render function과 Indicator slot을 함께 사용할 수 있습니다.
      </Text>
    </View>
  ),
};
