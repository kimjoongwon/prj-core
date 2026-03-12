# _prefetch.ts 기획서

> 생성일: 2026-03-12
> 타입: data
> 위치: apps/introduction/src/app/_prefetch.ts

## 역할

소개 랜딩의 정적 콘텐츠와 직렬화 가능한 페이지 데이터 계약을 정의합니다.
서버 컴포넌트는 이 파일을 통해 AI 중심 메시지, 섹션 구성, README 기반 기술 스택을 한번에 주입받습니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `SectionId` | 랜딩 내 섹션 앵커 식별자 |
| `IntroductionPageData` | `_client.tsx`로 전달되는 직렬화 가능한 정적 데이터 계약 |
| `getIntroductionPageData()` | 소개 랜딩 데이터 반환 |

## 데이터 범위

- Hero 메시지
- 문제 정의 카드
- AI 중심 작업 방식 카드
- 5단계 실행 프로세스
- 비용 최적화 논리
- README 기반 기술 스택 그룹
- 적합한 프로젝트 유형
- 마무리 선언 문구
- 외주 업계의 수주/제작 괴리와 AI 시대 병목 계층 비판
- Code to Storybook 기반 공유 방식, Code-first design system, 2년 유지보수 보장 메시지

## 구현 체크리스트

- [x] 직렬화 가능한 값만 포함
- [x] 섹션 앵커 ID와 내비게이션 ID 일치
- [x] README 기반 기술 스택 반영
- [x] 문의/백엔드/API 데이터 제외
- [x] 외주 업계 현실과 AI 시대 80% 초안 구조를 서술하는 카피 반영
- [x] Code 중심 기획/디자인, Storybook 공유 방식, 유지보수 보장 문구 반영

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-12 | introduction 랜딩 정적 콘텐츠 계약 신규 생성 | codex |
| 2026-03-12 | 외주 업계 현실과 AI 시대 병목 계층 비판 메시지를 강화 | codex |
| 2026-03-12 | Code-first design, AI 개발 플로우 거래, 2년 유지보수 보장 메시지를 추가 | codex |
| 2026-03-12 | Code to Figma 표현을 Code to Storybook 중심 메시지로 조정 | codex |
