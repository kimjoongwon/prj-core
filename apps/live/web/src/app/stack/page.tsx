import { ArrowRight, Layers, Play, Store } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
	architectureFlowSteps,
	requirementMappingRows,
	streamingOptions,
	techStackGroups,
} from "@/data/tech-stack";

export const metadata: Metadata = {
	title: "기술 스택 — 라이브 커머스 데모",
	description:
		"라이브 커머스 플랫폼 구축 기술 스택: 시연 데모와 실제 구현 계획을 함께 소개합니다.",
};

/**
 * 클라이언트 시연용 기술 스택 소개 페이지 (정적 콘텐츠).
 */
export default function TechStackPage() {
	return (
		<div className="flex min-h-dvh flex-col">
			<header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/90 backdrop-blur">
				<div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-3 lg:px-6">
					<div className="flex items-center gap-2.5">
						<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
							<Layers className="h-4 w-4 text-sky-300" />
						</span>
						<div>
							<p className="font-display text-sm font-bold text-white">
								기술 스택 소개
							</p>
							<p className="text-[11px] text-zinc-400">
								라이브 커머스 플랫폼 구축 제안
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Link
							href="/"
							className="flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10"
						>
							<Play className="h-3.5 w-3.5" />
							시청 화면
						</Link>
						<Link
							href="/admin"
							className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-zinc-950 transition hover:bg-amber-400"
						>
							<Store className="h-3.5 w-3.5" />
							관리자
						</Link>
					</div>
				</div>
			</header>

			<main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-3 py-6 lg:px-6">
				<section className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-900/40 p-6">
					<h1 className="font-display text-xl font-bold text-white sm:text-2xl">
						라이브 커머스 플랫폼 · 기술 스택
					</h1>
					<p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
						지금 보신 시연 데모는 실제 구현할 스택과 같은 구조로 만들었습니다.
						데모가 목업으로 흉내 낸 부분이 실서비스에서 무엇으로 채워지는지
						아래에서 함께 확인하실 수 있어요.
					</p>
				</section>

				<section aria-label="전체 구조 흐름">
					<h2 className="font-display mb-3 text-base font-bold text-white">
						전체 구조 한눈에 보기
					</h2>
					<div className="flex flex-col items-stretch gap-1.5 rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
						{architectureFlowSteps.map((step, index) => (
							<div key={step} className="flex flex-col items-center gap-1.5">
								{index > 0 ? <span className="text-zinc-600">↓</span> : null}
								<p className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-center text-[13px] font-medium text-zinc-200">
									{step}
								</p>
							</div>
						))}
					</div>
				</section>

				{techStackGroups.map((group) => (
					<section key={group.id} aria-label={group.title}>
						<h2 className="font-display text-base font-bold text-white">
							{group.title}
						</h2>
						<p className="mt-0.5 mb-3 text-xs text-zinc-400">{group.summary}</p>
						<div className="grid gap-3 md:grid-cols-2">
							{group.items.map((item) => (
								<div
									key={item.name}
									className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4"
								>
									<p className="text-sm font-semibold text-white">
										{item.name}
									</p>
									<p className="mt-1 text-xs leading-relaxed text-zinc-400">
										{item.role}
									</p>
									{item.demoNote ? (
										<p className="mt-2 rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-[11px] leading-relaxed text-amber-300">
											데모 연동: {item.demoNote}
										</p>
									) : null}
								</div>
							))}
						</div>
					</section>
				))}

				<section aria-label="스트리밍 엔진 선택지">
					<h2 className="font-display text-base font-bold text-white">
						스트리밍 엔진 — 두 가지 선택지
					</h2>
					<p className="mt-0.5 mb-3 text-xs text-zinc-400">
						규모와 예산이 정해지면 이 지점에 선택한 엔진을 끼웁니다. 데모
						플레이어는 두 선택지 모두로 교체 가능하도록 분리해 두었습니다.
					</p>
					<div className="grid gap-3 md:grid-cols-2">
						{streamingOptions.map((option) => (
							<div
								key={option.id}
								className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-zinc-900/60 p-4"
							>
								<p className="text-sm font-bold text-white">{option.title}</p>
								<p className="text-xs text-sky-300">{option.tagline}</p>
								<ul className="flex-1 space-y-1.5">
									{option.highlights.map((highlight) => (
										<li
											key={highlight}
											className="flex gap-1.5 text-xs text-zinc-300"
										>
											<span className="text-emerald-400">✓</span>
											{highlight}
										</li>
									))}
								</ul>
								<p className="rounded-lg bg-white/5 px-2.5 py-1.5 text-[11px] text-zinc-400">
									💰 {option.costShape}
								</p>
							</div>
						))}
					</div>
				</section>

				<section aria-label="요구사항과 구현 매핑">
					<h2 className="font-display mb-1 text-base font-bold text-white">
						요구사항 → 시연 데모 → 실제 구현
					</h2>
					<p className="mb-3 text-xs text-zinc-400">
						프로젝트 요구 항목이 이 데모에서 어떻게 보이고, 실서비스에서
						무엇으로 구현되는지 정리한 표입니다.
					</p>
					<div className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-900/60">
						<table className="w-full min-w-[720px] text-left text-xs">
							<thead>
								<tr className="border-b border-white/10 text-zinc-400">
									<th className="px-4 py-3 font-semibold">요구사항</th>
									<th className="px-4 py-3 font-semibold">
										시연 데모 (지금 보신 것)
									</th>
									<th className="px-4 py-3 font-semibold">실제 구현</th>
								</tr>
							</thead>
							<tbody>
								{requirementMappingRows.map((row) => (
									<tr
										key={row.requirement}
										className="border-b border-white/5 last:border-b-0"
									>
										<td className="px-4 py-3 font-medium text-zinc-200">
											{row.requirement}
										</td>
										<td className="px-4 py-3 text-amber-300/90">{row.demo}</td>
										<td className="px-4 py-3 text-zinc-400">
											{row.production}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>

				<section className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/60 p-6 text-center">
					<p className="text-sm text-zinc-300">
						데모에서 직접 흐름을 다시 확인해 보세요 — 로그인부터 무중단 결제까지
						이어집니다.
					</p>
					<Link
						href="/"
						className="mt-1 flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-amber-400"
					>
						<ArrowRight className="h-4 w-4" />
						시연 데모로 돌아가기
					</Link>
				</section>

				<p className="pb-2 text-center text-[11px] text-zinc-600">
					이 페이지의 스택은 제안용 구성이며, 데모 앱은 모든 외부 연동을
					목업으로 대체해 비용 없이 시연합니다.
				</p>
			</main>
		</div>
	);
}
