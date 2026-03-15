# Assets Module 기획서

> 생성일: 2026-03-15
> 타입: module
> 위치: apps/core/api/src/module/assets/assets.module.ts

## 역할

`AssetsController`가 `AssetFacade`와 Asset service/repository 조합을 주입받도록 provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| AssetFacade | Asset controller boundary 조합 |
| AssetService | Asset 도메인 규칙 및 조회/이동/삭제 |
| AssetsRepository | Asset 영속성 접근 |
| FoldersRepository | 폴더 이동 검증용 영속성 접근 |
| SpaceContext | 현재 요청 Space 제공 |

## exports

| export | 설명 |
|--------|------|
| AssetFacade | 다른 모듈이 참조할 수 있는 Asset boundary 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | admin assets API 라우트 복구를 위한 AssetsModule 신규 추가 | codex |
