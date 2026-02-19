# StorageStore 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: store
> 위치: packages/fe-store/src/stores/storageStore.ts

## 역할

Web Storage API (localStorage/sessionStorage)에 대한 JSON 직렬화/역직렬화 래퍼 클래스. 데이터를 자동으로 JSON.stringify/JSON.parse 처리하여 저장/읽기합니다. MobX observable이 아닌 순수 유틸리티 클래스입니다.

## 상태 (Observable)

없음 (makeAutoObservable 미사용)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| storage | `Storage` (private) | localStorage 또는 sessionStorage | 사용할 Web Storage 인스턴스 |

## 계산된 값 (Computed)

없음

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| `setItem` | `key: string, value: unknown` | `JSON.stringify(value)` 후 storage에 저장 |
| `getItem` | `key: string` | storage에서 읽어 `JSON.parse` 후 반환. 없거나 파싱 실패 시 `null` |
| `removeItem` | `key: string` | storage에서 항목 삭제 |
| `clear` | 없음 | storage 전체 초기화 |

## 비동기 액션 (Flow)

없음

## 의존 Store

없음

## 생성자 파라미터

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| storageType | `"localStorage" \| "sessionStorage"` | `"localStorage"` | 사용할 Storage 유형 |

## 비고

- MobX observable이 아니므로 storage 변경이 자동 리렌더링을 트리거하지 않음
- JSON 파싱 실패 시 에러를 무시하고 null 반환 (안전한 처리)
- SSR 환경에서는 `localStorage`/`sessionStorage`가 존재하지 않으므로 주의 필요

## 사용 예시

```typescript
const storage = new StorageStore("localStorage");

storage.setItem("user", { name: "John", age: 30 });
const user = storage.getItem("user"); // { name: "John", age: 30 }
storage.removeItem("user");
storage.clear();
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
