# Sidecar Spec Policy

## 목적

`*.spec.md`는 source code 파일의 sidecar 문서에만 사용합니다.
AI가 로컬 문서를 읽을 때 `spec` suffix를 동일한 성격의 문서로 해석하기 때문에, 비소스 대상에 같은 suffix를 붙이면 검색 결과와 답변 맥락이 쉽게 혼탁해집니다.

## 허용 범위

- 실제 source code 파일에만 `*.spec.md`를 둡니다.
- 현재 감사/생성 기준의 source code 확장자: `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`, `.mts`, `.cts`, `.sh`
- `*.config.ts/js` 계열은 source code가 아니라 설정 파일로 보고 `*.spec.md` 대상에서 제외합니다.
- `packages/be-prisma/**` 전체와 Prisma schema / generated client는 sidecar 대상에서 제외합니다.

## 금지 범위

- `package.spec.md`, `tsconfig.spec.md`, `app.spec.md`
- `*.toml.spec.md`, `*.json.spec.md`, `*.css.spec.md`, `*.html.spec.md`
- `*.toml.guide.md`
- `*.prisma.spec.md`, `packages/be-prisma/**/*.spec.md`
- `Dockerfile.*.spec.md`, `Jenkinsfile.*.spec.md`
- source file이 없는 디렉터리 설명용 `index.spec.md`
- 템플릿, agent 설정, 운영 메모처럼 코드와 1:1 대응하지 않는 문서

## 권장 대체 이름

| 문서 성격 | 기존 예시 | 권장 이름 |
|------|------|------|
| 앱/도메인 컨텍스트 | `app.spec.md` | `app.context.md` |
| 디렉터리/모듈 개요 | `index.spec.md` | `README.md`, `module.md` |
| 설정 설명 | `package.spec.md`, `vitest.config.spec.md` | `package.guide.md`, `vitest.config.guide.md` |
| 배포/운영 설명 | `Dockerfile.*.spec.md`, `Jenkinsfile.*.spec.md` | `*.ops.md` |
| agent / tool 규칙 | `*.toml.spec.md`, `*.toml.guide.md` | 해당 `*.toml`의 `developer_instructions`, `README.md` |
| 템플릿 문서 | `page.spec.md` template 파일 | `page.template.md` |

## 운영 원칙

- `*.spec.md`를 새로 만들기 전에 대응 source file 경로를 먼저 확정합니다.
- 대응 source file이 삭제되면 sidecar도 같이 삭제하거나 일반 문서 이름으로 바꿉니다.
- Prisma 패키지와 schema/generated 산출물은 코드여도 sidecar를 만들지 않습니다.
- source file이 아닌 설명 문서는 `context`, `guide`, `ops`, `notes`, `template` suffix 중 하나를 사용합니다.
- 단, TOML 설정/agent role 파일은 보조 sidecar 문서를 두지 않고 해당 `.toml` 또는 인덱스 `README.md`에 직접 설명을 둡니다.
- `scripts/spec-audit.js`는 repo 전체 `*.spec.md`를 검사하며, non-source target spec를 orphan으로 보고합니다.

## 마이그레이션 순서

1. repo root / `.codex` / `.claude`의 non-source `*.spec.md`부터 rename합니다.
2. 설정 파일(`package`, `tsconfig`, `*.config.*`, Docker/Jenkins) sidecar를 `*.guide.md` 또는 `*.ops.md`로 옮깁니다.
3. `packages/be-prisma/**`와 `*.prisma.spec.md`는 rename하지 않고 제거합니다.
4. 디렉터리 설명용 `index.spec.md`는 `README.md` 또는 `module.md`로 바꿉니다.
5. `*.toml.guide.md`는 rename하지 않고 제거하거나 내용을 해당 `.toml` / `README.md`에 병합합니다.
6. 마지막으로 `spec:audit`를 돌려 orphan 목록이 source-only 정책과 일치하는지 확인합니다.
