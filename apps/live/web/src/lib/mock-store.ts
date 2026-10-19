import { broadcastSeed } from "@/data/broadcast";
import { productsSeed } from "@/data/products";
import type {
	AlimTalkNotification,
	DemoOrder,
	DemoOrderStatus,
	DemoProduct,
	LiveDemoSummary,
	PaymentMethod,
} from "@/lib/types";

/**
 * 시연용 인메모리 저장소. dev 서버 리로드 사이에도 상태가 유지되도록
 * globalThis에 단일 인스턴스로 둔다. 실제 서비스에서는 DB + 결제/알림 큐로 대체된다.
 */

type LiveDemoStore = {
	broadcast: typeof broadcastSeed;
	products: DemoProduct[];
	orders: DemoOrder[];
	notifications: AlimTalkNotification[];
	orderSeq: number;
	notificationSeq: number;
	pendingNotificationTimers: ReturnType<typeof setTimeout>[];
};

const globalRef = globalThis as unknown as {
	__liveDemoStore?: LiveDemoStore;
};

const MAX_HISTORY = 200;

function seedLiveDemoStore(): LiveDemoStore {
	return {
		broadcast: broadcastSeed,
		products: structuredClone(productsSeed),
		orders: [],
		notifications: [],
		orderSeq: 0,
		notificationSeq: 0,
		pendingNotificationTimers: [],
	};
}

export function getLiveDemoStore(): LiveDemoStore {
	globalRef.__liveDemoStore ??= seedLiveDemoStore();
	return globalRef.__liveDemoStore;
}

export function resetLiveDemoStore(): void {
	const previous = globalRef.__liveDemoStore;
	if (previous) {
		for (const timer of previous.pendingNotificationTimers) {
			clearTimeout(timer);
		}
	}
	globalRef.__liveDemoStore = seedLiveDemoStore();
}

export type PlaceOrderResult =
	| { ok: true; order: DemoOrder; product: DemoProduct }
	| {
			ok: false;
			reason: "SOLD_OUT" | "INSUFFICIENT_STOCK";
			remainingStock: number;
	  };

export function placeDemoOrder(input: {
	productId: string;
	quantity: number;
	buyerNickname: string;
	paymentMethod: PaymentMethod;
}): PlaceOrderResult {
	const store = getLiveDemoStore();
	const product = store.products.find((item) => item.id === input.productId);
	if (!product) {
		return { ok: false, reason: "SOLD_OUT", remainingStock: 0 };
	}
	if (product.stock <= 0) {
		return { ok: false, reason: "SOLD_OUT", remainingStock: 0 };
	}
	if (input.quantity > product.stock) {
		return {
			ok: false,
			reason: "INSUFFICIENT_STOCK",
			remainingStock: product.stock,
		};
	}

	product.stock -= input.quantity;
	store.orderSeq += 1;
	const order: DemoOrder = {
		id: `LC-${100200 + store.orderSeq}`,
		productId: product.id,
		productName: product.name,
		quantity: input.quantity,
		amount: product.salePrice * input.quantity,
		buyerNickname: input.buyerNickname,
		paymentMethod: input.paymentMethod,
		status: "PAID",
		createdAt: new Date().toISOString(),
	};
	store.orders.unshift(order);
	store.orders = store.orders.slice(0, MAX_HISTORY);

	queueAlimTalkOrderNotification(order);

	return { ok: true, order, product };
}

/**
 * 알림톡 백그라운드 큐 시뮬레이션.
 * 주문 즉시 PENDING 레코드를 적재하고, 수 초 뒤 발송 완료(SENT)로 전환한다.
 * 실제 서비스에서는 BullMQ 등 작업 큐가 알림톡 발송 API를 호출하는 지점이다.
 */
function queueAlimTalkOrderNotification(order: DemoOrder): void {
	const store = getLiveDemoStore();
	store.notificationSeq += 1;
	const notification: AlimTalkNotification = {
		id: `AT-${300100 + store.notificationSeq}`,
		orderId: order.id,
		channel: "ALIMTALK",
		templateName: "주문확정 안내",
		recipient: order.buyerNickname,
		status: "PENDING",
		queuedAt: new Date().toISOString(),
		sentAt: null,
	};
	store.notifications.unshift(notification);
	store.notifications = store.notifications.slice(0, MAX_HISTORY);

	const timer = setTimeout(() => {
		notification.status = "SENT";
		notification.sentAt = new Date().toISOString();
	}, 4000);
	store.pendingNotificationTimers.push(timer);
	store.pendingNotificationTimers = store.pendingNotificationTimers.slice(
		-MAX_HISTORY,
	);
}

export function adjustDemoProductStock(
	productId: string,
	stockDelta: number,
): DemoProduct | null {
	const store = getLiveDemoStore();
	const product = store.products.find((item) => item.id === productId);
	if (!product) {
		return null;
	}
	product.stock = Math.max(0, product.stock + stockDelta);
	return product;
}

export function advanceDemoOrderStatus(
	orderId: string,
	status: DemoOrderStatus,
): DemoOrder | null {
	const store = getLiveDemoStore();
	const order = store.orders.find((item) => item.id === orderId);
	if (!order) {
		return null;
	}
	order.status = status;
	return order;
}

export function summarizeLiveDemoStore(): LiveDemoSummary {
	const store = getLiveDemoStore();
	return {
		totalOrders: store.orders.length,
		totalRevenue: store.orders.reduce((sum, order) => sum + order.amount, 0),
		pendingNotifications: store.notifications.filter(
			(notification) => notification.status === "PENDING",
		).length,
		sentNotifications: store.notifications.filter(
			(notification) => notification.status === "SENT",
		).length,
	};
}
