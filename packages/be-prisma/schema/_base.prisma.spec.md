# _base.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/_base.prisma

## 역할

Prisma `generator`/`datasource`와 도메인 스키마가 공유하는 모델 분류 메타데이터 규칙을 정의합니다.
도메인 스키마들이 `@schema-type`, `@schema-owner: true`, 필요 시 `@aggregate-root: true` 같은 태그를
헷갈리지 않고 같은 뜻으로 사용할 수 있게 돕는 기준 문서입니다.

문서의 핵심 구분은 다음과 같습니다.

- `@schema-type`: 이 모델이 무슨 역할인지 적는 이름표
- `@schema-owner: true`: 이 파일의 주인공 표시
- `@aggregate-root: true`: 혼자 관리되는 큰 단위 표시
- `@extends` / `@materializes`: 부모 밑에 달린 모델인지, BASE 뼈대를 실제 타입으로 만드는 모델인지 구분

## 운영 규칙

- `_base.prisma` 변경 시 `_base.prisma.spec.md`를 함께 갱신합니다.
- 공통 규칙 변경 시 하위 도메인 폴더(`access-control/`, `identity/`, `asset/` 등) 영향 범위를 명시합니다.
- `@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`, `@relation-pattern`, `@ownership`, `@scope`, `@join-role`, `@description`, `/// @displayName` 메타데이터 규칙을 일관되게 유지합니다.
- 각 schema 파일은 `_base.prisma`를 제외하고 대표 소유 모델 1개에만 `@schema-owner: true`를 가져야 합니다.
- `@aggregate-root: true`는 독립적으로 관리되는 대표 소유 모델에만 부여합니다.
- `@schema-owner: true`는 파일의 주인공을 뜻할 뿐이며, 항상 ROOT/BASE 또는 aggregate root를 뜻하지 않습니다.
- DETAIL은 일반 종속 상세(`@extends`)와 BASE 실체화 상세(`@materializes`)를 구분합니다.
- JOIN은 단순 N:M 여부보다 "연결 자체가 핵심인지"를 기준으로 분류하고 `@join-role`로 뜻을 보강합니다.
- `@join-role`은 특히 `simple-link`, `membership`, `assignment`, `operational-link` 경계를 예시와 판단 질문으로 함께 설명합니다.
- 새 `@join-role`은 이름 차이만으로 추가하지 않고, 반복되는 설계 규칙 차이가 있을 때만 검토합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 예시 경로를 실제 파일명 규칙에 맞춰 `identity/tenant.prisma`로 정정 | codex |
| 2026-03-10 | `@join-role`이 무분별하게 늘어나지 않도록 신규 role 추가 조건을 `_base.prisma` 기준 문서에 명시 | codex |
| 2026-03-10 | `@join-role`이 겹쳐 보일 때 고르는 우선순위와 경계 규칙을 `_base.prisma` 문서에 보강 | codex |
| 2026-03-10 | `_base.prisma` 메타데이터 설명 문장을 더 직접적이고 쉬운 표현으로 정리 | codex |
| 2026-03-10 | `@schema-type` / `@schema-owner` / `@aggregate-root` / `@extends` / `@materializes`의 역할 차이를 명시해 오해 가능성을 줄이도록 기준 문구를 구체화 | codex |
| 2026-03-10 | 파일 대표 모델과 실제 aggregate root를 `@schema-owner: true` / `@aggregate-root: true`로 분리해 기준 문서 갱신 | codex |
| 2026-03-10 | 도메인 폴더 구조와 `@aggregate-root: true` 운영 규칙을 `_base.prisma` 기준 문서에 반영 | codex |
| 2026-03-10 | `@join-role` 선택 기준과 대표 예시를 `_base.prisma` 공통 문서에 보강 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |
