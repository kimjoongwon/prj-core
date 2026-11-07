# OpenSpec 문서·CLI 사용 안내

OpenSpec은 변경별 요구사항·설계·작업·검증 조건을 기록하는 도구다. 여러 owner가 함께 바뀌거나 사용자 동작·공개 계약이 바뀌는 작업에서 합의할 내용을 남기고 싶을 때 선택적으로 사용한다. 기존 제품과 과거 설계 문서를 일괄 변환하지 않는다.

이 문서는 저장소의 OpenSpec 사용법을 소유한다. 공통 규칙은 [AGENTS.md](../AGENTS.md), 역할·ownership 계약은 [Codex agent 원본](../.codex/agents/), 패키지 기술 계약은 해당 package owner 문서가 canonical이다. 사용자 요구사항과 승인된 설계 문서의 경로를 change에 연결하고, 같은 계약을 다시 정의하지 않는다. 구현과 테스트는 기존 owner가 맡는다.

## 설치와 명령

저장소가 정한 Node.js·pnpm 버전으로 루트에서 실행한다. 새 clone이나 worktree도 의존성 설치 후 바로 사용할 수 있다. `openspec/config.yaml`은 버전 관리되므로 `init`을 반복할 필요가 없다.

```bash
pnpm install --frozen-lockfile
pnpm openspec --version
pnpm openspec:check
```

`@fission-ai/openspec`은 루트 devDependency에 `1.16.1`로 고정한다. `pnpm openspec <args>`는 로컬 CLI를 실행하며 telemetry와 첫 실행 completion 알림을 실행 환경변수로 꺼서 이 진입점의 자동 전역 설정 쓰기를 방지한다. `pnpm openspec:check`는 `validate --all --strict --no-interactive`로 현재 명세와 활성 change를 검사한다. 기존 `lint`, `test`, `type-check` 명령은 별도로 유지한다.

`pnpm openspec`은 터미널 CLI다. `/opsx:*`는 AI 도구 연동이 제공하는 slash command이며 이 방식에서는 사용하지 않는다. 초기화 출력의 일반적인 slash command 예시도 설치된 명령을 뜻하지 않는다.

새 OpenSpec 구조를 초기화할 때만 다음처럼 도구 연동을 생략한다.

```bash
pnpm openspec init --tools none --language '한국어 (ko-KR)' --no-animation
```

도구를 선택하는 `init`이나 도구용 instructions를 재생성하는 `update`는 이 사용 경로에 포함하지 않는다. CLI 버전을 갱신할 때는 `package.json`의 정확한 버전과 lockfile을 함께 변경하고 아래 검증을 다시 실행한다. `openspec/config.yaml`의 한글 설정과 기존 owner 참조는 직접 유지한다. 도구별 skills·commands·prompts와 전역 설치·설정은 추가하지 않는다.

## 변경 작성부터 보관까지

1. 관련 코드·테스트·기존 명세와 canonical owner 문서를 확인하고 변경 이름을 정한다.

   ```bash
   pnpm openspec list
   pnpm openspec list --specs
   pnpm openspec new change <change-name>
   pnpm openspec status --change <change-name>
   pnpm openspec templates --json
   pnpm openspec instructions proposal --change <change-name>
   ```

2. `instructions <artifact>`와 `status`에 따라 `proposal.md`, `specs/<capability>/spec.md`, `design.md`, `tasks.md`를 작성한다. CLI는 구조와 작성 지침을 제공하고 문서 내용은 작성자가 채운다. `instructions specs`, `instructions design`, `instructions tasks`에도 같은 `--change`를 전달한다. 설명문은 한글로 쓰고 `## ADDED Requirements`, `## MODIFIED Requirements`, `### Requirement:`, `#### Scenario:`, `SHALL`/`MUST`, `WHEN`/`THEN` 같은 고정 구조는 유지한다. 기존 요구사항 수정은 해당 requirement 전체와 시나리오를 delta에 담는다.

3. 명세를 확인하고 기존 owner가 구현과 관련 테스트를 수행한다. `tasks.md`에는 실제 확인한 항목만 완료로 표시한다. strict 검증은 명세 구조를 검사하므로 구현·테스트 결과도 함께 확인한다.

   ```bash
   pnpm openspec show <change-name> --type change --no-interactive
   pnpm openspec validate <change-name> --strict --no-interactive
   pnpm openspec:check
   ```

4. 구현·테스트·문서 검증이 끝나면 change와 현재 명세의 의미를 대조하고 보관한다. 아래 CLI `archive`는 delta를 `openspec/specs/`에 병합한 뒤 날짜가 붙은 `openspec/changes/archive/`로 change를 옮긴다. 이 경로에서는 별도 slash `sync`를 실행하지 않는다. `--yes`는 CLI의 보관 확인만 생략하며 PR 병합이나 배포 승인에 영향을 주지 않는다.

   ```bash
   pnpm openspec instructions archive --change <change-name>
   pnpm openspec archive <change-name> --yes
   pnpm openspec:check
   pnpm openspec validate --archived --strict --no-interactive
   ```

   보관 뒤 현재 명세의 목적·요구사항을 확인하고, 구현 변경·테스트·현재 명세·보관 기록을 같은 PR에서 리뷰한다. `--all`의 대상은 현재 명세와 활성 change이며, `--archived`는 보관된 change의 task 완료 여부를 별도로 검사한다. 명세 완료나 archive는 운영 배포 완료를 뜻하지 않는다. PR 승인·병합·배포·운영 확인은 기존 [공통 규칙](../AGENTS.md)과 [배포 런북](../docs/build-deploy-runbook.md)을 따른다.

## 파일의 역할

| 경로 | 기록 내용 |
| --- | --- |
| `openspec/config.yaml` | 기본 schema, 한글 작성 설정, 기존 canonical owner 참조 |
| `openspec/specs/<capability>/spec.md` | 도입한 capability의 현재 요구사항과 시나리오 |
| `openspec/changes/<change-name>/` | 진행 중인 변경의 제안·delta 명세·설계·작업 |
| `openspec/changes/archive/<date>-<change-name>/` | 완료한 변경의 보관 기록 |

첫 도입 기록은 [adopt-openspec-docs-cli](./changes/archive/2026-11-07-adopt-openspec-docs-cli/proposal.md)이며 [openspec-cli-workflow](./specs/openspec-cli-workflow/spec.md)에 이 도구 사용 기능만 명세화한다. 현재 명세는 제품 전체의 구현 현황이나 배포 현황을 나타내지 않는다.

공식 문서: [CLI](https://github.com/Fission-AI/OpenSpec/blob/v1.16.1/docs/cli.md), [설정](https://github.com/Fission-AI/OpenSpec/blob/v1.16.1/docs/customization.md), [다국어 작성](https://github.com/Fission-AI/OpenSpec/blob/v1.16.1/docs/multi-language.md).
