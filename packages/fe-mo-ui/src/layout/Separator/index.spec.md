# Separator 모바일 layout 기획서

> 생성일: 2026-04-08
> 타입: layout
> 위치: packages/fe-mo-ui/src/layout/Separator/index.ts

## 역할

HeroUI Native의 upstream 컴포넌트를 `@cocrepo/mo-ui` 경계 안에서 명시적 wrapper로 감싸고, 모바일 패키지 이름에 맞는 local props 타입을 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `Separator` | upstream root component를 감싼 명시적 wrapper입니다. |
| `SeparatorProps` | upstream props를 기준으로 정리한 local props 타입입니다. |

## 비고

- 단순 re-export 대신 로컬 wrapper를 통해 컴포넌트 경계를 고정합니다.
- compound sub-component나 classNames/hook export가 있는 경우 현재 파일에서 함께 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | 단순 재수출을 제거하고 명시적 wrapper 구조로 전환 | codex |
| 2026-04-08 | HeroUI Native Separator 공개 계약 신규 생성 | codex |
