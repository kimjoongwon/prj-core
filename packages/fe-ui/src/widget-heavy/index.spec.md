# widget-heavy 배럴 기획서

> 생성일: 2026-03-11
> 타입: widget
> 위치: packages/fe-ui/src/widget-heavy/index.ts

## 역할

`@cocrepo/ui` 루트 배럴에서 분리한 무거운 widget 공개 export를 모읍니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| DiagramViewer | 무거운 다이어그램 viewer export |
| MarkdownEditor | 무거운 markdown editor export |
| TimelineChart | 무거운 gantt chart export |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | `mermaid`/`frappe-gantt` 계열 widget을 루트 배럴에서 분리하기 위한 전용 서브패스를 추가 | codex |
