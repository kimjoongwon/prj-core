# InquiryDetailPage.stories.tsx Spec

## 목적
- `page/InquiryDetailPage` Storybook 엔트리에서 실제 페이지 컴포넌트를 렌더링합니다.
- 대표 상태를 canvas에서 바로 확인할 수 있도록 scaffold를 실제 시나리오 스토리로 교체합니다.

## 핵심 동작
- Storybook 사이드바 제목은 `page/InquiryDetailPage`입니다.
- 스토리 파일 기준 경로는 `page/InquiryDetailPage/InquiryDetailPage.stories.tsx`입니다.
- `Default`, `Busy`, `EmptyState` 시나리오를 제공합니다.
- fixture는 현재 detail shell 계약에 맞는 plain object shape를 사용해 proxy/selection warning 없이 렌더링합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | inquiry detail fixture를 plain object 기반 계약으로 재구성해 Storybook runtime warning 없이 상태 시나리오를 재생 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 story page id와 component 이름을 semantic 기준으로 갱신 | codex |
| 2026-04-14 | scaffold를 실제 페이지 시나리오 스토리로 교체하고 Default, Busy, EmptyState 상태를 추가 | Codex |
| 2026-04-05 | 누락된 page Storybook scaffold 신규 생성 | Codex |
