# Action 상세 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/actions/[actionId]`

## 사용자 시나리오

1. 관리자가 Action 목록에서 특정 Action을 클릭하여 상세 페이지에 진입한다.
2. 기본 정보(식별자, 표시명, 분류, 순서, 설명)를 확인한다.
3. Config JSON이 있으면 설정 섹션에서 확인한다.
4. 추가 정보(생성일, 수정일)를 확인한다.
5. 시스템 Action이 아닌 경우 "수정" 또는 "삭제" 버튼을 사용할 수 있다.
6. 삭제 시 확인 모달이 표시되고, 확인하면 삭제 후 목록으로 이동한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `PageSurface` | title="Action 상세", description 동적 (표시명 또는 식별자 기반) |
| 액션 영역 | `Button` x3 | "목록으로" (ArrowLeft) + "수정" (Edit, primary, 비시스템만) + "삭제" (Trash2, danger, 비시스템만) |
| 시스템 안내 | `div` | warning 배경, 시스템 Action은 수정/삭제 불가 안내 (isSystem일 때만 표시) |
| 기본 정보 섹션 | `SectionSurface` | 2열 그리드: 식별자(font-mono + 시스템 Chip), 표시명, 분류(Chip), 순서, 설명 |
| Config 섹션 | `SectionSurface` | JSON pre 포맷 (config가 있을 때만 표시) |
| 추가 정보 섹션 | `SectionSurface` | 2열 그리드: 생성일, 수정일 |
| 삭제 모달 | `Modal` | Action명 표시 + 경고 메시지 + 취소/삭제 버튼 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 중 | API 응답 대기 | "로딩 중..." 텍스트 |
| 데이터 없음 | Action을 찾을 수 없음 | "Action을 찾을 수 없습니다." + "목록으로" 버튼 |
| 시스템 Action | isSystem=true | 수정/삭제 버튼 숨김 + 시스템 안내 배너 표시 |
| 사용자 Action | isSystem=false | 수정/삭제 버튼 표시 |
| 삭제 확인 모달 | 삭제 버튼 클릭 시 | Modal 표시 |
| 삭제 중 | DELETE API 호출 대기 | 삭제 버튼 isLoading, 취소 버튼 isDisabled |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR Prefetch | `GET /api/v1/actions/:id` (prefetchActionDetailData) | 상세 데이터 프리페치 |
| 클라이언트 | `GET /api/v1/actions/:id` (useGetActionById) | ActionResponseDto 반환 (config 포함) |
| 삭제 확인 | `DELETE /api/v1/actions/:id` (useDeleteAction) | Action 삭제 (소프트 삭제) |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/actions` 목록 페이지로 router.push |
| onClickEditButton | `/actions/${actionId}/edit` 수정 페이지로 router.push |
| deleteModal.onOpen | 삭제 확인 모달 표시 |
| onClickDeleteConfirm | deleteAction 뮤테이션 실행 → 성공 시 모달 닫기 + 목록 이동 |
| deleteModal.onClose | 삭제 모달 닫기 |

## group 색상 매핑

| group | 색상 |
|-------|------|
| crud | primary |
| visibility | secondary |
| workflow | success |
| bulk | warning |
| (기타) | default |

## 구현 체크리스트

- [x] page.tsx (서버 컴포넌트)
- [x] _client.tsx (클라이언트 컴포넌트)
- [x] _prefetch.ts (데이터 프리페치)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
