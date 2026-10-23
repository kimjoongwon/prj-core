import Link from "next/link";
import DesignLinkDirectory from "@/components/DesignLinkDirectory";
import {
	designCurationRounds,
	designLinkCategories,
	designLinksLastUpdatedAt,
	retiredDesignLinks,
} from "@/data/design-links";

export default function DesignArchivePage() {
	const totalLinkCount = designLinkCategories.reduce(
		(sum, category) => sum + category.links.length,
		0,
	);

	return (
		<main className="mx-auto max-w-5xl px-5 pb-24 sm:px-8">
			<header className="pt-14 pb-10">
				<p className="text-sm font-medium tracking-wide text-blue-600">
					DESIGN LINK ARCHIVE
				</p>
				<h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
					디자인 감각 기르기 자료 모음
				</h1>
				<p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
					사이트를 직접 찾아다니며 접속 검증한 레퍼런스만 모았습니다. 살아있는
					서비스는 분야별로 쌓고, 폐업·방치된 곳은 제외 이력으로 남깁니다.
				</p>
				<dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm">
					<div className="flex items-baseline gap-2">
						<dt className="text-zinc-500">링크</dt>
						<dd className="text-xl font-semibold text-zinc-900">
							{totalLinkCount}개
						</dd>
					</div>
					<div className="flex items-baseline gap-2">
						<dt className="text-zinc-500">분야</dt>
						<dd className="text-xl font-semibold text-zinc-900">
							{designLinkCategories.length}개
						</dd>
					</div>
					<div className="flex items-baseline gap-2">
						<dt className="text-zinc-500">큐레이션</dt>
						<dd className="text-xl font-semibold text-zinc-900">
							{designCurationRounds.length}회
						</dd>
					</div>
					<div className="flex items-baseline gap-2">
						<dt className="text-zinc-500">마지막 갱신</dt>
						<dd className="text-xl font-semibold text-zinc-900">
							{designLinksLastUpdatedAt}
						</dd>
					</div>
				</dl>
				<div className="mt-6">
					<Link
						href="/components"
						className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
					>
						UI 키트 · 톤앤매너 탐색기
						<span aria-hidden>→</span>
					</Link>
				</div>
			</header>

			<DesignLinkDirectory
				categories={designLinkCategories}
				retiredLinks={retiredDesignLinks}
			/>

			<footer className="mt-20 border-t border-zinc-200 pt-6 text-sm leading-6 text-zinc-500">
				{designCurationRounds.map((round) => (
					<p key={round.date}>
						{round.date} — {round.label}
					</p>
				))}
				<p className="mt-3">
					출처: 옵시디언 북마크/디자인.md 누적 기록 · 전 항목 직접 접속 검증
				</p>
			</footer>
		</main>
	);
}
