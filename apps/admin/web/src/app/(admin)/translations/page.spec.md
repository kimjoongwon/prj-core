# 정적 번역 관리 페이지 기획서

> 생성일: 2026-05-01
> 타입: page
> 경로: `/translations`

## 사용자 시나리오

1. FULL_ACCESS 관리자가 정적 번역 key-value 목록을 조회합니다.
2. 언어, 카테고리, 번역 완료 상태, key 검색으로 번역 항목을 좁힙니다.
3. 번역 항목을 등록, 수정, 삭제합니다.
4. 전체 또는 선택 언어 기준으로 번역 캐시 갱신을 요청합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `collection`
- reusable target: `data-grid`
- screen component path: `packages/fe-ui/src/screen/StaticTranslationListScreen/StaticTranslationListScreen.tsx`
- route는 Orval translation hooks, nuqs query state, mutation toast, React Query invalidate를 소유합니다.

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetTranslations({ page, limit, key, category, languageCode, isTranslated })` | 번역 목록 조회 |
| 등록 | `useCreateTranslation()` | 번역 key-value 생성 |
| 수정 | `useUpdateTranslation()` | 번역 text/category/isTranslated 수정 |
| 삭제 | `useDeleteTranslation()` | 번역 항목 삭제 |
| 전체 캐시 갱신 | `useInvalidateAllTranslationCache()` | 전체 번역 캐시 무효화 |
| 언어 캐시 갱신 | `useInvalidateTranslationCache()` | 언어별 번역 캐시 무효화 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onCreateTranslation` | create mutation 후 목록 query invalidate |
| `onUpdateTranslation` | update mutation 후 목록 query invalidate |
| `onDeleteTranslation` | delete mutation 후 목록 query invalidate |
| `onInvalidateAllTranslationCache` | 전체 cache invalidate mutation 후 목록 query invalidate |
| `onInvalidateTranslationCache` | 언어별 cache invalidate mutation 후 목록 query invalidate |

## E2E 관점

| 관점 | 확인 |
|------|------|
| 초기 렌더 | 제목, 검색 input, 등록 버튼 노출 |
| 필터 | key/category/language/status query state 반영 |
| form | 등록 modal에서 필수값 입력 후 생성 요청 |
| 수정/삭제 | row action을 통해 mutation 실행 |