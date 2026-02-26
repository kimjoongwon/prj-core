import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../../../inputs/Button/Button";
import { AIFormPreviewModal } from "./AIFormPreviewModal";

const meta: Meta<typeof AIFormPreviewModal> = {
	title: "UI/Feedback/AIFormPreviewModal",
	component: AIFormPreviewModal,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AIFormPreviewModal>;

// 기본 상태 관리를 위한 래퍼 컴포넌트
const ModalWrapper = (args: React.ComponentProps<typeof AIFormPreviewModal>) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="flex flex-col items-center gap-4">
			<Button color="primary" onPress={() => setIsOpen(true)}>
				미리보기 모달 열기
			</Button>
			<AIFormPreviewModal
				{...args}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onConfirm={(values) => {
					console.log("적용된 값:", values);
					setIsOpen(false);
				}}
			/>
		</div>
	);
};

export const Default: Story = {
	render: () => (
		<ModalWrapper
			originalValues={{ title: "", content: "", priority: "medium" }}
			aiValues={{
				title: "AI가 생성한 제목입니다",
				content: "AI가 생성한 긴 내용입니다. 이 내용은 여러 줄에 걸쳐 표시될 수 있습니다.",
				priority: "high",
			}}
			appliedFields={["title", "content", "priority"]}
			confidence={{ title: 95, content: 88, priority: 92 }}
			fieldLabels={{ title: "제목", content: "내용", priority: "우선순위" }}
		/>
	),
};

export const WithOriginalValues: Story = {
	render: () => (
		<ModalWrapper
			originalValues={{ title: "기존 제목", content: "기존 내용", priority: "low" }}
			aiValues={{
				title: "AI가 수정한 제목",
				content: "AI가 수정한 내용",
				priority: "high",
			}}
			appliedFields={["title", "content", "priority"]}
			confidence={{ title: 78, content: 65, priority: 90 }}
			fieldLabels={{ title: "제목", content: "내용", priority: "우선순위" }}
		/>
	),
};

export const Loading: Story = {
	render: () => (
		<ModalWrapper
			originalValues={{}}
			aiValues={{}}
			appliedFields={[]}
			confidence={{}}
			fieldLabels={{}}
			isLoading={true}
		/>
	),
};

export const EmptyFields: Story = {
	render: () => (
		<ModalWrapper
			originalValues={{ title: "", content: "" }}
			aiValues={{ title: "", content: "" }}
			appliedFields={[]}
			confidence={{}}
			fieldLabels={{ title: "제목", content: "내용" }}
		/>
	),
};

export const LowConfidence: Story = {
	render: () => (
		<ModalWrapper
			originalValues={{ title: "", description: "", status: "pending" }}
			aiValues={{
				title: "낮은 신뢰도 제목",
				description: "신뢰도가 낮은 AI 제안",
				status: "completed",
			}}
			appliedFields={["title", "description", "status"]}
			confidence={{ title: 45, description: 30, status: 55 }}
			fieldLabels={{ title: "제목", description: "설명", status: "상태" }}
		/>
	),
};

export const MixedConfidence: Story = {
	render: () => (
		<ModalWrapper
			originalValues={{
				field1: "",
				field2: "",
				field3: "",
				field4: "",
				field5: "",
			}}
			aiValues={{
				field1: "높은 신뢰도",
				field2: "중간 신뢰도",
				field3: "낮은 신뢰도",
				field4: "매우 높은 신뢰도",
				field5: "중간 낮은 신뢰도",
			}}
			appliedFields={["field1", "field2", "field3", "field4", "field5"]}
			confidence={{
				field1: 95,
				field2: 65,
				field3: 35,
				field4: 99,
				field5: 55,
			}}
			fieldLabels={{
				field1: "필드 1",
				field2: "필드 2",
				field3: "필드 3",
				field4: "필드 4",
				field5: "필드 5",
			}}
		/>
	),
};

export const BooleanFields: Story = {
	render: () => (
		<ModalWrapper
			originalValues={{
				isActive: false,
				isPublished: true,
				allowComments: false,
			}}
			aiValues={{
				isActive: true,
				isPublished: true,
				allowComments: true,
			}}
			appliedFields={["isActive", "isPublished", "allowComments"]}
			confidence={{ isActive: 90, isPublished: 85, allowComments: 70 }}
			fieldLabels={{
				isActive: "활성화",
				isPublished: "게시됨",
				allowComments: "댓글 허용",
			}}
		/>
	),
};

export const LongContent: Story = {
	render: () => (
		<ModalWrapper
			originalValues={{
				title: "",
				summary: "",
				description: "",
			}}
			aiValues={{
				title: "AI 생성 프로젝트 제안서",
				summary:
					"이 프로젝트는 AI를 활용하여 업무 효율성을 극대화하는 것을 목표로 합니다.",
				description:
					"AI 기술을 도입하여 반복적인 업무를 자동화하고, 데이터 분석을 통해 의사결정을 지원하며, 고객 서비스 품질을 향상시키는 종합적인 솔루션을 제공합니다. 이 프로젝트는 총 3단계로 진행되며, 각 단계별로 명확한 목표와 성과 지표를 설정하여 진행 상황을 모니터링할 수 있습니다.",
			}}
			appliedFields={["title", "summary", "description"]}
			confidence={{ title: 98, summary: 92, description: 85 }}
			fieldLabels={{
				title: "제목",
				summary: "요약",
				description: "상세 설명",
			}}
		/>
	),
};
