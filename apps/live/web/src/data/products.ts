import type { DemoProduct } from "@/lib/types";

/**
 * 시연용 상품 시드. 이미지는 오프라인 시연을 위해 이모지+그라디언트로 대체한다.
 */
export const productsSeed: DemoProduct[] = [
	{
		id: "product-earbuds",
		name: "무선 미니 블루투스 이어폰",
		emoji: "🎧",
		gradient: "from-violet-500/80 to-fuchsia-500/80",
		originalPrice: 89000,
		salePrice: 49900,
		stock: 80,
		initialStock: 80,
		badge: "방송가",
	},
	{
		id: "product-phone-stand",
		name: "360° 회전 휴대폰 거치대",
		emoji: "📱",
		gradient: "from-sky-500/80 to-cyan-400/80",
		originalPrice: 19900,
		salePrice: 9900,
		stock: 150,
		initialStock: 150,
		badge: "1+1",
	},
	{
		id: "product-humidifier",
		name: "USB 미니 가습기",
		emoji: "💧",
		gradient: "from-emerald-500/80 to-teal-400/80",
		originalPrice: 39000,
		salePrice: 24900,
		stock: 60,
		initialStock: 60,
		badge: "오늘만",
	},
	{
		id: "product-ringlight",
		name: "LED 셀카 링라이트",
		emoji: "💡",
		gradient: "from-amber-400/80 to-orange-500/80",
		originalPrice: 25000,
		salePrice: 12900,
		stock: 45,
		initialStock: 45,
		badge: "한정 45개",
	},
	{
		id: "product-kitchenmat",
		name: "실리콘 주방 정리 매트",
		emoji: "🍳",
		gradient: "from-rose-500/80 to-pink-500/80",
		originalPrice: 15900,
		salePrice: 7900,
		stock: 200,
		initialStock: 200,
		badge: "증정 이벤트",
	},
];
