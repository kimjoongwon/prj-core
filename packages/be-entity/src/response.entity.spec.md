# ResponseEntity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/response.entity.ts

## 역할

모든 API 응답의 표준 형식을 정의하는 응답 래퍼 클래스입니다. HTTP 상태 코드, 메시지, 데이터, 페이지네이션 메타, 통계/필터/액션 등 확장 필드를 포함한 Flat 구조를 제공합니다. 제네릭 타입으로 데이터(`T`), 메타(`M`), 확장 필드(`E`)를 유연하게 지정할 수 있습니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| httpStatus | HttpStatus | required | - | HTTP 상태 코드 |
| message | string | required | - | 응답 메시지 (한글) |
| data | T \| undefined | optional | undefined | 실제 응답 데이터 |
| meta | M \| undefined | optional | undefined | 페이지네이션 메타 정보 |
| stats | E["stats"] \| undefined | optional | undefined | 통계 정보 (활성/비활성 수 등) |
| filters | E["filters"] \| undefined | optional | undefined | 적용 가능한 필터 옵션 목록 |
| actions | E["actions"] \| undefined | optional | undefined | 권한 기반 가능한 액션 목록 |
| aggregations | E["aggregations"] \| undefined | optional | undefined | 집계 데이터 (차트 등) |
| summary | E["summary"] \| undefined | optional | undefined | 요약 정보 |

## Enum

해당 없음

## 관계

해당 없음

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| WITH_SUCCESS(message) | ResponseEntity\<T\> | 성공 응답 생성 (정적 팩토리) |
| WITH_ERROR(httpStatus, message, data?) | ResponseEntity\<T \| null\> | 에러 응답 생성 (정적 팩토리) |
| WITH_ROUTE(data) | ResponseEntity\<T\> | 데이터와 함께 성공 응답 생성 (정적 팩토리) |
| from(data) | ResponseEntity\<T, M\> | 기존 인스턴스에서 데이터를 교체한 새 인스턴스 반환 |

## 비즈니스 규칙

- Flat 구조를 사용하여 `response.data.data` 같은 중첩 접근을 방지합니다.
- 확장 필드(stats, filters, actions 등)는 필요한 API만 선택적으로 사용합니다.
- `ResponseInterceptor`가 자동으로 Controller 반환값을 ResponseEntity로 래핑합니다.
- Controller에서 직접 ResponseEntity를 생성하지 않고 인터셉터를 통해 자동 처리합니다.
- DELETE(204) 응답 시 body 없이 반환됩니다.
- `RESPONSE_EXTRA_KEYS` 상수로 확장 필드 키 목록을 관리합니다.

## 구현 체크리스트

- [x] response.entity.ts
- [x] ResponseEntity 클래스 구현
- [x] ResponseExtras 인터페이스 정의
- [x] RESPONSE_EXTRA_KEYS 상수 정의
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
