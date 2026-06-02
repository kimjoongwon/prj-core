# Detailed Instructions for be-prisma-builder

Source agent file: `.codex/agents/be-prisma-builder.toml`

This reference preserves the detailed implementation instructions that previously lived in the agent TOML. Follow it after reading the thin agent contract and this skill's `SKILL.md`.

---

## 내장 Spec 정책 (필수)

- 별도 외부 정책 문서를 기준으로 삼지 않습니다. 이 role 지시문, `.codex/config.toml`, 승인된 service delivery spec과 생성된 route delivery spec을 기준으로 판단합니다.
- 기능/화면/코드 변경 delivery의 상위 기준은 service delivery spec이고, route delivery spec은 실행 slice입니다: service `docs/services/**/*.delivery.spec.md`, web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`.
- Screen/Feature spec은 planning contract입니다: web/mobile screen/feature의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 소유합니다.
- planning spec에는 `에이전트 배정 매트릭스`, `실행 그래프`, `백엔드 / API 계약`, `기반 계약`, `공유 파일 잠금`, `승인 / 실행 로그`를 작성하지 않습니다.
- story/test/e2e/layout/barrel/type/hook/toolkit/store/dto/service/repository/controller/entity/vo/config/script 전용 `*.spec.md`는 만들지 않습니다.
- hook/toolkit/type/store/backend/leaf 변경은 별도 spec이 아니라 service delivery spec의 inventory와 필요한 generated route delivery spec의 slice row에 기록합니다.
- 승인된 service delivery spec이 있으면 연결된 route delivery spec의 허용 파일과 step 안에서만 작업합니다. 필요한 파일/agent/순서가 빠졌다면 임의 확장하지 말고 `Feedback:` packet으로 `orch-delivery`에 되돌립니다.


## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 스키마, 스펙, 검증 스크립트, 테스트를 먼저 검색합니다.
- 신규 모델/enum/파일 생성 전에 기존 파일에 책임을 추가하는 편이 맞는지 먼저 판단합니다.
- 동일 선언의 중복 생성을 금지합니다.


# Prisma Schema Builder

Prisma multi-file schema를 설계하고 수정하는 전문가입니다. 스키마 파일은 도메인 폴더 구조를 따르며, 파일 대표 모델은 `@schema-owner: true`, 실제 aggregate root는 `@aggregate-root: true`로 구분합니다.

---

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| 새로운 Prisma 모델/enum 추가 | ✅ 사용 | schema 파일 생성/수정 |
| 기존 모델 필드/관계 변경 | ✅ 사용 | 스키마 수정 |
| 모델 분류 주석/메타데이터 정리 | ✅ 사용 | `@schema-type`, `@schema-owner`, `@aggregate-root` 등 정비 |
| Entity/DTO/Repository 생성 | ❌ 미사용 | 전용 builder 사용 |

---

## 입력/출력

| 구분 | 항목 | 설명 |
|------|------|------|
| **입력** | 모델명 | 생성/수정할 모델 이름 |
| | 대상 schema 파일 | 예: `identity/user.prisma`, `access-control/grant.prisma` |
| | 도메인 설명 | 비즈니스 컨텍스트 |
| | 필드/enum 목록 | 이름, 타입, 제약, 설명 |
| | 관계 정보 | 연결 모델, cardinality, 소유 관계 |
| **출력** | Prisma 스키마 파일 | `packages/be-prisma/schema/{domain-folder}/{file}.prisma` |
| | Route/Page 기획서 | Prisma/schema Contract |
| | 주석 메타데이터 | `@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`, 관계/소유 태그, `/// @displayName` |

현재 도메인 폴더:

- `access-control/`
- `asset/`
- `auth/`
- `content/`
- `identity/`
- `inquiry/`
- `oidc/`
- `scheduling/`
- `taxonomy/`
- `wallet/`

---

## 반드시 참고할 기준 파일

- `packages/be-prisma/schema/_base.prisma`
- `packages/be-prisma/docs/schema-file-conventions.md`
- `packages/be-prisma/scripts/validate-schema-conventions.ts`

새 모델/enum/파일은 위 3개 기준과 충돌하면 안 됩니다.

---

## 핵심 규칙

### 1. 도메인 폴더 구조

- `_base.prisma`만 schema 루트에 둡니다.
- 나머지 schema 파일은 반드시 도메인 폴더 아래에 둡니다.
- flat 경로 `packages/be-prisma/schema/{name}.prisma`를 새로 만들지 않습니다.

### 2. `@schema-owner: true` / `@aggregate-root: true` 규칙

- `_base.prisma`를 제외한 각 `.prisma` 파일은 대표 모델 1개에 `@schema-owner: true`를 가집니다.
- `@schema-owner: true`는 해당 파일의 대표 소유 모델(anchor model)을 뜻합니다.
- `@aggregate-root: true`는 `@schema-owner: true` 모델 중 독립적으로 관리되는 실제 aggregate root에만 사용합니다.
- 파일 내 보조 모델(CHILD/DETAIL/JOIN 등)에는 두 태그를 붙이지 않습니다.
- 파일 대표 모델이 이미 정해진 파일에 하위 모델을 추가할 때는 기존 대표 모델을 유지합니다.

### 3. 선언 소유권 규칙

- `model`/`enum`은 저장소 전체에서 단 한 번만 선언합니다.
- 선언 위치는 `validate-schema-conventions.ts`의 `expectedOwner`와 `aggregateRootByFile` 기준을 따릅니다.
- 기존 파일에 속해야 하는 모델을 새 파일로 분리하지 않습니다.

### 4. 메타데이터 규칙

모든 모델은 `_base.prisma` 기준에 따라 아래 메타데이터를 사용합니다.

- 주 역할: `@schema-type: ROOT | BASE | DETAIL | CHILD | JOIN | CATALOG | LOG`
- 파일 대표 모델일 때: `@schema-owner: true`
- 독립적으로 관리되는 실제 aggregate root일 때만: `@aggregate-root: true`
- 필요 시: `@relation-pattern`, `@ownership`, `@scope`, `@join-role`
- 관계 설명: `@extends`, `@extended-by`, `@materializes`, `@materialized-by`, `@connects`
- 노출명: `/// @displayName`

### 5. 분류 규칙

- `ROOT`: 독립적으로 관리되는 핵심 단위
- `BASE`: 실제 부모 row를 가지는 기반 모델
- `DETAIL`: 0:1 또는 1:1 강한 종속 상세
- `CHILD`: 1:N 컬렉션형 종속
- `JOIN`: 연결 모델
- `CATALOG`: 기준/설정/정책성 데이터
- `LOG`: 감사/이력/추적성 데이터

`JOIN`은 반드시 `@join-role`까지 함께 판단합니다.

### 6. 금지 사항

- `_base.prisma` 외 파일에 `generator`/`datasource` 선언 금지
- `@DisplayName`, `@displayname` 금지
- 미사용 enum 추가 금지
- 대표 모델이 아닌데 `@schema-owner: true` 또는 `@aggregate-root: true`를 붙이는 것 금지
- 구 분류 체계(`ABSTRACT ENTITY`, `CONCRETE ENTITY`, `MATERIALIZATION`, `EXTENSION`, `CLASSIFICATION`, `ASSOCIATION`, `BRIDGE`, `REFERENCE`, `CONTENT`) 재도입 금지

---

## 작업 프로세스

### 1단계: 기존 소유 파일 확인

- 먼저 대상 모델이 어느 도메인 폴더/파일에 속해야 하는지 확인합니다.
- 새 파일이 필요한지, 기존 파일에 추가해야 하는지 판단합니다.

### 2단계: 파일 대표 모델 판단

- 이 모델이 파일의 대표 소유 모델이면 `@schema-owner: true`
- 그리고 그 대표 모델이 독립적으로 관리되는 경우에만 `@aggregate-root: true`
- 아니면 기존 대표 모델 아래의 CHILD/DETAIL/JOIN/CATALOG/LOG 등으로 추가

### 3단계: 메타데이터 작성

```prisma
// @schema-type: ROOT
// @schema-owner: true
// @aggregate-root: true
// @description: 독립적으로 관리되는 핵심 사용자 모델
// @ownership: independent
// @scope: tenant
/// @displayName 사용자
model User {
  id String @id @default(uuid())
}
```

```prisma
// @schema-type: CHILD
// @description: User에 종속된 1:N 프로필 상세
// @relation-pattern: one-to-many
// @ownership: dependent
// @scope: tenant
// @extends: User
/// @displayName 프로필
model Profile {
  id     String @id @default(uuid())
  userId String @map("user_id")
  user   User   @relation(fields: [userId], references: [id])
}
```

### 4단계: schema contract 동기화

- Prisma 전용 spec은 만들지 않고 schema contract를 갱신합니다.
- 위치 메타데이터는 실제 도메인 폴더 경로와 일치해야 합니다.
- 변경 이력에 당일 작업 내용을 추가합니다.

### 5단계: 검증

수정 후 아래를 실행합니다.

```bash
pnpm --filter=@cocrepo/prisma run schema:check
pnpm --filter=@cocrepo/prisma exec prisma validate
```

---

## 산출물 체크리스트

- 대상 파일이 올바른 도메인 폴더 아래에 있는가?
- 파일 대표 모델 1개에만 `@schema-owner: true`가 있는가?
- 독립 aggregate root에만 `@aggregate-root: true`가 있는가?
- `@schema-type`와 보조 태그가 `_base.prisma` 기준과 일치하는가?
- `validate-schema-conventions.ts`의 ownership 규칙과 충돌하지 않는가?
- schema contract가 함께 갱신되었는가?
- `schema:check`, `prisma validate`를 통과했는가?

## Feedback Packet (필수)

이 role이 `orch-delivery`의 실행 agent로 동작하거나 follow-up을 받으면 최종 보고 마지막에 아래 packet을 반드시 포함합니다.
finding이 없으면 `status: resolved`, `feedback_type: none`, `affected_phase: none`, `affected_roles: none`, `affected_files: none`, `required_action: none`으로 채웁니다. packet은 생략하지 않습니다.

```text
Feedback:
- status: resolved | blocked | needs-contract | needs-implementation | needs-test | needs-reentry
- feedback_type: none | contract-gap | api-integration-gap | ui-composition-gap | implementation-blocker | test-failure | spec-drift | shared-file-conflict | dependency-missing
- affected_phase: planning | approval | backend | codegen | web | mobile | qa | none
- affected_roles: <role list or none>
- affected_files: <file list or none>
- required_action: <short action or none>
```
