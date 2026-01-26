"use client";

import { Button, Input, Spinner } from "@heroui/react";
import { ExternalLink, Link2, RefreshCw } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";

interface FigmaEmbedProps {
	/** Figma URL */
	figmaUrl: string;
	/** URL 변경 핸들러 */
	onUrlChange: (url: string) => void;
}

/**
 * Figma URL을 임베드 URL로 변환
 */
const toEmbedUrl = (url: string): string | null => {
	if (!url) return null;

	try {
		// Figma URL 패턴 검증
		const figmaPattern =
			/^https:\/\/(www\.)?figma\.com\/(file|design|proto)\/[\w-]+/;
		if (!figmaPattern.test(url)) return null;

		return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
	} catch {
		return null;
	}
};

/**
 * Figma 임베드 컴포넌트
 */
export const FigmaEmbed = observer(
	({ figmaUrl, onUrlChange }: FigmaEmbedProps) => {
		const [inputUrl, setInputUrl] = useState(figmaUrl);
		const [isLoading, setIsLoading] = useState(false);
		const [error, setError] = useState<string | null>(null);

		const embedUrl = toEmbedUrl(figmaUrl);

		const handleConnect = () => {
			const embed = toEmbedUrl(inputUrl);
			if (embed) {
				setError(null);
				setIsLoading(true);
				onUrlChange(inputUrl);
			} else {
				setError("올바른 Figma URL을 입력해주세요");
			}
		};

		const handleKeyDown = (e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				handleConnect();
			}
		};

		const handleIframeLoad = () => {
			setIsLoading(false);
		};

		const handleRefresh = () => {
			setIsLoading(true);
			onUrlChange(figmaUrl);
		};

		const handleOpenInFigma = () => {
			if (figmaUrl) {
				window.open(figmaUrl, "_blank");
			}
		};

		return (
			<div className="flex h-full flex-col">
				{/* URL 입력 영역 */}
				<div className="flex gap-2 border-b border-divider bg-content2 p-3">
					<Input
						placeholder="Figma URL을 입력하세요..."
						size="sm"
						value={inputUrl}
						onValueChange={(value) => {
							setInputUrl(value);
							setError(null);
						}}
						onKeyDown={handleKeyDown}
						startContent={<Link2 className="size-4 text-default-400" />}
						isInvalid={!!error}
						errorMessage={error}
						classNames={{
							inputWrapper: "bg-content1",
						}}
					/>
					<Button
						size="sm"
						color="primary"
						onPress={handleConnect}
						isDisabled={!inputUrl.trim()}
					>
						연결
					</Button>
					{embedUrl && (
						<>
							<Button
								size="sm"
								variant="flat"
								isIconOnly
								onPress={handleRefresh}
							>
								<RefreshCw className="size-4" />
							</Button>
							<Button
								size="sm"
								variant="flat"
								isIconOnly
								onPress={handleOpenInFigma}
							>
								<ExternalLink className="size-4" />
							</Button>
						</>
					)}
				</div>

				{/* Figma 임베드 영역 */}
				<div className="relative flex-1 bg-content1">
					{embedUrl ? (
						<>
							{isLoading && (
								<div className="absolute inset-0 z-10 flex items-center justify-center bg-content1">
									<Spinner size="lg" label="Figma 로딩 중..." />
								</div>
							)}
							<iframe
								src={embedUrl}
								className="size-full border-0"
								allowFullScreen
								onLoad={handleIframeLoad}
								title="Figma Design"
							/>
						</>
					) : (
						<div className="flex h-full flex-col items-center justify-center gap-4 text-default-500">
							<div className="flex size-16 items-center justify-center rounded-full bg-content2">
								<Link2 className="size-8" />
							</div>
							<div className="text-center">
								<p className="font-medium">Figma 디자인 연결</p>
								<p className="mt-1 text-sm">
									상단에 Figma URL을 입력하면 디자인을 볼 수 있습니다
								</p>
							</div>
							<div className="max-w-md rounded-lg bg-content2 p-3 text-xs">
								<p className="mb-2 font-medium">지원 URL 형식:</p>
								<ul className="space-y-1 text-default-400">
									<li>• https://figma.com/file/...</li>
									<li>• https://figma.com/design/...</li>
									<li>• https://figma.com/proto/...</li>
								</ul>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	},
);
