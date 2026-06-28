import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../action/Button/Button";
import { Screen, Section } from "../../layout";
import { VStack } from "../../rhythm";
import { PageTitleBar } from "../../widget/PageTitleBar";
import { SectionSurface } from "../SectionSurface";
import { ScreenSurface } from "./ScreenSurface";

const meta: Meta<typeof ScreenSurface> = {
	title: "Surface/ScreenSurface",
	component: ScreenSurface,
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
			<div className="text-muted text-sm">
				ScreenSurface는 screen boundary가 소유하는 가장 바깥 본문 표면입니다.
			</div>
		),
	},
};
export const ScreenOwnedHierarchy: Story = {
	render: () => (
		<Screen>
			<ScreenSurface>
				<VStack gap="section" fullWidth>
					<PageTitleBar
						key="title"
						title="에셋 관리"
						description="screen rhythm 안에서 타이틀과 SectionSurface를 배치합니다."
						actions={
							<Button size="sm" variant="flat" color="primary">
								업로드
							</Button>
						}
					/>
					<SectionSurface key="queue">
						<Section>
							<Section.Header>
								<PageTitleBar
									level={2}
									title="업로드 대기열"
									description="section의 시각 표면은 SectionSurface가 담당합니다."
								/>
							</Section.Header>
							<Section.Body>
								<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
									<div className="rounded-lg border border-border/70 bg-white p-4 dark:border-white/10 dark:bg-neutral-600">
										<p className="text-xs text-muted">대기</p>
										<p className="mt-2 text-xl font-semibold">12개</p>
									</div>
									<div className="rounded-lg border border-border/70 bg-white p-4 dark:border-white/10 dark:bg-neutral-600">
										<p className="text-xs text-muted">완료</p>
										<p className="mt-2 text-xl font-semibold">48개</p>
									</div>
									<div className="rounded-lg border border-border/70 bg-white p-4 dark:border-white/10 dark:bg-neutral-600">
										<p className="text-xs text-muted">실패</p>
										<p className="mt-2 text-xl font-semibold">1개</p>
									</div>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			</ScreenSurface>
		</Screen>
	),
};
export const MultipleScreenSections: Story = {
	render: () => (
		<ScreenSurface>
			<VStack gap="section" fullWidth>
				<PageTitleBar
					key="title"
					title="문의 생성"
					description="하나의 screen은 여러 SectionSurface를 가질 수 있습니다."
					actions={
						<Button size="sm" variant="flat" color="primary">
							저장
						</Button>
					}
				/>
				<SectionSurface key="basic">
					<Section>
						<Section.Header>
							<PageTitleBar level={2} title="기본 정보" />
						</Section.Header>
						<Section.Body>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<label className="flex flex-col gap-2 text-sm">
									<span className="text-muted">제목</span>
									<span className="rounded-lg border border-border/70 bg-white px-3 py-2 dark:border-white/10 dark:bg-neutral-600">
										환불 요청 문의
									</span>
								</label>
								<label className="flex flex-col gap-2 text-sm">
									<span className="text-muted">분류</span>
									<span className="rounded-lg border border-border/70 bg-white px-3 py-2 dark:border-white/10 dark:bg-neutral-600">
										결제
									</span>
								</label>
							</div>
						</Section.Body>
					</Section>
				</SectionSurface>
				<SectionSurface key="body">
					<Section>
						<Section.Header>
							<PageTitleBar level={2} title="본문" />
						</Section.Header>
						<Section.Body>
							<div className="min-h-28 rounded-lg border border-border/70 bg-white p-4 text-sm text-muted dark:border-white/10 dark:bg-neutral-600">
								결제 취소 후 환불 상태를 확인하고 싶습니다.
							</div>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		</ScreenSurface>
	),
};
