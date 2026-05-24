# TenantSelectPage ui 기획서

> 생성일: 2026-03-03
> 타입: ui
> 위치: packages/fe-ui/src/screen/TenantSelectPage/TenantSelectPage.tsx

## 역할

이 파일은 ui 성격의 경량 구성/배럴 책임을 가집니다.

## 디자인 스케치

```text
TenantSelectPage
- Modal
  - ModalContent
    - ModalHeader
    - ModalBody
      - Listbox
      - ModalFooter
        - Button
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `Modal` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalContent` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalHeader` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `ModalBody` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Listbox` | `@heroui/react` | 사용자 입력 컨트롤 |
| `ListboxItem` | `@heroui/react` | 사용자 입력 컨트롤 |
| `ModalFooter` | `@heroui/react` | 확인 또는 보조 작업 오버레이 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |

## 구성 요소

| 항목 | 설명 |
|------|------|
| TenantSelectPageProps | 공개 계약 요소 |
| TenantSelectPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 초기 화면 기획 수립 | codex |
