# 비밀번호 변경 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/my-account/change-password`

## 사용자 시나리오

1. 관리자가 내 계정 메뉴에서 "비밀번호 변경"을 선택하여 페이지에 진입한다
2. 현재 비밀번호를 입력한다
3. 새 비밀번호를 입력하면 실시간 비밀번호 강도 검증이 표시된다
4. 새 비밀번호 확인을 입력하면 일치 여부가 표시된다
5. 선택적으로 "다른 기기에서 로그아웃" 체크박스를 선택한다
6. "비밀번호 변경" 버튼을 클릭하면 API를 호출한다
7. 성공 시 완료 화면이 표시된다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | `PageSurface` | title="비밀번호 변경", description="현재 비밀번호를 확인한 후 새 비밀번호를 설정합니다." |
| 폼 영역 | `SectionSurface` | 비밀번호 변경 폼 (max-w-md) |
| 완료 화면 | `SectionSurface` | 성공 아이콘 + 메시지 + "다시 변경하기" 버튼 |

## 폼 필드

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| currentPassword | Input (password) | O | 현재 비밀번호 |
| newPassword | Input (password) | O | 새 비밀번호 + PasswordStrengthIndicator |
| confirmPassword | Input (password) | O | 새 비밀번호 확인 (불일치 시 에러) |
| logoutOtherDevices | Checkbox | X | 다른 기기에서 로그아웃 (기본: false) |

## 비밀번호 정책 규칙 (PasswordStrengthIndicator)

| 규칙 | 라벨 | 검증 |
|------|------|------|
| minLength | 8자 이상 | `pw.length >= 8` |
| maxLength | 128자 이하 | `pw.length <= 128` |
| uppercase | 영문 대문자 포함 | `/[A-Z]/` |
| lowercase | 영문 소문자 포함 | `/[a-z]/` |
| number | 숫자 포함 | `/[0-9]/` |
| special | 특수문자 포함 | 특수문자 정규식 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 초기 | 빈 폼 표시 | 버튼 비활성화 |
| 입력 중 | 비밀번호 강도 표시 + 일치 여부 | 실시간 피드백 |
| 유효 | 모든 조건 충족 | 버튼 활성화 |
| 제출 중 | API 호출 중 | 버튼 로딩 |
| 에러 | 서버 에러 발생 | 에러 배너 표시 |
| 완료 | 변경 성공 | 성공 아이콘 + "다시 변경하기" 버튼 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 제출 시 | `useChangePassword` | { currentPassword, newPassword, confirmPassword, logoutOtherDevices } |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| handleSubmit | changePassword API 호출 |
| handleReset | 모든 상태 초기화 (완료 화면에서 다시 변경) |

## 서버 에러 메시지 매핑

| 서버 메시지 | 한글 표시 |
|------------|----------|
| CURRENT_PASSWORD_INCORRECT | "현재 비밀번호가 올바르지 않습니다." |
| PASSWORD_POLICY_VIOLATION* | "비밀번호가 정책 조건을 충족하지 않습니다." |
| PASSWORD_REUSE | "최근 사용한 비밀번호는 다시 사용할 수 없습니다." |
| PASSWORD_MISMATCH | "비밀번호가 일치하지 않습니다." |
| 기타 | "비밀번호 변경에 실패했습니다." |

## 특이사항

- 상태 관리: `useState` (MobX useLocalObservable 미사용)
- 프리페칭 없음 (서버 컴포넌트는 단순 래퍼)
- 폼 제출은 `<form>` onSubmit으로 처리
- 비밀번호 강도 검증은 클라이언트 전용
- 버튼 활성화 조건: currentPassword 입력 + 모든 정책 규칙 통과 + 비밀번호 일치

## 구현 체크리스트

- [x] page.tsx (서버 컴포넌트, 단순 래퍼)
- [x] _client.tsx (클라이언트 컴포넌트, observer 래핑)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
