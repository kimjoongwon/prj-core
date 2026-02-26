# SentimentAnalysis Entity 기획서

> 생성일: 2026-02-26
> 타입: entity
> 위치: packages/be-entity/src/sentiment-analysis.entity.ts

## 역할

문의 내용의 감정 분석 결과를 저장하는 엔티티입니다. AI 기반 감정 분석을 통해 고객의 감정 상태(긍정, 중립, 부정)와 신뢰도를 추적합니다. 실시간 채팅에서 메시지별 감정 변화를 모니터링합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| inquiryId | UUID | FK, required, unique | - | 소속 문의 ID (1:1) |
| messageId | UUID | FK, optional | - | 분석 대상 메시지 ID (null이면 전체 문의) |
| sentiment | SentimentType | required | - | 감정 유형 |
| score | Float | required | - | 감정 점수 (0~1) |
| confidence | Float | required | - | 분석 신뢰도 (0~1) |
| emotions | Json | optional | - | 세부 감정 (joy, anger, sadness, fear, surprise) |
| keywords | Json | optional | - | 주요 키워드 목록 |
| urgency | Float | optional | - | 긴급도 점수 (0~1) |
| analyzedAt | DateTime | required | now() | 분석 일시 |
| createdAt | DateTime | required | now() | 생성 일시 |
| updatedAt | DateTime | required | now() | 수정 일시 |

## Enum

### SentimentType

| 값 | 설명 |
|-----|------|
| POSITIVE | 긍정 |
| NEUTRAL | 중립 |
| NEGATIVE | 부정 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | Inquiry | 1:1 | 소속 문의 |
| belongsTo | InquiryMessage | N:0..1 | 분석 대상 메시지 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isPositive() | boolean | 긍정 감정 여부 |
| isNeutral() | boolean | 중립 감정 여부 |
| isNegative() | boolean | 부정 감정 여부 |
| isUrgent() | boolean | 긴급 여부 (urgency > 0.7) |
| isReliable() | boolean | 신뢰도 높음 여부 (confidence > 0.8) |
| getDominantEmotion() | string | 가장 강한 감정 반환 |
| updateAnalysis(result) | void | 분석 결과 업데이트 |

## 비즈니스 규칙

- 문의 생성 시 자동 감정 분석 수행
- 새 메시지 추가 시 분석 결과 업데이트
- 부정 감정 + 높은 긴급도 → 자동 에스컬레이션 검토
- 신뢰도 < 0.5면 수동 검토 권장
- 감정 분석은 비동기로 수행 (UI 블로킹 방지)

## 감정 분석 구조

### emotions JSON 예시

```json
{
  "joy": 0.1,
  "anger": 0.6,
  "sadness": 0.2,
  "fear": 0.1,
  "surprise": 0.0
}
```

### keywords JSON 예시

```json
[
  { "text": "배송", "relevance": 0.9 },
  { "text": "지연", "relevance": 0.8 },
  { "text": "불만", "relevance": 0.7 }
]
```

## 구현 대상 (orch-stage 자동 병렬 실행용)

### Entity 목록

| Entity | 타입 | 의존성 | 병렬 그룹 |
|--------|------|--------|----------|
| SentimentAnalysis | MATERIALIZATION | Inquiry, InquiryMessage | 1 |

### Enum 목록

| Enum | 사용 Entity |
|------|-------------|
| SentimentType | SentimentAnalysis |

## 구현 체크리스트

- [x] sentiment-analysis.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma 타입 implements
- [x] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### [TC-001] isNegative - 부정 감정

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | sentiment=NEGATIVE인 분석 결과 |
| **When** | isNegative() 호출 |
| **Then** | true 반환 |

### [TC-002] isUrgent - 긴급 여부

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | urgency=0.8인 분석 결과 |
| **When** | isUrgent() 호출 |
| **Then** | true 반환 |

### [TC-003] isReliable - 신뢰도 확인

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | confidence=0.9인 분석 결과 |
| **When** | isReliable() 호출 |
| **Then** | true 반환 |

### [TC-004] getDominantEmotion - 주요 감정

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | emotions={joy:0.1, anger:0.7, sadness:0.1} |
| **When** | getDominantEmotion() 호출 |
| **Then** | "anger" 반환 |

## 상위 기획서

- `packages/be-entity/src/inquiry.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | orch-requirement |

| 2026-02-26 | Entity 클래스 구현 완료 | be-entity-builder |
