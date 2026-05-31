# CommunityScreen Planning Spec

## 목표
- 모바일 `/community` route에서 현재 지점의 커뮤니티 글 목록을 보여주고, 짧은 글 작성을 bottom sheet로 시작한다.
- 실행 기준은 route delivery spec인 `apps/mobile/src/app/community/index.spec.md`를 따른다.

## 화면 러프

```text
┌────────────────────────────┐
│ COMMUNITY                  │
│ 지점 커뮤니티              │
│ 같은 지점 회원들과...      │
├────────────────────────────┤
│ 작성자 · 방금 전   [내 글] │
│ 저녁 수업 후 스트레칭      │
│ 오늘 저녁 수업 끝나고...   │
├────────────────────────────┤
│ 작성자 · 어제       [공지] │
│ 토요일 오전 수업 안내      │
│ 이번 주 토요일 오전...     │
├────────────────────────────┤
│ [글쓰기] fixed action bar  │
└────────────────────────────┘

BottomSheet: 제목 선택 입력 + 내용 필수 입력 + 취소/등록
```

## 렌더링 / 리듬 계약

| 컴포넌트 | 계층 | 사용 | 신규 여부 | 역할 |
|---|---|---|---|---|
| `ScreenFrame` | layout | 사용 | 기존 | 화면 safe-area와 bottom action bar 배치 |
| `ScreenActionBar` | layout | 사용 | 기존 | 글쓰기 주요 CTA 고정 |
| `VStack` / `HStack` | rhythm | 사용 | 기존 | section/block/inline 리듬 표현 |
| `CommunityPostCard` | data-display | 사용 | 신규 | 게시글 카드 순수 UI |
| `StatusFeedback` | feedback | 사용 | 기존 | loading/empty/error 상태와 다음 행동 |
| `BottomSheet` | layout | 사용 | 기존 | 글 작성 composer |
| `Text` | data-display | 사용 | 기존 | 화면 내부 모든 표시 텍스트 |

## Props / Event

| 이름 | 방향 | 설명 |
|---|---|---|
| `posts` | in | 카드로 렌더링할 커뮤니티 글 |
| `status` | in | `loading`, `error`, `empty`, `ready` |
| `composer` | in | bottom sheet open/value/error/submitting 상태 |
| `onPressWrite` | out | 글쓰기 열기 |
| `onOpenChangeComposer` | out | bottom sheet 열림 상태 변경 |
| `onChangeComposerTitle` | out | 제목 입력 변경 |
| `onChangeComposerText` | out | 내용 입력 변경 |
| `onPressSubmitComposer` | out | 글 등록 |
| `onPressRetry` | out | 목록 재조회 |

## 상태별 렌더링
- loading: `StatusFeedback(status="loading")`
- error: 이유와 `다시 시도` 액션
- empty: 이유와 `첫 글 쓰기` 액션
- ready: `CommunityPostCard[]`

## Story / Unit Test
- Story: ready, empty
- Unit: 목록 렌더링, empty/error action delegation

## 변경 이력
- 2026-05-27: 모바일 커뮤니티 화면 planning spec 최초 작성.
