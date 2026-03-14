# I18n Translation Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-03-13
> 타입: service
> 위치: packages/be-service/src/i18n/translation.service/index.ts

## 역할

다국어 번역 키를 현재 요청 언어로 변환하는 서비스입니다.
DB, JSON 파일, 기본 언어 폴백 순서로 번역을 조회합니다.
CLS(Continuation Local Storage)를 통해 현재 요청의 언어 코드를 가져옵니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `I18nService` (nestjs-i18n) | JSON 파일 기반 번역 조회 |
| `ClsService` (nestjs-cls) | 현재 요청 언어 코드 조회 |
| `PrismaService` | DB 번역 데이터 조회 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `translate` | `key: string` | `Promise<string>` | 번역 키를 현재 언어로 번역 |
| `getTranslation` | `languageCode: LanguageCode, key: string` | `Promise<string \| null>` | 특정 언어와 키로 번역 조회 |

## 비즈니스 규칙

### 번역 우선순위 (translate 메서드)

1. **DB 확인**: `Translation` 테이블에서 `(languageCode, key)` 복합 키로 조회
2. **JSON 파일 확인**: nestjs-i18n의 로컬 JSON 번역 파일 조회
3. **기본 언어 폴백**: 현재 언어가 기본 언어(ko_KR)가 아니면 ko_KR로 재시도
4. **키 자체 반환**: 번역 없으면 키 문자열 그대로 반환

### 현재 언어 결정

- CLS에서 `CONTEXT_KEYS.LANGUAGE` 값으로 언어 코드 조회
- CLS에 값이 없으면 `DEFAULT_LANGUAGE` (ko_KR) 사용

## 에러 처리

- 번역 없는 경우: 키 자체 반환 (에러 없음)
- `getTranslation`: 번역 없는 경우 `null` 반환
- DB 번역 조회 실패 시: 예외를 다시 던지지 않고 JSON 번역/기본 언어/키 자체 반환으로 폴백

## 권한 요구사항

- 내부 서비스 전용 (에러 메시지 변환, 응답 메시지 생성 등에서 사용)

## 구현 체크리스트

- [x] i18n/translation.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-13 | 도메인 TranslationService와 충돌하지 않도록 `I18nTranslationService`로 명명 | codex |
| 2026-03-13 | `translation.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
| 2026-03-13 | 중첩 폴더 구조에 맞게 `PrismaService` 상대 import 경로를 `../../prisma.service`로 보정 | codex |
| 2026-03-14 | DB 번역 조회 실패 시 JSON/i18n 폴백으로 계속 동작하도록 예외 흡수 규칙 추가 | codex |
