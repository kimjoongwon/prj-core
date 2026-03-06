# safe.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/safe.prisma

## 역할

Safe 멀티시그 지갑 도메인의 핵심 스키마를 정의합니다.
`SafeWallet`(지갑), `SafeTransaction`(트랜잭션), `SafeConfirmation`(서명 확인)으로 책임을 분리합니다.

## 분류 기준

- `SafeWallet`: `CONCRETE ENTITY`
- `SafeTransaction`: `EXTENSION`
- `SafeConfirmation`: `EXTENSION`

## 주석 표준

- 모델 상단에 `@schema-type`, `@description`을 유지합니다.
- 상하위 관계는 `@extends`, `@extended-by`로 명시합니다.
- 모델명은 `/// @displayName`으로 노출명을 명시합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | Safe 도메인 모델에 역할 기반 표준 주석을 추가하고 분류 기준을 명시 | codex |
