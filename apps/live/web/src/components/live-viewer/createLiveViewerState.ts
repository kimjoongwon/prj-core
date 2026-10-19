import { makeAutoObservable } from "mobx";
import {
	botPurchasePhrases,
	chatMessagePool,
	couponEventPool,
} from "@/data/chat-script";
import { viewerNicknamePool } from "@/data/nicknames";
import { ApiError, apiBasePath, apiFetchJson } from "@/lib/api-client";
import type {
	DemoBroadcast,
	DemoOrder,
	DemoProduct,
	DemoUser,
	PaymentMethod,
} from "@/lib/types";

/**
 * 시청자 화면 전체 상태 (방송·세션·채팅 시뮬레이션·구매 오버레이 흐름).
 * 채팅/쿠폰/가상 시청자 구매는 클라이언트 시뮬레이션이며,
 * 실제 서비스에서는 이 부분을 채팅 SDK 구독(IVS Chat Web SDK 또는 자체 WebSocket)으로 교체한다.
 */

export type ViewerChatMessageKind =
	| "bot"
	| "mine"
	| "purchase"
	| "coupon"
	| "system";

export type ViewerChatMessage = {
	id: string;
	kind: ViewerChatMessageKind;
	nickname: string;
	text: string;
	createdAt: number;
};

export type PurchaseFlowStep =
	| "cart"
	| "pg"
	| "processing"
	| "success"
	| "error";

export type PurchaseFlowState = {
	productId: string;
	quantity: number;
	step: PurchaseFlowStep;
	paymentMethod: PaymentMethod;
	errorMessage: string | null;
	completedOrder: DemoOrder | null;
};

function pickRandom<T>(items: readonly T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createLiveViewerState() {
	const simulationTimeouts: ReturnType<typeof setTimeout>[] = [];
	let chatMessageSeq = 0;

	function scheduleLoop(
		minIntervalMs: number,
		maxIntervalMs: number,
		run: () => void | Promise<void>,
	) {
		const tick = () => {
			void run();
			const handle = setTimeout(
				tick,
				minIntervalMs + Math.random() * (maxIntervalMs - minIntervalMs),
			);
			simulationTimeouts.push(handle);
		};
		tick();
	}

	const state = {
		broadcast: null as DemoBroadcast | null,
		me: null as DemoUser | null,
		products: [] as DemoProduct[],
		chatMessages: [] as ViewerChatMessage[],
		chatInput: "",
		viewerCount: 1284,
		isPlaybackTokenIssued: false,
		playbackRemainingSeconds: 0,
		purchase: null as PurchaseFlowState | null,
		isLoginModalOpen: false,
		pendingPurchaseProductId: null as string | null,
		latestCouponText: null as string | null,
		latestCouponShownAt: 0,
		mobilePanel: "products" as "products" | "chat",

		get selectedProduct(): DemoProduct | null {
			if (!this.purchase) {
				return null;
			}
			return (
				this.products.find(
					(product) => product.id === this.purchase?.productId,
				) ?? null
			);
		},

		async loadInitialData() {
			const [broadcastRes, productsRes] = await Promise.all([
				apiFetchJson<{ broadcast: DemoBroadcast }>(`${apiBasePath}/broadcast`),
				apiFetchJson<{ products: DemoProduct[] }>(`${apiBasePath}/products`),
			]);
			this.broadcast = broadcastRes.broadcast;
			this.products = productsRes.products;

			try {
				const meResponse = await fetch(`${apiBasePath}/auth/me`);
				if (meResponse.ok) {
					const meRes = (await meResponse.json()) as { user: DemoUser };
					this.me = meRes.user;
				}
			} catch {
				// 세션 확인 실패는 비로그인 상태로 간주한다.
			}
		},

		async issuePlaybackToken() {
			this.isPlaybackTokenIssued = false;
			const tokenRes = await apiFetchJson<{ expiresInSeconds: number }>(
				`${apiBasePath}/broadcast/playback-token`,
				{ method: "POST" },
			);
			this.playbackRemainingSeconds = tokenRes.expiresInSeconds;
			this.isPlaybackTokenIssued = true;
		},

		async login(nickname: string) {
			const loginRes = await apiFetchJson<{ user: DemoUser }>(
				`${apiBasePath}/auth/kakao`,
				{ method: "POST", body: JSON.stringify({ nickname }) },
			);
			this.me = loginRes.user;
			this.isLoginModalOpen = false;
			this.pushChatMessage(
				"system",
				"운영자",
				`${loginRes.user.nickname}님 환영합니다! 🎉`,
			);

			const pendingProductId = this.pendingPurchaseProductId;
			if (pendingProductId) {
				this.pendingPurchaseProductId = null;
				this.startPurchase(pendingProductId);
			}
		},

		async logout() {
			await fetch(`${apiBasePath}/auth/kakao`, { method: "DELETE" }).catch(
				() => {},
			);
			this.me = null;
		},

		setChatInput(value: string) {
			this.chatInput = value;
		},

		sendChatMessage() {
			const text = this.chatInput.trim();
			if (!text) {
				return;
			}
			this.pushChatMessage("mine", this.me?.nickname ?? "게스트", text);
			this.chatInput = "";
		},

		requestPurchaseOrLogin(productId: string) {
			const product = this.products.find((item) => item.id === productId);
			if (!product || product.stock <= 0) {
				return;
			}
			if (!this.me) {
				this.pendingPurchaseProductId = productId;
				this.isLoginModalOpen = true;
				return;
			}
			this.startPurchase(productId);
		},

		startPurchase(productId: string) {
			const product = this.products.find((item) => item.id === productId);
			if (!product || product.stock <= 0) {
				return;
			}
			this.purchase = {
				productId,
				quantity: 1,
				step: "cart",
				paymentMethod: "KAKAOPAY",
				errorMessage: null,
				completedOrder: null,
			};
		},

		changeQuantity(delta: number) {
			const purchase = this.purchase;
			const product = this.selectedProduct;
			if (!purchase || !product) {
				return;
			}
			purchase.quantity = Math.min(
				Math.max(1, purchase.quantity + delta),
				Math.min(10, product.stock),
			);
		},

		goToPgStep() {
			if (this.purchase) {
				this.purchase.step = "pg";
			}
		},

		backToCartStep() {
			if (this.purchase) {
				this.purchase.step = "cart";
			}
		},

		selectPaymentMethod(method: PaymentMethod) {
			if (this.purchase) {
				this.purchase.paymentMethod = method;
			}
		},

		async confirmPgPayment() {
			const purchase = this.purchase;
			if (!purchase || purchase.step === "processing") {
				return;
			}
			purchase.step = "processing";
			purchase.errorMessage = null;

			await sleep(900); // PG 승인 지연 목업

			try {
				const orderRes = await apiFetchJson<{
					order: DemoOrder;
					product: DemoProduct;
				}>(`${apiBasePath}/orders`, {
					method: "POST",
					body: JSON.stringify({
						productId: purchase.productId,
						quantity: purchase.quantity,
						paymentMethod: purchase.paymentMethod,
					}),
				});
				this.applyProductUpdate(orderRes.product);
				purchase.step = "success";
				purchase.completedOrder = orderRes.order;
				this.pushChatMessage(
					"purchase",
					orderRes.order.buyerNickname,
					`${orderRes.order.productName} ${orderRes.order.quantity}개 구매! (주문 ${orderRes.order.id})`,
				);
			} catch (error) {
				purchase.step = "error";
				purchase.errorMessage = resolveOrderErrorMessage(error);
			}
		},

		closePurchase() {
			this.purchase = null;
		},

		openLoginModal() {
			this.isLoginModalOpen = true;
		},

		closeLoginModal() {
			this.isLoginModalOpen = false;
			this.pendingPurchaseProductId = null;
		},

		setMobilePanel(panel: "products" | "chat") {
			this.mobilePanel = panel;
		},

		applyProductUpdate(product: DemoProduct) {
			const index = this.products.findIndex((item) => item.id === product.id);
			if (index >= 0) {
				this.products[index] = product;
			}
		},

		pushChatMessage(
			kind: ViewerChatMessageKind,
			nickname: string,
			text: string,
		) {
			chatMessageSeq += 1;
			this.chatMessages.push({
				id: `chat-${chatMessageSeq}`,
				kind,
				nickname,
				text,
				createdAt: Date.now(),
			});
			if (this.chatMessages.length > 140) {
				this.chatMessages = this.chatMessages.slice(-110);
			}
		},

		startSimulations() {
			// 일반 채팅 봇
			scheduleLoop(1400, 2600, () => {
				this.pushChatMessage(
					"bot",
					pickRandom(viewerNicknamePool),
					pickRandom(chatMessagePool),
				);
			});

			// 쿠폰 드롭 이벤트
			scheduleLoop(40000, 70000, () => {
				const couponText = pickRandom(couponEventPool);
				this.latestCouponText = couponText;
				this.latestCouponShownAt = Date.now();
				this.pushChatMessage("coupon", "운영자", couponText);
			});

			// 동시 시청자 수 등락
			scheduleLoop(2500, 4000, () => {
				const drift = Math.floor(Math.random() * 13) - 6;
				this.viewerCount = Math.min(
					2300,
					Math.max(950, this.viewerCount + drift),
				);
			});

			// 재생 토큰 만료 카운트다운 + 자동 갱신
			scheduleLoop(1000, 1000, () => {
				if (this.playbackRemainingSeconds > 0) {
					this.playbackRemainingSeconds -= 1;
				}
				if (this.playbackRemainingSeconds <= 0 && this.isPlaybackTokenIssued) {
					void this.issuePlaybackToken();
				}
			});

			// 가상 시청자 구매 (재고 차감·관리자 주문 반영까지 실제 API 경유)
			scheduleLoop(20000, 40000, async () => {
				const inStockProduct = pickRandom(
					this.products.filter((product) => product.stock > 0),
				);
				if (!inStockProduct) {
					return;
				}
				const buyerNickname = pickRandom(viewerNicknamePool);
				try {
					const orderRes = await apiFetchJson<{
						order: DemoOrder;
						product: DemoProduct;
					}>(`${apiBasePath}/orders`, {
						method: "POST",
						body: JSON.stringify({
							productId: inStockProduct.id,
							quantity: 1,
							nickname: buyerNickname,
							paymentMethod: Math.random() < 0.7 ? "KAKAOPAY" : "CARD",
						}),
					});
					this.applyProductUpdate(orderRes.product);
					const phrase = pickRandom(botPurchasePhrases)
						.replace("{nickname}", buyerNickname)
						.replace("{quantity}", "1");
					this.pushChatMessage(
						"purchase",
						buyerNickname,
						`${phrase} · ${orderRes.product.name} (남은 재고 ${orderRes.product.stock}개)`,
					);
				} catch {
					// 가상 구매 실패(품절 등)는 조용히 넘어간다.
				}
			});

			// 관리자 탭에서 바꾼 재고 등 외부 변경 동기화
			scheduleLoop(8000, 8000, async () => {
				const productsRes = await apiFetchJson<{ products: DemoProduct[] }>(
					`${apiBasePath}/products`,
				).catch(() => null);
				if (productsRes) {
					this.products = productsRes.products;
				}
			});
		},

		disposeSimulations() {
			for (const handle of simulationTimeouts) {
				clearTimeout(handle);
			}
			simulationTimeouts.length = 0;
		},
	};

	return makeAutoObservable(
		state,
		{},
		{ autoBind: true, name: "LiveViewerState" },
	);
}

export type LiveViewerState = ReturnType<typeof createLiveViewerState>;

function resolveOrderErrorMessage(error: unknown): string {
	if (error instanceof ApiError) {
		const payload = error.payload as {
			error?: string;
			remainingStock?: number;
		} | null;
		if (payload?.error === "SOLD_OUT") {
			return "재고가 모두 팔렸어요. 다음 상품을 확인해 주세요!";
		}
		if (payload?.error === "INSUFFICIENT_STOCK") {
			return `재고가 부족해요. 남은 수량: ${payload.remainingStock ?? 0}개`;
		}
	}
	return "결제 처리에 실패했어요. 잠시 후 다시 시도해 주세요.";
}
