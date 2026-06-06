import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { InputGroup } from "./index";

const meta = {
  title: "input/InputGroup",
  component: InputGroup,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof InputGroup>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View className="w-[300px] gap-2 rounded-xl border border-border bg-surface p-4">
      <Text variant="label">금액</Text>
      <InputGroup>
        <InputGroup.Prefix isDecorative>
          <Text tone="muted">₩</Text>
        </InputGroup.Prefix>
        <InputGroup.Input placeholder="120000" />
        <InputGroup.Suffix isDecorative>
          <Text tone="muted">원</Text>
        </InputGroup.Suffix>
      </InputGroup>
    </View>
  ),
};

export const States: Story = {
  render: () => (
    <View className="w-[300px] gap-4 rounded-xl border border-border bg-surface p-4">
      <InputGroup>
        <InputGroup.Prefix isDecorative>
          <Text tone="muted">@</Text>
        </InputGroup.Prefix>
        <InputGroup.Input placeholder="username" />
      </InputGroup>
      <InputGroup isDisabled>
        <InputGroup.Prefix isDecorative>
          <Text tone="muted">#</Text>
        </InputGroup.Prefix>
        <InputGroup.Input placeholder="disabled" />
      </InputGroup>
    </View>
  ),
};

export const Composition: Story = {
  render: () => (
    <View className="w-[300px] gap-2 rounded-xl border border-border bg-surface p-4">
      <Text variant="label">좌석 코드</Text>
      <InputGroup>
        <InputGroup.Prefix>
          <Text variant="label">A</Text>
        </InputGroup.Prefix>
        <InputGroup.Input placeholder="12" />
        <InputGroup.Suffix>
          <Text variant="label">열</Text>
        </InputGroup.Suffix>
      </InputGroup>
      <Text tone="muted">장식과 입력을 하나의 field처럼 배치합니다.</Text>
    </View>
  ),
};
