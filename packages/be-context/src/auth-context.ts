import { CONTEXT_KEYS } from "@cocrepo/constant";
import { User } from "@cocrepo/entity";
import type {
	ContextTenantSnapshot,
	ContextUserSnapshot,
	DatabaseId,
} from "@cocrepo/type";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ClsService } from "nestjs-cls";

/**
 * 인증 컨텍스트
 *
 * CLS에 저장된 인증 정보를 Entity 인스턴스로 제공하여
 * Service에서 도메인 메서드를 사용할 수 있게 합니다.
 *
 * @example
 * constructor(private readonly authCtx: AuthContext) {}
 *
 * async someMethod() {
 *   if (this.authCtx.isSuperManager()) {
 *     return this.repository.findAll();
 *   }
 *   if (this.authCtx.user?.canAccessSpace(someSpaceId)) {
 *     // ...
 *   }
 * }
 */
@Injectable()
export class AuthContext {
	/** 변환된 User Entity 캐시 */
	private _user: User | null = null;

	constructor(private readonly cls: ClsService) {}

	// ═══════════════════════════════════════════════════════════
	// Raw Data (CLS 직접 접근)
	// ═══════════════════════════════════════════════════════════

	/** 원본 ContextUserSnapshot */
	get userDto(): ContextUserSnapshot | undefined {
		return this.cls.get<ContextUserSnapshot>(CONTEXT_KEYS.AUTH_USER);
	}

	/** 원본 ContextTenantSnapshot */
	get tenantDto(): ContextTenantSnapshot | undefined {
		return this.cls.get<ContextTenantSnapshot>(CONTEXT_KEYS.TENANT);
	}

	/** 현재 Tenant ID */
	get tenantId(): DatabaseId | undefined {
		return this.cls.get<DatabaseId>(CONTEXT_KEYS.TENANT_ID);
	}

	/** 현재 Tenant에서 파생된 Space ID */
	get spaceId(): DatabaseId | undefined {
		return this.cls.get<DatabaseId>(CONTEXT_KEYS.SPACE_ID);
	}

	// ═══════════════════════════════════════════════════════════
	// Entity (변환 + 캐싱)
	// ═══════════════════════════════════════════════════════════

	/** User Entity (요청당 한 번만 변환) */
	get user(): User | null {
		if (this._user === null && this.userDto) {
			this._user = User.fromDto(this.userDto);
		}
		return this._user;
	}

	// ═══════════════════════════════════════════════════════════
	// 편의 메서드 (User Entity에 위임)
	// ═══════════════════════════════════════════════════════════

	/** 슈퍼매니저 여부 */
	isSuperManager(): boolean {
		return this.user?.isSuperManager() ?? false;
	}

	/** 접근 가능한 Space IDs */
	get accessibleSpaceIds(): DatabaseId[] | undefined {
		return this.user?.accessibleSpaceIds;
	}

	/** 특정 Space 접근 권한 */
	canAccessSpace(spaceId: DatabaseId): boolean {
		return this.user?.canAccessSpace(spaceId) ?? false;
	}

	// ═══════════════════════════════════════════════════════════
	// 인증 상태
	// ═══════════════════════════════════════════════════════════

	/** 인증됨 */
	get isAuthenticated(): boolean {
		return !!this.userDto;
	}

	/** 인증 필수 */
	assertAuthenticated(): void {
		if (!this.userDto) {
			throw new UnauthorizedException("인증이 필요합니다.");
		}
	}
}
