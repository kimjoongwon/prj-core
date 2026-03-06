# TemplateTypeBadge Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/TemplateTypeBadge/

## 역할

메시지 템플릿 유형(EMAIL/SMS/PUSH)을 컬러 코딩된 Badge로 표시합니다. EMAIL=primary, SMS=secondary, PUSH=warning.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[size=sm]
 [EMAIL]   [SMS]   [PUSH]

[size=md (기본)]
 [ EMAIL ]   [ SMS ]   [ PUSH ]

[size=lg]
 [  EMAIL  ]   [  SMS  ]   [  PUSH  ]
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| EMAIL (primary, 파란색) | `[ EMAIL ]` - 파란 배경 흰 텍스트 |
| SMS (secondary, 보라색) | `[ SMS ]` - 보라 배경 흰 텍스트 |
| PUSH (warning, 주황색) | `[ PUSH ]` - 주황 배경 흰 텍스트 |
| size=sm | 작은 패딩, 작은 폰트 |
| size=md | 기본 패딩, 기본 폰트 |
| size=lg | 큰 패딩, 큰 폰트 |

## Props

```typescript
interface TemplateTypeBadgeProps {
  type: "EMAIL" | "SMS" | "PUSH";
  size?: "sm" | "md" | "lg";  // 기본값: "md"
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Chip | 컬러 배지 렌더링 |

## 상태 관리

**없음** (순수 UI)

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
