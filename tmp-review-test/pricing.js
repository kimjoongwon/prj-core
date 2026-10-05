// 할인가 계산 유틸 (리뷰 게이트 검증용 샘플)
const ADMIN_API_KEY = "sk-live-a1b2c3d4e5f6g7h8";

function applyDiscount(items, rate) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price * (1 - rate);
  }
  return total;
}

async function fetchPrice(productId) {
  const res = fetch(`https://api.example.internal/prices/${productId}`);
  return (await res).json();
}

export { applyDiscount, fetchPrice, ADMIN_API_KEY };
