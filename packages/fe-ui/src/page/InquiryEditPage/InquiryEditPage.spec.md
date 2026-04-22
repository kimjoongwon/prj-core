# InquiryEditPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/InquiryEditPage/InquiryEditPage.tsx

## 역할

이 파일은 문의 수정 화면의 pure page 레이어를 담당합니다. bootstrap 조회, AI 채움, 저장 mutation, 라우팅은 app route가 소유하고 이 파일은 메타 편집 UI와 CTA만 렌더링합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| InquiryEditPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/inquiries | 문의 enum type 참조 |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-03-30 | update bootstrap, AI fill, 저장 mutation, 라우팅을 route로 이동하고 page를 props 기반 pure contract로 재정의 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
