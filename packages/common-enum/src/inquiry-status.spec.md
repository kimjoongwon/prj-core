# InquiryStatus Enum 기획서

> 생성일: 2026-02-25
> 타입: enum
> 위치: packages/common-enum/src/inquiry-status.ts

## 역할

문의 처리 상태를 관리하는 Enum입니다. 상태 머신 기반으로 문의 처리 흐름을 추적합니다.

## 값 정의

| Prisma 값 | Code (영문) | Name (한글) | 설명 |
|-----------|-------------|-------------|------|
| NEW | NEW | "신규" | 새 문의, 담당자 미배정 |
| OPEN | OPEN | "열림" | 담당자 배정 완료 |
| IN_PROGRESS | IN_PROGRESS | "처리 중" | 담당자가 처리 중 |
| WAITING_CUSTOMER | WAITING_CUSTOMER | "고객 대기" | 고객 응답 대기 |
| RESOLVED | RESOLVED | "해결됨" | 문제 해결 완료 |
| CLOSED | CLOSED | "종료됨" | 문의 종료 (재오픈 불가) |
| ESCALATED | ESCALATED | "에스컬레이션" | 상위 레벨 이관 |

## TypeScript 정의 (BaseEnum 패턴)

```typescript
import { BaseEnum } from "./base-enum";

export class InquiryStatus extends BaseEnum {
  static readonly NEW = new InquiryStatus("NEW", "신규");
  static readonly OPEN = new InquiryStatus("OPEN", "열림");
  static readonly IN_PROGRESS = new InquiryStatus("IN_PROGRESS", "처리 중");
  static readonly WAITING_CUSTOMER = new InquiryStatus("WAITING_CUSTOMER", "고객 대기");
  static readonly RESOLVED = new InquiryStatus("RESOLVED", "해결됨");
  static readonly CLOSED = new InquiryStatus("CLOSED", "종료됨");
  static readonly ESCALATED = new InquiryStatus("ESCALATED", "에스컬레이션");

  private static readonly _values = [
    InquiryStatus.NEW,
    InquiryStatus.OPEN,
    InquiryStatus.IN_PROGRESS,
    InquiryStatus.WAITING_CUSTOMER,
    InquiryStatus.RESOLVED,
    InquiryStatus.CLOSED,
    InquiryStatus.ESCALATED,
  ] as const;

  static values(): InquiryStatus[] {
    return [...InquiryStatus._values];
  }

  private constructor(code: string, name: string) {
    super(code, name);
  }
}
```

## Prisma Enum 정의

```prisma
enum InquiryStatus {
  NEW
  OPEN
  IN_PROGRESS
  WAITING_CUSTOMER
  RESOLVED
  CLOSED
  ESCALATED
}
```

## 상태 전환 규칙

```
NEW → OPEN (담당자 배정 시 자동)
OPEN → IN_PROGRESS (첫 응답 시)
IN_PROGRESS ↔ WAITING_CUSTOMER (양방향)
IN_PROGRESS → RESOLVED (해결 처리)
WAITING_CUSTOMER → RESOLVED (해결 처리)
RESOLVED → CLOSED (종료 처리)
ANY → ESCALATED (에스컬레이션)
```

## 사용 컨텍스트

| 도메인 | 사용처 | 설명 |
|--------|--------|------|
| Inquiry | Inquiry.status | 문의 처리 상태 |

## 비즈니스 규칙

- CLOSED 상태는 재오픈 불가
- ESCALATED 상태는 일반 상태로 복귀 불가 (별도 처리 필요)
- 상태 전환은 규칙에 따른 순차적 진행

## 구현 체크리스트

- [ ] `inquiry-status.ts` (BaseEnum 상속 클래스)
- [ ] `index.ts` export 추가
- [ ] Prisma schema enum 추가
- [ ] Entity에서 타입 사용 시 매핑 확인

## 상위 기획서

- `packages/be-entity/src/inquiry.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-25 | 초기 생성 | orch-requirement |
