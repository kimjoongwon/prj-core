# InquiryPriority Enum 기획서

> 생성일: 2026-02-25
> 타입: enum
> 위치: packages/common-enum/src/inquiry-priority.ts

## 역할

문의 우선순위를 구분하는 Enum입니다. SLA 정책 및 담당자 배정 우선순위 결정에 활용합니다.

## 값 정의

| Prisma 값 | Code (영문) | Name (한글) | 설명 |
|-----------|-------------|-------------|------|
| LOW | LOW | "낮음" | 낮은 우선순위 |
| NORMAL | NORMAL | "보통" | 일반 우선순위 |
| HIGH | HIGH | "높음" | 높은 우선순위 |
| URGENT | URGENT | "긴급" | 긴급 처리 필요 |

## TypeScript 정의 (BaseEnum 패턴)

```typescript
import { BaseEnum } from "./base-enum";

export class InquiryPriority extends BaseEnum {
  static readonly LOW = new InquiryPriority("LOW", "낮음");
  static readonly NORMAL = new InquiryPriority("NORMAL", "보통");
  static readonly HIGH = new InquiryPriority("HIGH", "높음");
  static readonly URGENT = new InquiryPriority("URGENT", "긴급");

  private static readonly _values = [
    InquiryPriority.LOW,
    InquiryPriority.NORMAL,
    InquiryPriority.HIGH,
    InquiryPriority.URGENT,
  ] as const;

  static values(): InquiryPriority[] {
    return [...InquiryPriority._values];
  }

  private constructor(code: string, name: string) {
    super(code, name);
  }
}
```

## Prisma Enum 정의

```prisma
enum InquiryPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}
```

## 사용 컨텍스트

| 도메인 | 사용처 | 설명 |
|--------|--------|------|
| Inquiry | Inquiry.priority | 문의 우선순위 |
| SLATemplate | SLATemplate.priority | 우선순위별 SLA 정책 |

## 비즈니스 규칙

- URGENT 우선순위는 즉시 알림 발송
- 우선순위별로 다른 SLA 기한 적용
- AI 감정 분석 결과가 부정일 경우 자동으로 우선순위 상향 조정 가능

## 구현 체크리스트

- [ ] `inquiry-priority.ts` (BaseEnum 상속 클래스)
- [ ] `index.ts` export 추가
- [ ] Prisma schema enum 추가
- [ ] Entity에서 타입 사용 시 매핑 확인

## 상위 기획서

- `packages/be-entity/src/inquiry.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-25 | 초기 생성 | orch-requirement |
