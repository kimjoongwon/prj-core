# qa-mo-testing 상세 지시

원본 에이전트 파일: `.codex/agents/50-qa-mo-testing.toml`

이 참고 문서는 예전에 에이전트 TOML에 있던 상세 구현 지시를 담고 있습니다. 얇은 에이전트 계약과 이 skill의 `SKILL.md`를 읽은 뒤 따릅니다.

---


## 재사용 우선 점검 (필수)

- 작업 시작 전에 반드시 기존 route/component/spec/test 를 먼저 검색합니다.
- 대응 `app.context.md`, route `index.spec.md`의 `테스트 케이스` 섹션을 먼저 읽습니다.
- 담당 스펙이 없거나 테스트 케이스가 비어 있으면 즉시 `BLOCKED: missing 모바일 단위 테스트 계약`으로 보고합니다.
- 동일 책임의 중복 구현을 금지합니다.


# 모바일 unit 테스트 에이전트 (Jest + React Native Testing Library)

Jest + React Native Testing Library 기반으로 `apps/mobile`, `@cocrepo/mo-ui`의 단위 테스트 코드를 작성하는 전문가입니다.

---

## 1. 언제 사용하는가?

| 상황 | 적합 여부 | 설명 |
|------|:---------:|------|
| route screen 렌더링 테스트 | ✅ | Expo Router native route screen smoke/unit |
| layout/provider 연결 테스트 | ✅ | 루트 레이아웃 / provider |
| 모바일 UI wrapper 테스트 | ✅ | `@cocrepo/mo-ui` 내부 유틸, 얇은 wrapper |
| 브라우저 DOM 테스트 / Expo Web 테스트 | ❌ | 웹 QA 역할 사용 |
| 실제 디바이스 E2E | ❌ | `qa-mo-e2e-testing` 사용 |

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| 테스트 대상 파일 | ✅ | route screen / layout / UI wrapper |
| 테스트 시나리오 | ✅ | 담당 스펙 의 unit 테스트 케이스 |

### 출력

| 항목 | 파일 | 설명 |
|------|------|------|
| 테스트 파일 | `apps/mobile/src/**/*.test.tsx`, `packages/fe-mo-ui/src/**/*.test.ts` | 모바일 단위 테스트 파일 |

- 테스트 구현 후 대응 spec 의 구현 체크리스트와 `## 변경 이력`도 함께 갱신합니다.

---

## 3. 핵심 규칙

### ✅ 권장

- 테스트 설명은 한글로 작성
- Given-When-Then 패턴 사용
- React Native Testing Library 기준 query 사용
- 필요한 외부 런타임(`expo-router`, provider, native wrapper`)은 얇게 mock

### ❌ 금지

- 담당 스펙에 없는 케이스를 임의 추가 금지
- Detox/Playwright 전제를 단위 테스트 에 섞지 않음
- route code 변경 없이 테스트만 추가한 뒤 spec sync 를 생략하지 않음
