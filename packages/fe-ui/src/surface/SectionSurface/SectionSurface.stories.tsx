import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../action/Button/Button";
import { VStack } from "../../rhythm";
import { PageTitleBar } from "../../widget/PageTitleBar";
import { SectionSurface } from "./SectionSurface";

const meta: Meta<typeof SectionSurface> = {
	title: "Surface/SectionSurface",
	component: SectionSurface,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: <div className="text-muted text-sm">기본 섹션 표면입니다.</div>,
	},
};

export const Titled: Story = {
	render: () => (
		<SectionSurface
			top={
				<PageTitleBar
					level={2}
					title="기본 정보"
					description="SectionSurface가 자체 슬롯을 받아 화면 구역을 구성합니다."
					actions={
						<Button size="sm" variant="flat">
							편집
						</Button>
					}
				/>
			}
		>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<p className="text-muted text-sm">이름</p>
					<p className="mt-1 font-medium">홍길동</p>
				</div>
				<div>
					<p className="text-muted text-sm">이메일</p>
					<p className="mt-1 font-medium">hong@example.com</p>
				</div>
			</div>
		</SectionSurface>
	),
};

export const ScreenSections: Story = {
	render: () => (
		<VStack gap="section" fullWidth>
			<PageTitleBar
				key="title"
				title="결제 관리"
				description="PageTitleBar는 SectionSurface 밖의 screen rhythm에 둡니다."
				actions={
					<Button color="primary" size="sm" variant="flat">
						새로고침
					</Button>
				}
			/>
			<SectionSurface
				key="filters"
				top={<PageTitleBar level={2} title="검색 조건" />}
				bottom={
					<div className="flex justify-end">
						<Button size="sm" variant="flat">
							검색
						</Button>
					</div>
				}
			>
				<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
					<div className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm">
						전체 상태
					</div>
					<div className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm">
						최근 30일
					</div>
					<div className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm">
						결제자 검색
					</div>
				</div>
			</SectionSurface>
			<SectionSurface
				key="list"
				top={<PageTitleBar level={2} title="결제 목록" />}
			>
				<div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
					<div className="grid grid-cols-4 gap-4 bg-background/60 px-4 py-3 text-muted text-xs">
						<span>결제자</span>
						<span>상태</span>
						<span>수단</span>
						<span className="text-right">금액</span>
					</div>
					<div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm">
						<span>김하나</span>
						<span>완료</span>
						<span className="text-muted">카드</span>
						<span className="text-right font-medium">₩120,000</span>
					</div>
					<div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm">
						<span>박도윤</span>
						<span>대기</span>
						<span className="text-muted">계좌 이체</span>
						<span className="text-right font-medium">₩86,000</span>
					</div>
				</div>
			</SectionSurface>
		</VStack>
	),
};
