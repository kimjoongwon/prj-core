# InquiryChannel Enum 기획서

> 생성일: 2026-02-25
> 타입: enum
> 위치: packages/common-enum/src/inquiry-channel.ts

## 역할

문의 접수 채널을 구분하는 Enum입니다. 옴니채널 지원을 위해 다양한 접수 경로를 관리합니다.

## 값 정의

| Prisma 값 | Code (영문) | Name (한글) | 설명 |
|-----------|-------------|-------------|------|
| WEB | WEB | "웹 폼" | 웹사이트 문의 폼 |
| EMAIL | EMAIL | "이메일" | 이메일 문의 |
| CHAT | CHAT | "채팅" | 실시간 채팅 |
| SMS | SMS | "SMS" | 문자 메시지 |
| PHONE | PHONE | "전화" | 전화 문의 |
| WALK_IN | WALK_IN | "방문" | 현장 방문 |

## TypeScript 정의 (BaseEnum 패턴)

```typescript
import { BaseEnum } from "./base-enum";

export class InquiryChannel extends BaseEnum {
  static readonly WEB = new InquiryChannel("WEB", "웹 폼");
  static readonly EMAIL = new InquiryChannel("EMAIL", "이메일");
  static readonly CHAT = new InquiryChannel("CHAT", "채팅");
  static readonly SMS = new InquiryChannel("SMS", "SMS");
  static readonly PHONE = new InquiryChannel("PHONE", "전화");
  static readonly WALK_IN = new InquiryChannel("WALK_IN", "방문");

  private static readonly _values = [
    InquiryChannel.WEB,
    InquiryChannel.EMAIL,
    InquiryChannel.CHAT,
    InquiryChannel.SMS,
    InquiryChannel.PHONE,
    InquiryChannel.WALK_IN,
  ] as const;

  static values(): InquiryChannel[] {
    return [...InquiryChannel._values];
  }

  private constructor(code: string, name: string) {
    super(code, name);
  }
}
```

## Prisma Enum 정의

```prisma
enum InquiryChannel {
  WEB
  EMAIL
  CHAT
  SMS
  PHONE
  WALK_IN
}
```

## 사용 컨텍스트

| 도메인 | 사용처 | 설명 |
|--------|--------|------|
| Inquiry | Inquiry.channel | 문의 접수 채널 |
| ChannelConfig | ChannelConfig.channel | 채널 설정 |

## 비즈니스 규칙

- 채널별로 다른 응답 템플릿 사용 가능
- 채널별 SLA 정책 다르게 설정 가능
- 이메일, 채팅은 자동 접수, 전화/방문은 수동 접수

## 구현 체크리스트

- [ ] `inquiry-channel.ts` (BaseEnum 상속 클래스)
- [ ] `index.ts` export 추가
- [ ] Prisma schema enum 추가
- [ ] Entity에서 타입 사용 시 매핑 확인

## 상위 기획서

- `packages/be-entity/src/inquiry.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-25 | 초기 생성 | orch-requirement |
