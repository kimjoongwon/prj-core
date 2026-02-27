# 클로드 코드 설정

이 디렉토리는 팀 전체가 공유하는 클로드 코드(Claude Code) 설정입니다.

## 📁 파일 구조

```
.claude/
├── CLAUDE.md    # 프로젝트 개발 가이드
├── README.md    # 이 파일
├── agents/      # 역할별 전문 에이전트
├── skills/      # 재사용 가능한 기술
└── hooks/       # 품질 체크 스크립트
```

### Agents vs Skills
 
 - **agents/**: 설계 및 아키텍처 전문가 (fe-*, be-*, etc-* prefix로 분류)
 - **skills/**: 도구 실행 방법 (type-check, lint-format 등)
 - **hooks/**: 자동 실행 스크립트
 
 ## 🚀 사용 방법
 
 프로젝트 루트에서 Claude Code를 실행하면 자동으로 이 설정이 적용됩니다.
 
### 에이전트/가이드 동기화 (Codex → OpenCode/Claude Code)

에이전트의 단일 소스는 `.codex/agents/*.toml`이며, 가이드의 단일 소스는 `.claude/CLAUDE.md`입니다.
동기화 시 에이전트와 가이드가 함께 반영됩니다:

```bash
# Codex 변경 감시 + 자동 동기화
pnpm agent:watch

# 수동 동기화 (파일 반영)
pnpm agent:sync

# 동기화 검증 (불일치 시 실패)
pnpm agent:check
```
 
**동기화 흐름:**
1. `.codex/agents/*.toml` 또는 `.codex/config.toml` 수정
2. 감시기/훅이 변경 감지
3. `.claude/agents/*.md`, `.opencode/agents/*.md` 자동 생성
4. `.claude/CLAUDE.md` 기준으로 `AGENTS.md` 동기화
5. `pnpm agent:check`로 정합성 검증
 
**참고:**
- `agent:sync`는 Codex 목록에 없는 타겟 에이전트를 제거합니다
- 동기화된 파일은 수동 편집하지 말고 Codex 원본을 수정하세요
- Ctrl+C로 감시 중지

## 📝 개발 가이드

자세한 개발 규칙은 [CLAUDE.md](./CLAUDE.md)를 참고하세요.

### 주요 규칙

**프론트엔드**

- ui 컴포넌트는 mobx 사용
- 핸들러 함수명에 `handle` 접두어
- 인라인 함수 선언 금지

**테스트**

- 테스트 설명은 한글로 작성
- Given-When-Then 패턴 사용

**커밋**

- 커밋 메시지는 `<타입>(<범위>): <제목>` 형식
- 타입: feat, fix, docs, style, refactor, test, chore

**페이지 개발**

- 페이지는 각 앱에서 직접 개발 (apps/admin, apps/coin 등)
- UI 컴포넌트를 조합하여 구성
- 재사용 가능한 UI는 packages/fe-ui에서 import

## 🤝 팀 협업

### 설정 변경 시

1. 팀원들과 먼저 논의
2. 커밋 메시지에 변경 이유 명시
3. 필요시 README 업데이트

### 질문/제안

팀 슬랙 채널에서 논의해주세요.
