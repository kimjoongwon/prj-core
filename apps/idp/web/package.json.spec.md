# package.json 기획서

> 생성일: 2026-03-23
> 타입: config
> 위치: apps/idp/web/package.json

## 역할

`idp-web`의 런타임/개발 의존성과 실행 스크립트 계약을 정의합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `scripts` | Next 개발/빌드/타입체크/포맷 명령을 제공 |
| `workspace dependencies` | `@cocrepo/api`, `@cocrepo/hook`, `@cocrepo/store`, `@cocrepo/ui` 등 workspace 패키지를 직접 참조 |
| `nuqs resolution` | `nuqs`는 `@cocrepo/hook`가 제공하는 단일 워크스페이스 인스턴스를 사용하고 앱에서 직접 중복 선언하지 않음 |

## 메모

- `idp-web`는 `NuqsAdapter`를 직접 import하지만, 패키지 중복 설치를 피하기 위해 앱 자체 `package.json`에는 `nuqs`를 별도 선언하지 않습니다.
- URL 상태 훅과 adapter는 모노레포 공용 패키지와 동일한 물리 경로를 사용해야 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | `nuqs` 직접 의존성을 제거해 `@cocrepo/hook`/`@cocrepo/ui`와 동일한 패키지 인스턴스를 사용하도록 계약 명시 | codex |
