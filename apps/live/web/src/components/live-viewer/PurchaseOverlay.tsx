"use client";

import {
	CheckCircle2,
	ChevronLeft,
	Loader2,
	Minus,
	Plus,
	ShieldCheck,
	X,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import type { LiveViewerState } from "@/components/live-viewer/createLiveViewerState";
import { formatKrw } from "@/lib/format";

/**
 * 무중단(오버레이) 결제 UX의 핵심 컴포넌트.
 * 영상 위에 시트로 떠 오르고, 결제가 진행되는 동안 방송 재생은 유지된다.
 * PG 화면은 목업이며 실제 서비스에서는 PG사 SDK/리다이렉트 흐름으로 교체한다.
 */
export const PurchaseOverlay = observer(function PurchaseOverlay({
	state,
}: {
	state: LiveViewerState;
}) {
	const purchase = state.purchase;
	const product = state.selectedProduct;
	if (!purchase || !product) {
		return null;
	}

	return (
		<div className="absolute inset-x-0 bottom-0 z-20 p-2 sm:inset-x-auto sm:bottom-3 sm:right-3 sm:w-88">
			<div className="rounded-2xl border border-white/10 bg-zinc-900/95 p-4 text-zinc-100 shadow-2xl shadow-black/60 backdrop-blur">
				<div className="mb-3 flex items-start justify-between gap-2">
					<div className="flex items-center gap-2">
						{purchase.step === "success" ? (
							<span className="flex items-center gap-1.5 rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">
								<ShieldCheck className="h-3.5 w-3.5" />
								결제 완료
							</span>
						) : (
							<span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-zinc-200">
								무중단 결제 · 방송 계속 재생 중 ▶
							</span>
						)}
					</div>
					<button
						type="button"
						onClick={state.closePurchase}
						className="rounded-full p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white"
						aria-label="결제창 닫기"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				{purchase.step === "cart" ? (
					<CartStep state={state} />
				) : purchase.step === "pg" ? (
					<PgStep state={state} />
				) : purchase.step === "processing" ? (
					<ProcessingStep />
				) : purchase.step === "success" ? (
					<SuccessStep state={state} />
				) : (
					<ErrorStep state={state} />
				)}
			</div>
		</div>
	);
});

function CartStep({ state }: { state: LiveViewerState }) {
	const product = state.selectedProduct;
	const purchase = state.purchase;
	if (!product || !purchase) {
		return null;
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-3">
				<div
					className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ${product.gradient}`}
				>
					{product.emoji}
				</div>
				<div className="min-w-0">
					<p className="truncate text-sm font-semibold">{product.name}</p>
					<p className="text-xs text-zinc-400">
						남은 재고 {product.stock}개 · {product.badge ?? "라이브 특가"}
					</p>
					<p className="mt-0.5 text-sm">
						<span className="font-bold text-amber-400">
							{formatKrw(product.salePrice)}
						</span>{" "}
						<span className="text-xs text-zinc-500 line-through">
							{formatKrw(product.originalPrice)}
						</span>
					</p>
				</div>
			</div>

			<div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
				<span className="text-sm text-zinc-300">수량</span>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => state.changeQuantity(-1)}
						disabled={purchase.quantity <= 1}
						className="rounded-lg bg-white/10 p-1.5 transition hover:bg-white/20 disabled:opacity-30"
						aria-label="수량 줄이기"
					>
						<Minus className="h-4 w-4" />
					</button>
					<span className="w-8 text-center text-sm font-semibold tabular-nums">
						{purchase.quantity}
					</span>
					<button
						type="button"
						onClick={() => state.changeQuantity(1)}
						disabled={purchase.quantity >= Math.min(10, product.stock)}
						className="rounded-lg bg-white/10 p-1.5 transition hover:bg-white/20 disabled:opacity-30"
						aria-label="수량 늘리기"
					>
						<Plus className="h-4 w-4" />
					</button>
				</div>
			</div>

			<div className="flex items-center justify-between text-sm">
				<span className="text-zinc-400">결제 금액</span>
				<span className="font-display text-lg font-bold text-white">
					{formatKrw(product.salePrice * purchase.quantity)}
				</span>
			</div>

			<button
				type="button"
				onClick={state.goToPgStep}
				className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-amber-400"
			>
				결제하기
			</button>
		</div>
	);
}

function PgStep({ state }: { state: LiveViewerState }) {
	const product = state.selectedProduct;
	const purchase = state.purchase;
	if (!product || !purchase) {
		return null;
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-2 text-xs text-zinc-400">
				<button
					type="button"
					onClick={state.backToCartStep}
					className="flex items-center gap-1 rounded-md px-1.5 py-1 transition hover:bg-white/10 hover:text-white"
				>
					<ChevronLeft className="h-3.5 w-3.5" />
					뒤로
				</button>
				<span>목업 PG — 실제 결제가 발생하지 않습니다</span>
			</div>

			<button
				type="button"
				onClick={() => {
					state.selectPaymentMethod("KAKAOPAY");
					void state.confirmPgPayment();
				}}
				className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-3 text-sm font-bold text-zinc-900 transition hover:brightness-95"
			>
				<span aria-hidden>💬</span> 카카오페이로 결제
			</button>

			<button
				type="button"
				onClick={() => {
					state.selectPaymentMethod("CARD");
					void state.confirmPgPayment();
				}}
				className="w-full rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/10"
			>
				카드 결제
			</button>

			<p className="text-center text-xs text-zinc-500">
				{product.name} {purchase.quantity}개 ·{" "}
				{formatKrw(product.salePrice * purchase.quantity)}
			</p>
		</div>
	);
}

function ProcessingStep() {
	return (
		<div className="flex flex-col items-center gap-3 py-6">
			<Loader2 className="h-8 w-8 animate-spin text-amber-400" />
			<p className="text-sm font-semibold text-zinc-200">PG 승인 처리 중…</p>
			<p className="text-xs text-zinc-500">재고를 확보하고 있어요</p>
		</div>
	);
}

function SuccessStep({ state }: { state: LiveViewerState }) {
	const purchase = state.purchase;
	const product = state.selectedProduct;
	if (!purchase?.completedOrder || !product) {
		return null;
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col items-center gap-1 py-2">
				<CheckCircle2 className="h-10 w-10 text-emerald-400" />
				<p className="font-display text-base font-bold">주문 완료!</p>
				<p className="text-xs text-zinc-400">
					주문번호 {purchase.completedOrder.id} ·{" "}
					{formatKrw(purchase.completedOrder.amount)}
				</p>
			</div>
			<div className="rounded-xl bg-white/5 px-3 py-2 text-xs text-zinc-300">
				<p>📦 상품: {purchase.completedOrder.productName}</p>
				<p className="mt-1">
					💬 알림톡 발송 큐에 적재됐어요 — 관리자 화면에서 발송 상태를 확인할 수
					있어요
				</p>
			</div>
			<button
				type="button"
				onClick={state.closePurchase}
				className="w-full rounded-xl bg-white/10 py-2.5 text-sm font-semibold transition hover:bg-white/20"
			>
				계속 시청하기
			</button>
		</div>
	);
}

function ErrorStep({ state }: { state: LiveViewerState }) {
	const purchase = state.purchase;
	if (!purchase) {
		return null;
	}

	return (
		<div className="flex flex-col gap-3">
			<p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300">
				{purchase.errorMessage ?? "결제에 실패했어요"}
			</p>
			<button
				type="button"
				onClick={state.closePurchase}
				className="w-full rounded-xl bg-white/10 py-2.5 text-sm font-semibold transition hover:bg-white/20"
			>
				닫기
			</button>
		</div>
	);
}
