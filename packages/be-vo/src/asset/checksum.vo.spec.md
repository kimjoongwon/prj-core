# Checksum VO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-24
> 타입: vo
> 위치: packages/be-vo/src/asset/checksum.vo.ts

## 역할

파일 무결성 검증을 위한 체크섬(해시)을 나타내는 값 객체입니다. MD5, SHA-256, SHA-512 알고리즘을 지원하며, 알고리즘별 올바른 길이와 형식을 검증합니다. 파일 업로드/다운로드 시 데이터 무결성 확인에 사용됩니다.

## Props

| 필드 | 타입 | 설명 |
|------|------|------|
| algorithm | "md5" \| "sha256" \| "sha512" | 해시 알고리즘 |
| value | string | 소문자 hex 형식의 해시 값 |

## 유효성 규칙

| 규칙 | 에러 메시지 |
|------|------------|
| algorithm 필수 | "알고리즘은 필수입니다." |
| value 필수 | "체크섬 값은 필수입니다." |
| 지원 알고리즘만 허용 | "지원하지 않는 알고리즘입니다: {algorithm}" |
| MD5 길이 (32자) | "MD5 체크섬은 32자여야 합니다." |
| SHA-256 길이 (64자) | "SHA-256 체크섬은 64자여야 합니다." |
| SHA-512 길이 (128자) | "SHA-512 체크섬은 128자여야 합니다." |
| hex 형식만 허용 | "체크섬 값은 소문자 hex 형식이어야 합니다." |

## 알고리즘별 길이

| 알고리즘 | 길이 | 비트 |
|----------|------|------|
| md5 | 32자 | 128-bit |
| sha256 | 64자 | 256-bit |
| sha512 | 128자 | 512-bit |

## hex 정규식

```
/^[a-f0-9]+$/
```

소문자 a-f와 숫자 0-9만 허용합니다.

## 팩토리 메서드

| 메서드 | 파라미터 | 설명 |
|--------|----------|------|
| `Checksum.md5(value)` | string | MD5 체크섬 생성 (32자 hex) |
| `Checksum.sha256(value)` | string | SHA-256 체크섬 생성 (64자 hex) |
| `Checksum.sha512(value)` | string | SHA-512 체크섬 생성 (128자 hex) |
| `Checksum.fromString(str)` | string | "algorithm:value" 형식 문자열 파싱 |

### fromString 상세

```typescript
// 예시
Checksum.fromString("sha256:abc123def456...")
// → Checksum { algorithm: "sha256", value: "abc123def456..." }

Checksum.fromString("invalid")
// → VoValidationError ("잘못된 체크섬 형식입니다. 'algorithm:value' 형식이어야 합니다.")
```

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| `get algorithm` | string | 알고리즘 반환 |
| `get value` | string | 해시 값 반환 |
| `toString()` | string | "algorithm:value" 형식 반환 |
| `verify(content)` | Promise\<boolean\> | (선택) Buffer 내용의 해시와 비교 |

### verify 메서드 (선택 구현)

Node.js crypto 모듈을 사용하여 실제 내용의 해시와 비교합니다.

```typescript
import { createHash } from "crypto";

async verify(content: Buffer): Promise<boolean> {
  const hash = createHash(this.algorithm).update(content).digest("hex");
  return hash === this.value;
}
```

## 예시

```typescript
// 팩토리 메서드 사용
const checksum = Checksum.sha256("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

checksum.algorithm;  // "sha256"
checksum.value;      // "e3b0c44298fc..."
checksum.toString(); // "sha256:e3b0c44298fc..."

// 문자열에서 파싱
const parsed = Checksum.fromString("md5:d41d8cd98f00b204e9800998ecf8427e");
parsed.algorithm;  // "md5"

// 대문자 입력 시 자동 소문자 변환
const normalized = Checksum.sha256("ABC123...");
normalized.value;  // "abc123..."
```

## 구현 체크리스트

- [x] checksum.vo.ts
- [x] ValueObject 상속
- [x] validate() 구현
- [x] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 규칙 / 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| 알고리즘 검증 | 3 | 1 | 0 | 4 |
| 길이 검증 (각 알고리즘) | 3 | 3 | 0 | 6 |
| hex 형식 검증 | 2 | 2 | 0 | 4 |
| fromString() | 2 | 2 | 0 | 4 |
| toString() | 3 | 0 | 0 | 3 |
| 대문자 정규화 | 1 | 0 | 0 | 1 |

### [TC-001] SHA-256 체크섬 생성

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" (64자) |
| **When** | Checksum.sha256() 호출 |
| **Then** | Checksum 인스턴스 생성 성공 |

### [TC-002] MD5 길이 오류

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | "abc123" (6자 - MD5는 32자 필요) |
| **When** | Checksum.md5() 호출 |
| **Then** | VoValidationError ("MD5 체크섬은 32자여야 합니다.") |

### [TC-003] 대문자 hex 자동 변환

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | "ABCDEF123456..." (대문자) |
| **When** | Checksum.sha256() 호출 |
| **Then** | value가 소문자로 저장됨 ("abcdef123456...") |

### [TC-004] fromString 파싱

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | "sha512:abc123..." (올바른 형식) |
| **When** | Checksum.fromString() 호출 |
| **Then** | Checksum { algorithm: "sha512", value: "abc123..." } |

### [TC-005] fromString 형식 오류

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | "sha256-abc123" (콜론 없음) |
| **When** | Checksum.fromString() 호출 |
| **Then** | VoValidationError ("잘못된 체크섬 형식입니다...") |

### [TC-006] 지원하지 않는 알고리즘

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | "sha1:abc123..." |
| **When** | Checksum.fromString() 호출 |
| **Then** | VoValidationError ("지원하지 않는 알고리즘입니다: sha1") |

### [TC-007] toString 형식

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | Checksum.sha256("abc123...") |
| **When** | toString() 호출 |
| **Then** | "sha256:abc123..." 반환 |

### [TC-008] hex 이외 문자

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | "ghijklmnop..." (hex 범위 벗어남) |
| **When** | Checksum.md5() 호출 |
| **Then** | VoValidationError ("체크섬 값은 소문자 hex 형식이어야 합니다.") |

## 상위 기획서

- `packages/be-entity/src/asset/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-vo-builder |
| 2026-02-24 | VO 구현 완료 | vo-builder |
