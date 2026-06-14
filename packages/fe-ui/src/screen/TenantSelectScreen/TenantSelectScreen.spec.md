# TenantSelectScreen ui 기획서

> 생성일: 2026-03-03
> 타입: ui
> 위치: packages/fe-ui/src/screen/TenantSelectScreen/TenantSelectScreen.tsx

## 역할

이 파일은 ui 성격의 경량 구성/배럴 책임을 가집니다.

## 디자인 스케치

```text
TenantSelectScreen
- Modal
  - Modal overlay content
    - Modal.Header
    - Modal.Body
      - ListBox
      - Modal.Footer
        - Button
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `Modal` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal overlay content` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Header` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Modal.Body` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ListBox` | `@heroui/react` | 사용자 입력 컨트롤 |
| `ListBox.Item` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Modal.Footer` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |

## 구성 요소

| 항목 | 설명 |
|------|------|
| TenantSelectScreenProps | 공개 계약 요소 |
| TenantSelectScreen | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 초기 화면 기획 수립 | codex |
