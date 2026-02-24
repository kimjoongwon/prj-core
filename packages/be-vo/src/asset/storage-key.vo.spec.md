# StorageKey VO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-24
> 타입: vo
> 위치: packages/be-vo/src/asset/storage-key.vo.ts

## 역할

S3/Object Storage의 스토리지 경로를 나타내는 값 객체입니다. 스토리지 키 형식을 검증하고, 경로 조작, 확장자 추출 등의 기능을 제공합니다. 파일 업로드 시 안전한 키 생성을 보장합니다.

## Props

| 필드 | 타입 | 설명 |
|------|------|------|
| value | string | 스토리지 키 값 (S3 Key 경로) |

## 유효성 규칙

| 규칙 | 에러 메시지 |
|------|------------|
| value 필수 | "스토리지 키는 필수입니다." |
| 최소 1자 이상 | "스토리지 키는 최소 1자 이상이어야 합니다." |
| 최대 1024자 이하 | "스토리지 키는 최대 1024자까지 가능합니다." |
| 허용 문자만 사용 | "스토리지 키에 허용되지 않는 문자가 포함되어 있습니다: {value}" |
| 공백 금지 | "스토리지 키에 공백을 포함할 수 없습니다." |
| 선행 슬래시 금지 | "스토리지 키는 슬래시(/)로 시작할 수 없습니다." |
| 후행 슬래시 금지 | "스토리지 키는 슬래시(/)로 끝날 수 없습니다." |

## 허용 문자 정규식

```
/^[a-zA-Z0-9\-_.\/]+$/
```

- 영문 대소문자 (a-z, A-Z)
- 숫자 (0-9)
- 하이픈 (-)
- 언더스코어 (_)
- 점 (.)
- 슬래시 (/) - 디렉토리 구분자

## 팩토리 메서드

| 메서드 | 파라미터 | 설명 |
|--------|----------|------|
| `StorageKey.fromPath(path)` | string | 경로 문자열로부터 생성 (유효성 검사 수행) |
| `StorageKey.generate(prefix, filename)` | prefix: string, filename: string | prefix와 filename을 조합하여 안전한 키 생성 |

### generate 상세

```typescript
// 예시
StorageKey.generate("uploads/images", "profile.png")
// → "uploads/images/profile.png"

StorageKey.generate("temp", "user document.pdf")
// → VoValidationError (공백 포함)
```

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| `get value` | string | 스토리지 키 문자열 반환 |
| `getExtension()` | string | 파일 확장자 추출 (점 제외, 소문자) - 예: "png", "pdf" |
| `getDirectory()` | string | 디렉토리 경로 추출 (파일명 제외) - 예: "uploads/images" |
| `getFilename()` | string | 파일명 추출 (디렉토리 제외) - 예: "profile.png" |
| `toString()` | string | 스토리지 키 문자열 반환 |

## 예시

```typescript
// 기본 생성
const key = StorageKey.fromPath("uploads/images/profile.png");
key.getExtension();   // "png"
key.getDirectory();   // "uploads/images"
key.getFilename();    // "profile.png"

// 자동 생성
const newKey = StorageKey.generate("uploads/2024/02", "document.pdf");
// → "uploads/2024/02/document.pdf"

// 루트 레벨 파일
const rootKey = StorageKey.fromPath("config.json");
rootKey.getDirectory();   // "" (빈 문자열)
rootKey.getFilename();    // "config.json"
```

## 구현 체크리스트

- [x] storage-key.vo.ts
- [x] ValueObject 상속
- [x] validate() 구현
- [x] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 규칙 / 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| 필수값 검증 | 1 | 1 | 0 | 2 |
| 길이 검증 | 2 | 2 | 1 | 5 |
| 허용 문자 검증 | 2 | 3 | 0 | 5 |
| 슬래시 규칙 | 2 | 2 | 0 | 4 |
| getExtension() | 3 | 0 | 2 | 5 |
| getDirectory() | 3 | 0 | 1 | 4 |
| getFilename() | 3 | 0 | 0 | 3 |
| generate() | 2 | 2 | 0 | 4 |

### [TC-001] 유효한 경로로 생성

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | "uploads/images/profile.png" |
| **When** | StorageKey.fromPath() 호출 |
| **Then** | StorageKey 인스턴스 생성 성공 |

### [TC-002] 확장자 없는 파일

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | "uploads/data/README" |
| **When** | getExtension() 호출 |
| **Then** | 빈 문자열("") 반환 |

### [TC-003] 공백 포함 경로

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | "uploads/my file.png" |
| **When** | StorageKey.fromPath() 호출 |
| **Then** | VoValidationError ("스토리지 키에 공백을 포함할 수 없습니다.") |

### [TC-004] 선행 슬래시

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | "/uploads/file.png" |
| **When** | StorageKey.fromPath() 호출 |
| **Then** | VoValidationError ("스토리지 키는 슬래시(/)로 시작할 수 없습니다.") |

### [TC-005] 깊은 디렉토리 경로

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | "a/b/c/d/e/file.txt" |
| **When** | getDirectory() 호출 |
| **Then** | "a/b/c/d/e" 반환 |

### [TC-006] 한글/특수문자 포함

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | "uploads/프로필.png" 또는 "uploads/file@2x.png" |
| **When** | StorageKey.fromPath() 호출 |
| **Then** | VoValidationError ("스토리지 키에 허용되지 않는 문자가 포함되어 있습니다.") |

## 상위 기획서

- `packages/be-entity/src/asset/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-vo-builder |
| 2026-02-24 | VO 구현 완료 | vo-builder |
