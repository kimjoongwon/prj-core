export type DemoUser = {
	id: string;
	nickname: string;
};

export type PaymentMethod = "KAKAOPAY" | "CARD";

export type DemoProduct = {
	id: string;
	name: string;
	emoji: string;
	gradient: string;
	originalPrice: number;
	salePrice: number;
	stock: number;
	initialStock: number;
	badge: string | null;
};

export type DemoOrderStatus = "PAID" | "PREPARING";

export type DemoOrder = {
	id: string;
	productId: string;
	productName: string;
	quantity: number;
	amount: number;
	buyerNickname: string;
	paymentMethod: PaymentMethod;
	status: DemoOrderStatus;
	createdAt: string;
};

export type AlimTalkNotificationStatus = "PENDING" | "SENT";

export type AlimTalkNotification = {
	id: string;
	orderId: string;
	channel: "ALIMTALK";
	templateName: string;
	recipient: string;
	status: AlimTalkNotificationStatus;
	queuedAt: string;
	sentAt: string | null;
};

export type DemoBroadcast = {
	id: string;
	title: string;
	hostName: string;
	channelName: string;
	ingestEndpoint: string;
	streamKey: string;
	playbackUrl: string;
	isPrivateChannel: boolean;
	playbackTokenTtlSeconds: number;
	startedAt: string;
};

export type LiveDemoSummary = {
	totalOrders: number;
	totalRevenue: number;
	pendingNotifications: number;
	sentNotifications: number;
};
