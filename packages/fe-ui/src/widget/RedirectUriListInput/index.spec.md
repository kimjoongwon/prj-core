# RedirectUriListInput Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/RedirectUriListInput/

## 역할

OIDC 클라이언트의 Redirect URI를 동적으로 추가/삭제/수정하는 입력 위젯입니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────┐
│ ┌────────────────────────────────────┐  [삭제]  │
│ │ https://example.com/callback        │    🗑    │
│ └────────────────────────────────────┘          │
│                                                   │
│ ┌────────────────────────────────────┐  [삭제]  │
│ │ https://app.example.com/auth        │    🗑    │
│ └────────────────────────────────────┘          │
│                                                   │
│ ┌────────────────────────────────────┐  [삭제]  │
│ │ Redirect URI를 입력하세요...        │    🗑    │
│ └────────────────────────────────────┘          │
│  ⚠ 유효하지 않은 URI 형식입니다                   │
│                                                   │
│ [+ URI 추가]                                      │
└─────────────────────────────────────────────────┘

[읽기 전용 상태 (isReadOnly=true)]
┌─────────────────────────────────────────────────┐
│ https://example.com/callback                      │
│ https://app.example.com/auth                      │
└─────────────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 편집 가능 | URI 입력 필드 + 삭제 버튼 + 추가 버튼 |
| 읽기 전용 (isReadOnly=true) | URI 목록만 텍스트로 표시, 버튼 없음 |
| 오류 상태 | 유효하지 않은 항목 아래 오류 메시지 표시 |

## Props

```typescript
interface RedirectUriListInputProps {
  value: string[];
  onChange: (uris: string[]) => void;
  errors?: Record<number, string>;
  isReadOnly?: boolean;  // 기본값: false
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Input | 각 URI 입력 필드 |
| HeroUI Button | URI 추가/삭제 버튼 |

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
