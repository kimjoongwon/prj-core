# UnsavedChangesIndicator Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/UnsavedChangesIndicator/

## 역할

저장되지 않은 변경사항이 있을 때 화면 하단 중앙에 표시되는 플로팅 알림 바입니다. 저장/초기화 액션을 제공합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[visible=true, 기본 상태]

        (화면 콘텐츠 영역)


  ┌──────────────────────────────────────────────────┐
  │  ⚠ 저장되지 않은 변경사항이 있습니다.    [초기화]  [저장]  │
  └──────────────────────────────────────────────────┘
              (화면 하단 중앙 플로팅)

[visible=true, 저장 중 (isSaving=true)]

  ┌──────────────────────────────────────────────────┐
  │  ⚠ 저장되지 않은 변경사항이 있습니다.    [초기화]  [⏳ 저장 중]  │
  └──────────────────────────────────────────────────┘

[visible=false]
  (표시 없음 - 숨김 처리)
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 (visible=true) | 플로팅 카드 + 경고 아이콘 + 초기화/저장 버튼 |
| 저장 중 (isSaving=true) | 저장 버튼 로딩 스피너 + 비활성화 |
| 숨김 (visible=false) | 컴포넌트 미표시 |

## Props

```typescript
interface UnsavedChangesIndicatorProps {
  visible: boolean;
  isSaving?: boolean;  // 기본값: false
  onSave: () => void;
  onReset: () => void;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Card/CardBody | 알림 바 컨테이너 |
| HeroUI Button | 초기화/저장 버튼 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
