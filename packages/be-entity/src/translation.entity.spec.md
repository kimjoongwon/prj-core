# Translation Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/translation.entity.ts

## 역할

다국어 번역 텍스트를 관리하는 엔티티입니다. 언어 코드, 번역 키, 텍스트, 카테고리, 번역 완료 여부를 저장합니다. 키는 콜론(`:`)으로 구분된 계층 구조를 가지며 (예: `menu:users:list`), 번역 완료 여부를 추적하여 미번역 항목을 관리합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| languageCode | LanguageCode | required | - | 언어 코드 (ko, en 등) |
| key | string | required | - | 번역 키 (계층 구조: 'menu:users:list') |
| text | string | required | - | 번역 텍스트 |
| category | string | required | - | 카테고리 |
| isTranslated | boolean | required | - | 번역 완료 여부 |

## Enum

| Enum명 | 값 | 설명 |
|--------|-----|------|
| LanguageCode | (Prisma 정의) | 지원 언어 코드 (ko, en 등) |

## 관계

해당 없음

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isCompleted() | boolean | 번역 완료 여부 확인 |
| belongsToCategory(category) | boolean | 특정 카테고리 소속 여부 확인 |
| isLanguage(languageCode) | boolean | 특정 언어 코드 여부 확인 |
| getKeyPrefix() | string | 번역 키 prefix 반환 (예: "menu:users:list" → "menu") |
| getKeyDepth() | number | 번역 키 depth 반환 (예: "menu:users:list" → 3) |

## 비즈니스 규칙

- `languageCode + key` 조합은 유니크해야 합니다 (동일 언어의 동일 키 중복 불가).
- `isTranslated=false`이면 번역이 완료되지 않은 항목으로 검토가 필요합니다.
- 번역 키는 콜론(`:`)으로 구분된 계층 구조를 사용합니다.
- 소프트 삭제를 통해 번역 삭제 이력을 보존합니다.

## 구현 체크리스트

- [x] translation.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma Translation 타입 implements (직접 implements 없음, extends 사용)
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
