import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../action/Button/Button";
import { Screen, Section } from "../layout";
import { VStack } from "../rhythm";
import { PageTitleBar } from "../widget/PageTitleBar";
import { ScreenSurface } from "./ScreenSurface";
import { SectionSurface } from "./SectionSurface";
import { Surface } from "./Surface";

const meta = {
	title: "Surface/OwnershipHierarchy",
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const AdminScreenHierarchy: Story = {
	render: () => (
		<div className="min-h-screen bg-background p-6 text-foreground">
			<Screen>
				<ScreenSurface>
					<VStack gap="section" fullWidth>
						<PageTitleBar
							key="title"
							title="강좌 관리"
							description="screen이 ScreenSurface, SectionSurface, layout Section을 조합합니다."
							actions={
								<Button color="primary" size="sm" variant="flat">
									강좌 추가
								</Button>
							}
						/>
						<SectionSurface key="summary">
							<Section>
								<Section.Header>
									<PageTitleBar
										level={2}
										title="요약"
										description="반복 metric은 Surface 중첩 대신 border와 배경으로 구분합니다."
									/>
								</Section.Header>
								<Section.Body>
									<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
										<div className="rounded-lg border border-border/70 bg-white p-4 dark:border-white/10 dark:bg-neutral-600">
											<p className="text-muted text-xs">운영 강좌</p>
											<p className="mt-2 text-2xl font-semibold">24</p>
										</div>
										<div className="rounded-lg border border-border/70 bg-white p-4 dark:border-white/10 dark:bg-neutral-600">
											<p className="text-muted text-xs">신청 대기</p>
											<p className="mt-2 text-2xl font-semibold">8</p>
										</div>
										<div className="rounded-lg border border-border/70 bg-white p-4 dark:border-white/10 dark:bg-neutral-600">
											<p className="text-muted text-xs">이번 달 매출</p>
											<p className="mt-2 text-2xl font-semibold">₩12.8M</p>
										</div>
									</div>
								</Section.Body>
							</Section>
						</SectionSurface>
						<SectionSurface key="operations">
							<Section>
								<Section.Header>
									<PageTitleBar
										level={2}
										title="운영 현황"
										description="feature/widget은 독립 패널이 필요할 때만 local Surface를 사용합니다."
									/>
								</Section.Header>
								<Section.Body>
									<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
										<div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
											<div className="grid grid-cols-4 gap-4 bg-neutral-50 px-4 py-3 text-muted text-xs dark:bg-neutral-600">
												<span>강좌</span>
												<span>상태</span>
												<span>수강생</span>
												<span className="text-right">매출</span>
											</div>
											<div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm">
												<span>입문자를 위한 데이터 분석</span>
												<span>운영중</span>
												<span className="text-muted">84명</span>
												<span className="text-right font-medium">₩4.2M</span>
											</div>
											<div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm">
												<span>UX 리서치 실무</span>
												<span>모집중</span>
												<span className="text-muted">31명</span>
												<span className="text-right font-medium">₩2.1M</span>
											</div>
											<div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm">
												<span>프로덕트 전략 워크숍</span>
												<span>준비중</span>
												<span className="text-muted">12명</span>
												<span className="text-right font-medium">₩940K</span>
											</div>
										</div>
										<Surface>
											<div className="flex flex-col gap-4">
												<div>
													<p className="text-sm font-semibold">위젯 패널</p>
													<p className="mt-1 text-muted text-xs">
														local Surface는 feature/widget 내부의 독립 도구
														표면입니다.
													</p>
												</div>
												<div className="rounded-lg border border-border/70 bg-white p-3 dark:border-white/10 dark:bg-neutral-600">
													<p className="text-muted text-xs">오늘 마감</p>
													<p className="mt-2 text-lg font-semibold">5건</p>
												</div>
												<Button size="sm" variant="flat">
													작업 보기
												</Button>
											</div>
										</Surface>
									</div>
								</Section.Body>
							</Section>
						</SectionSurface>
					</VStack>
				</ScreenSurface>
			</Screen>
		</div>
	),
};
