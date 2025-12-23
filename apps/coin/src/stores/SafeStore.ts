import { makeAutoObservable } from "mobx";

export interface SafeInfo {
	address: string;
	chainId: number;
	owners: string[];
	threshold: number;
	nonce: number;
}

export interface TokenBalance {
	tokenAddress: string;
	symbol: string;
	name: string;
	decimals: number;
	balance: string;
	fiatBalance?: string;
}

export class SafeStore {
	// Safe 정보
	currentSafe: SafeInfo | null = null;
	safes: SafeInfo[] = [];

	// 잔액
	ethBalance: string = "0";
	tokenBalances: TokenBalance[] = [];

	// 로딩 상태
	isLoading = false;
	isCreating = false;
	error: string | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	// Safe 설정
	setSafe(safe: SafeInfo) {
		this.currentSafe = safe;
		this.error = null;
	}

	// Safe 목록 설정
	setSafes(safes: SafeInfo[]) {
		this.safes = safes;
	}

	// Safe 목록에 추가
	addSafe(safe: SafeInfo) {
		this.safes.push(safe);
	}

	// ETH 잔액 설정
	setEthBalance(balance: string) {
		this.ethBalance = balance;
	}

	// 토큰 잔액 설정
	setTokenBalances(balances: TokenBalance[]) {
		this.tokenBalances = balances;
	}

	// 로딩 상태
	setLoading(loading: boolean) {
		this.isLoading = loading;
	}

	// 생성 중 상태
	setCreating(creating: boolean) {
		this.isCreating = creating;
	}

	// 에러 설정
	setError(error: string | null) {
		this.error = error;
	}

	// 초기화
	reset() {
		this.currentSafe = null;
		this.ethBalance = "0";
		this.tokenBalances = [];
		this.isLoading = false;
		this.error = null;
	}

	// 현재 Safe가 있는지 확인
	get hasSafe(): boolean {
		return this.currentSafe !== null;
	}

	// 포맷된 ETH 잔액
	get formattedEthBalance(): string {
		const eth = parseFloat(this.ethBalance) / 1e18;
		return eth.toFixed(4);
	}
}

export const safeStore = new SafeStore();
