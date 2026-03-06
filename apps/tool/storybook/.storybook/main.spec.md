# main.js Spec

## 목적
- Storybook이 로드할 스토리 파일 범위를 정의합니다.
- `packages/fe-ui/src` 경계를 기준으로 자동 타이틀 추론 기준점을 고정합니다.

## 핵심 동작
- 로컬 `stories` 디렉토리의 mdx 및 CSF 스토리를 함께 로드합니다.
- `packages/fe-ui/src` 아래 스토리는 `src` 폴더를 루트로 삼아 수집합니다.
- 새 스토리가 `title`을 생략해도 실제 컴포넌트 폴더 구조와 가까운 사이드바 경로를 갖도록 유도합니다.
- Vite alias를 통해 워크스페이스 패키지를 직접 해석합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | `@cocrepo/ui` 스토리 루트를 `src/components`에서 `src`로 상향 | codex |
| 2026-03-06 | components 루트 기준 Storybook 스토리 수집 규칙 문서화 | codex |
