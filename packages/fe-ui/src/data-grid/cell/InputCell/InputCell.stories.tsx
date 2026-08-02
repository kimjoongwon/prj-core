import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { InputCell } from "./InputCell";

interface ControlledInputCellArgs {
	initialValue: string | number;
	type?: "text" | "number";
	isDisabled?: boolean;
	isReadOnly?: boolean;
}

const meta = {
	title: "data-grid/cell/InputCell",
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		initialValue: "",
		type: "text",
		isDisabled: false,
		isReadOnly: false,
	},
	render: ({ initialValue, type = "text", isDisabled, isReadOnly }) => {
		const [value, setValue] = useState<string | number>(initialValue);

		return (
			<div className="w-[320px]">
				<InputCell
					aria-label="이름 입력"
					value={value}
					type={type}
					disabled={isDisabled}
					readOnly={isReadOnly}
					onValueChange={setValue}
					onFinish={() => undefined}
					onCancel={() => undefined}
				/>
				<p className="mt-2 text-xs text-gray-600">현재 값: {String(value)}</p>
			</div>
		);
	},
} satisfies Meta<ControlledInputCellArgs>;

export default meta;

type Story = StoryObj<ControlledInputCellArgs>;

export const StringValue: Story = {
	args: {
		initialValue: "입력 가능한 문자열",
	},
};

export const NumberValue: Story = {
	args: {
		initialValue: 128,
		type: "number",
	},
};

export const Disabled: Story = {
	args: {
		initialValue: "비활성 입력",
		isDisabled: true,
	},
};

export const ReadOnlyValue: Story = {
	args: {
		initialValue: "읽기 전용 값",
		isReadOnly: true,
	},
};

export const LongText: Story = {
	args: {
		initialValue:
			"매우 긴 텍스트 예시입니다. 실시간 렌더링과 넓은 입력폭에서도 값이 잘리는지 확인하기 위한 문자열입니다.",
	},
};
