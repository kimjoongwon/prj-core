# AddressEmailVerifyScreen ui 기획서

> 생성일: 2026-03-03
> 타입: ui
> 위치: packages/fe-ui/src/screen/AddressEmailVerifyScreen/AddressEmailVerifyScreen.tsx

## 역할

이 파일은 ui 성격의 경량 구성/배럴 책임을 가집니다.

## 디자인 스케치

```text
AddressEmailVerifyScreen
- VStack
  - VStack
  - VStack
    - Input x2
    - Button (조건부)
    - Input (조건부)
  - Button (조건부)
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `../../rhythm/VStack/VStack` | 화면 조합 요소 |
| `Input` | `../../input/Input` | 사용자 입력 컨트롤 |
| `Button` | `../../action/Button/Button` | 사용자 액션 실행 |

## 구성 요소

| 항목 | 설명 |
|------|------|
| AddressEmailVerifyScreenState | 공개 계약 요소 |
| AddressEmailVerifyScreenProps | 공개 계약 요소 |
| AddressEmailVerifyScreen | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 초기 화면 기획 수립 | codex |
