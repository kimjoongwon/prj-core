import type { Meta, StoryObj } from "@storybook/react";
import { VisibilityCell } from "./VisibilityCell";

const meta: Meta<typeof VisibilityCell> = {
	title: "Ui/permission/VisibilityCell",
	component: VisibilityCell,
	tags: ["autodocs"],
	argTypes: {
		status: {
			control: "select",
			options: ["full", "masked", "hidden"],
			description: "가시성 상태",
		},
		fieldName: {
			control: "text",
			description: "필드 이름 (툴팁에 표시)",
		},
		roleName: {
			control: "text",
			description: "역할 이름 (툴팁에 표시)",
		},
		editable: {
			control: "boolean",
			description: "편집 가능 여부",
		},
		onStatusChange: {
			action: "statusChanged",
			description: "상태 변경 콜백",
		},
	},
};

export default meta;
type Story = StoryObj<typeof VisibilityCell>;

/**
 * 전체 공개 상태
 */
export const Full: Story = {
	args: {
		status: "full",
	},
};

/**
 * 부분 마스킹 상태
 */
export const Masked: Story = {
	args: {
		status: "masked",
	},
};

/**
 * 숨김 상태
 */
export const Hidden: Story = {
	args: {
		status: "hidden",
	},
};

/**
 * 필드 및 역할 정보와 함께 표시
 */
export const WithContext: Story = {
	args: {
		status: "masked",
		fieldName: "이메일",
		roleName: "일반 사용자",
	},
};

/**
 * 편집 가능 모드 - 클릭하여 상태 변경
 */
export const Editable: Story = {
	args: {
		status: "full",
		fieldName: "전화번호",
		roleName: "매니저",
		editable: true,
	},
};

/**
 * 모든 상태 비교
 */
export const AllStates: Story = {
	render: () => (
		<div className="flex gap-4 items-center">
			<VisibilityCell status="full" />
			<VisibilityCell status="masked" />
			<VisibilityCell status="hidden" />
		</div>
	),
};

/**
 * 테이블 셀에서 사용 예시
 */
export const InTableContext: Story = {
	render: () => (
		<table className="w-full border-collapse">
			<thead>
				<tr className="border-b border-border">
					<th className="p-2 text-left text-sm font-medium">필드</th>
					<th className="p-2 text-left text-sm font-medium">관리자</th>
					<th className="p-2 text-left text-sm font-medium">매니저</th>
					<th className="p-2 text-left text-sm font-medium">일반 사용자</th>
				</tr>
			</thead>
			<tbody>
				<tr className="border-b border-border">
					<td className="p-2 text-sm">이름</td>
					<td className="p-2">
						<VisibilityCell status="full" fieldName="이름" roleName="관리자" />
					</td>
					<td className="p-2">
						<VisibilityCell status="full" fieldName="이름" roleName="매니저" />
					</td>
					<td className="p-2">
						<VisibilityCell
							status="full"
							fieldName="이름"
							roleName="일반 사용자"
						/>
					</td>
				</tr>
				<tr className="border-b border-border">
					<td className="p-2 text-sm">이메일</td>
					<td className="p-2">
						<VisibilityCell
							status="full"
							fieldName="이메일"
							roleName="관리자"
						/>
					</td>
					<td className="p-2">
						<VisibilityCell
							status="masked"
							fieldName="이메일"
							roleName="매니저"
						/>
					</td>
					<td className="p-2">
						<VisibilityCell
							status="hidden"
							fieldName="이메일"
							roleName="일반 사용자"
						/>
					</td>
				</tr>
				<tr className="border-b border-border">
					<td className="p-2 text-sm">전화번호</td>
					<td className="p-2">
						<VisibilityCell
							status="full"
							fieldName="전화번호"
							roleName="관리자"
						/>
					</td>
					<td className="p-2">
						<VisibilityCell
							status="masked"
							fieldName="전화번호"
							roleName="매니저"
						/>
					</td>
					<td className="p-2">
						<VisibilityCell
							status="hidden"
							fieldName="전화번호"
							roleName="일반 사용자"
						/>
					</td>
				</tr>
			</tbody>
		</table>
	),
};
