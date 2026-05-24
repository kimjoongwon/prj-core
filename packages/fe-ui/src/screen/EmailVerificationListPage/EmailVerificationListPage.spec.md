# EmailVerificationListPage ui 기획서

> 생성일: 2026-04-29
> 타입: ui
> 위치: packages/fe-ui/src/screen/EmailVerificationListPage/EmailVerificationListPage.tsx

## 역할

회원가입 이메일 인증 요청 목록 화면의 pure screen 컴포넌트입니다.
조회, query state, 재발송 mutation은 route thin container가 소유하고 이 파일은 목록 시각 조합과 재발송 확인 modal만 담당합니다.

## 디자인 스케치

```text
EmailVerificationListPage
- VStack
  - PageTitleBar
  - Surface
    - DataGrid
  - ConfirmModal
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목과 설명 |
| `Surface` | `@cocrepo/ui` | 목록 영역 elevation |
| `DataGrid` | `@cocrepo/ui` | 이메일 인증 목록 표시 |
| `ConfirmModal` | `@cocrepo/ui` | 재발송 확인 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| EmailVerificationListPageProps.verifications | EmailVerificationDto[] optional row 계약 |
| EmailVerificationListPageProps | pure screen 입력 계약 |
| adminEmailVerificationsPageQueryInputs | route와 page가 공유하는 query input 정의 |
| EmailVerificationListPage | 공개 계약 요소 |

## 상태별 렌더링

| 상태 | 렌더링 |
|------|--------|
| loading | DataGrid loading 상태 |
| empty | `조회된 이메일 인증 요청이 없습니다.` |
| resend disabled | `canResend=false` 또는 cooldown 중이면 row action 비활성 |
| resend modal | 이메일 주소와 기존 링크 교체 안내 표시 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-29 | 이메일 인증 목록 pure screen 초기 생성 | codex |
