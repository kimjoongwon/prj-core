"use client";

import { Typography } from "@cocrepo/ui";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { MomoAvatarErrorBoundary } from "./MomoAvatarErrorBoundary";
import { MomoAvatarPoster } from "./MomoAvatarPoster";
import { MOMO_MOTION_LABELS, type MomoAvatarPlaybackProps } from "./momoAvatar";

export function createMomoAvatarPanelState({
	onReady,
}: {
	onReady: () => void;
}) {
	return makeAutoObservable(
		{
			isInitialized: false,
			isReducedMotion: true,
			isDocumentVisible: true,
			isInViewport: false,
			isModelReady: false,
			isUnavailable: false,
			get shouldLoadCanvas() {
				return (
					this.isInitialized &&
					!this.isReducedMotion &&
					!this.isUnavailable &&
					(this.isInViewport || this.isModelReady)
				);
			},
			get isPlaying() {
				return (
					this.shouldLoadCanvas && this.isDocumentVisible && this.isInViewport
				);
			},
			initializeRuntime(isReducedMotion: boolean, isDocumentVisible: boolean) {
				this.isReducedMotion = isReducedMotion;
				this.isDocumentVisible = isDocumentVisible;
				this.isInitialized = true;
			},
			applyReducedMotion(isReducedMotion: boolean) {
				this.isReducedMotion = isReducedMotion;
			},
			applyDocumentVisibility(isDocumentVisible: boolean) {
				this.isDocumentVisible = isDocumentVisible;
			},
			applyViewportVisibility(isInViewport: boolean) {
				this.isInViewport = isInViewport;
			},
			markModelReady() {
				if (this.isModelReady) return;
				this.isModelReady = true;
				onReady();
			},
			markUnavailable() {
				this.isUnavailable = true;
			},
		},
		{},
		{ autoBind: true, name: "MomoAvatarPanelState" },
	);
}

export type MomoAvatarPanelState = ReturnType<
	typeof createMomoAvatarPanelState
>;

export type MomoAvatarPanelProps = Omit<
	MomoAvatarPlaybackProps,
	"isPlaying" | "onUnavailable"
> & { presentation?: "panel" | "compact" };

const MomoAvatarCanvas = dynamic(
	() => import("./MomoAvatarCanvas").then((module) => module.MomoAvatarCanvas),
	{ ssr: false },
);

export const MomoAvatarPanel = observer(function MomoAvatarPanel({
	motion,
	playbackId,
	onReady,
	onOneShotFinished,
	presentation = "panel",
}: MomoAvatarPanelProps) {
	const momoAvatarPanelState = useLocalObservable(() =>
		createMomoAvatarPanelState({ onReady }),
	);
	const viewportRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const motionPreference = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		);
		const refreshMotionPreference = () =>
			momoAvatarPanelState.applyReducedMotion(motionPreference.matches);
		const refreshDocumentVisibility = () =>
			momoAvatarPanelState.applyDocumentVisibility(!document.hidden);
		momoAvatarPanelState.initializeRuntime(
			motionPreference.matches,
			!document.hidden,
		);
		motionPreference.addEventListener("change", refreshMotionPreference);
		document.addEventListener("visibilitychange", refreshDocumentVisibility);
		const viewportObserver =
			typeof IntersectionObserver === "undefined"
				? null
				: new IntersectionObserver(([viewportEntry]) => {
						momoAvatarPanelState.applyViewportVisibility(
							viewportEntry?.isIntersecting ?? false,
						);
					});
		if (viewportObserver && viewportRef.current) {
			viewportObserver.observe(viewportRef.current);
		} else {
			momoAvatarPanelState.applyViewportVisibility(true);
		}
		return () => {
			motionPreference.removeEventListener("change", refreshMotionPreference);
			document.removeEventListener(
				"visibilitychange",
				refreshDocumentVisibility,
			);
			viewportObserver?.disconnect();
		};
	}, [momoAvatarPanelState]);

	return (
		<figure
			className={
				presentation === "compact"
					? "m-0 flex min-w-0 items-center gap-3"
					: "m-0 flex w-full flex-col items-center gap-2"
			}
		>
			<div
				ref={viewportRef}
				aria-hidden="true"
				className={
					presentation === "compact"
						? "relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-accent/5"
						: "relative h-[200px] w-full max-w-[280px] overflow-hidden rounded-xl bg-accent/5 lg:h-[240px]"
				}
			>
				{!momoAvatarPanelState.shouldLoadCanvas ||
				!momoAvatarPanelState.isModelReady ? (
					<MomoAvatarPoster />
				) : null}
				{momoAvatarPanelState.shouldLoadCanvas ? (
					<MomoAvatarErrorBoundary
						onUnavailable={momoAvatarPanelState.markUnavailable}
					>
						<MomoAvatarCanvas
							motion={motion}
							playbackId={playbackId}
							isPlaying={momoAvatarPanelState.isPlaying}
							onReady={momoAvatarPanelState.markModelReady}
							onUnavailable={momoAvatarPanelState.markUnavailable}
							onOneShotFinished={onOneShotFinished}
						/>
					</MomoAvatarErrorBoundary>
				) : null}
			</div>
			<figcaption
				className={
					presentation === "compact" ? "min-w-0 text-left" : "text-center"
				}
			>
				<Typography.Paragraph className="text-sm font-semibold">
					MOMO
				</Typography.Paragraph>
				<output className="block text-xs text-foreground/60">
					{MOMO_MOTION_LABELS[motion]}
				</output>
			</figcaption>
		</figure>
	);
});

MomoAvatarPanel.displayName = "MomoAvatarPanel";
