# HashedPassword VO 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: vo
> 위치: packages/be-vo/src/auth/password/hashed-password.vo.ts

## 역할

bcrypt로 해시된 비밀번호를 값 객체로 캡슐화합니다. 해시 형식 검증, 평문 비밀번호와의 비교 로직을 캡슐화하며, `toString()`에서 `[HASHED]`로 마스킹하여 보안을 강화합니다.

## Props

| 필드 | 타입 | 설명 |
|------|------|------|
| value | string | bcrypt 해시 문자열 |

## 유효성 규칙

| 규칙 | 에러 메시지 |
|------|------------|
| value 필수 | "해시된 비밀번호는 필수입니다." |
| bcrypt 형식 (`$2a$`, `$2b$`, `$2y$` 접두어 + 정규식) | "유효하지 않은 bcrypt 해시 형식입니다." |

## bcrypt 형식 정규식

```
/^\$2[aby]\$\d{2}\$.{53}$/
```

- `$2a$`, `$2b$`, `$2y$` 중 하나로 시작
- salt rounds 2자리 숫자
- 53자 해시값

## 팩토리 메서드

| 메서드 | 파라미터 | 설명 |
|--------|----------|------|
| `HashedPassword.fromPlain(plainPassword, saltRounds?)` | PlainPassword, saltRounds(기본 10) | 평문 비밀번호를 비동기 해싱하여 생성 |
| `HashedPassword.fromPlainSync(plainPassword, saltRounds?)` | PlainPassword, saltRounds(기본 10) | 평문 비밀번호를 동기 해싱하여 생성 (시드 데이터용) |
| `HashedPassword.fromHash(hashedValue)` | string | 이미 해시된 값으로 생성 (DB 로드용) |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| `compare(plainPassword)` | Promise\<boolean\> | bcrypt.compare로 평문과 비교 |
| `get value` | string | 해시 문자열 반환 |
| `toString()` | "[HASHED]" | 보안상 마스킹된 문자열 반환 |

## 상수

| 상수 | 값 | 설명 |
|------|-----|------|
| DEFAULT_SALT_ROUNDS | 10 | 기본 bcrypt salt rounds |

## 구현 체크리스트

- [x] hashed-password.vo.ts
- [x] ValueObject 상속
- [x] validate() 구현
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
