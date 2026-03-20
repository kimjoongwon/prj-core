# _client.tsx 기획서

> 생성일: 2026-03-12
> 타입: page-client
> 위치: apps/proposal/web/src/app/_client.tsx

## 역할

소개 랜딩의 실제 UI 렌더링과 섹션 앵커 상호작용을 담당합니다.
HeroUI 컴포넌트, `@cocrepo/ui` 레이아웃, `framer-motion` 애니메이션을 조합해 AI-first 브랜드 톤을 표현합니다.
라이트 기본 화면과 다크 모드 토글을 모두 지원하며, 사용자 선택을 로컬에 유지합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `ProposalPageClient` | 정적 페이지 데이터 기반 랜딩 렌더러 |
| `pageData` | `_prefetch.ts`가 제공하는 직렬화 가능한 소개 데이터 |

## 섹션 구성

- Hero
- Why this model
- Approach
- Execution flow
- Cost optimization
- Tech credibility
- Best fit + Closing note

## 상호작용

- 상단 내비게이션 `Button` 클릭 시 섹션 스크롤
- 상단 내비게이션의 Theme 토글 클릭 시 `localStorage`와 `html.dark`를 동기화
- Hero CTA 클릭 시 `process`, `stack` 섹션 스크롤
- 나머지 콘텐츠는 읽기 전용 정적 카드/리스트 렌더링

## 카피 톤

- 외주 업계의 수주 인력과 실제 제작 인력 간 괴리를 직접적으로 설명
- AI가 기획, 디자인, 개발의 80% 초안을 빠르게 만드는 시대라는 전제 사용
- 어중간한 중간 계층이 비용과 일정 병목이 된다는 메시지 강조
- Figma보다 Code가 기준 자산이며 `Code to Storybook`이 더 적합한 공유 방식이라는 관점 강조
- 고객은 단순 제작 인력이 아니라 AI 개발 플로우와 거래한다는 메시지 강조
- 2년 유지보수 보장과 끝까지 책임지는 구조를 명시

## 레이아웃 밀도

- 외곽 패딩을 넓혀 첫 화면 압박감을 줄임
- 섹션 간 `gap`과 카드 내부 패딩을 늘려 읽기 호흡을 확보
- Hero, 상단 내비게이션, 카드 그리드 사이 간격을 넉넉하게 조정

## 재사용 원칙

- 공용 레이아웃은 `Page`, `Section`, `Container` 재사용
- HeroUI의 `Button`, `Card`, `Chip`, `Divider` 재사용
- 신규 공용 UI 패키지 생성 없이 페이지 내부 helper 컴포넌트로 조합

## 구현 체크리스트

- [x] `"use client"` 선언
- [x] `observer` 적용
- [x] 섹션 앵커 이동 처리
- [x] 라이트 기본 + 다크 토글 처리
- [x] AI 중심 메시지/비용 최적화 메시지 렌더링
- [x] README 기반 기술 스택 카드 렌더링

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-20 | 라이트 기본 UI와 다크 모드 토글, 테마별 대비 클래스를 반영 | codex |
| 2026-03-14 | proposal-web 랜딩 클라이언트의 Biome 포맷 정렬을 반영해 lint 기준과 코드 가독성을 맞춤 | codex |
| 2026-03-12 | proposal-web 랜딩 클라이언트 렌더러 신규 생성 | codex |
| 2026-03-12 | 외주 업계 현실과 AI 시대 병목 구조를 드러내는 카피 톤으로 조정 | codex |
| 2026-03-12 | Code-first design system과 2년 유지보수 책임 메시지를 반영하는 카피 정책 추가 | codex |
| 2026-03-12 | Pretendard 적용과 여유 있는 여백 중심으로 레이아웃 밀도를 조정 | codex |
| 2026-03-12 | Code to Storybook이 더 적합한 공유 방식이라는 카피로 조정 | codex |
