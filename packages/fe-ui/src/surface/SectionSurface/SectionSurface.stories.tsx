import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../action/Button/Button";
import { Section } from "../../layout";
import { VStack } from "../../rhythm";
import { PageTitleBar } from "../../widget/PageTitleBar";
import { SectionSurface } from "./SectionSurface";

const meta: Meta<typeof SectionSurface> = {
	title: "surface/SectionSurface",
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
		children: (
			<Section>
				<Section.Body>
					<div className="text-sm text-muted">
						layout/Section을 감싸는 section-level 표면입니다.
					</div>
				</Section.Body>
			</Section>
		),
	},
};

export const TitledSection: Story = {
	render: () => (
		<SectionSurface>
			<Section>
				<Section.Header>
					<PageTitleBar
						level={2}
						title="기본 정보"
						description="제목과 본문 구조는 Section이, 시각 표면은 SectionSurface가 담당합니다."
						actions={
							<Button size="sm" variant="flat">
								편집
							</Button>
						}
					/>
				</Section.Header>
				<Section.Body>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<p className="text-sm text-muted">이름</p>
							<p className="mt-1 font-medium">홍길동</p>
						</div>
						<div>
							<p className="text-sm text-muted">이메일</p>
							<p className="mt-1 font-medium">hong@example.com</p>
						</div>
					</div>
				</Section.Body>
			</Section>
		</SectionSurface>
	),
};

export const ScreenSections: Story = {
	render: () => (
		<VStack fullWidth>
			<PageTitleBar
				title="결제 관리"
				description="PageTitleBar는 screen rhythm에 두고, 각 주요 구획은 SectionSurface로 감쌉니다."
				actions={
					<Button color="primary" size="sm" variant="flat">
						새로고침
					</Button>
				}
			/>
			<SectionSurface>
				<Section>
					<Section.Header>
						<PageTitleBar level={2} title="검색 조건" />
					</Section.Header>
					<Section.Body>
						<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
							<div className="rounded-lg border border-border/70 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-600">
								전체 상태
							</div>
							<div className="rounded-lg border border-border/70 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-600">
								최근 30일
							</div>
							<div className="rounded-lg border border-border/70 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-600">
								결제자 검색
							</div>
						</div>
					</Section.Body>
					<Section.Footer>
						<div className="flex justify-end">
							<Button size="sm" variant="flat">
								검색
							</Button>
						</div>
					</Section.Footer>
				</Section>
			</SectionSurface>
			<SectionSurface className="overflow-hidden">
				<Section overflow="hidden">
					<Section.Body>
						<div className="divide-y divide-border">
							<div className="grid grid-cols-4 gap-4 bg-neutral-50 px-4 py-3 text-xs text-muted dark:bg-neutral-600">
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
					</Section.Body>
				</Section>
			</SectionSurface>
		</VStack>
	),
};
