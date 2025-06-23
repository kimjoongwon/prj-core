# Navigation & Navigator Services 테스트

이 문서는 `NavigationStore`와 `NavigatorStore`에 대한 테스트 코드를 설명합니다.

## 테스트 파일 구조

```
src/services/__tests__/
├── navigation.test.ts    # NavigationStore 테스트
└── navigator.test.ts     # NavigatorStore 테스트
```

## NavigationStore 테스트 (navigation.test.ts)

### 테스트 커버리지

총 **29개 테스트**로 다음과 같은 기능들을 검증합니다:

#### 1. 초기화 (4 테스트)

- 라우트 빌더로 올바른 초기화
- 중첩된 라우트 구조 생성
- fullPath 생성 검증

#### 2. 라우트 검색 (4 테스트)

- 이름으로 라우트 검색
- 존재하지 않는 라우트 처리
- fullPath 조회
- 별칭 메서드 동작

#### 3. 직계 자식 라우트 조회 (4 테스트)

- fullPath로 자식 라우트 조회
- 라우트 이름으로 자식 라우트 조회
- 자식이 없는 경우 처리
- 존재하지 않는 라우트 처리

#### 4. 현재 경로 관리 (4 테스트)

- 초기 경로 설정
- 경로 변경
- relativePath 추출
- 빈 경로 처리

#### 5. 활성 상태 관리 (3 테스트)

- 라우트 활성화
- 활성 상태 업데이트
- 활성화된 라우트 조회

#### 6. 선택된 대시보드 자식 라우트 (3 테스트)

- 대시보드 자식 라우트 반환
- 대시보드가 아닌 경로 처리
- 매칭되지 않는 경우 처리

#### 7. Navigator Service 통합 (2 테스트)

- NavigatorStore 인스턴스 반환
- navigate 함수 설정

#### 8. 경로 정규화 및 매칭 (2 테스트)

- 슬래시 정규화
- 부분 경로 매칭

#### 9. 특수 케이스 및 에러 처리 (3 테스트)

- 빈 RouteBuilder 배열 처리
- legacy pathname 속성 지원
- 잘못된 경로 형식 처리

## NavigatorStore 테스트 (navigator.test.ts)

### 테스트 커버리지

총 **29개 테스트**로 다음과 같은 기능들을 검증합니다:

#### 1. 초기화 및 설정 (4 테스트)

- 초기 상태 확인
- 네비게이션 함수 설정
- 라우트 리졸버 설정
- 활성화 콜백 설정

#### 2. React Router vs Next.js 구분 (2 테스트)

- React Router NavigateFunction 인식
- Next.js router.push 인식

#### 3. 경로 네비게이션 (push) (6 테스트)

- 기본 경로 네비게이션
- 상대/절대 경로 정규화
- pathParams 처리
- searchParams 처리
- 복합 파라미터 처리
- 설정되지 않은 함수 처리

#### 4. 라우트 이름으로 네비게이션 (pushByName) (5 테스트)

- 라우트 이름 네비게이션
- pathParams와 함께 네비게이션
- searchParams와 함께 네비게이션
- 존재하지 않는 라우트 처리
- 리졸버 미설정 처리

#### 5. 히스토리 네비게이션 (4 테스트)

- 뒤로가기
- 앞으로가기
- 특정 단계 이동
- window 미존재 환경 처리

#### 6. URL 대체 (replace) (4 테스트)

- React Router replace 옵션
- pathParams/searchParams 처리
- 경로 정규화
- 함수 미설정 처리

#### 7. PathUtil 통합 (1 테스트)

- PathUtil 함수 호출 검증

#### 8. 엣지 케이스 (3 테스트)

- 빈 경로 처리
- 절대 경로 처리
- undefined 파라미터 처리

## 테스트 실행

```bash
# 모든 navigation 테스트 실행
pnpm test -- --run src/services/__tests__

# 특정 테스트 파일만 실행
pnpm test -- --run src/services/__tests__/navigation.test.ts
pnpm test -- --run src/services/__tests__/navigator.test.ts

# watch 모드로 실행
pnpm test src/services/__tests__
```

## Mock 사용

### NavigationStore 테스트

- RouteBuilder 인터페이스를 직접 정의하여 순환 종속성 방지
- window.location mock 설정
- 실제 라우트 구조와 유사한 mock 데이터 사용

### NavigatorStore 테스트

- @shared/utils의 PathUtil mock
- window.history API mock
- React Router와 Next.js 구분을 위한 함수 length 속성 조작

## 테스트 결과

✅ **58개 테스트 모두 통과**

- NavigationStore: 29개 테스트
- NavigatorStore: 29개 테스트

모든 주요 기능과 엣지 케이스가 검증되어 서비스의 안정성을 보장합니다.
