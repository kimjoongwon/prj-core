# SizeDisplay

## 개요

파일 크기(바이트)를 사람이 읽기 쉬운 형태로 변환하여 표시하는 컴포넌트입니다.

## Props

| 이름      | 타입   | 필수 | 설명                    |
| --------- | ------ | ---- | ----------------------- |
| bytes     | number | ✅   | 바이트 크기             |
| decimals  | number | ❌   | 소수점 자릿수 (기본값: 1) |
| className | string | ❌   | 추가 클래스명           |

## 변환 규칙

- 1024 단위로 단위 변환 (B → KB → MB → GB → TB → PB)
- 지원 단위: B, KB, MB, GB, TB, PB
- 0바이트는 "0 B"로 표시

## 변환 예시

| 입력 (bytes) | 출력      |
| ------------ | --------- |
| 0            | 0 B       |
| 512          | 512 B     |
| 1024         | 1 KB      |
| 1536         | 1.5 KB    |
| 1048576      | 1 MB      |
| 1572864      | 1.5 MB    |
| 1073741824   | 1 GB      |

## 사용 예시

```tsx
import { SizeDisplay } from "@cocrepo/ui";

// 기본 사용
<SizeDisplay bytes={1536} /> // "1.5 KB"

// 소수점 2자리
<SizeDisplay bytes={1536} decimals={2} /> // "1.50 KB"

// 큰 파일
<SizeDisplay bytes={1572864} /> // "1.5 MB"
```

## 의존성

- mobx-react-lite (observer)

## 변경 이력

| 일자       | 내용     | 작성자             |
| ---------- | -------- | ------------------ |
| 2026-02-23 | 초기 생성 | fe-ui-component-builder |
