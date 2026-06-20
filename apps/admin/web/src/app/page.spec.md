# 루트 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   [ 브라우저 주소창: http://example.com/ ]           │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │                                             │   │
│   │   (UI 없음 - 서버 사이드 리다이렉트)         │   │
│   │                                             │   │
│   │   → /auth/login 으로 즉시 이동              │   │
│   │                                             │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 사용자가 앱의 루트 경로(`/`)에 접근한다.
2. 클라이언트에서 세션 검증 API를 호출한다.
3. 유효 세션이면 `/dashboard`로, 아니면 `/auth/login`으로 이동한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| route surface | `ScreenSurface` | route page가 page-level surface를 소유 |
| screen rhythm/header | `VStack` + `PageTitleBar` | 세션 확인 중 안내 |
| 로딩 본문 | `SectionSurface` + `Spinner` | screen이 세션 검증 중 로딩 표시 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 검증 중 | 세션 유효성 확인 대기 | 전체 화면 스피너 |
| 인증됨 | `/dashboard`로 클라이언트 이동 | 로딩 후 즉시 이동 |
| 미인증 | `/auth/login`으로 클라이언트 이동 | 로딩 후 즉시 이동 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 초기 진입 | `useVerifyToken()` | 현재 세션 유효성 확인 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `useEffect` | 세션 검증 완료 후 목적지 route로 이동 |

## 특이사항

- `page.tsx` 단일 CSR 파일에서 세션 유효성을 확인합니다.
- 루트 리다이렉트 페이지도 route `ScreenSurface`와 screen `SectionSurface` 안에서 최소 로딩 본문을 렌더링합니다.
- 검증 완료 전에는 최소 로딩 화면만 렌더링합니다.
- `_client.tsx` 없이 page 파일에서 직접 리다이렉트 흐름을 처리합니다.

## 구현 체크리스트

- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] `_client.tsx` 없음

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/page.tsx` |
| page가 소유하지 않는 skeleton | `Page` |

- `page.tsx`는 루트 진입 판별과 리다이렉트용 콘텐츠만 담당합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `detail`
- reusable target: `detail/view`
- screen component path: `packages/fe-ui/src/screen/SessionCheckScreen/SessionCheckScreen.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)