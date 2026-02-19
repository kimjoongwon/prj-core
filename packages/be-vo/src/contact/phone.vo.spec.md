# Phone VO 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: vo
> 위치: packages/be-vo/src/contact/phone.vo.ts

## 역할

국제 전화번호를 값 객체로 캡슐화합니다. `libphonenumber-js` 라이브러리를 사용하여 국제 표준(E.164) 형식으로 검증 및 정규화합니다. 국가 코드, 국내 형식, 국제 형식 변환 기능을 제공합니다.

## Props

| 필드 | 타입 | 설명 |
|------|------|------|
| value | string | 원본 입력 전화번호 문자열 |
| normalized | string | E.164 형식으로 정규화된 전화번호 (예: "+821012345678") |

## 유효성 규칙

| 규칙 | 에러 메시지 |
|------|------------|
| value 필수 | "전화번호는 필수입니다." |
| libphonenumber-js 파싱 성공 | "전화번호 파싱 실패: {value}" |
| isValid() === true | "유효하지 않은 전화번호입니다: {value}" |

## 팩토리 메서드

| 메서드 | 파라미터 | 설명 |
|--------|----------|------|
| `Phone.create(phone, defaultCountry?)` | string, 국가코드(기본: "KR") | libphonenumber-js로 파싱 후 Phone 생성. KR/US/JP/CN 지원 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| `get value` | string | 원본 입력 전화번호 반환 |
| `get normalized` | string | E.164 형식 전화번호 반환 (예: "+821012345678") |
| `getCountryCode()` | string \| undefined | ISO 국가 코드 반환 (예: "KR") |
| `getCountryCallingCode()` | string | 국가 전화 코드 반환 (예: "+82") |
| `formatNational()` | string | 국내 형식 반환 (예: "010-1234-5678") |
| `formatInternational()` | string | 국제 형식 반환 (예: "+82 10-1234-5678") |
| `toString()` | string | E.164 형식(normalized) 반환 |

## 지원 국가 코드

| 코드 | 국가 |
|------|------|
| KR (기본) | 대한민국 |
| US | 미국 |
| JP | 일본 |
| CN | 중국 |

## 구현 체크리스트

- [x] phone.vo.ts
- [x] ValueObject 상속
- [x] validate() 구현
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
