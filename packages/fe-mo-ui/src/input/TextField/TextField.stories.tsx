import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView } from "react-native";
import { Text } from "../../data-display/Text";
import { VStack } from "../../rhythm";
import { Input } from "../Input";
import { TextField } from "./index";

const state = observable({
  email: "hello@example.com",
});

const meta = {
  title: "input/TextField",
  component: TextField,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <ScrollView contentContainerClassName="gap-3 px-4 py-5">
      <VStack gap="dense">
        <Text variant="heading">TextField</Text>
        <Text tone="muted">
          HeroUI Native의 TextField, Label, Input, Description, FieldError
          조합을 그대로 노출합니다.
        </Text>
      </VStack>
      <TextField isRequired>
        <TextField.Label>이메일</TextField.Label>
        <Input path="email" placeholder="hello@example.com" state={state} />
        <TextField.Description>
          예약 알림과 영수증을 받을 이메일입니다.
        </TextField.Description>
      </TextField>
      <TextField isInvalid>
        <TextField.Label>이메일</TextField.Label>
        <Input path="email" placeholder="hello@example.com" state={state} />
        <TextField.FieldError>
          이메일 형식이 올바르지 않습니다.
        </TextField.FieldError>
      </TextField>
    </ScrollView>
  ),
};
