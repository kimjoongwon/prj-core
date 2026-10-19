"use client";

import {
	BellRing,
	Check,
	Copy,
	Eye,
	EyeOff,
	KeyRound,
	Layers,
	Package,
	Play,
	RefreshCw,
	RotateCcw,
	ShoppingCart,
	Truck,
	Users,
	Wallet,
} from "lucide-react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiBasePath, apiFetchJson } from "@/lib/api-client";
import { formatKoreanTime, formatKrw } from "@/lib/format";
import type {
	AlimTalkNotification,
	DemoBroadcast,
	DemoOrder,
	DemoProduct,
	LiveDemoSummary,
} from "@/lib/types";

/**
 * 관리자 화면 (시연 편의상 무인증): 방송 채널/재생 보안, 상품 재고,
 * 주문, 알림톡 발송 이력을 폴링으로 보여준다.
 */
type AdminTab = "products" | "orders" | "notifications";

function createLiveAdminState() {
	const state = {
		broadcast: null as DemoBroadcast | null,
		summary: {
			totalOrders: 0,
			totalRevenue: 0,
			pendingNotifications: 0,
			sentNotifications: 0,
		} satisfies LiveDemoSummary,
		products: [] as DemoProduct[],
		orders: [] as DemoOrder[],
		notifications: [] as AlimTalkNotification[],
		viewerCount: 1284,
		activeTab: "products" as AdminTab,
		isStreamKeyVisible: false,
		playbackToken: null as { token: string; expiresAt: number } | null,

		setActiveTab(tab: AdminTab) {
			this.activeTab = tab;
		},

		toggleStreamKeyVisibility() {
			this.isStreamKeyVisible = !this.isStreamKeyVisible;
		},

		async loadAll() {
			const [broadcastRes, productsRes, ordersRes, notificationsRes] =
				await Promise.all([
					apiFetchJson<{ broadcast: DemoBroadcast; summary: LiveDemoSummary }>(
						`${apiBasePath}/broadcast`,
					),
					apiFetchJson<{ products: DemoProduct[] }>(`${apiBasePath}/products`),
					apiFetchJson<{ orders: DemoOrder[] }>(`${apiBasePath}/admin/orders`),
					apiFetchJson<{ notifications: AlimTalkNotification[] }>(
						`${apiBasePath}/admin/notifications`,
					),
				]);
			this.broadcast = broadcastRes.broadcast;
			this.summary = broadcastRes.summary;
			this.products = productsRes.products;
			this.orders = ordersRes.orders;
			this.notifications = notificationsRes.notifications;
		},

		async adjustStock(productId: string, stockDelta: number) {
			const productRes = await apiFetchJson<{ product: DemoProduct }>(
				`${apiBasePath}/products`,
				{ method: "PATCH", body: JSON.stringify({ productId, stockDelta }) },
			);
			const index = this.products.findIndex((item) => item.id === productId);
			if (index >= 0) {
				this.products[index] = productRes.product;
			}
		},

		async advanceOrderToPreparing(orderId: string) {
			const orderRes = await apiFetchJson<{ order: DemoOrder }>(
				`${apiBasePath}/admin/orders`,
				{
					method: "PATCH",
					body: JSON.stringify({ orderId, status: "PREPARING" }),
				},
			);
			const index = this.orders.findIndex((item) => item.id === orderId);
			if (index >= 0) {
				this.orders[index] = orderRes.order;
			}
		},

		async issuePlaybackToken() {
			const tokenRes = await apiFetchJson<{
				token: string;
				expiresInSeconds: number;
			}>(`${apiBasePath}/broadcast/playback-token`, { method: "POST" });
			this.playbackToken = {
				token: tokenRes.token,
				expiresAt: Date.now() + tokenRes.expiresInSeconds * 1000,
			};
		},

		async resetDemo() {
			await apiFetchJson(`${apiBasePath}/admin/reset`, { method: "POST" });
			this.playbackToken = null;
			await this.loadAll();
		},
	};

	return makeAutoObservable(
		state,
		{},
		{ autoBind: true, name: "LiveAdminState" },
	);
}

type LiveAdminState = ReturnType<typeof createLiveAdminState>;

const LiveAdminPage = observer(function LiveAdminPage() {
	const state = useLocalObservable(() => createLiveAdminState());

	useEffect(() => {
		void state.loadAll();
		const pollHandle = setInterval(() => {
			void state.loadAll();
		}, 4000);
		const viewerDriftHandle = setInterval(() => {
			state.viewerCount = Math.min(
				2300,
				Math.max(950, state.viewerCount + Math.floor(Math.random() * 13) - 6),
			);
		}, 3000);
		return () => {
			clearInterval(pollHandle);
			clearInterval(viewerDriftHandle);
		};
	}, [state]);

	return (
		<div className="flex min-h-dvh flex-col">
			<header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/90 backdrop-blur">
				<div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-3 lg:px-6">
					<div className="flex items-center gap-2.5">
						<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-sm">
							⚙️
						</span>
						<div>
							<p className="font-display text-sm font-bold text-white">
								라이브 커머스 관리자
							</p>
							<p className="text-[11px] text-zinc-400">시연용 목업 대시보드</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => void state.resetDemo()}
							className="flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10"
						>
							<RotateCcw className="h-3.5 w-3.5" />
							시연 초기화
						</button>
						<Link
							href="/stack"
							className="flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10"
						>
							<Layers className="h-3.5 w-3.5" />
							기술 스택
						</Link>
						<Link
							href="/"
							className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-zinc-950 transition hover:bg-amber-400"
						>
							<Play className="h-3.5 w-3.5" />
							시청 화면
						</Link>
					</div>
				</div>
			</header>

			<main className="mx-auto w-full max-w-6xl flex-1 space-y-4 px-3 py-4 lg:px-6">
				<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
					<StatCard
						icon={<Users className="h-4 w-4" />}
						label="동시 시청자"
						value={`${state.viewerCount.toLocaleString("ko-KR")}명`}
						tone="sky"
					/>
					<StatCard
						icon={<ShoppingCart className="h-4 w-4" />}
						label="누적 주문"
						value={`${state.summary.totalOrders.toLocaleString("ko-KR")}건`}
						tone="violet"
					/>
					<StatCard
						icon={<Wallet className="h-4 w-4" />}
						label="누적 매출"
						value={formatKrw(state.summary.totalRevenue)}
						tone="amber"
					/>
					<StatCard
						icon={<BellRing className="h-4 w-4" />}
						label="알림톡 발송"
						value={`SENT ${state.summary.sentNotifications} / 대기 ${state.summary.pendingNotifications}`}
						tone="emerald"
					/>
				</div>

				<ChannelCard state={state} />

				<div className="rounded-2xl border border-white/10 bg-zinc-900/60">
					<div className="flex gap-1 border-b border-white/10 p-2">
						<AdminTabButton
							isActive={state.activeTab === "products"}
							onClick={() => state.setActiveTab("products")}
							icon={<Package className="h-3.5 w-3.5" />}
							label="상품 재고"
						/>
						<AdminTabButton
							isActive={state.activeTab === "orders"}
							onClick={() => state.setActiveTab("orders")}
							icon={<ShoppingCart className="h-3.5 w-3.5" />}
							label={`주문 (${state.orders.length})`}
						/>
						<AdminTabButton
							isActive={state.activeTab === "notifications"}
							onClick={() => state.setActiveTab("notifications")}
							icon={<BellRing className="h-3.5 w-3.5" />}
							label={`알림톡 (${state.notifications.length})`}
						/>
					</div>
					<div className="p-3">
						{state.activeTab === "products" ? (
							<ProductsPanel state={state} />
						) : state.activeTab === "orders" ? (
							<OrdersPanel state={state} />
						) : (
							<NotificationsPanel state={state} />
						)}
					</div>
				</div>

				<p className="pb-2 text-center text-[11px] text-zinc-600">
					모든 데이터는 시연용 인메모리 목업입니다 — 4초마다 자동 새로고침 ·
					시청 화면의 가상 구매가 여기에 실시간으로 쌓여요
				</p>
			</main>
		</div>
	);
});

function StatCard({
	icon,
	label,
	value,
	tone,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	tone: "sky" | "violet" | "amber" | "emerald";
}) {
	const toneClasses = {
		sky: "bg-sky-500/15 text-sky-300",
		violet: "bg-violet-500/15 text-violet-300",
		amber: "bg-amber-500/15 text-amber-300",
		emerald: "bg-emerald-500/15 text-emerald-300",
	} as const;

	return (
		<div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
			<span
				className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}
			>
				{icon}
			</span>
			<div className="min-w-0">
				<p className="text-[11px] text-zinc-400">{label}</p>
				<p className="font-display truncate text-base font-bold text-white">
					{value}
				</p>
			</div>
		</div>
	);
}

const ChannelCard = observer(function ChannelCard({
	state,
}: {
	state: LiveAdminState;
}) {
	const broadcast = state.broadcast;
	const token = state.playbackToken;
	const [remainingMs, setRemainingMs] = useState(0);

	useEffect(() => {
		if (!token) {
			return;
		}
		const tick = () =>
			setRemainingMs(Math.max(0, token.expiresAt - Date.now()));
		tick();
		const handle = setInterval(tick, 1000);
		return () => clearInterval(handle);
	}, [token]);

	if (!broadcast) {
		return null;
	}

	const maskedStreamKey = `${broadcast.streamKey.slice(0, 8)}${"•".repeat(24)}`;

	return (
		<section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
			<div className="mb-3 flex items-center justify-between">
				<h2 className="font-display flex items-center gap-1.5 text-sm font-bold text-white">
					<KeyRound className="h-4 w-4 text-sky-300" />
					방송 채널 · 재생 보안
				</h2>
				<span className="rounded-md bg-emerald-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-300">
					비공개 채널 · 재생 토큰 필수
				</span>
			</div>
			<div className="grid gap-3 md:grid-cols-2">
				<div className="space-y-2 text-xs">
					<InfoRow label="채널명" value={broadcast.channelName} />
					<InfoRow
						label="송출 URL (OBS)"
						value={broadcast.ingestEndpoint}
						copyValue={broadcast.ingestEndpoint}
					/>
					<div className="flex items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2">
						<span className="shrink-0 text-zinc-400">스트림 키</span>
						<span className="flex min-w-0 items-center gap-1.5">
							<code className="truncate text-zinc-200">
								{state.isStreamKeyVisible
									? broadcast.streamKey
									: maskedStreamKey}
							</code>
							<button
								type="button"
								onClick={state.toggleStreamKeyVisibility}
								className="shrink-0 rounded-md p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white"
								aria-label={
									state.isStreamKeyVisible
										? "스트림 키 가리기"
										: "스트림 키 보기"
								}
							>
								{state.isStreamKeyVisible ? (
									<EyeOff className="h-3.5 w-3.5" />
								) : (
									<Eye className="h-3.5 w-3.5" />
								)}
							</button>
							<CopyButton value={broadcast.streamKey} />
						</span>
					</div>
				</div>
				<div className="space-y-2 text-xs">
					<InfoRow label="방송 제목" value={broadcast.title} />
					<InfoRow
						label="재생 URL"
						value={broadcast.playbackUrl}
						copyValue={broadcast.playbackUrl}
					/>
					<div className="rounded-xl bg-white/5 px-3 py-2">
						<div className="flex items-center justify-between gap-2">
							<span className="text-zinc-400">재생 토큰 정책</span>
							<span className="text-zinc-200">
								유효기간 {broadcast.playbackTokenTtlSeconds / 60}분
							</span>
						</div>
						<button
							type="button"
							onClick={() => void state.issuePlaybackToken()}
							className="mt-2 w-full rounded-lg bg-sky-500/20 py-2 text-[11px] font-bold text-sky-300 transition hover:bg-sky-500/30"
						>
							재생 토큰 발급해 보기
						</button>
						{token ? (
							<p className="mt-2 break-all text-[10px] text-zinc-400">
								{token.token.slice(0, 64)}… ·{" "}
								<span className="text-sky-300">
									만료까지 {Math.ceil(remainingMs / 1000)}초
								</span>
							</p>
						) : null}
					</div>
				</div>
			</div>
		</section>
	);
});

function InfoRow({
	label,
	value,
	copyValue,
}: {
	label: string;
	value: string;
	copyValue?: string;
}) {
	return (
		<div className="flex items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2">
			<span className="shrink-0 text-zinc-400">{label}</span>
			<span className="flex min-w-0 items-center gap-1.5">
				<code className="truncate text-zinc-200">{value}</code>
				{copyValue ? <CopyButton value={copyValue} /> : null}
			</span>
		</div>
	);
}

function CopyButton({ value }: { value: string }) {
	const [isCopied, setIsCopied] = useState(false);

	return (
		<button
			type="button"
			onClick={() => {
				void navigator.clipboard.writeText(value).then(() => {
					setIsCopied(true);
					setTimeout(() => setIsCopied(false), 1500);
				});
			}}
			className="shrink-0 rounded-md p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white"
			aria-label="복사"
		>
			{isCopied ? (
				<Check className="h-3.5 w-3.5 text-emerald-400" />
			) : (
				<Copy className="h-3.5 w-3.5" />
			)}
		</button>
	);
}

function AdminTabButton({
	isActive,
	onClick,
	icon,
	label,
}: {
	isActive: boolean;
	onClick: () => void;
	icon: React.ReactNode;
	label: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
				isActive
					? "bg-white/15 text-white"
					: "text-zinc-400 hover:text-zinc-200"
			}`}
		>
			{icon}
			{label}
		</button>
	);
}

const ProductsPanel = observer(function ProductsPanel({
	state,
}: {
	state: LiveAdminState;
}) {
	return (
		<div className="space-y-2">
			{state.products.map((product) => (
				<div
					key={product.id}
					className="flex flex-wrap items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5"
				>
					<span
						className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl ${product.gradient}`}
					>
						{product.emoji}
					</span>
					<div className="min-w-0 flex-1">
						<p className="truncate text-[13px] font-semibold text-white">
							{product.name}
						</p>
						<p className="text-[11px] text-zinc-400">
							{formatKrw(product.salePrice)} · 초기 {product.initialStock}개
						</p>
					</div>
					<span
						className={`rounded-md px-2 py-1 text-xs font-bold tabular-nums ${
							product.stock <= 0
								? "bg-red-500/15 text-red-300"
								: product.stock <= product.initialStock * 0.3
									? "bg-amber-500/15 text-amber-300"
									: "bg-emerald-500/15 text-emerald-300"
						}`}
					>
						재고 {product.stock}개
					</span>
					<div className="flex items-center gap-1">
						{[-10, -1, 1, 10].map((delta) => (
							<button
								key={delta}
								type="button"
								onClick={() => void state.adjustStock(product.id, delta)}
								className="rounded-lg bg-white/10 px-2 py-1 text-xs font-semibold text-zinc-200 transition hover:bg-white/20"
							>
								{delta > 0 ? `+${delta}` : delta}
							</button>
						))}
					</div>
				</div>
			))}
		</div>
	);
});

const OrdersPanel = observer(function OrdersPanel({
	state,
}: {
	state: LiveAdminState;
}) {
	if (state.orders.length === 0) {
		return (
			<p className="py-8 text-center text-xs text-zinc-500">
				아직 주문이 없어요 — 시청 화면에서 구매해 보세요
			</p>
		);
	}

	return (
		<div className="space-y-2">
			{state.orders.map((order) => (
				<div
					key={order.id}
					className="flex flex-wrap items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-xs"
				>
					<code className="rounded bg-white/10 px-1.5 py-0.5 font-semibold text-zinc-200">
						{order.id}
					</code>
					<span className="min-w-0 flex-1 truncate text-zinc-200">
						{order.productName} ×{order.quantity}
					</span>
					<span className="font-semibold text-amber-300">
						{formatKrw(order.amount)}
					</span>
					<span className="text-zinc-400">{order.buyerNickname}</span>
					<span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-zinc-300">
						{order.paymentMethod === "KAKAOPAY" ? "카카오페이" : "카드"}
					</span>
					<span className="text-zinc-500">
						{formatKoreanTime(order.createdAt)}
					</span>
					{order.status === "PAID" ? (
						<button
							type="button"
							onClick={() => void state.advanceOrderToPreparing(order.id)}
							className="flex items-center gap-1 rounded-lg bg-sky-500/20 px-2 py-1 font-semibold text-sky-300 transition hover:bg-sky-500/30"
						>
							<Truck className="h-3 w-3" />
							배송준비
						</button>
					) : (
						<span className="rounded-md bg-sky-500/15 px-2 py-1 text-[10px] font-semibold text-sky-300">
							배송준비
						</span>
					)}
				</div>
			))}
		</div>
	);
});

const NotificationsPanel = observer(function NotificationsPanel({
	state,
}: {
	state: LiveAdminState;
}) {
	if (state.notifications.length === 0) {
		return (
			<p className="py-8 text-center text-xs text-zinc-500">
				알림톡 이력이 없어요 — 주문이 생기면 자동으로 큐에 쌓여요
			</p>
		);
	}

	return (
		<div className="space-y-2">
			{state.notifications.map((notification) => (
				<div
					key={notification.id}
					className="flex flex-wrap items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-xs"
				>
					<code className="rounded bg-white/10 px-1.5 py-0.5 text-zinc-300">
						{notification.id}
					</code>
					<span className="text-zinc-400">주문 {notification.orderId}</span>
					<span className="min-w-0 flex-1 truncate text-zinc-200">
						[{notification.templateName}] → {notification.recipient} 님
					</span>
					{notification.status === "SENT" ? (
						<span className="flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">
							<Check className="h-3 w-3" />
							발송 완료{" "}
							{notification.sentAt ? formatKoreanTime(notification.sentAt) : ""}
						</span>
					) : (
						<span className="flex items-center gap-1 rounded-md bg-zinc-500/20 px-2 py-1 text-[10px] font-semibold text-zinc-300">
							<RefreshCw className="h-3 w-3 animate-spin" />큐 대기 중
						</span>
					)}
				</div>
			))}
		</div>
	);
});

export default LiveAdminPage;
