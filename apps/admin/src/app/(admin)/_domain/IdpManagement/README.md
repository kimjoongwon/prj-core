# IdpManagement (IDP 관리)

> 프로젝트: prj-core / 앱: admin-web
> 생성일: 2026-02-10

## 개요

OIDC 클라이언트 앱을 등록/수정/삭제하고, 활성 세션/토큰을 조회 및 강제 폐기할 수 있는 IDP 관리 기능입니다.

## 범위

| 도메인 | 기능 | 상태 |
|--------|------|------|
| OIDC Client | 목록/상세/등록/수정/삭제 | 신규 |
| OIDC Session | 활성 세션 목록 조회/강제 폐기 | 신규 |

## 페이지 목록

| 페이지 | 경로 | 설명 |
|--------|------|------|
| OidcClientList | /oidc-clients | 클라이언트 목록 |
| OidcClientDetail | /oidc-clients/[oidcClientId] | 클라이언트 상세 |
| OidcClientCreate | /oidc-clients/new | 클라이언트 등록 |
| OidcClientEdit | /oidc-clients/[oidcClientId]/edit | 클라이언트 수정 |
| OidcSessionList | /oidc-sessions | 세션/토큰 목록 + 강제 폐기 |

## 기획서 구조

| 파일 | 레이어 | 내용 |
|------|--------|------|
| 01-overview.md | L0-L2 | 컨텍스트, 사용자, 목표 |
| 02-structure.md | L3-L4 | 기능, 화면 |
| 03-interactions.md | L5-L6 | 인터랙션, API |
| 04-ui-details.md | L7-L8 | 데이터 모델, UI 컴포넌트 |
| 05-technical-design.md | L9-L10 | 비즈니스 로직, 테스트 |
