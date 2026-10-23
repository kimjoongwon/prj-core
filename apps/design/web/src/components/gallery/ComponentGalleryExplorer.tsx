"use client";

import Link from "next/link";
import { Button } from "@cocrepo/ui";
import { Palette, X } from "lucide-react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { ToneMannerPanel } from "@/components/tone-manner/ToneMannerPanel";
import { useIsWideViewport } from "@/hooks/useIsWideViewport";
import ButtonSection from "./sections/ButtonSection";
import DataDisplaySection from "./sections/DataDisplaySection";
import DataGridSection from "./sections/DataGridSection";
import FeedbackSection from "./sections/FeedbackSection";
import FormInputSection from "./sections/FormInputSection";
import OverlaySection from "./sections/OverlaySection";
import SurfaceRhythmSection from "./sections/SurfaceRhythmSection";

const gallerySectionLinks = [
	{ id: "buttons", label: "버튼" },
	{ id: "form-inputs", label: "입력·선택" },
	{ id: "data-display", label: "데이터 표시" },
	{ id: "feedback", label: "피드백" },
	{ id: "surface-rhythm", label: "표면·리듬" },
	{ id: "overlay", label: "오버레이" },
	{ id: "data-grid", label: "DataGrid" },
];

export function createComponentGalleryExplorerState() {
	const state = {
		isToneMannerDrawerOpen: false,

		openToneMannerDrawer() {
			state.isToneMannerDrawerOpen = true;
		},
		closeToneMannerDrawer() {
			state.isToneMannerDrawerOpen = false;
		},
	};

	return makeAutoObservable(
		state,
		{},
		{ autoBind: true, name: "ComponentGalleryExplorerState" },
	);
}

export type ComponentGalleryExplorerState = ReturnType<
	typeof createComponentGalleryExplorerState
>;

const ComponentGalleryExplorer = observer(function ComponentGalleryExplorer() {
	const explorerState = useLocalObservable(createComponentGalleryExplorerState);
	const isWideViewport = useIsWideViewport();

	return (
		<div className="min-h-dvh bg-background text-foreground">
			<header className="mx-auto max-w-7xl px-5 pt-12 pb-8 sm:px-8">
				<p className="text-sm font-medium tracking-wide text-accent">
					PLATE UI KIT
				</p>
				<div className="mt-3 flex flex-wrap items-end justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
							UI 구성요소 갤러리
						</h1>
						<p className="mt-3 max-w-2xl text-base leading-7 text-muted">
							@cocrepo/ui의 구성요소를 화면(screen) 제외하고 나열했습니다.
							패널에서 토큰을 바꾸면 선택한 톤앤매너가 페이지 전체에 즉시
							적용됩니다. 화면이 좁을 때는 오른쪽 아래 버튼으로 패널을 여세요.
						</p>
					</div>
					<Link
						href="/"
						className="text-sm font-medium text-accent hover:underline"
					>
						← 링크 아카이브로
					</Link>
				</div>
				<nav
					aria-label="갤러리 섹션"
					className="mt-6 flex flex-wrap gap-1.5"
				>
					{gallerySectionLinks.map((sectionLink) => (
						<a
							key={sectionLink.id}
							href={`#${sectionLink.id}`}
							className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium hover:bg-surface-hover"
						>
							{sectionLink.label}
						</a>
					))}
				</nav>
			</header>
			<div className="mx-auto flex max-w-7xl items-start gap-8 px-5 pb-24 sm:px-8">
				<div className="flex min-w-0 flex-1 flex-col gap-8">
					<ButtonSection />
					<FormInputSection />
					<DataDisplaySection />
					<FeedbackSection />
					<SurfaceRhythmSection />
					<OverlaySection />
					<DataGridSection />
				</div>
				{isWideViewport ? (
					<aside className="sticky top-6 w-80 shrink-0">
						<div className="max-h-[calc(100dvh-3rem)] overflow-y-auto pr-1">
							<ToneMannerPanel />
						</div>
					</aside>
				) : null}
			</div>
			{isWideViewport ? null : (
				<>
					<Button
						variant="primary"
						startContent={<Palette className="size-4" aria-hidden />}
						onPress={explorerState.openToneMannerDrawer}
						aria-expanded={explorerState.isToneMannerDrawerOpen}
						className="fixed right-5 bottom-5 z-30 shadow-lg"
					>
						톤앤매너 패널
					</Button>
					{explorerState.isToneMannerDrawerOpen ? (
						<div
							className="fixed inset-0 z-40"
							role="dialog"
							aria-modal="true"
							aria-label="톤앤매너 토큰 패널"
						>
							<button
								type="button"
								aria-label="패널 닫기"
								onClick={explorerState.closeToneMannerDrawer}
								className="absolute inset-0 bg-black/40"
							/>
							<div className="absolute inset-y-0 right-0 flex w-[22rem] max-w-[92vw] flex-col border-l border-border bg-surface shadow-xl">
								<div className="flex justify-end border-b border-border p-3">
									<Button
										variant="ghost"
										isIconOnly
										size="sm"
										aria-label="패널 닫기"
										onPress={explorerState.closeToneMannerDrawer}
									>
										<X className="size-4" aria-hidden />
									</Button>
								</div>
								<div className="flex-1 overflow-y-auto p-3">
									<ToneMannerPanel />
								</div>
							</div>
						</div>
					) : null}
				</>
			)}
		</div>
	);
});

export default ComponentGalleryExplorer;
