# Message UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/primitive/feedback/Message/

## 역할

정보성 알림 메시지를 간단히 표시하는 컴포넌트. 왼쪽 파란색 테두리 스타일의 알림 영역이다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[기본 구조]
┃ 안내 제목                             ← title (bold)
┃ 이 작업은 되돌릴 수 없습니다.         ← message
  ↑
  왼쪽 4px 파란 테두리 (border-l-4 border-blue-500)
  배경: bg-blue-100 | 텍스트: text-blue-700

[실제 렌더링 예시]
┌────────────────────────────────────────┐
┃ 비밀번호 변경 안내                     │
┃ 비밀번호는 90일마다 변경을 권장합니다. │
└────────────────────────────────────────┘
  role="alert" 접근성 속성 포함
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 (단일 스타일) | 파란 좌측 테두리 + 파란 배경 + 제목 + 본문 |

## Props

```typescript
interface MessageProps {
  /** 메시지 제목 */
  title: string;
  /** 메시지 본문 */
  message: string;
}
```

## 스타일

- 왼쪽 4px 파란색 보더 (`border-blue-500 border-l-4`)
- 파란색 배경 (`bg-blue-100`)
- 파란색 텍스트 (`text-blue-700`)
- `role="alert"` 접근성 속성 포함

## 내부 의존성

- `Text` (data-display/Text)

## 관련 컴포넌트

다양한 상태(info, warning, error, success)가 필요하면 `InfoMessage`를 사용.

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
