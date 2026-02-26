# SenderType Enum 기획서

> 생성일: 2026-02-26
> 타입: enum
> 위치: packages/common-enum/src/sender-type.ts

## 역할

메시지 발신자 유형을 구분하는 Enum입니다. 실시간 채팅에서 사용자, AI, 시스템 메시지를 구분하여 표시합니다.

## 값 정의

| Prisma 값 | Code (영문) | Name (한글) | 설명 |
|-----------|-------------|-------------|------|
| USER | USER | "사용자" | 일반 사용자 (고객/담당자) |
| AI | AI | "AI" | AI 에이전트 |
| SYSTEM | SYSTEM | "시스템" | 시스템 자동 메시지 |

## TypeScript 정의 (BaseEnum 패턴)

```typescript
import { BaseEnum } from "./base-enum";

export class SenderType extends BaseEnum {
  static readonly USER = new SenderType("USER", "사용자");
  static readonly AI = new SenderType("AI", "AI");
  static readonly SYSTEM = new SenderType("SYSTEM", "시스템");

  private static readonly _values = [
    SenderType.USER,
    SenderType.AI,
    SenderType.SYSTEM,
  ] as const;

  static values(): SenderType[] {
    return [...SenderType._values];
  }

  private constructor(code: string, name: string) {
    super(code, name);
  }
}
```

## Prisma Enum 정의

```prisma
enum SenderType {
  USER
  AI
  SYSTEM
}
```

## UI 표시 규칙

| SenderType | 아이콘 | 색상 | senderId |
|------------|--------|------|----------|
| USER | 사용자 프로필 | 기본 | 필수 |
| AI | 로봇/스파클 | 보라색 | null |
| SYSTEM | 정보 아이콘 | 회색 | null |

## 사용 컨텍스트

| 도메인 | 사용처 | 설명 |
|--------|--------|------|
| InquiryMessage | InquiryMessage.senderType | 메시지 발신자 유형 |

## 비즈니스 규칙

- USER 메시지는 senderId 필수
- AI/SYSTEM 메시지는 senderId null
- AI 메시지는 "AI 초안 사용됨" 배지 표시 가능
- SYSTEM 메시지는 상태 변경, 입장/퇴장 등 알림용

## 구현 체크리스트

- [ ] `sender-type.ts` (BaseEnum 상속 클래스)
- [ ] `index.ts` export 추가
- [ ] Prisma schema enum 추가
- [ ] Entity에서 타입 사용 시 매핑 확인

## 상위 기획서

- `packages/be-entity/src/inquiry-message.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | orch-requirement |
