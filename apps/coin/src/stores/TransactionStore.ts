import { makeAutoObservable } from "mobx";

export type TransactionStatus =
	| "pending"
	| "awaiting_confirmations"
	| "awaiting_execution"
	| "executed"
	| "failed"
	| "cancelled";

export interface SafeTransaction {
	safeTxHash: string;
	to: string;
	value: string;
	data: string;
	nonce: number;
	confirmations: TransactionConfirmation[];
	confirmationsRequired: number;
	isExecuted: boolean;
	submissionDate: string;
	executionDate?: string;
	// ERC-20 관련
	tokenAddress?: string;
	tokenSymbol?: string;
	tokenDecimals?: number;
}

export interface TransactionConfirmation {
	owner: string;
	signature: string;
	submissionDate: string;
}

export interface PendingTransaction {
	safeTxHash: string;
	to: string;
	value: string;
	data: string;
	nonce: number;
	confirmations: number;
	confirmationsRequired: number;
	isExecuted: boolean;
	tokenAddress?: string;
	tokenSymbol?: string;
}

export class TransactionStore {
	// 현재 트랜잭션
	currentTransaction: SafeTransaction | null = null;

	// 대기 중인 트랜잭션 목록
	pendingTransactions: PendingTransaction[] = [];

	// 실행된 트랜잭션 내역
	executedTransactions: SafeTransaction[] = [];

	// 로딩/상태
	isLoading = false;
	isCreating = false;
	isSigning = false;
	isExecuting = false;
	error: string | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	// 현재 트랜잭션 설정
	setCurrentTransaction(tx: SafeTransaction | null) {
		this.currentTransaction = tx;
	}

	// 대기 중인 트랜잭션 목록 설정
	setPendingTransactions(txs: PendingTransaction[]) {
		this.pendingTransactions = txs;
	}

	// 실행된 트랜잭션 내역 설정
	setExecutedTransactions(txs: SafeTransaction[]) {
		this.executedTransactions = txs;
	}

	// 트랜잭션 추가
	addPendingTransaction(tx: PendingTransaction) {
		this.pendingTransactions.unshift(tx);
	}

	// 트랜잭션 업데이트
	updatePendingTransaction(
		safeTxHash: string,
		updates: Partial<PendingTransaction>,
	) {
		const index = this.pendingTransactions.findIndex(
			(tx) => tx.safeTxHash === safeTxHash,
		);
		if (index !== -1) {
			this.pendingTransactions[index] = {
				...this.pendingTransactions[index],
				...updates,
			};
		}
	}

	// 대기 중인 트랜잭션에서 제거
	removePendingTransaction(safeTxHash: string) {
		this.pendingTransactions = this.pendingTransactions.filter(
			(tx) => tx.safeTxHash !== safeTxHash,
		);
	}

	// 로딩 상태
	setLoading(loading: boolean) {
		this.isLoading = loading;
	}

	// 생성 중 상태
	setCreating(creating: boolean) {
		this.isCreating = creating;
	}

	// 서명 중 상태
	setSigning(signing: boolean) {
		this.isSigning = signing;
	}

	// 실행 중 상태
	setExecuting(executing: boolean) {
		this.isExecuting = executing;
	}

	// 에러 설정
	setError(error: string | null) {
		this.error = error;
	}

	// 초기화
	reset() {
		this.currentTransaction = null;
		this.pendingTransactions = [];
		this.isLoading = false;
		this.isCreating = false;
		this.isSigning = false;
		this.isExecuting = false;
		this.error = null;
	}

	// 실행 가능 여부 (threshold 충족)
	get canExecute(): boolean {
		if (!this.currentTransaction) return false;
		return (
			this.currentTransaction.confirmations.length >=
			this.currentTransaction.confirmationsRequired
		);
	}
}

export const transactionStore = new TransactionStore();
