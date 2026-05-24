# 대시보드 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/dashboard`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌────────────────────────────────────────────────────────────────┐
│  [사이드 네비게이션]  │  메인 콘텐츠 영역                       │
│                      │                                         │
│  - 대시보드          │  대시보드                               │
│  - 이용자            │  관리자 대시보드에 오신 것을 환영합니다.   │
│  - 역할              │                                         │
│  - ...               │  ┌──────────┐ ┌──────────┐             │
│                      │  │ 오늘 예약  │ │ 전체 회원 │             │
│                      │  │          │ │          │             │
│                      │  │    -     │ │    -     │             │
│                      │  └──────────┘ └──────────┘             │
│                      │                                         │
│                      │  ┌──────────┐ ┌──────────┐             │
│                      │  │ 신규 문의  │ │이번달 매출│             │
│                      │  │          │ │          │             │
│                      │  │    -     │ │    -     │             │
│                      │  └──────────┘ └──────────┘             │
│                      │                                         │
│                      │  (위젯 데이터 미구현 - 스텁 상태)         │
└──────────────────────┴─────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 로그인 후 기본 랜딩 페이지(대시보드)에 진입한다
2. 요약 위젯 카드(오늘 예약, 전체 회원, 신규 문의, 이번 달 매출)를 확인한다
3. 로그인 직후 hydration recoverable error 없이 헤더와 본문이 정상 결합된다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | `DetailPage` + `PageTitleBar` | "대시보드" + "관리자 대시보드에 오신 것을 환영합니다." |
| 상세 surface | `DetailPageSurface` | detail/view 공통 surface를 소비 |
| 위젯 그리드 | `DetailSectionCard` (grid) | 4컬럼 반응형 그리드 (md:2, lg:4) |

## 위젯 카드 (스텁)

| 카드 | 라벨 | 현재 값 | 상태 |
|------|------|---------|------|
| 오늘 예약 | "오늘 예약" | "-" | 미구현 (플레이스홀더) |
| 전체 회원 | "전체 회원" | "-" | 미구현 (플레이스홀더) |
| 신규 문의 | "신규 문의" | "-" | 미구현 (플레이스홀더) |
| 이번 달 매출 | "이번 달 매출" | "-" | 미구현 (플레이스홀더) |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 기본 | 스텁 위젯 표시 | 4개 카드 + "-" 값 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| - | - | 현재 API 호출 없음 (추후 대시보드 위젯 데이터 연동 예정) |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| - | 현재 이벤트 핸들러 없음 |

## 특이사항

- `"use client"` 컴포넌트 (observer 래핑)
- `detail/view`의 `DetailPage`, `DetailPageSurface`, `DetailSectionCard` 조합을 사용합니다.
- 위젯은 모두 스텁 상태 (값이 "-")
- 프리페칭 없음, 서버 컴포넌트 래퍼 없음
- E2E에서 로그인 후 콘솔에 hydration recoverable error가 없어야 한다

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [x] 로그인 후 hydration recoverable error 회귀 테스트
- [x] 페이지 헤더 영역 적용 (`DetailPage` + `PageTitleBar`)
- [ ] 대시보드 위젯 데이터 연동 (미구현)

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/dashboard/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 `detail/view`의 detail shell 안에서 대시보드 읽기 전용 본문만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `detail`
- reusable target: `detail/view`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | 관리자 대시보드를 `DetailPage`/`DetailPageSurface`/`DetailSectionCard` 조합으로 정리하고 spec 설명을 동기화 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-route-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-14 | 로그인 후 대시보드 진입 시 hydration recoverable error가 없어야 한다는 E2E 회귀 조건 추가 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
