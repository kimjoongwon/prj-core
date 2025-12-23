import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "../../data-display/Text/Text";
import { Button } from "../../inputs/Button/Button";
import { VStack } from "../../surfaces/VStack/VStack";
import { AuthLayout } from "./AuthLayout";

const meta: Meta<typeof AuthLayout> = {
	title: "Layout/AuthLayout",
	component: AuthLayout,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

// Sample form component for stories
const SampleForm = () => (
	<VStack gap={4} className="w-full">
		<Text variant="h2" className="mb-4 text-center">
			로그인
		</Text>
		<div className="space-y-4">
			<div>
				<label className="mb-1 block font-medium text-sm">이메일</label>
				<input
					type="email"
					className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="이메일을 입력하세요"
				/>
			</div>
			<div>
				<label className="mb-1 block font-medium text-sm">비밀번호</label>
				<input
					type="password"
					className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="비밀번호를 입력하세요"
				/>
			</div>
			<Button className="w-full" color="primary">
				로그인
			</Button>
		</div>
	</VStack>
);

// Sample ad component for stories
const SampleAdComponent = () => (
	<div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
		<VStack gap={4} alignItems="center" className="text-center">
			<Text variant="h3" className="text-white">
				Welcome to Our Platform
			</Text>
			<Text variant="body1" className="max-w-sm text-white/90">
				Join thousands of users who trust our secure and reliable service
			</Text>
			<div className="flex space-x-2">
				<div className="h-3 w-3 rounded-full bg-white/50"></div>
				<div className="h-3 w-3 rounded-full bg-white"></div>
				<div className="h-3 w-3 rounded-full bg-white/50"></div>
			</div>
		</VStack>
	</div>
);

export const Default: Story = {
	args: {
		formComponent: <SampleForm />,
		adComponent: <SampleAdComponent />,
	},
};

export const WithImageAd: Story = {
	args: {
		formComponent: <SampleForm />,
		adImageSrc:
			"https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=Advertisement",
		adImageAlt: "Platform advertisement",
	},
};

export const FormOnly: Story = {
	args: {
		formComponent: <SampleForm />,
	},
};

export const MinimalForm: Story = {
	args: {
		formComponent: (
			<VStack gap={3} className="w-full">
				<Text variant="h3" className="mb-2 text-center">
					Sign In
				</Text>
				<Button className="w-full" color="primary">
					Continue with Google
				</Button>
				<Button className="w-full" variant="bordered">
					Continue with Email
				</Button>
			</VStack>
		),
		adComponent: (
			<div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100">
				<Text variant="subtitle1" className="text-gray-500">
					Advertisement Space
				</Text>
			</div>
		),
	},
};
