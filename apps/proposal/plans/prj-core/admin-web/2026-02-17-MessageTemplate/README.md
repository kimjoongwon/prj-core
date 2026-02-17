# Template (템플릿 관리)

> 프로젝트: prj-core / 앱: admin-web
> 생성일: 2026-02-17

## 개요

이메일(Email), SMS, 푸시(Push) 알림 세 가지 유형의 템플릿을 등록/관리하고, 미리보기 및 발송 테스트를 수행할 수 있는 템플릿 관리 기능입니다.

## 범위

| 도메인 | 기능 | 상태 |
|--------|------|------|
| Template | 목록/상세/등록/수정/삭제 | 신규 |
| Template | 미리보기/발송 테스트 | 신규 |
| TemplateVariable | 템플릿 변수 관리 (CRUD) | 신규 |

## 페이지 목록

| 페이지 | 경로 | 설명 |
|--------|------|------|
| TemplateList | /templates | 템플릿 목록 |
| TemplateDetail | /templates/[templateId] | 템플릿 상세 + 미리보기 |
| TemplateCreate | /templates/new | 템플릿 등록 |
| TemplateEdit | /templates/[templateId]/edit | 템플릿 수정 |

## 기획서 구조

| 파일 | 레이어 | 내용 |
|------|--------|------|
| 01-overview.md | L0-L2 | 컨텍스트, 사용자, 목표 |
| 02-structure.md | L3-L4 | 기능, 화면 |
| 03-interactions.md | L5-L6 | 인터랙션, API |
| 04-ui-details.md | L7-L8 | 데이터 모델, UI 컴포넌트 |
| 05-technical-design.md | L9-L10 | 비즈니스 로직, 테스트 |
