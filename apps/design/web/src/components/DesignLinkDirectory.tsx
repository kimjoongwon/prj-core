"use client";

import { ExternalLink, RotateCcw, Search } from "lucide-react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import type {
	DesignLink,
	DesignLinkCategory,
	DesignLinkPrice,
	RetiredDesignLink,
} from "@/data/design-links";

type PriceFilter = "all" | DesignLinkPrice;

const priceFilterOptions: { value: PriceFilter; label: string }[] = [
	{ value: "all", label: "전체" },
	{ value: "free", label: "무료" },
	{ value: "freemium", label: "부분 유료" },
	{ value: "paid", label: "유료" },
];

const priceLabels: Record<DesignLinkPrice, string> = {
	free: "무료",
	freemium: "부분 유료",
	paid: "유료",
};

const priceBadgeStyles: Record<DesignLinkPrice, string> = {
	free: "bg-emerald-50 text-emerald-700 ring-emerald-200",
	freemium: "bg-amber-50 text-amber-700 ring-amber-200",
	paid: "bg-rose-50 text-rose-700 ring-rose-200",
};

function getLinkHostname(url: string): string {
	return new URL(url).hostname.replace(/^www\./, "");
}

export function createDesignLinkDirectoryState(
	categories: DesignLinkCategory[],
) {
	const state = {
		searchKeyword: "",
		priceFilter: "all" as PriceFilter,

		applySearchKeyword(keyword: string) {
			state.searchKeyword = keyword;
		},
		selectPriceFilter(filter: PriceFilter) {
			state.priceFilter = filter;
		},
		resetFilters() {
			state.searchKeyword = "";
			state.priceFilter = "all";
		},

		get trimmedKeyword(): string {
			return state.searchKeyword.trim().toLowerCase();
		},
		get isFilterActive(): boolean {
			return state.trimmedKeyword.length > 0 || state.priceFilter !== "all";
		},
		get visibleCategories(): DesignLinkCategory[] {
			return categories
				.map((category) => ({
					...category,
					links: category.links.filter((link) => state.matchesLink(link)),
				}))
				.filter((category) => category.links.length > 0);
		},
		get visibleLinkCount(): number {
			return state.visibleCategories.reduce(
				(sum, category) => sum + category.links.length,
				0,
			);
		},
		get hasNoResult(): boolean {
			return state.isFilterActive && state.visibleLinkCount === 0;
		},

		matchesLink(link: DesignLink): boolean {
			const keyword = state.trimmedKeyword;
			const matchesKeyword =
				keyword.length === 0 ||
				link.name.toLowerCase().includes(keyword) ||
				link.description.toLowerCase().includes(keyword);
			const matchesPrice =
				state.priceFilter === "all" || link.price === state.priceFilter;
			return matchesKeyword && matchesPrice;
		},
	};

	return makeAutoObservable(
		state,
		{},
		{ autoBind: true, name: "DesignLinkDirectoryState" },
	);
}

export type DesignLinkDirectoryState = ReturnType<
	typeof createDesignLinkDirectoryState
>;

interface DesignLinkDirectoryProps {
	categories: DesignLinkCategory[];
	retiredLinks: RetiredDesignLink[];
}

function DesignLinkDirectory({
	categories,
	retiredLinks,
}: DesignLinkDirectoryProps) {
	const directoryState = useLocalObservable(() =>
		createDesignLinkDirectoryState(categories),
	);

	return (
		<div>
			<div className="sticky top-0 z-10 -mx-5 space-y-3 border-b border-zinc-200 bg-zinc-50/90 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
				<div className="flex flex-wrap items-center gap-3">
					<div className="relative">
						<Search
							className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400"
							aria-hidden
						/>
						<input
							type="search"
							value={directoryState.searchKeyword}
							onChange={(event) =>
								directoryState.applySearchKeyword(event.target.value)
							}
							placeholder="이름이나 설명으로 검색"
							aria-label="링크 검색"
							className="w-full rounded-lg border border-zinc-200 bg-white py-2 pr-3 pl-9 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-64"
						/>
					</div>
					<div className="flex flex-wrap items-center gap-1.5">
						{priceFilterOptions.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => directoryState.selectPriceFilter(option.value)}
								aria-pressed={directoryState.priceFilter === option.value}
								className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
									directoryState.priceFilter === option.value
										? "border-zinc-900 bg-zinc-900 text-white"
										: "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100"
								}`}
							>
								{option.label}
							</button>
						))}
					</div>
					{directoryState.isFilterActive && (
						<div className="ml-auto flex items-center gap-2 text-xs text-zinc-500">
							<span>{directoryState.visibleLinkCount}개 표시</span>
							<button
								type="button"
								onClick={directoryState.resetFilters}
								className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2.5 py-1 font-medium text-zinc-600 hover:bg-zinc-100"
							>
								<RotateCcw className="size-3" aria-hidden />
								초기화
							</button>
						</div>
					)}
				</div>
				<nav className="flex flex-wrap gap-1.5" aria-label="분야 바로가기">
					{categories.map((category) => (
						<a
							key={category.id}
							href={`#${category.id}`}
							className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 transition-colors hover:border-blue-300 hover:text-blue-600"
						>
							{category.title}
							<span className="ml-1 text-zinc-400">
								{category.links.length}
							</span>
						</a>
					))}
				</nav>
			</div>

			{directoryState.visibleCategories.map((category) => (
				<section
					key={category.id}
					id={category.id}
					aria-labelledby={`${category.id}-heading`}
					className="mt-14 scroll-mt-32"
				>
					<div className="flex items-baseline justify-between gap-3">
						<h2
							id={`${category.id}-heading`}
							className="text-xl font-bold tracking-tight"
						>
							{category.title}
						</h2>
						<span className="text-xs text-zinc-400">
							{category.links.length}개
						</span>
					</div>
					<p className="mt-1 text-sm text-zinc-500">{category.summary}</p>
					<ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{category.links.map((link) => (
							<li
								key={link.url}
								className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md"
							>
								<div className="flex items-start justify-between gap-3">
									<a
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-[15px] font-semibold text-zinc-900 underline-offset-4 decoration-blue-400 hover:underline"
									>
										{link.name}
									</a>
									<div className="flex shrink-0 items-center gap-2">
										{link.price && (
											<span
												className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${priceBadgeStyles[link.price]}`}
											>
												{priceLabels[link.price]}
											</span>
										)}
										<ExternalLink
											className="size-4 text-zinc-300 transition-colors group-hover:text-blue-500"
											aria-hidden
										/>
									</div>
								</div>
								<p className="mt-2 grow text-sm leading-6 text-zinc-600">
									{link.description}
								</p>
								<div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
									<span>{getLinkHostname(link.url)}</span>
									<span>수집 {link.addedAt}</span>
								</div>
							</li>
						))}
					</ul>
				</section>
			))}

			{directoryState.hasNoResult && (
				<div className="mt-14 rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
					<p className="font-medium text-zinc-700">
						조건에 맞는 링크가 없습니다
					</p>
					<button
						type="button"
						onClick={directoryState.resetFilters}
						className="mt-3 rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
					>
						필터 초기화
					</button>
				</div>
			)}

			<section className="mt-16" aria-labelledby="retired-heading">
				<h2
					id="retired-heading"
					className="text-lg font-semibold text-zinc-700"
				>
					검증 후 제외한 곳
				</h2>
				<p className="mt-1 text-sm text-zinc-500">
					접속 검증에서 폐업·방치·확인 불가로 판정되어 목록에서 뺀 곳의 이력
				</p>
				<ul className="mt-4 divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
					{retiredLinks.map((retired) => (
						<li
							key={retired.name}
							className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3 text-sm"
						>
							<span className="font-medium text-zinc-700">
								{retired.name}
								{retired.url ? ` (${getLinkHostname(retired.url)})` : ""}
							</span>
							<span className="text-zinc-500">
								{retired.reason} · {retired.checkedAt} 확인
							</span>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}

export default observer(DesignLinkDirectory);
