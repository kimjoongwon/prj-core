# review-map.toml Guide

> 위치: .codex/review-map.toml

## 역할

`qa-pr-reviewer`가 changed file을 어떤 role 규칙으로 검증해야 하는지 연결하는 1차 registry입니다.

- 기본 단위는 ordered `[[rules]]`
- 각 rule은 `glob -> primary_role -> supporting_roles -> check_keys -> exempt`를 정의합니다.
- first-match wins 규칙을 사용합니다.

## 운영 규칙

- `match`는 repo-relative glob 배열입니다.
- `primary_role`은 반드시 `.codex/config.toml`에 등록된 role 이름을 사용합니다.
- `supporting_roles`는 보조 근거 role이며, reviewer가 필요 시 함께 읽습니다.
- `rule_docs`는 role 문서 외에 추가로 읽어야 하는 고정 문서입니다.
- `check_keys`는 reviewer가 어떤 관점으로 판정해야 하는지 알려주는 짧은 힌트입니다.
- `exempt = true`인 rule은 gate 대상에서 제외합니다.
- source file rule은 가능한 한 구체적인 경로를 위에 두고, 광범위한 rule은 아래에 둡니다.
- registry에 없는 non-exempt changed file은 reviewer가 fallback inference를 시도하고, 그래도 unresolved면 finding으로 처리합니다.

## 문법 제약

현재 `scripts/wt.js`의 lightweight parser는 아래 값만 지원합니다.

- 문자열: `"value"`
- 정수: `1`
- 불리언: `true | false`
- 문자열 배열: `["a", "b"]`

멀티라인 배열, inline table, 숫자 배열, 중첩 object는 지원하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-23 | `qa-pr-reviewer`용 glob-to-role registry와 exempt/mapping/check key 운영 규칙을 추가 | codex |
