# L7-L8: 데이터 모델, UI 컴포넌트

## 이전 레이어 요약 (L0-L6)

- **L0-L2**: 시스템 관리자가 OIDC 클라이언트 CRUD + 세션/토큰 관리
- **L3**: 클라이언트 목록/검색/상세/등록/수정/삭제/토글, 세션 목록/필터/폐기
- **L4**: 5개 화면 (클라이언트 목록/상세/등록/수정, 세션 목록)
- **L5**: 25개 인터랙션
- **L6**: 9개 API (모두 신규)

---

## L7: 데이터 모델 (Entity)

### 엔티티 목록

| ID | 엔티티 | 위치 | 상태 | 설명 |
|----|--------|------|------|------|
| IDP-L7-ENT-001 | OidcClient | `@cocrepo/prisma` | 기존 | OIDC 클라이언트 앱 정보 |
| IDP-L7-ENT-002 | OidcModel | `@cocrepo/prisma` | 기존 | OIDC 토큰/세션 저장소 |

### 엔티티 관계

```
┌──────────────────────┐
│     OidcClient       │
│                      │
│ id                   │
│ clientId (unique)    │      ┌──────────────────────┐
│ clientSecret         │      │     OidcModel        │
│ clientName           │      │                      │
│ redirectUris[]       │      │ id                   │
│ grantTypes[]         │      │ key (unique)         │
│ responseTypes[]      │      │ modelType            │
│ tokenEndpointAuth... │      │ payload (Json)       │
│ scope                │      │ expiresAt            │
│ isActive             │      │ grantId              │
│ logoUri              │      │ uid                  │
│ policyUri            │      │ userCode             │
│ tosUri               │      │ createdAt            │
│ createdAt            │      └──────────────────────┘
│ updatedAt            │
│ removedAt            │      (관계 없음 - 독립 저장소)
└──────────────────────┘
```

**참고**: OidcClient와 OidcModel은 DB 관계가 없음. OidcModel의 payload JSON 내부에 clientId가 포함되어 있지만 FK가 아님.

### 주요 엔티티 상세

#### OidcClient (기존)

```prisma
model OidcClient {
  id                      String    @id @default(uuid())
  createdAt               DateTime  @default(now()) @db.Timestamptz(6)
  updatedAt               DateTime? @updatedAt @db.Timestamptz(6)
  removedAt               DateTime? @db.Timestamptz(6)
  clientId                String    @unique
  clientSecret            String?
  clientName              String
  redirectUris            String[]
  grantTypes              String[]  @default(["authorization_code"])
  responseTypes           String[]  @default(["code"])
  tokenEndpointAuthMethod String    @default("client_secret_basic")
  scope                   String    @default("openid profile email")
  isActive                Boolean   @default(true)
  logoUri                 String?
  policyUri               String?
  tosUri                  String?
  @@map("oidc_clients")
}
```

#### OidcModel (기존)

```prisma
model OidcModel {
  id        String    @id @default(uuid())
  createdAt DateTime  @default(now()) @db.Timestamptz(6)
  updatedAt DateTime? @updatedAt @db.Timestamptz(6)
  key       String    @unique
  modelType String
  payload   Json
  expiresAt DateTime? @db.Timestamptz(6)
  userCode  String?   @unique
  grantId   String?
  uid       String?   @unique
  @@map("oidc_models")
}
```

### DTO 목록 (신규)

| DTO | 위치 | 용도 |
|-----|------|------|
| OidcClientDto | `@cocrepo/dto` | 클라이언트 응답용 |
| CreateOidcClientDto | `@cocrepo/dto` | 클라이언트 등록 요청 |
| UpdateOidcClientDto | `@cocrepo/dto` | 클라이언트 수정 요청 |
| QueryOidcClientDto | `@cocrepo/dto` | 클라이언트 목록 쿼리 |
| OidcSessionDto | `@cocrepo/dto` | 세션 응답용 |
| QueryOidcSessionDto | `@cocrepo/dto` | 세션 목록 쿼리 |

---

## L8: UI 컴포넌트

### 컴포넌트 계층 구조

#### 클라이언트 목록 페이지

```
Page (클라이언트 목록)
└── PageSurface (title="OIDC 클라이언트", actions=[등록 버튼])
    ├── SearchInput (검색)
    └── SectionSurface (padding="none")
        └── DataGrid
            ├── Column: clientId
            ├── Column: clientName
            ├── Column: tokenEndpointAuthMethod → AuthMethodCell
            ├── Column: grantTypes → GrantTypeCell
            ├── Column: isActive → ActiveStatusCell
            └── Column: createdAt → DateTimeCell
```

#### 클라이언트 상세 페이지

```
Page (클라이언트 상세)
└── PageSurface (title=clientId, actions=[수정, 삭제, 토글])
    ├── SectionSurface (기본 정보)
    │   ├── DetailRow: Client ID
    │   ├── DetailRow: Client Secret (마스킹 + 보기/복사)
    │   ├── DetailRow: 이름
    │   ├── DetailRow: 활성 상태
    │   └── DetailRow: 등록일
    ├── SectionSurface (인증 설정)
    │   ├── DetailRow: 인증 방식
    │   ├── DetailRow: Grant Types (Chip 목록)
    │   ├── DetailRow: Response Types (Chip 목록)
    │   └── DetailRow: 스코프
    ├── SectionSurface (Redirect URIs)
    │   └── URI 목록 (코드 블록 스타일)
    └── SectionSurface (추가 정보)
        ├── DetailRow: 로고 URI
        ├── DetailRow: 정책 URI
        └── DetailRow: 약관 URI
```

#### 클라이언트 등록/수정 페이지

```
Page (클라이언트 등록/수정)
└── PageSurface (title="OIDC 클라이언트 등록/수정")
    ├── SectionSurface (기본 정보)
    │   ├── TextInput: clientId (등록만, 수정 시 readonly)
    │   ├── TextInput: clientName
    │   ├── TextInput: clientSecret + [자동 생성 버튼]
    │   └── Checkbox: Public 클라이언트
    ├── SectionSurface (인증 설정)
    │   ├── Select: tokenEndpointAuthMethod
    │   ├── CheckboxGroup: grantTypes
    │   ├── CheckboxGroup: responseTypes
    │   └── TextInput: scope
    ├── SectionSurface (Redirect URIs)
    │   └── RedirectUriListInput (동적 추가/삭제)
    ├── SectionSurface (추가 정보)
    │   ├── TextInput: logoUri
    │   ├── TextInput: policyUri
    │   └── TextInput: tosUri
    └── 버튼 영역: [취소] [등록/저장]
```

#### 세션 목록 페이지

```
Page (세션 목록)
└── PageSurface (title="OIDC 세션/토큰")
    ├── Select (모델 타입 필터)
    └── SectionSurface (padding="none")
        └── DataGrid
            ├── Column: key (앞 8자리 truncate)
            ├── Column: modelType → ModelTypeCell
            ├── Column: grantId (앞 8자리, 클릭 → 일괄 폐기)
            ├── Column: expiresAt → ExpiryCell (남은 시간 표시)
            ├── Column: createdAt → DateTimeCell
            └── Column: actions → RevokeButtonCell
```

### 컴포넌트 목록

#### Pure UI (기존 활용)

| ID | 컴포넌트 | 패키지 | 상태 |
|----|---------|--------|------|
| IDP-L8-CMP-001 | DataGrid | `@cocrepo/ui` | 기존 |
| IDP-L8-CMP-002 | Input | HeroUI | 기존 |
| IDP-L8-CMP-003 | Button | HeroUI | 기존 |
| IDP-L8-CMP-004 | Select | HeroUI | 기존 |
| IDP-L8-CMP-005 | Checkbox/CheckboxGroup | HeroUI | 기존 |
| IDP-L8-CMP-006 | Chip | HeroUI | 기존 |
| IDP-L8-CMP-007 | Modal | HeroUI | 기존 |

#### Cell 컴포넌트 (신규)

| ID | 컴포넌트 | 위치 | 설명 |
|----|---------|------|------|
| IDP-L8-CMP-010 | AuthMethodCell | `@cocrepo/ui` | 인증 방식 뱃지 (basic/post/none) |
| IDP-L8-CMP-011 | GrantTypeCell | `@cocrepo/ui` | Grant Type Chip 목록 |
| IDP-L8-CMP-012 | ActiveStatusCell | `@cocrepo/ui` | 활성/비활성 뱃지 |
| IDP-L8-CMP-013 | ModelTypeCell | `@cocrepo/ui` | OIDC 모델 타입 뱃지 (컬러 코딩) |
| IDP-L8-CMP-014 | ExpiryCell | `@cocrepo/ui` | 만료 시간 + 남은 시간 표시 |
| IDP-L8-CMP-015 | RevokeButtonCell | `@cocrepo/ui` | 폐기 버튼 (확인 다이얼로그 포함) |
| IDP-L8-CMP-016 | DateTimeCell | `@cocrepo/ui` | 날짜 포맷팅 (기존 확인 필요) |

#### Widget 컴포넌트 (신규)

| ID | 컴포넌트 | 위치 | 설명 |
|----|---------|------|------|
| IDP-L8-CMP-020 | OidcClientDetailCard | `@cocrepo/ui` | 클라이언트 상세 정보 카드 |
| IDP-L8-CMP-021 | SecretField | `@cocrepo/ui` | Secret 마스킹 + 보기/복사 위젯 |
| IDP-L8-CMP-022 | RedirectUriListInput | `@cocrepo/ui` | 동적 URI 추가/삭제 입력 위젯 |
| IDP-L8-CMP-023 | DetailRow | `@cocrepo/ui` | 라벨-값 한 줄 표시 (기존 확인 필요) |

#### Feature 컴포넌트 (신규)

| ID | 컴포넌트 | 위치 | 설명 |
|----|---------|------|------|
| IDP-L8-CMP-030 | OidcClientForm | `@cocrepo/ui` | 등록/수정 공용 폼 (Store 연결) |
| IDP-L8-CMP-031 | OidcClientActions | `@cocrepo/ui` | 상세 화면 액션 버튼 그룹 (삭제/토글) |

### 컴포넌트 상세

#### IDP-L8-CMP-021: SecretField

**용도**: Client Secret을 마스킹/표시/복사하는 위젯

**Props**:
```typescript
interface SecretFieldProps {
  value: string | null;
  label?: string;
}
```

**렌더링**:
```
[●●●●●●●●●●●●] [👁 보기] [📋 복사]
↓ 보기 클릭
[admin-secret-ch...] [👁 숨기] [📋 복사]
```

#### IDP-L8-CMP-022: RedirectUriListInput

**용도**: Redirect URI 동적 추가/삭제 입력

**Props**:
```typescript
interface RedirectUriListInputProps {
  value: string[];
  onChange: (uris: string[]) => void;
  errors?: Record<number, string>;
}
```

**렌더링**:
```
[http://localhost:3000/callback_____] [X]
[https://admin.example.com/callback_] [X]
[+ URI 추가]
```

#### IDP-L8-CMP-013: ModelTypeCell

**용도**: OIDC 모델 타입별 컬러 코딩 뱃지

| 모델 타입 | 색상 | 라벨 |
|-----------|------|------|
| AccessToken | primary | Access Token |
| RefreshToken | secondary | Refresh Token |
| AuthorizationCode | warning | Auth Code |
| Session | success | Session |
| Grant | default | Grant |
| 기타 | default | {modelType} |

#### IDP-L8-CMP-014: ExpiryCell

**용도**: 만료 시간 + 남은 시간 표시

```typescript
interface ExpiryCellProps {
  expiresAt: Date | null;
}
```

**렌더링**:
```
만료: 2026-02-10 15:30  (2h 30m 남음)  ← 유효
만료: 2026-02-09 10:00  (만료됨)        ← 만료 (danger 색상)
만료: -                                 ← expiresAt null
```

### DataGrid 컬럼 설정

#### 클라이언트 목록

```typescript
const oidcClientColumns: ColumnDef<OidcClientDto>[] = [
  { id: 'clientId', header: 'Client ID', accessor: 'clientId', width: 200 },
  { id: 'clientName', header: '이름', accessor: 'clientName', width: 200, sortable: true },
  {
    id: 'tokenEndpointAuthMethod', header: '인증 방식',
    cell: ({ row }) => <AuthMethodCell method={row.tokenEndpointAuthMethod} />,
    width: 150,
  },
  {
    id: 'grantTypes', header: 'Grant Types',
    cell: ({ row }) => <GrantTypeCell types={row.grantTypes} />,
    width: 200,
  },
  {
    id: 'isActive', header: '활성',
    cell: ({ row }) => <ActiveStatusCell isActive={row.isActive} />,
    width: 80,
  },
  {
    id: 'createdAt', header: '등록일',
    cell: ({ row }) => <DateTimeCell value={row.createdAt} format="YYYY-MM-DD" />,
    width: 120, sortable: true,
  },
];
```

#### 세션 목록

```typescript
const oidcSessionColumns: ColumnDef<OidcSessionDto>[] = [
  {
    id: 'key', header: '키',
    cell: ({ row }) => <span title={row.key}>{row.key.slice(0, 8)}...</span>,
    width: 120,
  },
  {
    id: 'modelType', header: '모델 타입',
    cell: ({ row }) => <ModelTypeCell type={row.modelType} />,
    width: 130,
  },
  {
    id: 'grantId', header: 'Grant ID',
    cell: ({ row }) => row.grantId ? <span title={row.grantId}>{row.grantId.slice(0, 8)}...</span> : '-',
    width: 120,
  },
  {
    id: 'expiresAt', header: '만료 시간',
    cell: ({ row }) => <ExpiryCell expiresAt={row.expiresAt} />,
    width: 200,
  },
  {
    id: 'createdAt', header: '등록일',
    cell: ({ row }) => <DateTimeCell value={row.createdAt} format="YYYY-MM-DD HH:mm" />,
    width: 150,
  },
  {
    id: 'actions', header: '',
    cell: ({ row }) => <RevokeButtonCell sessionKey={row.key} />,
    width: 100,
  },
];
```

---

## Requirement Graph (L7-L8)

```json
{
  "nodes": [
    { "id": "IDP-L7-ENT-001", "level": 7, "type": "entity", "label": "OidcClient", "metadata": { "status": "existing" } },
    { "id": "IDP-L7-ENT-002", "level": 7, "type": "entity", "label": "OidcModel", "metadata": { "status": "existing" } },
    { "id": "IDP-L8-CMP-010", "level": 8, "type": "component", "label": "AuthMethodCell", "metadata": { "status": "new" } },
    { "id": "IDP-L8-CMP-011", "level": 8, "type": "component", "label": "GrantTypeCell", "metadata": { "status": "new" } },
    { "id": "IDP-L8-CMP-012", "level": 8, "type": "component", "label": "ActiveStatusCell", "metadata": { "status": "new" } },
    { "id": "IDP-L8-CMP-013", "level": 8, "type": "component", "label": "ModelTypeCell", "metadata": { "status": "new" } },
    { "id": "IDP-L8-CMP-014", "level": 8, "type": "component", "label": "ExpiryCell", "metadata": { "status": "new" } },
    { "id": "IDP-L8-CMP-015", "level": 8, "type": "component", "label": "RevokeButtonCell", "metadata": { "status": "new" } },
    { "id": "IDP-L8-CMP-021", "level": 8, "type": "component", "label": "SecretField", "metadata": { "status": "new" } },
    { "id": "IDP-L8-CMP-022", "level": 8, "type": "component", "label": "RedirectUriListInput", "metadata": { "status": "new" } },
    { "id": "IDP-L8-CMP-030", "level": 8, "type": "component", "label": "OidcClientForm", "metadata": { "status": "new" } }
  ],
  "edges": [
    { "from": "IDP-L6-API-001", "to": "IDP-L7-ENT-001", "type": "returns" },
    { "from": "IDP-L6-API-007", "to": "IDP-L7-ENT-002", "type": "returns" },
    { "from": "IDP-L4-SCR-001", "to": "IDP-L8-CMP-010", "type": "uses" },
    { "from": "IDP-L4-SCR-001", "to": "IDP-L8-CMP-011", "type": "uses" },
    { "from": "IDP-L4-SCR-001", "to": "IDP-L8-CMP-012", "type": "uses" },
    { "from": "IDP-L4-SCR-002", "to": "IDP-L8-CMP-021", "type": "uses" },
    { "from": "IDP-L4-SCR-003", "to": "IDP-L8-CMP-022", "type": "uses" },
    { "from": "IDP-L4-SCR-003", "to": "IDP-L8-CMP-030", "type": "uses" },
    { "from": "IDP-L4-SCR-005", "to": "IDP-L8-CMP-013", "type": "uses" },
    { "from": "IDP-L4-SCR-005", "to": "IDP-L8-CMP-014", "type": "uses" },
    { "from": "IDP-L4-SCR-005", "to": "IDP-L8-CMP-015", "type": "uses" }
  ]
}
```
