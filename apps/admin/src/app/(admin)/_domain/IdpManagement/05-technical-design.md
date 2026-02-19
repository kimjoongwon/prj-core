# L9-L10: 비즈니스 로직, 테스트

## 이전 레이어 요약 (L0-L8)

- **L0-L2**: 시스템 관리자가 OIDC 클라이언트 CRUD + 세션/토큰 관리
- **L3-L4**: 5개 화면 (클라이언트 목록/상세/등록/수정, 세션 목록)
- **L5-L6**: 25개 인터랙션, 9개 API (모두 신규)
- **L7**: OidcClient, OidcModel 엔티티 (기존), 6개 DTO (신규)
- **L8**: Cell 7개, Widget 4개, Feature 2개 컴포넌트

---

## L9: 비즈니스 로직 (Logic)

### 백엔드 로직

#### IDP-L9-LOG-001: Client ID 유니크 검증

```typescript
// OidcClientService.create()
async create(dto: CreateOidcClientDto): Promise<OidcClient> {
  const existing = await this.repository.findByClientId(dto.clientId);
  if (existing) {
    throw new ConflictException("이미 존재하는 Client ID입니다");
  }
  return this.repository.create(dto);
}
```

#### IDP-L9-LOG-002: Client Secret 해싱 (선택사항)

```typescript
// Confidential 클라이언트의 Secret은 평문 저장 (oidc-provider 요구사항)
// oidc-provider가 자체적으로 Secret 비교를 수행하므로 해싱 불가
// 대신 DB 접근 권한으로 보안 관리
```

#### IDP-L9-LOG-003: 소프트 삭제 + 비활성화

```typescript
// OidcClientService.remove()
async remove(id: string): Promise<void> {
  await this.repository.update(id, {
    removedAt: new Date(),
    isActive: false,  // 삭제 시 자동 비활성화
  });
}
```

#### IDP-L9-LOG-004: 활성/비활성 토글

```typescript
// OidcClientService.toggleActive()
async toggleActive(id: string): Promise<OidcClient> {
  const client = await this.repository.findByIdOrThrow(id);
  return this.repository.update(id, {
    isActive: !client.isActive,
  });
}
```

#### IDP-L9-LOG-005: 세션 목록 조회 (OidcModel 기반)

```typescript
// OidcSessionService.findAll()
async findAll(query: QueryOidcSessionDto) {
  const where: Prisma.OidcModelWhereInput = {
    ...(query.modelType && { modelType: query.modelType }),
    // 만료되지 않은 세션만 (expiresAt > now OR expiresAt null)
    OR: [
      { expiresAt: { gt: new Date() } },
      { expiresAt: null },
    ],
  };

  const [data, total] = await Promise.all([
    this.repository.findMany({ where, skip: query.skip, take: query.take, orderBy: { createdAt: 'desc' } }),
    this.repository.count({ where }),
  ]);

  return { data, total };
}
```

#### IDP-L9-LOG-006: 단건 세션 폐기

```typescript
// OidcSessionService.revoke()
async revoke(key: string): Promise<void> {
  const session = await this.repository.findByKeyOrThrow(key);

  // 1. DB에서 삭제
  await this.repository.deleteByKey(key);

  // 2. Redis에서도 삭제 (oidc-provider 캐시 무효화)
  await this.redisService.del(`oidc:${session.modelType}:${key}`);

  // 3. grantId가 있으면 grant SET에서도 제거
  if (session.grantId) {
    await this.redisService.sRem(`oidc:${session.modelType}:grant:${session.grantId}`, key);
  }
}
```

#### IDP-L9-LOG-007: Grant 일괄 폐기

```typescript
// OidcSessionService.revokeByGrant()
async revokeByGrant(grantId: string): Promise<void> {
  // 1. DB에서 grantId로 모든 레코드 조회
  const sessions = await this.repository.findManyByGrantId(grantId);

  // 2. DB 일괄 삭제
  await this.repository.deleteManyByGrantId(grantId);

  // 3. Redis 일괄 삭제
  for (const session of sessions) {
    await this.redisService.del(`oidc:${session.modelType}:${session.key}`);
  }
}
```

### 프론트엔드 로직

#### IDP-L9-LOG-010: Client Secret 자동 생성

```typescript
// 프론트엔드에서 crypto.randomBytes 대안
function generateClientSecret(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}
```

#### IDP-L9-LOG-011: Public 클라이언트 토글 로직

```typescript
// Public 클라이언트 체크 시:
// - clientSecret 필드 비활성화 + 값 초기화
// - tokenEndpointAuthMethod = "none" 자동 설정
function handlePublicToggle(isPublic: boolean) {
  if (isPublic) {
    form.setValue("clientSecret", "");
    form.setValue("tokenEndpointAuthMethod", "none");
  } else {
    form.setValue("tokenEndpointAuthMethod", "client_secret_basic");
  }
}
```

#### IDP-L9-LOG-012: 등록 폼 유효성 검증

```typescript
const validationRules = {
  clientId: {
    required: "Client ID는 필수입니다",
    pattern: { value: /^[a-z0-9-]{3,64}$/, message: "영소문자, 숫자, 하이픈만 가능 (3-64자)" },
  },
  clientName: {
    required: "클라이언트 이름은 필수입니다",
    maxLength: { value: 128, message: "128자 이내로 입력하세요" },
  },
  redirectUris: {
    validate: (uris: string[]) => {
      if (uris.length === 0) return "최소 1개의 Redirect URI가 필요합니다";
      for (const uri of uris) {
        try { new URL(uri); } catch { return `유효하지 않은 URI: ${uri}`; }
      }
      return true;
    },
  },
  grantTypes: {
    validate: (types: string[]) => types.length > 0 || "최소 1개의 Grant Type을 선택하세요",
  },
  scope: {
    required: "스코프는 필수입니다",
    validate: (scope: string) => scope.includes("openid") || "openid 스코프는 필수입니다",
  },
};
```

#### IDP-L9-LOG-013: 만료 시간 상대 표시

```typescript
function formatExpiry(expiresAt: Date | null): { text: string; isExpired: boolean } {
  if (!expiresAt) return { text: "-", isExpired: false };

  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();

  if (diff <= 0) return { text: "만료됨", isExpired: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return { text: `${days}d ${hours}h 남음`, isExpired: false };
  if (hours > 0) return { text: `${hours}h ${minutes}m 남음`, isExpired: false };
  return { text: `${minutes}m 남음`, isExpired: false };
}
```

#### IDP-L9-LOG-014: 폐기 확인 다이얼로그

```typescript
function handleRevoke(key: string) {
  // 확인 다이얼로그 표시
  modal.confirm({
    title: "세션 폐기",
    content: "이 세션/토큰을 폐기하시겠습니까? 해당 사용자는 즉시 로그아웃됩니다.",
    confirmText: "폐기",
    confirmColor: "danger",
    onConfirm: async () => {
      await revokeSession(key);
      // 성공 토스트 + 목록 갱신
    },
  });
}
```

---

## L10: 테스트 (Test)

### 백엔드 테스트

#### IDP-L10-TST-001: OidcClientService 유닛 테스트

```typescript
describe('OidcClientService', () => {
  describe('create', () => {
    it('새 클라이언트를 등록한다', async () => {
      // Given
      const dto: CreateOidcClientDto = {
        clientId: 'test-client',
        clientName: 'Test Client',
        redirectUris: ['http://localhost:3000/callback'],
        grantTypes: ['authorization_code'],
      };

      // When
      const result = await service.create(dto);

      // Then
      expect(result.clientId).toBe('test-client');
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining(dto));
    });

    it('중복된 Client ID로 등록하면 ConflictException을 던진다', async () => {
      // Given
      repository.findByClientId.mockResolvedValue(existingClient);

      // When & Then
      await expect(service.create({ clientId: 'existing-id', ... }))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('toggleActive', () => {
    it('활성 상태를 반전시킨다', async () => {
      // Given: isActive=true인 클라이언트
      repository.findByIdOrThrow.mockResolvedValue({ ...client, isActive: true });

      // When
      const result = await service.toggleActive(client.id);

      // Then
      expect(repository.update).toHaveBeenCalledWith(client.id, { isActive: false });
    });
  });

  describe('remove', () => {
    it('소프트 삭제 시 isActive도 false로 설정한다', async () => {
      // When
      await service.remove(client.id);

      // Then
      expect(repository.update).toHaveBeenCalledWith(client.id, {
        removedAt: expect.any(Date),
        isActive: false,
      });
    });
  });
});
```

#### IDP-L10-TST-002: OidcSessionService 유닛 테스트

```typescript
describe('OidcSessionService', () => {
  describe('findAll', () => {
    it('만료되지 않은 세션만 조회한다', async () => {
      // When
      await service.findAll({ skip: 0, take: 20 });

      // Then
      expect(repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { expiresAt: { gt: expect.any(Date) } },
              { expiresAt: null },
            ],
          }),
        })
      );
    });

    it('modelType 필터를 적용한다', async () => {
      // When
      await service.findAll({ modelType: 'AccessToken', skip: 0, take: 20 });

      // Then
      expect(repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ modelType: 'AccessToken' }),
        })
      );
    });
  });

  describe('revoke', () => {
    it('DB와 Redis에서 모두 삭제한다', async () => {
      // Given
      repository.findByKeyOrThrow.mockResolvedValue({
        key: 'test-key', modelType: 'AccessToken', grantId: null,
      });

      // When
      await service.revoke('test-key');

      // Then
      expect(repository.deleteByKey).toHaveBeenCalledWith('test-key');
      expect(redisService.del).toHaveBeenCalledWith('oidc:AccessToken:test-key');
    });
  });

  describe('revokeByGrant', () => {
    it('Grant에 연결된 모든 세션을 폐기한다', async () => {
      // Given
      repository.findManyByGrantId.mockResolvedValue([
        { key: 'key-1', modelType: 'AccessToken' },
        { key: 'key-2', modelType: 'RefreshToken' },
      ]);

      // When
      await service.revokeByGrant('grant-id');

      // Then
      expect(repository.deleteManyByGrantId).toHaveBeenCalledWith('grant-id');
      expect(redisService.del).toHaveBeenCalledTimes(2);
    });
  });
});
```

#### IDP-L10-TST-003: OidcClientController E2E 테스트

```typescript
describe('OidcClientController (e2e)', () => {
  it('GET /api/oidc-clients - 목록을 반환한다', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/oidc-clients')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Space-ID', systemSpaceId)
      .expect(200);

    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.meta).toHaveProperty('total');
  });

  it('POST /api/oidc-clients - 새 클라이언트를 등록한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/oidc-clients')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Space-ID', systemSpaceId)
      .send({
        clientId: 'e2e-test-client',
        clientName: 'E2E Test',
        redirectUris: ['http://localhost:4000/callback'],
        grantTypes: ['authorization_code'],
        scope: 'openid profile',
      })
      .expect(201);

    expect(response.body.data.clientId).toBe('e2e-test-client');
  });

  it('POST /api/oidc-clients - 중복 Client ID는 409를 반환한다', async () => {
    await request(app.getHttpServer())
      .post('/api/oidc-clients')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Space-ID', systemSpaceId)
      .send({
        clientId: 'prj-core-admin',  // 이미 존재
        clientName: 'Duplicate',
        redirectUris: ['http://localhost/cb'],
        grantTypes: ['authorization_code'],
        scope: 'openid',
      })
      .expect(409);
  });
});
```

### 프론트엔드 테스트

#### IDP-L10-TST-010: 클라이언트 목록 페이지 테스트

```typescript
describe('OIDC 클라이언트 목록 페이지', () => {
  it('클라이언트 목록을 표시한다', async () => {
    // Given: API가 클라이언트 목록 반환
    mockUseGetOidcClients.mockReturnValue({
      data: { data: [mockClient], meta: { total: 1 } },
    });

    // When
    render(<OidcClientListPage />);

    // Then
    expect(screen.getByText('prj-core-admin')).toBeInTheDocument();
  });

  it('등록 버튼 클릭 시 등록 페이지로 이동한다', async () => {
    render(<OidcClientListPage />);
    await userEvent.click(screen.getByText('클라이언트 등록'));
    expect(router.push).toHaveBeenCalledWith('/oidc-clients/new');
  });
});
```

#### IDP-L10-TST-011: 클라이언트 등록 폼 테스트

```typescript
describe('OIDC 클라이언트 등록 폼', () => {
  it('필수 필드 미입력 시 에러를 표시한다', async () => {
    render(<OidcClientCreatePage />);
    await userEvent.click(screen.getByText('등록'));

    expect(screen.getByText('Client ID는 필수입니다')).toBeInTheDocument();
    expect(screen.getByText('클라이언트 이름은 필수입니다')).toBeInTheDocument();
  });

  it('Public 클라이언트 체크 시 Secret 필드가 비활성화된다', async () => {
    render(<OidcClientCreatePage />);
    await userEvent.click(screen.getByLabelText('Public 클라이언트'));

    expect(screen.getByLabelText('Client Secret')).toBeDisabled();
  });

  it('Secret 자동 생성 버튼이 64자 hex 문자열을 생성한다', async () => {
    render(<OidcClientCreatePage />);
    await userEvent.click(screen.getByText('자동 생성'));

    const secretInput = screen.getByLabelText('Client Secret');
    expect(secretInput.value).toMatch(/^[0-9a-f]{64}$/);
  });
});
```

#### IDP-L10-TST-012: 세션 목록 페이지 테스트

```typescript
describe('OIDC 세션 목록 페이지', () => {
  it('세션 목록을 표시한다', async () => {
    mockUseGetOidcSessions.mockReturnValue({
      data: { data: [mockSession], meta: { total: 1 } },
    });

    render(<OidcSessionListPage />);
    expect(screen.getByText('AccessToken')).toBeInTheDocument();
  });

  it('폐기 버튼 클릭 시 확인 다이얼로그를 표시한다', async () => {
    render(<OidcSessionListPage />);
    await userEvent.click(screen.getByText('폐기'));

    expect(screen.getByText(/세션\/토큰을 폐기하시겠습니까/)).toBeInTheDocument();
  });

  it('모델 타입 필터 변경 시 목록이 갱신된다', async () => {
    render(<OidcSessionListPage />);

    await userEvent.click(screen.getByLabelText('모델 타입'));
    await userEvent.click(screen.getByText('AccessToken'));

    expect(mockUseGetOidcSessions).toHaveBeenCalledWith(
      expect.objectContaining({ modelType: 'AccessToken' })
    );
  });
});
```

### 테스트 실행 명령어

```bash
# 백엔드 유닛 테스트
pnpm --filter=server test -- oidc-client
pnpm --filter=server test -- oidc-session

# 백엔드 E2E 테스트
pnpm --filter=e2e test -- oidc-client

# 프론트엔드 테스트
pnpm --filter=admin test -- --run oidc-client
pnpm --filter=admin test -- --run oidc-session

# 패키지 테스트 (Cell 컴포넌트)
pnpm --filter=@cocrepo/ui test -- --run AuthMethodCell
pnpm --filter=@cocrepo/ui test -- --run ModelTypeCell
pnpm --filter=@cocrepo/ui test -- --run ExpiryCell
```

---

## Requirement Graph (L9-L10)

```json
{
  "nodes": [
    { "id": "IDP-L9-LOG-001", "level": 9, "type": "logic", "label": "Client ID 유니크 검증" },
    { "id": "IDP-L9-LOG-003", "level": 9, "type": "logic", "label": "소프트 삭제 + 비활성화" },
    { "id": "IDP-L9-LOG-004", "level": 9, "type": "logic", "label": "활성/비활성 토글" },
    { "id": "IDP-L9-LOG-005", "level": 9, "type": "logic", "label": "세션 목록 조회 (미만료)" },
    { "id": "IDP-L9-LOG-006", "level": 9, "type": "logic", "label": "단건 세션 폐기 (DB+Redis)" },
    { "id": "IDP-L9-LOG-007", "level": 9, "type": "logic", "label": "Grant 일괄 폐기" },
    { "id": "IDP-L9-LOG-010", "level": 9, "type": "logic", "label": "Client Secret 자동 생성" },
    { "id": "IDP-L9-LOG-011", "level": 9, "type": "logic", "label": "Public 클라이언트 토글" },
    { "id": "IDP-L9-LOG-012", "level": 9, "type": "logic", "label": "등록 폼 유효성 검증" },
    { "id": "IDP-L9-LOG-013", "level": 9, "type": "logic", "label": "만료 시간 상대 표시" },
    { "id": "IDP-L10-TST-001", "level": 10, "type": "test", "label": "OidcClientService 유닛 테스트" },
    { "id": "IDP-L10-TST-002", "level": 10, "type": "test", "label": "OidcSessionService 유닛 테스트" },
    { "id": "IDP-L10-TST-003", "level": 10, "type": "test", "label": "OidcClientController E2E 테스트" },
    { "id": "IDP-L10-TST-010", "level": 10, "type": "test", "label": "클라이언트 목록 페이지 테스트" },
    { "id": "IDP-L10-TST-011", "level": 10, "type": "test", "label": "클라이언트 등록 폼 테스트" },
    { "id": "IDP-L10-TST-012", "level": 10, "type": "test", "label": "세션 목록 페이지 테스트" }
  ],
  "edges": [
    { "from": "IDP-L6-API-003", "to": "IDP-L9-LOG-001", "type": "implements" },
    { "from": "IDP-L6-API-005", "to": "IDP-L9-LOG-003", "type": "implements" },
    { "from": "IDP-L6-API-006", "to": "IDP-L9-LOG-004", "type": "implements" },
    { "from": "IDP-L6-API-007", "to": "IDP-L9-LOG-005", "type": "implements" },
    { "from": "IDP-L6-API-008", "to": "IDP-L9-LOG-006", "type": "implements" },
    { "from": "IDP-L6-API-009", "to": "IDP-L9-LOG-007", "type": "implements" },
    { "from": "IDP-L5-ACT-012", "to": "IDP-L9-LOG-010", "type": "implements" },
    { "from": "IDP-L5-ACT-013", "to": "IDP-L9-LOG-011", "type": "implements" },
    { "from": "IDP-L5-ACT-016", "to": "IDP-L9-LOG-012", "type": "implements" },
    { "from": "IDP-L8-CMP-014", "to": "IDP-L9-LOG-013", "type": "uses" }
  ]
}
```
