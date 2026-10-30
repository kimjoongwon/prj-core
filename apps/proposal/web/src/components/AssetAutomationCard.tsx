"use client";

import Image from "next/image";
import { Chip, HStack, Typography, VStack } from "@cocrepo/ui";
import { Card } from "@heroui/react";
import {
	assetAutomationFramework,
	type AssetSellingPointIcon,
} from "../data/asset-automation";

const SELLING_POINT_EMOJIS: Record<AssetSellingPointIcon, string> = {
	batch: "🗂️",
	styleLock: "🔒",
	fastIteration: "⚡",
	designerFocus: "🎯",
};

// next/image와 달리 일반 <a>에는 basePath가 붙지 않아 경로에 직접 반영
const PROPOSAL_BASE_PATH = "/proposal";

export function AssetAutomationCard() {
	const { screenshot } = assetAutomationFramework;
	const fullScreenshotHref = `${PROPOSAL_BASE_PATH}${screenshot.src}`;

	return (
		<Card className="w-full border-2 border-accent bg-accent-soft p-5">
			<VStack gap="section" alignItems="start" fullWidth>
				<HStack gap="block" alignItems="center" fullWidth>
					<span className="shrink-0 text-2xl leading-none" aria-hidden="true">🪄</span>
					<VStack gap="flush" alignItems="start">
						<Typography.Heading level={4}>
							{assetAutomationFramework.title}
						</Typography.Heading>
						<Typography.Paragraph size="xs" color="muted">
							{assetAutomationFramework.badge}
						</Typography.Paragraph>
					</VStack>
				</HStack>

				<VStack gap="dense" alignItems="start" fullWidth>
					<Typography.Paragraph size="sm" className="font-bold">
						{assetAutomationFramework.headline}
					</Typography.Paragraph>
					<Typography.Paragraph size="sm" color="muted">
						{assetAutomationFramework.description}
					</Typography.Paragraph>
				</VStack>

				<div className="grid w-full gap-4 md:grid-cols-2">
					<VStack gap="section" alignItems="start">
						{assetAutomationFramework.sellingPoints.map((point) => {
							const pointEmoji = SELLING_POINT_EMOJIS[point.icon];
							return (
								<HStack key={point.name} gap="inline" alignItems="start">
										<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-base leading-none" aria-hidden="true">
											{pointEmoji}
										</span>
									<VStack gap="flush" alignItems="start">
										<Typography.Paragraph size="sm" className="font-bold">
											{point.name}
										</Typography.Paragraph>
										<Typography.Paragraph size="xs" color="muted">
											{point.detail}
										</Typography.Paragraph>
									</VStack>
								</HStack>
							);
						})}
					</VStack>

					<VStack gap="inline" alignItems="start">
						<figure className="w-full">
							<a
								href={fullScreenshotHref}
								target="_blank"
								rel="noopener noreferrer"
								className="block overflow-hidden rounded-lg border border-separator bg-surface"
							>
								<Image
									src={screenshot.src}
									alt={screenshot.alt}
									width={screenshot.width}
									height={screenshot.height}
									sizes="(max-width: 768px) 100vw, 50vw"
									className="h-auto w-full"
								/>
							</a>
							<figcaption className="mt-2">
								<Typography.Paragraph size="xs" color="muted">
									{screenshot.caption}
								</Typography.Paragraph>
							</figcaption>
						</figure>
						<VStack gap="dense" alignItems="start" fullWidth>
							<Typography.Paragraph size="xs" className="font-semibold">
								자동 생산 대상
							</Typography.Paragraph>
							<HStack gap="inline" className="flex-wrap">
								{assetAutomationFramework.deliverables.map((deliverable) => (
									<Chip key={deliverable} size="sm" variant="soft" color="accent">
										{deliverable}
									</Chip>
								))}
							</HStack>
						</VStack>
					</VStack>
				</div>

				<VStack gap="dense" alignItems="start" fullWidth>
					<Typography.Paragraph size="xs" className="font-semibold">
						생성 파이프라인
					</Typography.Paragraph>
					<div className="grid w-full gap-3 md:grid-cols-4">
						{assetAutomationFramework.pipelineStages.map((stage) => (
							<div
								key={stage.stepOrder}
								className="rounded-lg bg-surface-secondary p-3"
							>
								<HStack gap="inline" alignItems="center">
									<span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
										{stage.stepOrder}
									</span>
									<Typography.Paragraph size="sm" className="font-bold">
										{stage.name}
									</Typography.Paragraph>
								</HStack>
								<Typography.Paragraph size="xs" color="muted">
									{stage.detail}
								</Typography.Paragraph>
							</div>
						))}
					</div>
				</VStack>
			</VStack>
		</Card>
	);
}
