# FileTypeIcon

## 개요

MIME 타입에 따라 적절한 파일 타입 아이콘을 표시하는 컴포넌트입니다.

## Props

| 이름      | 타입             | 필수 | 설명                                    |
| --------- | ---------------- | ---- | --------------------------------------- |
| mimeType  | string           | ✅   | MIME 타입 (예: image/png, video/mp4)    |
| size      | FileTypeIconSize | ❌   | 아이콘 크기 (기본값: "md")               |
| className | string           | ❌   | 추가 클래스명                           |

## 타입

### FileTypeIconSize

```typescript
type FileTypeIconSize = "sm" | "md" | "lg";
```

## MIME 타입별 아이콘

| MIME 타입 범위          | 아이콘   | 색상            |
| ----------------------- | -------- | --------------- |
| image/*                 | Image    | text-primary    |
| video/*                 | Video    | text-secondary  |
| audio/*                 | Music    | text-warning    |
| application/pdf         | FileText | text-default-500|
| application/msword      | FileText | text-default-500|
| application/vnd.*       | FileText | text-default-500|
| text/*                  | FileText | text-default-500|
| 기타                    | File     | text-default-400|

## 크기별 스펙

| 크기 | iconSize | className |
| ---- | -------- | --------- |
| sm   | 16       | w-4 h-4   |
| md   | 20       | w-5 h-5   |
| lg   | 24       | w-6 h-6   |

## 사용 예시

```tsx
import { FileTypeIcon } from "@cocrepo/ui";

// 이미지 파일
<FileTypeIcon mimeType="image/png" />

// 비디오 파일 (큰 크기)
<FileTypeIcon mimeType="video/mp4" size="lg" />

// 문서 파일
<FileTypeIcon mimeType="application/pdf" />
```

## 의존성

- lucide-react (Image, Video, FileText, Music, File)
- mobx-react-lite (observer)

## 변경 이력

| 일자       | 내용     | 작성자             |
| ---------- | -------- | ------------------ |
| 2026-02-23 | 초기 생성 | fe-ui-component-builder |
