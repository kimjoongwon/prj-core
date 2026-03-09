# safe.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/wallet/safe.prisma

## 역할

Safe 멀티시그 지갑 도메인의 핵심 스키마를 정의합니다.
`SafeWallet`(지갑), `SafeTransaction`(트랜잭션), `SafeConfirmation`(서명 확인)으로 책임을 분리합니다.

## 분류 기준

- `SafeWallet`: `ROOT`
- `SafeTransaction`: `CHILD`
- `SafeConfirmation`: `CHILD`

## 주석 표준

- 모델 상단에 `@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`, `@relation-pattern`, `@ownership`, `@scope`, `@join-role`, `@description`을 유지합니다.
- 상하위 관계는 `@extends`, `@extended-by`로 명시합니다.
- 모델명은 `/// @displayName`으로 노출명을 명시합니다.
- 모델 주석 메타데이터는 `@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`와 보조 태그(`@relation-pattern`, `@ownership`, `@scope`, `@join-role`) 체계를 함께 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 파일 대표 모델과 실제 aggregate root를 `@schema-owner: true` / `@aggregate-root: true`로 분리 | codex |
| 2026-03-10 | 스키마 파일을 도메인 폴더 구조로 재배치하고 sidecar 위치 메타데이터를 갱신 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-06 | Safe 도메인 모델에 역할 기반 표준 주석을 추가하고 분류 기준을 명시 | codex |
