import type { Meta, StoryObj } from "@storybook/react";
import { IdpConsoleSecurityPolicyPage } from "./IdpConsoleSecurityPolicyPage";

const defaultArgs = {
  "formState": {
  "accessTokenTtlSec": 15,
  "passwordExpirationDays": 15,
  "passwordMinLength": 15,
  "passwordRequireLowercase": false,
  "passwordRequireNumber": false,
  "passwordRequireSpecial": false,
  "passwordRequireUppercase": false,
  "passwordReuseLimit": 15,
  "permanentLockThreshold": 15,
  "refreshTokenTtlSec": 15,
  "sessionTtlSec": 15,
  "temporaryLockDurationMin": 15,
  "temporaryLockThreshold": 15,
},
  "isSaveSuccess": false,
  "isSaving": false,
  "onChangeBooleanField": (..._args: never[]) => undefined,
  "onChangeNumberField": (..._args: never[]) => undefined,
  "onSubmit": (..._args: never[]) => undefined,
};

const busyArgs = {
  ...defaultArgs,
  "isSaving": true,
};

const meta = {
  component: IdpConsoleSecurityPolicyPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: defaultArgs as never,
} satisfies Meta<typeof IdpConsoleSecurityPolicyPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
  args: busyArgs as never,
};
