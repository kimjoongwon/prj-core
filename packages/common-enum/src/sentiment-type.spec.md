# SentimentType Enum 기획서

> 생성일: 2026-02-26
> 타입: enum
> 위치: packages/common-enum/src/sentiment-type.ts

## 역할

감정 분석 결과를 구분하는 Enum입니다. AI 기반 감정 분석에서 고객의 감정 상태를 분류합니다.

## 값 정의

| Prisma 값 | Code (영문) | Name (한글) | 설명 |
|-----------|-------------|-------------|------|
| POSITIVE | POSITIVE | "긍정" | 긍정적인 감정 |
| NEUTRAL | NEUTRAL | "중립" | 중립적인 감정 |
| NEGATIVE | NEGATIVE | "부정" | 부정적인 감정 |

## TypeScript 정의 (BaseEnum 패턴)

```typescript
import { BaseEnum } from "./base-enum";

export class SentimentType extends BaseEnum {
  static readonly POSITIVE = new SentimentType("POSITIVE", "긍정");
  static readonly NEUTRAL = new SentimentType("NEUTRAL", "중립");
  static readonly NEGATIVE = new SentimentType("NEGATIVE", "부정");

  private static readonly _values = [
    SentimentType.POSITIVE,
    SentimentType.NEUTRAL,
    SentimentType.NEGATIVE,
  ] as const;

  static values(): SentimentType[] {
    return [...SentimentType._values];
  }

  private constructor(code: string, name: string) {
    super(code, name);
  }
}
```

## Prisma Enum 정의

```prisma
enum SentimentType {
  POSITIVE
  NEUTRAL
  NEGATIVE
}
```

## UI 표시 규칙

| SentimentType | 이모지 | 색상 | 설명 |
|---------------|--------|------|------|
| POSITIVE | 😊 | 초록색 | 만족, 감사, 칭찬 |
| NEUTRAL | 😐 | 회색 | 일반 문의, 정보 요청 |
| NEGATIVE | 😠 | 빨간색 | 불만, 화남, 실망 |

## 점수 기준

| 범위 | SentimentType |
|------|---------------|
| 0.0 ~ 0.3 | NEGATIVE |
| 0.3 ~ 0.7 | NEUTRAL |
| 0.7 ~ 1.0 | POSITIVE |

## 사용 컨텍스트

| 도메인 | 사용처 | 설명 |
|--------|--------|------|
| Inquiry | Inquiry.sentiment | 문의 전체 감정 |
| SentimentAnalysis | SentimentAnalysis.sentiment | 상세 분석 결과 |

## 비즈니스 규칙

- NEGATIVE + urgency > 0.7 → 자동 에스컬레이션 검토
- 감정 변화 추이 모니터링 (부정 → 긍정 개선)
- 신뢰도(confidence)가 낮으면 수동 검토 권장
- 실시간 채팅에서 감정 실시간 업데이트

## 구현 체크리스트

- [ ] `sentiment-type.ts` (BaseEnum 상속 클래스)
- [ ] `index.ts` export 추가
- [ ] Prisma schema enum 추가
- [ ] Entity에서 타입 사용 시 매핑 확인

## 상위 기획서

- `packages/be-entity/src/inquiry.entity.spec.md`
- `packages/be-entity/src/sentiment-analysis.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | orch-requirement |
