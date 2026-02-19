# Navigator 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: store
> 위치: packages/fe-store/src/stores/navigator.ts

## 역할

페이지 이동을 담당하는 클래스. Next.js의 AppRouter를 감싸서 프레임워크 의존성을 캡슐화하며, basePath 기반의 경로 조합을 처리합니다. MobX observable이 아닌 순수 유틸리티 클래스입니다.

## 타입 정의

| 타입명 | 종류 | 설명 |
|--------|------|------|
| `Router` | interface | Next.js AppRouter 호환 인터페이스 (`push`, `replace`, `back`, `forward?`, `refresh?`) |
| `NavigatorOptions` | interface | `router: Router`, `basePath?: string` |

## 상태 (Observable)

없음 (makeAutoObservable 미사용, 순수 클래스)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| router | `Router` (private, readonly) | options.router | Next.js AppRouter 인스턴스 |
| basePath | `string` (private, readonly) | options.basePath ?? `""` | 경로 접두사 |

## 계산된 값 (Computed)

없음

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| `push` | `path: string` | basePath를 적용한 경로로 이동 (히스토리에 추가) |
| `replace` | `path: string` | basePath를 적용한 경로로 이동 (히스토리 교체) |
| `back` | 없음 | 뒤로 가기 |
| `forward` | 없음 | 앞으로 가기 (router에 forward가 있을 때만) |
| `refresh` | 없음 | 페이지 새로고침 (router에 refresh가 있을 때만) |

## 비동기 액션 (Flow)

없음

## 의존 Store

없음

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| navigator | Navigator |

## 경로 조합 규칙 (resolvePath)

1. basePath가 비어있으면 path 그대로 반환
2. path가 이미 basePath로 시작하면 그대로 반환 (중복 방지)
3. 그 외: `${basePath}${path}` 형태로 조합

## 사용 예시

```typescript
const router = useRouter();
const navigator = new Navigator({ router, basePath: '/admin' });

navigator.push('/members');      // -> /admin/members
navigator.replace('/login');     // -> /admin/login
navigator.back();                // 뒤로 가기
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
