# Link ui 기획서

> 생성일: 2026-04-22
> 타입: ui
> 위치: packages/fe-ui/src/control/Link/Link.tsx

## 역할

`form/page` 계층에서 직접 HeroUI `Link`를 참조하지 않도록 control 레이어에 고정된 재사용 링크 래퍼입니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `LinkProps` | 공개 계약 요소 |
| `Link` | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | form 계층의 control-only 조합 규칙을 맞추기 위해 HeroUI Link 래퍼를 신규 추가 | codex |
