# BackButton Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/BackButton/

## 역할

모바일 서브메뉴 화면에서 이전 화면으로 돌아가는 뒤로가기 버튼을 제공합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
기본 (iconOnly: false)
┌─────────────────┐
│  ‹  뒤로        │
└─────────────────┘

아이콘 전용 (iconOnly: true)
┌──────┐
│  ‹   │
└──────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | `‹ 뒤로` 텍스트+아이콘 버튼 (variant="light") |
| 아이콘 전용 | `‹` 아이콘만 표시 |
| 커스텀 라벨 | `‹ 이전 페이지` 등 label prop으로 변경 |

## Props

```typescript
interface BackButtonProps {
  onClick: () => void;
  label?: string;           // 기본값: "뒤로"
  iconOnly?: boolean;       // 기본값: false
  className?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Button | 버튼 렌더링 (variant="light") |
| ChevronLeft (Lucide) | 뒤로가기 아이콘 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
