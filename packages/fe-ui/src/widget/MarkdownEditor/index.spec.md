# MarkdownEditor Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/MarkdownEditor/

## 역할

툴바를 통해 마크다운 문법(제목, 굵게, 기울임, 코드, 목록, 테이블, 링크 등)을 쉽게 삽입할 수 있는 에디터입니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
기본 상태
┌────────────────────────────────────────────────────┐
│ [H1][H2][H3] │ [B][I][~~] │ [<>][```] │ [≡][•][─] │ [🔗][표] │ [extraActions] │  ← 툴바
├────────────────────────────────────────────────────┤
│                                                    │
│  # 제목                                            │
│                                                    │
│  본문을 입력하세요...                              │
│                                                    │
│  **굵게** *기울임* ~~취소선~~                      │
│                                                    │
│  - 목록 항목 1                                     │
│  - 목록 항목 2                                     │
│                                                    │
└────────────────────────────────────────────────────┘

툴바 버튼 호버 시 (Tooltip)
  [B]
   │
┌──┴───┐
│ 굵게  │  ← Tooltip
└───────┘

extraToolbarItems 추가
┌──────────────────────────────────────────────────────────────┐
│ [H1][H2][H3] │ [B][I] │ ... │ [커스텀1][커스텀2]│[extraActions] │
├──────────────────────────────────────────────────────────────┤
│  편집 영역...                                                │
└──────────────────────────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 툴바(제목/인라인/코드/목록/기타) + textarea 편집 영역 |
| 추가 툴바 | extraToolbarItems로 커스텀 버튼 삽입 |
| 추가 액션 | extraActions 슬롯에 우측 버튼 배치 |
| 포커스 | 편집 영역 테두리 강조 |

## Props

```typescript
interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  extraToolbarItems?: ToolbarItemOrDivider[];
  extraActions?: ReactNode;
  className?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Button | 툴바 각 기능 버튼 |
| HeroUI Tooltip | 툴바 버튼 라벨 표시 |
| Lucide 아이콘 | 제목/굵게/기울임/코드/목록/테이블/링크 아이콘 |
| textarea (네이티브) | 마크다운 편집 영역 |

## 상태 관리

로컬: textareaRef (커서 위치 조작용)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| extraActions | 툴바 우측 추가 액션 버튼 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
