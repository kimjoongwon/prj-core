# Section UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/surfaces/Section/

## 역할

테두리와 패딩이 적용된 기본 섹션 영역 컴포넌트.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[기본 구조]
┌────────────────────────────────────┐  ← border-1, rounded-xl
│  [자식 요소 A]                     │  ← p-4 (내부 패딩)
│                                    │  ← space-y-4 (자식 간 세로 간격)
│  [자식 요소 B]                     │
│                                    │
│  [자식 요소 C]                     │
└────────────────────────────────────┘
  flex flex-col, w-full, flex-1

[실사용 예시 - 폼 섹션]
┌────────────────────────────────────┐
│  [입력 필드 A]                     │
│                                    │
│  [입력 필드 B]                     │
│                                    │
│  [저장 버튼]                       │
└────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 (단일 형태) | 테두리 + 둥근 모서리 + 내부 패딩 + 자식 간격 |

## Props

```typescript
interface SectionProps {
  /** 섹션 내부 콘텐츠 */
  children: ReactNode;
}
```

## 기본 스타일

`flex w-full flex-1 flex-col space-y-4 rounded-xl border-1 p-4`

## 관련 컴포넌트

엘리베이션 시스템을 사용하려면 `SectionSurface`를 권장.

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
