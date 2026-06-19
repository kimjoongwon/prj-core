# qa-mo-e2e-testing 상세 지시

원본 에이전트 파일: `.codex/agents/51-qa-mo-e2e-testing.toml`

이 참고 문서는 예전에 에이전트 TOML에 있던 상세 구현 지시를 담고 있습니다. 얇은 에이전트 계약과 이 skill의 `SKILL.md`를 읽은 뒤 따릅니다.

---


## 재사용 우선 점검 (필수)

- 작업 시작 전에 반드시 기존 모바일 spec/test/config를 먼저 검색합니다.
- 대응 `app.context.md`, route `index.spec.md`의 E2E 시나리오를 먼저 읽습니다.
- 담당 스펙이 없거나 E2E 케이스가 비어 있으면 즉시 `BLOCKED: missing 모바일 e2e spec`으로 보고합니다.
- 동일 책임의 중복 구현을 금지합니다.


# 모바일 E2E 테스트 담당 (Detox)

Detox 기반으로 `apps/mobile`의 실제 앱 실행 시나리오를 검증하는 전문가입니다.

---

## 1. 언제 사용하는가?

| 상황 | 적합 여부 | 설명 |
|------|:---------:|------|
| 앱 launch smoke test | ✅ | 첫 route 렌더링 확인 |
| 모바일 route 전환/상호작용 E2E | ✅ | Detox 기반 시나리오 |
| 브라우저 Playwright E2E / Expo Web E2E | ❌ | 웹 QA 역할 사용 |
| 컴포넌트 단위 테스트 | ❌ | `qa-mo-testing` 사용 |

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| 대상 route/app | ✅ | 모바일 app scope |
| 테스트 시나리오 | ✅ | 담당 스펙 의 E2E 시나리오 |

### 출력

| 항목 | 파일 | 설명 |
|------|------|------|
| 테스트 파일 | `apps/mobile/e2e/**/*.e2e.js` | Detox E2E 파일 |
| 설정 파일 | `apps/mobile/detox.config.js`, `apps/mobile/e2e/jest.config.js` | Detox 실행 설정 |

- 테스트 구현 후 대응 spec 의 구현 체크리스트와 `## 변경 이력`을 함께 갱신합니다.

---

## 3. 핵심 규칙

### ✅ 권장

- 앱 launch 기준 smoke 시나리오부터 구현
- 담당 스펙 의 시나리오 ID와 기대 결과를 그대로 사용
- 가능하면 text/testID 기반 selector 사용

### ❌ 금지

- 브라우저 URL / DOM selector 전제를 Detox 테스트에 섞지 않음
- 검증 타깃은 iOS/Android native 런타임 으로 한정
- 담당 스펙과 담당 스펙 QA 단계에 없는 신규 시나리오를 임의 추가하지 않음
- spec sync 없이 설정 파일만 추가하지 않음
