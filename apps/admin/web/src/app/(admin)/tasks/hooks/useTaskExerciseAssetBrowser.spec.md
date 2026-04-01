# useTaskExerciseAssetBrowser hook 기획서

> 생성일: 2026-04-01
> 타입: hook
> 위치: apps/admin/web/src/app/(admin)/tasks/hooks/useTaskExerciseAssetBrowser.ts

## 역할

task 등록/수정 화면에서 공통으로 쓰는 asset picker 흐름을 담당합니다.
현재 image/video file id 기준 preview 조회, 활성 slot 관리, `AssetBrowser` picker modal용 bindings, 선택/삭제 후 form value 동기화를 이 hook이 조합합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `useTaskExerciseAssetBrowser` | task form 전용 asset picker hook |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-01 | 신규 생성 | codex |
