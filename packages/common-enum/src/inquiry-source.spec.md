# InquirySource Enum 기획서

> 생성일: 2026-02-26
> 타입: enum
> 위치: packages/common-enum/src/inquiry-source.ts

## 역할

문의 접수 유형을 구분하는 Enum입니다. 온라인(고객 직접 접수)과 오프라인(상담원 대리 접수)을 구분합니다.

## 값 정의

| Prisma 값 | Code (영문) | Name (한글) | 설명 |
|-----------|-------------|-------------|------|
| ONLINE | ONLINE | "온라인" | 고객이 직접 접수 (웹, 앱, 채팅) |
| OFFLINE | OFFLINE | "오프라인" | 상담원이 대리 접수 (전화, 방문) |

## TypeScript 정의 (BaseEnum 패턴)

```typescript
import { BaseEnum } from "./base-enum";

export class InquirySource extends BaseEnum {
  static readonly ONLINE = new InquirySource("ONLINE", "온라인");
  static readonly OFFLINE = new InquirySource("OFFLINE", "오프라인");

  private static readonly _values = [
    InquirySource.ONLINE,
    InquirySource.OFFLINE,
  ] as const;

  static values(): InquirySource[] {
    return [...InquirySource._values];
  }

  private constructor(code: string, name: string) {
    super(code, name);
  }
}
```

## Prisma Enum 정의

```prisma
enum InquirySource {
  ONLINE
  OFFLINE
}
```

## 사용 컨텍스트

| 도메인 | 사용처 | 설명 |
|--------|--------|------|
| Inquiry | Inquiry.source | 문의 접수 유형 |

## 비즈니스 규칙

- WEB, EMAIL, CHAT, SMS 채널은 기본적으로 ONLINE
- PHONE, WALK_IN 채널은 기본적으로 OFFLINE
- 채널과 Source는 독립적 (전화도 고객이 직접 걸 수 있음)
- Source에 따라 SLA 정책이 다를 수 있음

## 구현 체크리스트

- [ ] `inquiry-source.ts` (BaseEnum 상속 클래스)
- [ ] `index.ts` export 추가
- [ ] Prisma schema enum 추가
- [ ] Entity에서 타입 사용 시 매핑 확인

## 상위 기획서

- `packages/be-entity/src/inquiry.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | orch-requirement |
