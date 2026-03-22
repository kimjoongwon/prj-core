# widgets 배럴 기획서

> 생성일: 2026-03-03
> 타입: widget
> 위치: packages/fe-ui/src/widget/index.ts

## 역할

`@cocrepo/ui`의 Widget 계층 공개 export를 `widgets` 디렉토리 하나로 통합합니다.

## 핵심 동작

- 기존 `widget`과 `widgets`로 분산되어 있던 공개 컴포넌트를 `widgets`에서 단일 re-export 합니다.
- 기존 보조 그룹(`ability`, `common`, `role`, `user`)과 일반 widget 컴포넌트를 함께 노출합니다.
- layout shell UI인 `HeaderBar`, `SidePanel`, `BottomNav`, `ActionFab`, `OverlayMenu`도 widget 계층에서 공개합니다.
- 표현 전용 섹션 래퍼는 widget이 아니라 `surface/SectionSurface`에서 관리합니다.
- `DiagramViewer`, `MarkdownEditor`, `TimelineChart`처럼 번들이 무거운 widget은 이 배럴에서 제외하고 `widget-heavy` 서브패스로 분리합니다.

## 의존성

| 모듈 | 용도 |
|------|------|
| `./ability` | 권한 관련 widget 묶음 |
| `./common` | 공용 보조 widget 묶음 |
| `./role` | 역할 관리 widget 묶음 |
| `./user` | 사용자 관리 widget 묶음 |
| 그 외 개별 widget 디렉토리 | 개별 widget 공개 export |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | layout shell 5종을 `primitive/layout`에서 `widget`으로 재배치하고 공개 export에 추가 | codex |
| 2026-03-15 | assets 좌측 폴더 탐색에 사용하는 `FolderTree` widget 공개 export를 추가 | codex |
| 2026-03-15 | 시각 섹션 래퍼 책임을 `surface/SectionSurface`로 이관하고 `widget/Section` 설명을 제거 | codex |
| 2026-03-11 | `DiagramViewer`/`MarkdownEditor`/`TimelineChart`를 루트 widget 배럴에서 제거하고 `widget-heavy`로 분리 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-06 | `widget`/`widgets` 분리를 제거하고 `widgets` 단일 배럴로 병합 | codex |
