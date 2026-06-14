# 이메일 인증 관리 페이지 기획서

> 생성일: 2026-04-29
> 타입: page
> 경로: `/email-verifications`

## 사용자 시나리오

1. FULL_ACCESS 관리자가 회원 메뉴 하위 이메일 인증 화면에 진입합니다.
2. 회원가입 전 생성된 이메일 인증 요청의 이메일, 이름, 상태, 발송 상태, 발송 횟수, 만료 시각, 인증 시각을 확인합니다.
3. 이메일 검색과 상태 필터로 인증 요청을 좁혀 봅니다.
4. 아직 인증 완료되지 않았고 cooldown이 지난 요청에 인증 메일을 재발송합니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/email-verifications/page.tsx` |
| page가 소유하지 않는 skeleton | `Page` |

- `page.tsx`는 query state, Orval 목록 조회, 재발송 mutation만 담당하고 시각 조합은 `EmailVerificationListScreen`가 소유합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `collection`
- reusable target: `data-grid`
- screen component path: `packages/fe-ui/src/screen/EmailVerificationListScreen/EmailVerificationListScreen.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- page-level `SuspenseQuery`는 사용하지 않고 `useGetEmailVerifications`의 `isLoading`/`isFetching`으로 목록 상태를 제어합니다.

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetEmailVerifications({ take, skip, email, status })` | FULL_ACCESS 전역 이메일 인증 목록 조회 |
| 재발송 확인 | `useResendEmailVerification({ emailVerificationId })` | 인증 링크를 새 토큰으로 회전하고 메일 재발송 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| 이메일 검색 Enter | `email` URL 파라미터 갱신 후 재조회 |
| 상태 필터 변경 | `status` URL 파라미터 갱신 후 재조회 |
| 페이지 변경 | `skip` 상태 갱신 후 재조회 |
| 페이지 크기 변경 | `take` 상태 갱신 후 재조회 |
| 재발송 클릭 | pure screen modal open |
| 재발송 확인 | mutation 성공 후 `getGetEmailVerificationsQueryKey()` prefix invalidate |

## 권한과 Scope

| 항목 | 값 |
|------|----|
| menu subject | `menu:users:email-verifications` |
| page subject | generated route catalog의 `/email-verifications` page subject |
| scopeKind | `global-full-access-only` |

이메일 인증 요청은 User 생성 전에 존재하므로 tenant/space scope가 아니라 FULL_ACCESS 전역 관리 대상으로 취급합니다.

## E2E 관점

| ID | Given | When | Then |
|----|-------|------|------|
| ADMIN-EMAIL-VERIFY-LIST-001 | 관리자 로그인 | 화면 진입 | 타이틀, 설명, DataGrid 표시 |
| ADMIN-EMAIL-VERIFY-LIST-002 | 목록 화면 | 이메일 검색 | URL `email` 파라미터 반영 |
| ADMIN-EMAIL-VERIFY-LIST-003 | 목록 화면 | 상태 필터 선택 | URL `status` 파라미터 반영 |
| ADMIN-EMAIL-VERIFY-LIST-004 | 재발송 가능 row | 재발송 클릭 | 확인 modal 표시 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-29 | 이메일 인증 관리 route page 초기 생성 | codex |
