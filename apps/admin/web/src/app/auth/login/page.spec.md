# 로그인 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/auth/login`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌──────────────────────────────────────────────────────────────┐
│                      관리자 시스템                           │
│                  (bg-black / dark mode)                      │
│                                                              │
│   [좌하단 blur orb: primary/30]  [우상단 blur orb: secondary/20] │
│                                                              │
│              ┌─────────────────────────────┐                 │
│              │        Section            │                 │
│              │      (max-w-md, 중앙정렬)   │                 │
│              │                             │                 │
│              │  ── 정상 진입 (리다이렉팅) ──  │                 │
│              │                             │                 │
│              │     ⟳  (Spinner)            │                 │
│              │  로그인 페이지로 이동 중...   │                 │
│              │                             │                 │
│              │  ── 에러 발생 시 ──           │                 │
│              │                             │                 │
│              │  ⚠  로그인 실패              │                 │
│              │  ─────────────────────────  │                 │
│              │  [에러 메시지 내용]           │                 │
│              │                             │                 │
│              │  ┌─────────────────────┐    │                 │
│              │  │    다시 로그인       │    │                 │
│              │  └─────────────────────┘    │                 │
│              │                             │                 │
│              └─────────────────────────────┘                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 로그인 페이지에 진입한다
2. OIDC 기반 로그인이므로 즉시 IDP의 Authorization 엔드포인트(`/api/v1/auth/login`)로 리다이렉트된다
3. IDP에서 인증 완료 후 콜백으로 돌아올 때 에러가 있으면 에러 메시지를 표시한다
4. "다시 로그인" 버튼을 클릭하면 다시 IDP로 리다이렉트한다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 레이아웃 | `Section` > 중앙 정렬 (max-w-md) | 로그인 레이아웃 |
| 리다이렉트 상태 | `Spinner` + "로그인 페이지로 이동 중..." | 정상 진입 시 |
| 에러 상태 | 에러 제목 + 에러 메시지 + "다시 로그인" 버튼 | 콜백 에러 시 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 리다이렉팅 | IDP로 이동 중 | `Spinner` + "로그인 페이지로 이동 중..." |
| 에러 | OIDC 콜백 에러 | "로그인 실패" 제목 + 에러 메시지 + "다시 로그인" 버튼 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 페이지 진입 | `window.location.href = "/api/v1/auth/login"` | IDP OIDC Authorization 엔드포인트로 브라우저 리다이렉트 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| 페이지 진입 (useEffect) | 에러 쿼리파라미터 없으면 즉시 `/api/v1/auth/login`으로 리다이렉트 |
| onClickRetry | `/api/v1/auth/login`으로 다시 리다이렉트 |

## 훅 구성

| 훅 | 위치 | 역할 |
|----|------|------|
| `useAuthLoginPage` | `hooks/useAuthLoginPage.tsx` | OIDC 로그인 로직 (리다이렉트, 에러 처리) |

### useAuthLoginPage 반환값

| 값 | 타입 | 설명 |
|----|------|------|
| errorMessage | string | searchParams에서 "error" 쿼리파라미터 |
| isRedirecting | boolean | 에러가 없으면 true (리다이렉트 중) |
| onClickRetry | () => void | `/api/v1/auth/login`으로 리다이렉트 |

## 특이사항

- `"use client"` 컴포넌트 (observer 래핑)
- `useSearchParams`로 에러 쿼리파라미터 추출 -> `Suspense`로 래핑
- OIDC 기반이므로 ID/PW 입력 폼 없음
- 프리페칭 없음, 서버 컴포넌트 래퍼 없음

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [x] hooks/useAuthLoginPage.tsx (OIDC 로그인 훅)
- [x] layout.tsx (Section + 중앙 정렬)

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/auth/login/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/auth/login/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 입력, 검증, 생성/수정 폼 흐름만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `form`
- reusable target: `widget/form`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | `page.tsx` default export를 `observer(...)`로 정리해 client page 규칙을 맞춤 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
| 2026-03-03 | 로그인 페이지 레이아웃 네이밍을 `Section` 기준으로 갱신 | codex |
