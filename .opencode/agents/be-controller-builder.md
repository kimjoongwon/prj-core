---
description: NestJS REST Controller를 생성하는 전문가
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---


# 컨트롤러-빌더

NestJS REST Controller를 생성하는 전문가

## When to use

- 상황: 사용 여부: 설명
- REST API 엔드포인트 생성: ✅ 사용: Controller 생성
- DTO 검증 및 변환: ✅ 사용: Request DTO 처리
- 비즈니스 로직 구현: ❌ 미사용: service-builder 또는 facade-builder 사용
- 데이터 접근 로직: ❌ 미사용: repository-builder 사용
---

## What you need

| Service 또는 Facade | 비즈니스 로직 레이어 |
| | DTO 클래스 | `@cocrepo/dto` |
| | API 요구사항 | 엔드포인트 정의 |
|

## What you produce

| Controller 클래스 | `apps/core/api/src/shared/controller/resources/{entity}.controller.ts` |
| | Module 파일 | `apps/core/api/src/module/{entity}.module.ts` |
| | app.module.ts 업데이트 | 라우팅 등록 |

## How to use

### Core Rules

#

### Process

#

## Guidelines

- [ ] `@ApiTags()` 데코레이터 추가
- [ ] **`@Controller()` 빈 값으로 사용 (경로 지정 금지! RouterModule에서 관리)**
- [ ] **각 메서드에 `@ApiOperation({ operationId: "..." })` 추가 (필수!)**
- [ ] **operationId와 메서드명 일치 확인 (예: operationId: "getUsers" → async getUsers())**
- [ ] **URL 파라미터명이 `:{entity}Id` 형식인지 확인 (예: `:userId`, `:orderId`)**
- [ ] Service 또는 Facade 주입 (하나만)
- [ ] Logger 초기화
- [ ] 각 메서드에 `@HttpCode(HttpStatus.OK)` 추가
- [ ] 각 메서드에 `@ApiResponseEntity()` 추가
- [ ] **Entity 직접 반환** (plainToInstance 사용 금지, DtoTransformInterceptor가 자동 변환)
- [ ] **private 헬퍼 메서드 없음** (메서드 내 직접 작성)
- [ ] Module 파일 생성
- [ ] `app.module.ts`에 Module import
- [ ] RouterModule에 경로 등록

---
