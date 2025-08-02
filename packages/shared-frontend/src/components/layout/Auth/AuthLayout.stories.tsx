import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../ui/Button/Button";
import { Text } from "../../ui/Text/Text";
import { VStack } from "../../ui/VStack/VStack";
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
		<Text variant="h2" className="text-center mb-4">
			로그인
		</Text>
		<div className="space-y-4">
			<div>
				<label className="block text-sm font-medium mb-1">이메일</label>
				<input
					type="email"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="이메일을 입력하세요"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium mb-1">비밀번호</label>
				<input
					type="password"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
	<div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white rounded-lg">
		<VStack gap={4} alignItems="center" className="text-center">
			<Text variant="h3" className="text-white">
				Welcome to Our Platform
			</Text>
			<Text variant="body1" className="text-white/90 max-w-sm">
				Join thousands of users who trust our secure and reliable service
			</Text>
			<div className="flex space-x-2">
				<div className="w-3 h-3 bg-white/50 rounded-full"></div>
				<div className="w-3 h-3 bg-white rounded-full"></div>
				<div className="w-3 h-3 bg-white/50 rounded-full"></div>
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
				<Text variant="h3" className="text-center mb-2">
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
			<div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
				<Text variant="subtitle1" className="text-gray-500">
					Advertisement Space
				</Text>
			</div>
		),
	},
};
