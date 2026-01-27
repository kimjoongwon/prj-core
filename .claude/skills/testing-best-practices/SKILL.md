---
name: testing-best-practices
description: JavaScript 테스팅 모범 사례를 제공합니다. 사용자가 "테스트 작성", "테스트 리뷰", "테스트 코드 작성", "테스팅", "테스트 전략" 등을 요청할 때 사용합니다. Yoni Goldberg의 "JavaScript Testing Best Practices" 가이드를 기반으로 합니다.
allowed-tools: Bash, Read, Write, Edit
---

# JavaScript Testing Best Practices

이 스킬은 JavaScript 및 Node.js 테스팅에 대한 모범 사례를 제공합니다. Yoni Goldberg의 "JavaScript Testing Best Practices" 가이드를 기반으로 합니다.

## 사용 시나리오
- 테스트 코드 작성 시
- 테스트 코드 리뷰 시
- 테스트 전략 수립 시
- 코드 품질 개선 시
- 사용자가 "테스트", "테스팅", "테스트 코드 작성", "테스트 리뷰" 등을 요청할 때

## 핵심 원칙

### 황금률: 린 테스트를 위한 설계
- 테스트 코드는 제품 코드와 다릅니다
- 단순하고, 짧고, 추상화가 없고, 무난하게 작성
- 테스트를 보고 즉시 의미를 알아챌 수 있어야 함
- 과도한 복잡성을 피하고 가치 있는 테스트에 집중

## 테스트 해부 (Test Anatomy)

### 1. 테스트 이름 구성 (3부분)
**규칙:** 테스트 이름은 세 부분으로 구성되어야 합니다.

1. 무엇을 테스트하고 있는가? (예: ProductService.addNewProduct 메서드)
2. 어떤 상황과 시나리오에서? (예: 가격이 전달되지 않는다)
3. 예상되는 결과는 무엇인가? (예: 신제품은 승인되지 않는다)

**좋은 예:**
```javascript
it('가격을 지정하지 않으면 제품 상태는 승인 대기중이다.', () => {
  // 테스트 코드
});
```

### 2. AAA 패턴에 의한 테스트 구조
**규칙:** 3개의 잘 구분된 섹션으로 테스트를 구성하세요.

- **Arrange (준비):** 시나리오에 필요한 시스템 설정 (생성자 인스턴스화, DB 데이터 추가, mock/stub)
- **Act (행동):** 단위 테스트 실행 (보통 코드 한 줄)
- **Assert (주장):** 예상값 충족 여부 확인 (보통 코드 한 줄)

**좋은 예:**
```javascript
test('고객이 500달러 이상을 소비한 경우 프리미엄으로 분류해야 합니다.', () => {
  // Arrange
  const customerToClassify = {spent:505, joined: new Date(), id:1};
  const DBStub = sinon.stub(dataAccess, "getCustomer")
    .reply({id:1, classification: 'regular'});

  // Act
  const receivedClassification = customerClassifier.classifyCustomer(customerToClassify);

  // Assert
  expect(receivedClassification).toMatch('premium');
});
```

### 3. BDD 스타일의 Assertion 사용
**규칙:** 선언적 BDD 스타일의 expect 또는 should를 사용하여 인간과 같은 언어로 작성하세요.

**좋은 예:**
```javascript
it("관리자 요청이 들어오면 정렬된 관리자 목록만 결과에 포함된다.", () => {
  const allAdmins = getUsers({adminOnly:true});
  expect(allAdmins).to.include.ordered.members(["admin1", "admin2"])
                   .but.not.include.ordered.members(["user1"]);
});
```

**나쁜 예:** 명령형 코드로 채워진 조건부 논리

### 4. 블랙박스 테스트: Public Method만 테스트
**규칙:** 내부 테스트는 거의 아무것도 하지 않는 엄청난 오버헤드를 발생시킵니다. Public method가 잘 동작할 때마다 private method 또한 암시적으로 테스트됩니다.

**이유:**
- 코드 리팩토링 시 테스트가 깨지기 쉬움
- 행동 테스트(블랙박스)가 내부 테스트(화이트박스)보다 효율적

### 5. 올바른 테스트 더블 선택
**규칙:** 요구사항 문서에 있거나 있을 수 있는 기능을 테스트하는 데 테스트 더블을 사용하세요.

**우선순위:**
1. **Stub:** 외부 서비스를 대체하여 특정 시나리오에서 애플리케이션의 동작/응답/결과 확인
2. **Spy:** 특정 동작이 수행되었는지 assert (예: 결제 실패 시 메일 발송)
3. **Mock 피하기:** 내부 구현에 초점을 둔 mock 사용 자제

### 6. 실제와 같은 인풋 데이터 사용
**규칙:** 실제 데이터와 다양성 및 형태가 유사한 데이터를 생성하세요.

**도구:**
- **Faker:** 실제같은 전화번호, 사용자 이름, 신용카드, 회사명 생성
- 무작위화: 테스트(단위 테스트 위에서)를 무작위화

**나쁜 예:** "Foo"와 같은 의미없는 인풋 사용

### 7. Property-based Testing (프로퍼티 기반 테스트)
**규칙:** 1000 가지 조합의 인풋값을 자동으로 생성하여 올바른 응답을 반환하지 못하는 인풋값을 찾아내세요.

**도구:**
- **fast-check:** 추천 (활발하게 유지보수, 부가적인 기능들 제공)
- js-verify
- testcheck

**좋은 예:**
```javascript
import fc from "fast-check";

describe("Product service", () => {
  describe("Adding new", () => {
    it("Add new product with random yet valid properties, always successful", () =>
      fc.assert(
        fc.property(fc.integer(), fc.string(), (id, name) => {
          expect(addNewProduct(id, name).status).toEqual("approved");
        })
      ));
  });
});
```

### 8. 짧거나 인라인 스냅샷만 사용
**규칙:** 외부 파일이 아닌 테스트의 일부에 포함된 짧고 집중된 스냅샷(3~7 라인)만 사용하세요.

**이유:**
- 긴 외부 스냅샷(1,000+ 라인)은 테스트 실패 원인을 파악하기 어렵게 함
- 모든 공백, 주석, 사소한 CSS/HTML 변경에 실패

**허용되는 경우:**
- 데이터가 아닌 스키마를 assert 할 때
- 수신된 문서가 거의 변경되지 않는 경우

### 9. 테스트 데이터를 테스트별로 따로 추가
**규칙:** 각 테스트는 커플링을 방지하고 테스트 흐름을 쉽게 추론하기 위해 자체 DB 데이터를 추가하고 실행해야 합니다.

**이유:**
- 글로벌 훅에 의한 DB 데이터 의존 시 테스트 간 간섭 발생 가능
- 테스트 실패 시 원인 파악 어려움

**타협 가능한 경우:**
- 성능이 중요한 문제일 때 데이터를 변경하지 않는 테스트 모음(예: 쿼리)

### 10. 오류를 expect 하십시오
**규칙:** 오류를 발생시키는 입력값을 assert 할 때 try-catch-finally 대신 한 줄짜리 assertion을 사용하세요.

**좋은 예:**
```javascript
it("제품명이 없으면, 400 오류를 던진다.", async () => {
  await expect(addNewProduct({}))
    .to.eventually.throw(AppError)
    .with.property("code", "InvalidInput");
});
```

**나쁜 예:** try-catch로 오류가 존재한다고 assert 하는 긴 테스트 사례

### 11. 테스트에 태깅하십시오
**규칙:** 다른 테스트는 꼭 다른 시나리오에서 실행해야 합니다. #cold #api #sanity와 같은 키워드로 테스트에 태깅하세요.

**시나리오 예:**
- 빠르고, IO가 많이 없는 테스트: 파일 저장 시 실행 (#cold, #sanity)
- 전체 end-to-end 테스트: Pull Request 제출 시 실행 (#e2e)

**실행 예:**
```bash
mocha -grep 'sanity'
```

### 12. 일반적인 좋은 테스트 기법들
- TDD 원칙 배우고 연습
- 실패-성공-리팩토링 스타일로 코드 작성 전 테스트 작성 고려
- 각 테스트에서 정확히 한 가지만 확인
- 버그 수정 전 테스트 작성
- 테스트가 성공하기 전에 각 테스트가 한번 이상 실패하도록
- 테스트를 만족시키는 간단한 코드 작성 후 점진적으로 리팩토링
- 환경(경로, OS 등)에 대한 종속성 피하기

## 백엔드 테스트

### 1. 테스트 포트폴리오 풍부하게 하기
**규칙:** 테스트 피라미드 외에 다른 테스트 유형들에 익숙해지세요.

**추천 테스트 유형:**
- Consumer-driven contract 테스트
- Fuzz 테스트
- Mutation 테스트
- Component 테스트
- Contract 테스트

**이유:**
- 모든 어플리케이션 유형에 테스트 피라미드가 적합하지 않음
- 위험성 분석 기반 포트폴리오 구축 필요

### 2. 컴포넌트 테스트
**규칙:** 단위 테스트보다는 크지만 end-to-end 테스트보다는 작은 테스트를 작성하세요.

**특징:**
- 합리적인 성능과 TDD 패턴 적용 가능
- 현실적이면서 훌륭한 커버리지
- 마이크로서비스 '단위'에 중점을 두고 API에 대하여 동작
- 마이크로서비스 그 자체에 속한 것은 모킹하지 않고, 외부적인 것은 스텁

**도구:** Supertest (프로세스 내 Express API 접근)

### 3. 신규 릴리즈가 API 사용을 깨지게 하지 마십시오
**규칙:** Consumer-driven contracts와 PACT 프레임워크를 사용하세요.

**동작:**
- 클라이언트가 서버의 테스트를 결정 (서버가 아닌)
- PACT는 클라이언트의 기댓값을 기록하여 "브로커"라는 공유된 위치에 저장
- 서버는 기댓값을 가져와 빌드할 때 깨진 계약 감지

### 4. 미들웨어를 독립적으로 테스트 하십시오
**규칙:** 미들웨어 함수를 테스트하기 위해 함수를 불러오고 {req, res} 객체에 대한 인터랙션을 스파이하세요.

**도구:**
- **Sinon:** 스파이 기능
- **node-mock-http:** {req, res} 객체 테스트

**이유:**
- 미들웨어는 작지만 모든 요청에 영향을 미침
- 순수한 함수로 쉽게 테스트 가능

### 5. 정적 분석 도구 사용
**규칙:** 정적 분석 도구를 CI 빌드에 추가하여 코드 냄새가 발견되면 중단되도록 하세요.

**도구:**
- **Sonarqube:** 2,600+ stars
- **Code Climate:** 1,500+ stars

**이점:**
- 여러 파일들의 컨텍스트 안에서 품질 검사 (중복 탐지)
- 고급 분석 (코드 복잡성)
- 코드 이슈 히스토리 및 프로세스 추적

### 6. 노드 혼돈(chaos)에 대한 준비상태 확인
**규칙:** 인프라 이슈에 대한 애플리케이션 복원력을 테스트하세요.

**테스트 대상:**
- 프로세스 메모리 과부하
- 서버/프로세스 죽음
- API 속도 저하

**도구:**
- **Chaos Monkey:** 서버 무작위 종료
- **kube-monkey:** 쿠버네티스 팟 종료
- **node-chaos:** Node.js 관련 혼돈 발생

## 프론트엔드 테스트

### 1. 컴포넌트 테스트 (Component Testing)
**규칙:** React Testing Library와 같은 도구를 사용하여 컴포넌트의 동작을 테스트하세요.

**원칙:**
- 사용자가 실제로 상호작용하는 방식으로 테스트
- DOM 노드 쿼리가 아닌 사용자 액션(클릭, 타이핑 등)으로 테스트
- 구현 세부사항이 아닌 사용자 경험 테스트

### 2. E2E (End-to-End) 테스트
**규칙:** Playwright, Cypress 같은 도구를 사용하여 사용자 흐름 전체를 테스트하세요.

**주의:**
- E2E 테스트는 느리고 취약함
- 중요한 사용자 흐름만 테스트
- 일반적인 사용자 시나리오 중심

### 3. 접근성 테스트
**규칙:** axe-core와 같은 도구를 사용하여 접근성을 테스트하세요.

## 테스트 효과 측정

### 1. 커버리지 보고서
**규칙:** 테스트 커버리지를 측정하고 최소 기준을 설정하세요.

**도구:**
- **Istanbul/nyc:** 코드 커버리지 측정
- **Jest:** 내장 커버리지 도구

**주의:** 높은 커버리지 ≠ 높은 품질

### 2. Mutation Testing (돌연변이테스트)
**규칙:** 코드의 뮤테이션(변형)을 생성하여 테스트가 이를 감지하는지 확인하세요.

**도구:**
- **Stryker Mutator:** JavaScript용 돌연변이 테스트 도구
- **stryker-js**

**이유:** 테스트의 효율성을 측정

### 3. 코드 복잡도 측정
**규칙:** 코드 복잡도를 측정하여 복잡한 함수에 집중하세요.

**지표:**
- **순환 복잡도 (Cyclomatic Complexity)**
- **인지 복잡도 (Cognitive Complexity)**

## 지속적 통합 (CI)

### 1. 테스트 분리
**규칙:** 빠른 테스트와 느린 테스트를 분리하여 실행하세요.

**전략:**
- 개발 중: 빠른 테스트만 (#cold, #sanity)
- PR 제출 시: 전체 테스트
- 배포 전: 전체 테스트 + E2E

### 2. 병렬 테스트 실행
**규칙:** 테스트를 병렬로 실행하여 CI 시간을 단축하세요.

**도구:**
- **GitHub Actions:** 병렬 작업
- **Jest:** --maxWorkers 옵션

### 3. 테스트 결과 저장
**규칙:** 테스트 결과를 저장하고 추적하세요.

**도구:**
- **GitHub Actions:** 아티팩트 저장
- **Codecov:** 커버리지 추적
- **Code Climate:** 품질 지표 추적

### 4. 플레이크(Flake) 테스트 감지
**규칙:** 일관성 없이 실패하는 테스트를 감지하고 수정하세요.

**도구:**
- **Flaky Bot:** GitHub Actions 플레이크 테스트 감지
- **rerun:** 실패 시 자동 재시도

### 5. 테스트 실행 최적화
**규칙:** 변경된 파일에 관련된 테스트만 실행하세요.

**도구:**
- **Jest:** --onlyChanged
- **GitHub Actions:** 경로 필터링

### 6. 테스트 데이터 격리
**규칙:** 각 테스트는 독립적인 테스트 데이터를 사용하세요.

**전략:**
- 테스트마다 데이터베이스 롤백
- 트랜잭션 사용 후 롤백
- 임시 데이터베이스 사용

### 7. 테스트 시간 모니터링
**규칙:** 테스트 실행 시간을 모니터링하고 느린 테스트를 개선하세요.

**도구:**
- **Jest:** --listTests 및 --verbose
- **GitHub Actions:** 작업 시간 표시

### 8. 테스트 실패 알림
**규칙:** 테스트 실패 시 적절한 알림을 설정하세요.

**채널:**
- Slack
- 이메일
- GitHub Notifications
- Teams

### 9. 테스트 성공 조건 정의
**규칙:** 테스트 성공 조건을 명확히 정의하고 CI 파이프라인에 통합하세요.

**조건:**
- 모든 테스트 통과
- 최소 커버리지 달성
- 정적 분석 통과
- 빌드 성공

## 도구 및 라이브러리

### 테스트 프레임워크
- **Jest:** Facebook 개발, 전통적이고 강력한 테스트 프레임워크
- **Mocha + Chai:** 유연한 테스트 프레임워크 + assertion 라이브러리
- **Vitest:** Vite 기반, 빠른 테스트 프레임워크

### 테스트 더블
- **Sinon.js:** Mock, Stub, Spy 라이브러리
- **MSW:** Mock Service Worker (API mocking)

### 프론트엔드 테스트
- **React Testing Library:** React 컴포넌트 테스트
- **@testing-library/user-event:** 사용자 상호작용 시뮬레이션
- **Cypress:** E2E 테스트
- **Playwright:** E2E 테스트 (Microsoft 개발)

### 데이터 생성
- **Faker:** 가짜 데이터 생성
- **@faker-js/faker:** Faker의 유지보수된 포크

### Property-based Testing
- **fast-check:** 추천, 활발한 유지보수
- **js-verify:** Property-based testing
- **testcheck-js:** Property-based testing

### 테스트 효과 측정
- **Istanbul/nyc:** 코드 커버리지
- **Stryker Mutator:** 돌연변이 테스트
- **Sonarqube:** 코드 품질 분석
- **Code Climate:** 코드 품질 분석

### CI/CD
- **GitHub Actions:** CI/CD 플랫폼
- **Codecov:** 커버리지 추적 및 보고

## 참고 자료

- [JavaScript Testing Best Practices (GitHub)](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Testing Library 공식 문서](https://testing-library.com/docs/)
- [Jest 공식 문서](https://jestjs.io/docs/getting-started)
- [Vitest 공식 문서](https://vitest.dev/guide/)
