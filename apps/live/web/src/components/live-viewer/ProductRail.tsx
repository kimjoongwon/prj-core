"use client";

import { Flame } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { LiveViewerState } from "@/components/live-viewer/createLiveViewerState";
import { formatKrw } from "@/lib/format";

function stockGaugeColorClass(stock: number, initialStock: number): string {
	const ratio = initialStock > 0 ? stock / initialStock : 0;
	if (stock <= 0) {
		return "bg-red-500";
	}
	if (ratio <= 0.3) {
		return "bg-amber-400";
	}
	return "bg-emerald-400";
}

/**
 * 방송 상품 목록(가로 스크롤). 재고 게이지가 주문마다 실시간으로 줄어든다.
 */
export const ProductRail = observer(function ProductRail({
	state,
}: {
	state: LiveViewerState;
}) {
	return (
		<section aria-label="방송 상품 목록" className="min-w-0">
			<div className="mb-2 flex items-center gap-1.5 px-1">
				<Flame className="h-4 w-4 text-amber-400" />
				<h2 className="font-display text-sm font-bold text-white">
					방송 상품{" "}
					<span className="text-amber-400">{state.products.length}개</span>
				</h2>
			</div>
			<div className="flex snap-x gap-3 overflow-x-auto pb-2">
				{state.products.map((product) => {
					const stockRatio =
						product.initialStock > 0
							? Math.max(0, product.stock / product.initialStock)
							: 0;
					const isSoldOut = product.stock <= 0;

					return (
						<article
							key={product.id}
							className="w-44 shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70"
						>
							<div
								className={`relative flex h-24 items-center justify-center bg-gradient-to-br text-4xl ${product.gradient}`}
							>
								<span aria-hidden>{product.emoji}</span>
								{product.badge ? (
									<span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
										{product.badge}
									</span>
								) : null}
								{isSoldOut ? (
									<span className="absolute inset-0 flex items-center justify-center bg-black/70 text-sm font-bold text-white">
										품절
									</span>
								) : null}
							</div>
							<div className="flex flex-col gap-1.5 p-3">
								<p className="line-clamp-1 text-[13px] font-semibold text-white">
									{product.name}
								</p>
								<p>
									<span className="text-sm font-bold text-amber-400">
										{formatKrw(product.salePrice)}
									</span>{" "}
									<span className="text-[11px] text-zinc-500 line-through">
										{formatKrw(product.originalPrice)}
									</span>
								</p>
								<div>
									<div className="h-1.5 overflow-hidden rounded-full bg-white/10">
										<div
											className={`h-full rounded-full transition-all duration-500 ${stockGaugeColorClass(product.stock, product.initialStock)}`}
											style={{ width: `${Math.max(stockRatio * 100, 3)}%` }}
										/>
									</div>
									<p className="mt-1 text-[11px] text-zinc-400">
										{isSoldOut
											? "품절되었어요"
											: `재고 ${product.stock}개 남음`}
									</p>
								</div>
								<button
									type="button"
									disabled={isSoldOut}
									onClick={() => state.requestPurchaseOrLogin(product.id)}
									className="mt-0.5 w-full rounded-xl bg-amber-500 py-2 text-xs font-bold text-zinc-950 transition hover:bg-amber-400 disabled:bg-white/10 disabled:text-zinc-500"
								>
									{isSoldOut ? "품절" : "구매하기"}
								</button>
							</div>
						</article>
					);
				})}
			</div>
		</section>
	);
});
