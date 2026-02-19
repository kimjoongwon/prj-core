# 이용자 수정 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/users/[userId]/edit`

## 사용자 시나리오

1. 관리자가 `/users/[userId]/edit` 경로에 진입하면 기존 이용자 정보가 폼에 채워진 상태로 표시된다.
2. 현재 구현은 TODO(미구현) 상태이며, "이 기능은 구현 예정입니다." 메시지가 표시된다.
3. "뒤로" 버튼을 클릭하면 이전 페이지로 이동한다 (router.back).

## 레이아웃 구성 (현재 - TODO 상태)

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 상단 | `Button` (variant="light") | "뒤로" + ArrowLeft 아이콘 |
| 본문 | `div` (bg-content1, rounded-xl) | "회원 수정" 제목 + "이 기능은 구현 예정입니다." 안내 |

## 레이아웃 구성 (기획 - 구현 시)

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `PageSurface` | title="이용자 수정" |
| 기본 정보 섹션 | `SectionSurface` | 이름, 이메일, 전화번호 (기존 값으로 prefill) |
| 분류 정보 섹션 | `SectionSurface` | 역할 (readonly), 분류 Select, 그룹 Multi-Select |
| 하단 액션 | 버튼 영역 | [취소] [저장] |

## 폼 필드 (기획)

| 필드 | 라벨 | 타입 | 필수 | 유효성 검사 | 비고 |
|------|------|------|------|------------|------|
| name | 이름 | Input | X | 2~50자 | 변경 시에만 전송 |
| email | 이메일 | Input | X | 이메일 형식 | 변경 시에만 전송 |
| phone | 전화번호 | Input | X | 한국 휴대폰 형식 | 변경 시에만 전송 |
| roleId | 역할 | 텍스트 표시 | - | - | readonly, 변경 불가 |
| categoryId | 분류 | Select | X | - | 변경 시에만 전송 |
| groupIds | 그룹 | Multi-Select | X | - | 변경 시에만 전송 |

## 제약사항

- 비밀번호 변경은 수정 화면에서 불가 (별도 기능)
- 역할(roleId) 변경은 수정 화면에서 불가 (별도 관리 기능)
- 변경된 필드만 PATCH 요청에 포함

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| TODO | 미구현 상태 | "이 기능은 구현 예정입니다." 안내 메시지 |

## API 호출 (기획)

| 시점 | API | 설명 |
|------|-----|------|
| SSR Prefetch | `prefetchGetUserById(userId)` | 기존 데이터 로드 |
| 클라이언트 렌더 | `useGetUserById(userId)` | 폼 prefill용 조회 |
| 페이지 로드 | `useGetRoleCategories()` | 분류 Select 옵션 조회 |
| 페이지 로드 | `useGetRoleGroups()` | 그룹 Multi-Select 옵션 조회 |
| 저장 실행 | `useUpdateUser()` | PATCH /api/v1/users/:id |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| 뒤로 버튼 클릭 | `router.back()` |
| 취소 버튼 클릭 (기획) | 이용자 상세 화면으로 이동 |
| 저장 버튼 클릭 (기획) | 유효성 검사 → PATCH API 호출 → 성공 시 상세 화면 이동, 실패 시 에러 토스트 |

## 구현 체크리스트

- [x] page.tsx (현재 "use client" 직접 컴포넌트, TODO 상태)
- [ ] page.tsx (서버 컴포넌트, Prefetch 패턴 적용)
- [ ] _client.tsx (클라이언트 컴포넌트, 폼 UI)
- [ ] _prefetch.ts (getUserById + roleCategories + roleGroups 프리페칭)

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
