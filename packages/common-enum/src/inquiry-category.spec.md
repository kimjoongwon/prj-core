# InquiryCategory Enum 기획서

> 생성일: 2026-02-25
> 타입: enum
> 위치: packages/common-enum/src/inquiry-category.ts

## 역할

문의 카테고리 분류를 위한 Enum입니다. 고객 문의를 체계적으로 분류하여 담당자 배정 및 통계에 활용합니다.

## 값 정의

| Prisma 값 | Code (영문) | Name (한글) | 설명 |
|-----------|-------------|-------------|------|
| GENERAL | GENERAL | "일반" | 일반 문의 |
| DELIVERY | DELIVERY | "배송" | 배송 관련 문의 |
| PAYMENT | PAYMENT | "결제" | 결제 관련 문의 |
| REFUND | REFUND | "환불/취소" | 환불, 주문 취소 문의 |
| PRODUCT | PRODUCT | "상품" | 상품 정보 문의 |
| ACCOUNT | ACCOUNT | "계정" | 계정 관련 문의 |
| TECHNICAL | TECHNICAL | "기술 지원" | 기술 지원 문의 |
| COMPLAINT | COMPLAINT | "불만/불편" | 불만, 불편 사항 |
| OTHER | OTHER | "기타" | 기타 문의 |

## TypeScript 정의 (BaseEnum 패턴)

```typescript
import { BaseEnum } from "./base-enum";

export class InquiryCategory extends BaseEnum {
  static readonly GENERAL = new InquiryCategory("GENERAL", "일반");
  static readonly DELIVERY = new InquiryCategory("DELIVERY", "배송");
  static readonly PAYMENT = new InquiryCategory("PAYMENT", "결제");
  static readonly REFUND = new InquiryCategory("REFUND", "환불/취소");
  static readonly PRODUCT = new InquiryCategory("PRODUCT", "상품");
  static readonly ACCOUNT = new InquiryCategory("ACCOUNT", "계정");
  static readonly TECHNICAL = new InquiryCategory("TECHNICAL", "기술 지원");
  static readonly COMPLAINT = new InquiryCategory("COMPLAINT", "불만/불편");
  static readonly OTHER = new InquiryCategory("OTHER", "기타");

  private static readonly _values = [
    InquiryCategory.GENERAL,
    InquiryCategory.DELIVERY,
    InquiryCategory.PAYMENT,
    InquiryCategory.REFUND,
    InquiryCategory.PRODUCT,
    InquiryCategory.ACCOUNT,
    InquiryCategory.TECHNICAL,
    InquiryCategory.COMPLAINT,
    InquiryCategory.OTHER,
  ] as const;

  static values(): InquiryCategory[] {
    return [...InquiryCategory._values];
  }

  private constructor(code: string, name: string) {
    super(code, name);
  }
}
```

## Prisma Enum 정의

```prisma
enum InquiryCategory {
  GENERAL
  DELIVERY
  PAYMENT
  REFUND
  PRODUCT
  ACCOUNT
  TECHNICAL
  COMPLAINT
  OTHER
}
```

## 사용 컨텍스트

| 도메인 | 사용처 | 설명 |
|--------|--------|------|
| Inquiry | Inquiry.category | 문의 카테고리 분류 |
| SLATemplate | SLATemplate.category | 카테고리별 SLA 정책 |

## 비즈니스 규칙

- 문의 생성 시 반드시 하나의 카테고리를 선택해야 함
- AI 자동 분류 시 카테고리 추천 가능

## 구현 체크리스트

- [ ] `inquiry-category.ts` (BaseEnum 상속 클래스)
- [ ] `index.ts` export 추가
- [ ] Prisma schema enum 추가
- [ ] Entity에서 타입 사용 시 매핑 확인

## 상위 기획서

- `packages/be-entity/src/inquiry.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-25 | 초기 생성 | orch-requirement |
