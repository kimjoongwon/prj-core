/**
 * Safe API Client
 * 백엔드 NestJS 서버와 통신하는 API 클라이언트
 */

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1/safe";

// Types
export interface CreateSafeWalletRequest {
	address: string;
	chainId: number;
	threshold: number;
	owners: string[];
	tenantId: string;
}

export interface CreateSafeTransactionRequest {
	safeTxHash: string;
	safeWalletId: string;
	to: string;
	value: string;
	data: string;
	nonce: number;
	operation?: number;
	tokenAddress?: string;
	tokenSymbol?: string;
	tokenDecimals?: number;
	confirmationsRequired: number;
}

export interface AddConfirmationRequest {
	safeTransactionId: string;
	owner: string;
	signature: string;
}

export interface ExecuteTransactionRequest {
	safeTxHash: string;
	executionTxHash: string;
}

export interface SafeWalletResponse {
	id: string;
	address: string;
	chainId: number;
	threshold: number;
	nonce: number;
	owners: string[];
	tenantId: string;
	createdAt: string;
}

export interface SafeTransactionResponse {
	id: string;
	safeTxHash: string;
	to: string;
	value: string;
	data: string;
	nonce: number;
	operation: number;
	tokenAddress?: string;
	tokenSymbol?: string;
	tokenDecimals?: number;
	confirmationsRequired: number;
	isExecuted: boolean;
	executionTxHash?: string;
	executedAt?: string;
	createdAt: string;
	confirmations: ConfirmationResponse[];
}

export interface ConfirmationResponse {
	id: string;
	owner: string;
	signature: string;
	createdAt: string;
}

// API 호출 헬퍼
async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`;

	const response = await fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	if (!response.ok) {
		const error = await response
			.json()
			.catch(() => ({ message: "Unknown error" }));
		throw new Error(error.message || `API Error: ${response.status}`);
	}

	return response.json();
}

// Safe Wallet API
export const safeWalletApi = {
	// Safe Wallet 생성
	create: (data: CreateSafeWalletRequest) =>
		apiRequest<SafeWalletResponse>("/wallets", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	// Safe Wallet 조회 (주소로)
	getByAddress: (address: string) =>
		apiRequest<SafeWalletResponse>(`/wallets/${address}`),

	// 소유자별 Safe Wallet 목록
	getByOwner: (ownerAddress: string) =>
		apiRequest<SafeWalletResponse[]>(`/wallets?owner=${ownerAddress}`),

	// 테넌트별 Safe Wallet 목록
	getByTenant: (tenantId: string) =>
		apiRequest<SafeWalletResponse[]>(`/tenants/${tenantId}/wallets`),
};

// Safe Transaction API
export const safeTransactionApi = {
	// 트랜잭션 생성
	create: (data: CreateSafeTransactionRequest) =>
		apiRequest<SafeTransactionResponse>("/transactions", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	// 트랜잭션 조회 (해시로)
	getByHash: (safeTxHash: string) =>
		apiRequest<SafeTransactionResponse>(`/transactions/${safeTxHash}`),

	// Wallet별 트랜잭션 목록
	getByWallet: (walletId: string) =>
		apiRequest<SafeTransactionResponse[]>(`/wallets/${walletId}/transactions`),

	// Wallet별 대기 중인 트랜잭션 목록
	getPending: (walletId: string) =>
		apiRequest<SafeTransactionResponse[]>(
			`/wallets/${walletId}/transactions/pending`,
		),

	// 트랜잭션 실행 완료 처리
	markExecuted: (data: ExecuteTransactionRequest) =>
		apiRequest<SafeTransactionResponse>("/transactions/execute", {
			method: "PUT",
			body: JSON.stringify(data),
		}),
};

// Confirmation API
export const confirmationApi = {
	// 서명 추가
	add: (data: AddConfirmationRequest) =>
		apiRequest<ConfirmationResponse>("/confirmations", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	// 트랜잭션별 서명 목록
	getByTransaction: (transactionId: string) =>
		apiRequest<ConfirmationResponse[]>(
			`/transactions/${transactionId}/confirmations`,
		),
};

// 통합 API 객체
export const safeApi = {
	wallet: safeWalletApi,
	transaction: safeTransactionApi,
	confirmation: confirmationApi,
};

export default safeApi;
