# DiagramViewer Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/DiagramViewer/

## 역할

Mermaid 기반 다이어그램(flowchart, sequence diagram 등)을 시각화하는 뷰어입니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
Flowchart 렌더링 예시 (dark 테마)
┌─────────────────────────────────────────┐
│                                         │
│    ┌───────┐     ┌───────┐              │
│    │  시작  │────▶│ 처리A │              │
│    └───────┘     └───┬───┘              │
│                      │                  │
│                  ┌───▼───┐              │
│                  │ 처리B  │              │
│                  └───────┘              │
│                                         │
└─────────────────────────────────────────┘

Sequence Diagram 예시
┌─────────────────────────────────────────┐
│  Client         Server                  │
│    │                │                   │
│    │── 요청 ────────▶│                   │
│    │                │                   │
│    │◀─── 응답 ───────│                   │
│    │                │                   │
└─────────────────────────────────────────┘

렌더링 실패 시
┌─────────────────────────────────────────┐
│  [다이어그램 파싱 오류]                   │
│  문법을 확인해 주세요                    │
└─────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| dark (기본) | 어두운 배경의 SVG 다이어그램 |
| default | 밝은 배경의 기본 스타일 다이어그램 |
| forest | 녹색 계열 테마 다이어그램 |
| neutral | 중성 회색 계열 테마 다이어그램 |

## Props

```typescript
interface DiagramViewerProps {
  diagram: string;
  theme?: "dark" | "default" | "forest" | "neutral";  // 기본값: "dark"
  className?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| mermaid (라이브러리) | 다이어그램 SVG 렌더링 |

## 상태 관리

로컬: containerRef로 DOM 직접 조작, Mermaid 초기화 플래그(모듈 레벨)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
