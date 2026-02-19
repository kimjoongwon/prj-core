# UserList Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/user/UserList/

## 역할

회원 목록을 표시하는 Feature 컴포넌트입니다.
API 호출, 검색, 페이지네이션, 상태별 필터링 기능을 포함합니다.
useLocalObservable로 로컬 MobX 상태를 관리하며, customInstance를 사용하여 직접 API를 호출합니다.
URL 검색 파라미터(page, search)와 동기화합니다.

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| API | `@cocrepo/api` > `customInstance` | 회원 목록/삭제 API 호출 |
| DTO | `@cocrepo/dto` > `UserDto` | 회원 데이터 타입 |
| Enum | `@cocrepo/enum` > `DeleteFilter` | 상태 필터 (삭제 여부) |
| Widget | `UserSearchWidget` | 검색 입력 UI |
| Widget | `UserTableWidget` | 회원 테이블 UI |
| UI Library | `@heroui/react` > `Button`, `Pagination` | 등록 버튼, 페이지네이션 |
| Icon | `lucide-react` > `Plus` | 등록 버튼 아이콘 |
| Next.js | `next/navigation` > `useRouter`, `useSearchParams` | 라우팅 및 URL 파라미터 |

## Props

```typescript
interface UserListProps {
  /** 상태 필터 (탭별) */
  statusFilter?: DeleteFilter;
  /** 신규 등록 버튼 클릭 핸들러 */
  onNewClick?: () => void;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| 로컬 MobX (useLocalObservable) | `users` | 회원 목록 데이터 |
| 로컬 MobX (useLocalObservable) | `isLoading` | 로딩 상태 |
| 로컬 MobX (useLocalObservable) | `error` | 에러 메시지 |
| 로컬 MobX (useLocalObservable) | `search` | 검색어 |
| 로컬 MobX (useLocalObservable) | `page` | 현재 페이지 |
| 로컬 MobX (useLocalObservable) | `limit` | 페이지 크기 (20) |
| 로컬 MobX (useLocalObservable) | `total` | 전체 건수 |
| 로컬 MobX (useLocalObservable) | `totalPages` | 전체 페이지 수 |
| 로컬 MobX (useLocalObservable) | `stats` | 통계 (total, active, inactive, newThisMonth) |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| `onNewClick` | 회원 등록 버튼 클릭 시 | 부모에서 등록 페이지 이동 처리 |
| (내부) `handleSearch` | 검색 실행 시 | page=1으로 리셋 후 API 호출 + URL 업데이트 |
| (내부) `handlePageChange` | 페이지 변경 시 | API 호출 + URL 업데이트 |
| (내부) `handleRowClick` | 행 클릭 시 | /users/[userId] 상세 페이지 이동 |
| (내부) `handleEditClick` | 수정 버튼 클릭 시 | /users/[userId]/edit 수정 페이지 이동 |
| (내부) `handleDeleteClick` | 삭제 버튼 클릭 시 | confirm 후 DELETE API 호출 + 목록 새로고침 |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `UserSearchWidget` | Widget | 검색 입력 및 검색 실행 |
| `UserTableWidget` | Widget | 회원 테이블 (행 클릭, 수정, 삭제) |
| `Button` | HeroUI | 회원 등록 버튼 (Plus 아이콘) |
| `Pagination` | HeroUI | 페이지네이션 |

## 구현 체크리스트

- [x] UserList.tsx
- [x] index.ts (re-export)
- [x] observer 적용
- [x] useLocalObservable 로컬 상태
- [x] URL 파라미터 동기화 (page, search)
- [x] 검색 + 페이지네이션 + 필터링

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
