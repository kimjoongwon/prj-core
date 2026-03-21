# page 페이지 기획서

> 생성일: 2026-03-12
> 수정일: 2026-03-12
> 타입: page
> 경로: /proposal

## 디자인 목업

```
┌──────────────────────────────────────────────────────────────────────┐
│ 자자                             왜 AI 외주인가 / 작업 방식 / 스택   │
├──────────────────────────────────────────────────────────────────────┤
│ AI-FIRST PRODUCT DELIVERY                                            │
│ 자자는 AI 주도로 외주 개발의 왕복 비용을 다시 설계합니다              │
│ [실행 방식 보기] [기술 기반 보기]                                    │
│ ┌─────────────┬─────────────┬─────────────┐                          │
│ │ 기획-구현    │ 디자인 레이어 │ 반복 작업    │                          │
│ │ 간극 축소    │ 압축         │ 자동화       │                          │
│ └─────────────┴─────────────┴─────────────┘                          │
├──────────────────────────────────────────────────────────────────────┤
│ 왜 AI 외주인가                                                        │
│ ┌ 문제 카드 ┐ ┌ 문제 카드 ┐ ┌ 문제 카드 ┐                            │
├──────────────────────────────────────────────────────────────────────┤
│ 작업 방식 / 실행 흐름 / 비용 최적화 / 기술 스택 / 적합한 프로젝트     │
│ 각 섹션이 카드와 리스트 형태로 순차 배치                              │
└──────────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 방문자는 자자의 AI 중심 외주 방식이 기존 외주와 무엇이 다른지 빠르게 이해합니다.
2. 방문자는 디자인 레이어 축소와 비용 최적화 논리를 섹션별로 확인합니다.
3. 방문자는 기술 스택과 적합한 프로젝트 유형을 보고 협업 적합성을 판단합니다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 기획서 |
|------|----------|--------|
| 루트 래퍼 | `layout.tsx` | `layout.spec.md` |
| Provider | `providers.tsx` | `providers.spec.md` |
| 클라이언트 페이지 | `page.tsx` | `page.spec.md` |
| 정적 데이터 | `proposal-page-data.ts` | `proposal-page-data.spec.md` |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 기본 | 모든 정적 섹션 정상 렌더링 | 전체 랜딩 노출 |
| 앵커 이동 | 상단 내비게이션 또는 CTA 클릭 | 해당 섹션으로 스크롤 |

## API 호출

| 시점 | API | 캐싱 |
|------|-----|------|
| 초기 렌더 | `proposalPageData` 로컬 정적 데이터 import | 별도 API 호출 없음 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| 상단 내비게이션 클릭 | 대응 섹션으로 스크롤 |
| Hero CTA 클릭 | `process`, `stack` 섹션으로 스크롤 |

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [x] proposal-page-data.ts (직렬화 가능한 정적 소개 데이터)
- [ ] E2E 테스트 (Playwright)

## 테스트 케이스

> 구현 도구: Playwright (향후)

### 테스트 커버리지

| 시나리오 | Happy Path | Error Path | Edge Case | 합계 |
|---------|:----------:|:----------:|:---------:|:----:|
| 정적 랜딩 렌더링 | O | - | O | 2 |
| 섹션 앵커 이동 | O | - | O | 2 |

### [TC-001] 랜딩 기본 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 사용자가 `/proposal` 에 진입함 |
| **When** | 클라이언트 page가 로컬 정적 데이터를 읽어 랜딩을 렌더링함 |
| **Then** | Hero, 작업 방식, 비용 최적화, 기술 스택 섹션이 모두 표시됨 |

## 상위 기획서

- `app.spec.md`

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/proposal/web/src/app/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/proposal/web/src/app/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 목록 탐색, 검색, 필터 같은 마스터 콘텐츠만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `master`
- reusable target: `feature/master/list`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | `_client.tsx`와 `_prefetch.ts`를 제거하고 `page.tsx` + `proposal-page-data.ts` 구조로 단순화 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-20 | 공용 ingress 경로와 일치하도록 외부 노출 경로를 `/proposal` 기준으로 조정 | codex |
| 2026-03-12 | proposal-web 정적 랜딩 페이지 기획서 신규 생성 | codex |
