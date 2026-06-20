/**
 * Router 인터페이스 - Next.js AppRouter 호환
 *
 * Next.js AppRouterInstance와 호환되도록 설계되었습니다.
 * push/replace는 typed router와 호환되도록 입력 타입을 어댑터 경계에서만 열어 둡니다.
 */
export interface Router {
	push(path: unknown, options?: unknown): void | Promise<void>;
	replace(path: unknown, options?: unknown): void | Promise<void>;
	back: () => void;
	forward?: () => void;
	refresh?: () => void;
}

export interface NavigatorOptions {
	router: Router;
	basePath?: string;
}

/**
 * Navigator - 페이지 이동을 담당하는 클래스
 *
 * 역할:
 * - Next.js router를 감싸서 실제 페이지 이동 수행
 * - 프레임워크 의존성 캡슐화
 * - 테스트 시 mock router 주입 용이
 *
 * @example
 * ```ts
 * const router = useRouter();
 * const navigator = new Navigator({ router });
 *
 * // 페이지 이동
 * navigator.push('/members');
 *
 * // 히스토리 교체
 * navigator.replace('/login');
 *
 * // 뒤로 가기
 * navigator.back();
 * ```
 */
export class Navigator {
	private readonly router: Router;
	private readonly basePath: string;

	constructor(options: NavigatorOptions) {
		this.router = options.router;
		this.basePath = options.basePath ?? "";
	}

	/**
	 * 지정된 경로로 이동 (히스토리에 추가)
	 */
	push(path: string): void {
		const fullPath = this.resolvePath(path);
		this.router.push(fullPath);
	}

	/**
	 * 지정된 경로로 이동 (히스토리 교체)
	 */
	replace(path: string): void {
		const fullPath = this.resolvePath(path);
		this.router.replace(fullPath);
	}

	/**
	 * 뒤로 가기
	 */
	back(): void {
		this.router.back();
	}

	/**
	 * 앞으로 가기
	 */
	forward(): void {
		this.router.forward?.();
	}

	/**
	 * 페이지 새로고침
	 */
	refresh(): void {
		this.router.refresh?.();
	}

	/**
	 * basePath를 적용한 전체 경로 반환
	 */
	private resolvePath(path: string): string {
		if (!this.basePath) {
			return path;
		}

		// path가 이미 basePath로 시작하면 그대로 반환
		if (path.startsWith(this.basePath)) {
			return path;
		}

		// basePath + path 조합
		return `${this.basePath}${path}`;
	}
}
