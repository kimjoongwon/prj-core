# InquiryParticipantRole Enum 기획서

> 생성일: 2026-02-26
> 타입: enum
> 위치: packages/common-enum/src/inquiry-participant-role.ts

## 역할

문의/스레드 참여자의 역할을 구분하는 Enum입니다. 실시간 채팅에서 권한 관리 및 UI 표시에 사용됩니다.

## 값 정의

| Prisma 값 | Code (영문) | Name (한글) | 설명 |
|-----------|-------------|-------------|------|
| CUSTOMER | CUSTOMER | "고객" | 문의 작성자 (고객) |
| AGENT | AGENT | "상담원" | 담당 상담원 |
| SUPERVISOR | SUPERVISOR | "감독관" | 모니터링 담당자 |
| VIEWER | VIEWER | "조회자" | 읽기 전용 참여자 |

## TypeScript 정의 (BaseEnum 패턴)

```typescript
import { BaseEnum } from "./base-enum";

export class InquiryParticipantRole extends BaseEnum {
  static readonly CUSTOMER = new InquiryParticipantRole("CUSTOMER", "고객");
  static readonly AGENT = new InquiryParticipantRole("AGENT", "상담원");
  static readonly SUPERVISOR = new InquiryParticipantRole("SUPERVISOR", "감독관");
  static readonly VIEWER = new InquiryParticipantRole("VIEWER", "조회자");

  private static readonly _values = [
    InquiryParticipantRole.CUSTOMER,
    InquiryParticipantRole.AGENT,
    InquiryParticipantRole.SUPERVISOR,
    InquiryParticipantRole.VIEWER,
  ] as const;

  static values(): InquiryParticipantRole[] {
    return [...InquiryParticipantRole._values];
  }

  private constructor(code: string, name: string) {
    super(code, name);
  }
}
```

## Prisma Enum 정의

```prisma
enum InquiryParticipantRole {
  CUSTOMER
  AGENT
  SUPERVISOR
  VIEWER
}
```

## 권한 매트릭스

| 역할 | 메시지 작성 | 상태 변경 | 담당자 변경 | 태그 관리 | 문의 종료 |
|------|:----------:|:--------:|:----------:|:--------:|:--------:|
| CUSTOMER | O | X | X | X | X |
| AGENT | O | O | X | O | O |
| SUPERVISOR | X | O | O | O | O |
| VIEWER | X | X | X | X | X |

## 사용 컨텍스트

| 도메인 | 사용처 | 설명 |
|--------|--------|------|
| InquiryParticipant | InquiryParticipant.role | 참여자 역할 |

## 비즈니스 규칙

- 하나의 문의에 CUSTOMER는 1명만 존재
- AGENT는 assigneeId와 일치해야 함
- SUPERVISOR는 여러 명 존재 가능
- VIEWER는 내부 참조용 (감사, 교육 등)

## 구현 체크리스트

- [ ] `inquiry-participant-role.ts` (BaseEnum 상속 클래스)
- [ ] `index.ts` export 추가
- [ ] Prisma schema enum 추가
- [ ] Entity에서 타입 사용 시 매핑 확인

## 상위 기획서

- `packages/be-entity/src/inquiry-participant.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | orch-requirement |
