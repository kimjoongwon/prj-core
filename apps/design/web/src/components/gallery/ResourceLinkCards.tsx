import { BookOpen, ExternalLink, Figma } from "lucide-react";
import type { ReactNode } from "react";

export interface DesignResourceLink {
	id: string;
	title: string;
	description: string;
	url: string;
	icon: ReactNode;
}

const designResourceLinks: DesignResourceLink[] = [
	{
		id: "heroui-figma-kit",
		title: "HeroUI Figma Kit v3",
		description:
			"모든 v3 컴포넌트를 1:1로 담은 공식 피그마 킴. Figma 변수가 코드 토큰과 대응합니다.",
		url: "https://www.figma.com/community/file/1546526812159103429/heroui-figma-kit-v3",
		icon: <Figma className="size-5" aria-hidden />,
	},
	{
		id: "storybook",
		title: "스토리북",
		description:
			"구성요소별 스토리와 사용 예시 모음 — onjitda.com/story 에서 서비스 중입니다.",
		url: "https://onjitda.com/story/",
		icon: <BookOpen className="size-5" aria-hidden />,
	},
];

/** 갤러리 상단의 참고 자료 링크 카드입니다. 토큰 기반 스타일이라 톤앤매너와 함께 변합니다. */
export default function ResourceLinkCards() {
	return (
		<div className="mt-6 grid gap-3 sm:grid-cols-2">
			{designResourceLinks.map((resourceLink) => (
				<a
					key={resourceLink.id}
					href={resourceLink.url}
					target="_blank"
					rel="noreferrer"
					className="group flex items-start gap-4 rounded-xl border border-border bg-surface p-5 shadow-surface transition-colors hover:bg-surface-hover"
				>
					<span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-default">
						{resourceLink.icon}
					</span>
					<span className="min-w-0 flex-1">
						<span className="flex items-center gap-1.5 text-sm font-semibold">
							{resourceLink.title}
							<ExternalLink
								className="size-3.5 text-muted"
								aria-hidden
							/>
						</span>
						<span className="mt-1 block text-xs leading-5 text-muted">
							{resourceLink.description}
						</span>
					</span>
				</a>
			))}
		</div>
	);
}
