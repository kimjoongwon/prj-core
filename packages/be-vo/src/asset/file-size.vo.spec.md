# FileSize VO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-24
> 타입: vo
> 위치: packages/be-vo/src/asset/file-size.vo.ts

## 역할

파일 크기를 나타내는 값 객체입니다. 바이트 단위의 정확한 크기를 저장하고, KB/MB/GB 등의 단위 변환 및 사람이 읽기 쉬운 형식으로의 변환을 제공합니다. 파일 업로드 크기 제한 검증에도 활용됩니다.

## Props

| 필드 | 타입 | 설명 |
|------|------|------|
| bytes | bigint | 바이트 단위의 파일 크기 |

## 유효성 규칙

| 규칙 | 에러 메시지 |
|------|------------|
| bytes 필수 | "파일 크기는 필수입니다." |
| 0 이상 | "파일 크기는 0 이상이어야 합니다." |

## 단위 변환 상수

| 단위 | 바이트 | 설명 |
|------|--------|------|
| KB | 1024 | 킬로바이트 |
| MB | 1048576 | 메가바이트 (1024 * 1024) |
| GB | 1073741824 | 기가바이트 (1024 * 1024 * 1024) |
| TB | 1099511627776 | 테라바이트 (1024^4) |

## 팩토리 메서드

| 메서드 | 파라미터 | 설명 |
|--------|----------|------|
| `FileSize.fromBytes(bytes)` | bigint \| number | 바이트 단위로 생성 |
| `FileSize.fromKB(kilobytes)` | number | 킬로바이트 단위로 생성 |
| `FileSize.fromMB(megabytes)` | number | 메가바이트 단위로 생성 |
| `FileSize.fromGB(gigabytes)` | number | 기가바이트 단위로 생성 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| `get bytes` | bigint | 바이트 단위 크기 반환 |
| `toKB()` | number | 킬로바이트로 변환 (소수점 포함) |
| `toMB()` | number | 메가바이트로 변환 (소수점 포함) |
| `toGB()` | number | 기가바이트로 변환 (소수점 포함) |
| `toHumanReadable()` | string | 사람이 읽기 쉬운 형식 반환 (예: "2.4 MB") |
| `isLargerThan(other)` | boolean | 다른 FileSize보다 큰지 비교 |
| `isSmallerThan(other)` | boolean | 다른 FileSize보다 작은지 비교 |
| `equals(other)` | boolean | 다른 FileSize와 같은지 비교 (ValueObject 상속) |
| `toString()` | string | 바이트 단위 문자열 반환 (예: "1024 bytes") |

## toHumanReadable 로직

```typescript
toHumanReadable(): string {
  const bytes = this.bytes;

  if (bytes >= 1099511627776n) {  // 1 TB
    return `${(Number(bytes) / 1099511627776).toFixed(2)} TB`;
  }
  if (bytes >= 1073741824n) {  // 1 GB
    return `${(Number(bytes) / 1073741824).toFixed(2)} GB`;
  }
  if (bytes >= 1048576n) {  // 1 MB
    return `${(Number(bytes) / 1048576).toFixed(2)} MB`;
  }
  if (bytes >= 1024n) {  // 1 KB
    return `${(Number(bytes) / 1024).toFixed(2)} KB`;
  }
  return `${bytes} bytes`;
}
```

## 예시

```typescript
// 팩토리 메서드 사용
const size1 = FileSize.fromBytes(1048576);
size1.toKB();             // 1024
size1.toMB();             // 1
size1.toHumanReadable();  // "1.00 MB"

const size2 = FileSize.fromMB(2.5);
size2.bytes;              // 2621440n
size2.toHumanReadable();  // "2.50 MB"

// 비교
const small = FileSize.fromKB(100);
const large = FileSize.fromMB(1);
small.isLargerThan(large);  // false
small.isSmallerThan(large); // true

// 큰 파일
const bigFile = FileSize.fromGB(15.7);
bigFile.toHumanReadable();  // "15.70 GB"

// 0바이트
const empty = FileSize.fromBytes(0);
empty.toHumanReadable();  // "0 bytes"
```

## 구현 체크리스트

- [x] file-size.vo.ts
- [x] ValueObject 상속
- [x] validate() 구현
- [x] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 규칙 / 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| 음수 검증 | 0 | 1 | 0 | 1 |
| fromBytes() | 2 | 0 | 1 | 3 |
| fromKB/MB/GB() | 3 | 0 | 0 | 3 |
| toKB/MB/GB() | 3 | 0 | 0 | 3 |
| toHumanReadable() | 5 | 0 | 2 | 7 |
| isLargerThan() | 2 | 0 | 0 | 2 |
| isSmallerThan() | 2 | 0 | 0 | 2 |

### [TC-001] 바이트로 생성

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 1048576 (1MB) |
| **When** | FileSize.fromBytes() 호출 |
| **Then** | FileSize { bytes: 1048576n } 생성 |

### [TC-002] 음수 크기

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | -100 |
| **When** | FileSize.fromBytes() 호출 |
| **Then** | VoValidationError ("파일 크기는 0 이상이어야 합니다.") |

### [TC-003] 0바이트

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | 0 |
| **When** | FileSize.fromBytes(0) 호출 |
| **Then** | toHumanReadable() → "0 bytes" |

### [TC-004] MB로 생성 후 변환

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 2.5 (MB) |
| **When** | FileSize.fromMB(2.5) |
| **Then** | bytes = 2621440n, toKB() = 2560 |

### [TC-005] toHumanReadable 단위별

**분류:** Happy Path

| 입력 | toHumanReadable() |
|------|-------------------|
| 500 bytes | "500 bytes" |
| 2048 bytes | "2.00 KB" |
| 1572864 bytes | "1.50 MB" |
| 5368709120 bytes | "5.00 GB" |
| 2199023255552 bytes | "2.00 TB" |

### [TC-006] 크기 비교

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | small = 1KB, large = 1MB |
| **When** | small.isLargerThan(large) |
| **Then** | false |

### [TC-007] 같은 크기 비교

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | size1 = 1024 bytes, size2 = FileSize.fromKB(1) |
| **When** | size1.equals(size2) |
| **Then** | true |

### [TC-008] 아주 큰 파일 (bigint)

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | 10995116277760n (10 TB) |
| **When** | FileSize.fromBytes() 호출 |
| **Then** | toHumanReadable() → "10.00 TB" |

### [TC-009] 소수점 KB

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 1536 bytes (1.5 KB) |
| **When** | toKB() 호출 |
| **Then** | 1.5 반환 |

## 상위 기획서

- `packages/be-entity/src/asset/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-vo-builder |
| 2026-02-24 | VO 구현 완료 | vo-builder |
