# storybookFrame ui 기획서

> 생성일: 2026-04-05
> 타입: ui
> 위치: packages/fe-ui/src/page/storybookFrame.tsx

## 역할

`page` 계층 Storybook 스토리에서 공통으로 사용하는 stage/card/scaffold 레이아웃을 제공합니다.
실제 페이지 스토리와 자동 생성된 baseline scaffold가 같은 시각적 문맥을 공유하도록 합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `PageStoryCard` | 단일 페이지 카드를 중앙 stage 위에 배치하는 wrapper |
| `PageStoryStage` | 모달/전체 화면형 페이지 스토리를 위한 stage wrapper |
| `PageStoryScaffold` | 아직 실제 시나리오가 없는 페이지용 baseline scaffold |

## 의존성

| 모듈 | 용도 |
|------|------|
| `react` | JSX 및 스타일 prop 기반 렌더링 |

## 구현 체크리스트

- [ ] `page` 스토리 전반의 배경/카드 레이아웃이 일관됨
- [ ] scaffold 문구 변경 시 자동 생성 스토리와 의미가 어긋나지 않음
- [ ] 시각 스타일 변경 시 기존 실제 페이지 스토리도 함께 점검함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-05 | `page` Storybook 공용 frame 및 scaffold 문서 신규 추가 | Codex |
