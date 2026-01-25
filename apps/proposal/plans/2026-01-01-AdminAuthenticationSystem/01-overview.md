# 화면 개요

## 목적

관리자가 시스템에 로그인하고, 적절한 Space를 선택하여 API 요청에 필요한 인증 정보를 설정하는 흐름을 정의합니다.

---

## 인증 흐름 다이어그램

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           인증 플로우                                    │
└─────────────────────────────────────────────────────────────────────────┘

[앱 진입]
    │
    ▼
[인증 상태 확인] ─── 토큰 유효 ───▶ [Space 확인] ─── spaceId 있음 ───▶ [대시보드]
    │                                    │
    │                                    │ spaceId 없음
    │                                    ▼
    │                              [Space 선택 Alert]
    │                                    │
    │                                    ▼
    │                              [Space 선택 페이지]
    │                                    │
    │                                    ▼
    │                              [대시보드]
    │
    │ 토큰 없음/만료
    ▼
[LoginPage]
    │
    │ 로그인 성공
    ▼
[토큰 저장 (Cookie)]
    │
    ▼
[Space 자동 선택]
(user.tenants[0].spaceId)
    │
    ▼
[PersistStore 저장]
(spaceId, groundName)
    │
    ▼
[대시보드 이동 (/)]
```

---

## 주요 상태 전이

| 현재 상태 | 조건 | 다음 상태 |
|----------|------|----------|
| 앱 진입 | 토큰 없음/만료 | LoginPage |
| 앱 진입 | 토큰 유효 + spaceId 있음 | 대시보드 |
| 앱 진입 | 토큰 유효 + spaceId 없음 | Space 선택 Alert |
| LoginPage | 로그인 성공 | Space 자동 선택 → 대시보드 |
| LoginPage | 로그인 실패 | LoginPage (에러 표시) |
| Space 선택 | Space 선택 완료 | 대시보드 |

---

## 인증 확인 기준

httpOnly 쿠키 환경에서 토큰 유효성을 판단하는 방법:

```typescript
// 토큰 자체는 httpOnly 쿠키에 저장되어 JS에서 접근 불가
// 만료 시간만 localStorage에 저장하여 판단

const isAuthenticated = () => {
  const accessTokenExpiresAt = persistStore.accessTokenExpiresAt;
  if (!accessTokenExpiresAt) return false;

  const TOKEN_BUFFER_MS = 30000; // 30초 버퍼
  return Date.now() < accessTokenExpiresAt - TOKEN_BUFFER_MS;
};
```
