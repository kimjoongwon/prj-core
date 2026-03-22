# detail/view feature 기획서

> 생성일: 2026-03-21
> 타입: feature
> 위치: packages/fe-ui/src/feature/detail/view/index.ts

## 역할

상세 조회, 읽기 전용 detail 본문, inspector view의 공식 재사용 엔트리입니다.
`page role = detail` 화면은 기본적으로 이 타깃을 소비합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `DetailPage` | detail route 콘텐츠용 page wrapper |
| `DetailPageSurface` | `Surface` 기반 detail 본문 wrapper |
| `DetailSection` | detail 섹션 배치 wrapper |
| `DetailSectionCard` | `Surface` 기반 detail 섹션 wrapper |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | detail surface wrapper의 기반 primitive를 `Surface`로 통일 | codex |
| 2026-03-21 | detail page primitive 치환용 thin wrapper를 추가 | codex |
| 2026-03-21 | `feature/detail/view` 표준 재사용 타깃 신규 추가 | codex |
