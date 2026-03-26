# FileUploader ui 기획서

> 생성일: 2026-03-03
> 타입: ui
> 위치: packages/fe-ui/src/control/FileUploader/FileUploader.tsx

## 역할

이 파일은 ui 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| FileDto | 공개 계약 요소 |
| FileUploaderProps | 공개 계약 요소 |
| FileUploader | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | Storybook 예시도 `FileUploader.tsx`의 로컬 `FileDto` export를 사용하도록 정리 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-08 | FileUploader.tsx의 `FileDto` 타입 참조를 @cocrepo/dto에서 로컬 타입으로 변경해 idp-web 빌드 타입 에러 해결 | codex |
