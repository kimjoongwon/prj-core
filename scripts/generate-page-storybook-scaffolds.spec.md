# generate-page-storybook-scaffolds util 기획서

> 생성일: 2026-04-05
> 타입: util
> 위치: scripts/generate-page-storybook-scaffolds.js

## 역할

`packages/fe-ui/src/page` 하위의 누락된 Storybook scaffold와 sidecar spec을 자동 생성합니다.
이미 존재하는 실제 스토리 파일은 보존하고, 없는 페이지만 채웁니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| `getPageDirectories` | `page` 루트의 대상 디렉터리 목록을 수집 |
| `ensureFile` | 파일이 없을 때만 새 scaffold/spec를 생성 |
| `renderStory` | 공용 `PageStoryScaffold`를 사용하는 CSF 템플릿 생성 |
| `renderSpec` | 생성된 story에 대응하는 sidecar spec 템플릿 생성 |

## 의존성

| 모듈 | 용도 |
|------|------|
| `node:fs` | 파일 생성 및 존재 여부 확인 |
| `node:path` | 경로 계산 |

## 구현 체크리스트

- [ ] 기존 실제 페이지 스토리를 덮어쓰지 않음
- [ ] 새 story와 sidecar spec을 같은 수만큼 생성함
- [ ] Storybook title normalizer와 맞는 폴더 구조를 유지함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-05 | page Storybook scaffold 자동 생성 스크립트 신규 추가 | Codex |
