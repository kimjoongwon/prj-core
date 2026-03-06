# preview.jsx Spec

## 목적
- Storybook Preview 전역 데코레이터와 파라미터를 정의합니다.
- 기본 배경/정렬 규칙과 공통 Provider를 제공합니다.

## 핵심 동작
- 모든 스토리에 `NuqsAdapter`, `ToastProvider`를 적용합니다.
- 기본 배경을 `plate-dark`로 설정하고 Plate 색상 팔레트를 제공합니다.
- 스토리 정렬 시 루트 카테고리 순서를 실제 컴포넌트 폴더 축(`Features > Inputs > Layouts > Page > Ui > Widget > Widgets`)에 가깝게 맞춥니다.
- 레거시 루트(`inputs`, `Layout`, `UI`, `ui`, `Cell`, `Form`)는 대응 카테고리 옆에 인접 배치합니다.
- 자동 생성 스토리(`Auto`)는 수동 큐레이션 스토리 뒤로 배치해 사이드바 노이즈를 줄입니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-03-05 | Plate 소유권 배지, 배경 팔레트, 스토리 정렬 규칙 추가 | codex |
| 2026-03-06 | 전역 브랜드 오버레이 제거, 설명 문구 정리 | codex |
| 2026-03-06 | 컴포넌트 폴더 구조 기준으로 스토리 정렬 우선순위 조정 | codex |
| 2026-03-06 | 레거시 루트 인접 배치와 Auto 후순위 정렬 규칙 반영 | codex |
