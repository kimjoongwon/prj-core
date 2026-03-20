# biome.json 기획서

> 생성일: 2026-03-14
> 타입: config
> 위치: biome.json

## 역할

루트 Biome 설정으로 워크스페이스 전체의 lint/format 대상과 공통 규칙을 정의합니다.
각 앱과 패키지의 lint 스크립트가 동일한 파일 범위와 규칙을 사용하도록 기준을 제공합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `files.includes` | 워크스페이스에서 Biome이 검사할 파일 범위 |
| `formatter` | 공통 포맷 기준 |
| `linter.rules` | 공통 lint 규칙 |

## 운영 원칙

- 각 워크스페이스의 `biome check .`가 실제 코드 파일을 처리할 수 있도록 `includes`를 유지합니다.
- Tailwind CSS 4 지시문을 사용하는 앱은 루트 `css.parser.tailwindDirectives` 설정으로 공통 파싱합니다.
- 공통 규칙은 워크스페이스 전반에 영향을 주므로 필요한 경우에만 변경합니다.
- 새 앱을 lint 대상으로 편입할 때는 루트 범위와 앱 내부 파일 포맷 상태를 함께 맞춥니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Biome 2.3.10 스키마에 맞춰 Tailwind CSS 4 파서 옵션을 루트 설정에 추가하고 `biome check .` 기준을 복원 | codex |
| 2026-03-14 | proposal-web 앱 lint 범위를 루트 Biome 설정 기준으로 운영하는 정책을 문서화 | codex |
