import SafeApiKit from "@safe-global/api-kit";
import Safe from "@safe-global/protocol-kit";
import { MetaTransactionData, OperationType } from "@safe-global/types-kit";
import { encodeFunctionData, parseUnits } from "viem";
import type { PendingTransaction, SafeTransaction } from "@/stores";

// Safe SDK Provider 타입
type SafeProvider = Parameters<typeof Safe.init>[0]["provider"];

// ERC-20 ABI (transfer function only)
const ERC20_ABI = [
	{
		name: "transfer",
		type: "function",
		inputs: [
			{ name: "to", type: "address" },
			{ name: "value", type: "uint256" },
		],
		outputs: [{ name: "", type: "bool" }],
	},
	{
		name: "balanceOf",
		type: "function",
		inputs: [{ name: "account", type: "address" }],
		outputs: [{ name: "", type: "uint256" }],
	},
	{
		name: "decimals",
		type: "function",
		inputs: [],
		outputs: [{ name: "", type: "uint8" }],
	},
	{
		name: "symbol",
		type: "function",
		inputs: [],
		outputs: [{ name: "", type: "string" }],
	},
	{
		name: "name",
		type: "function",
		inputs: [],
		outputs: [{ name: "", type: "string" }],
	},
] as const;

/**
 * 트랜잭션 서비스
 * Safe 트랜잭션 생성, 서명, 실행 기능 제공
 */
export class TransactionService {
	private chainId: number;
	private apiKit: SafeApiKit | null = null;

	constructor(chainId: number = 1) {
		this.chainId = chainId;
	}

	/**
	 * API Kit 초기화
	 */
	private getApiKit(): SafeApiKit {
		if (!this.apiKit) {
			this.apiKit = new SafeApiKit({
				chainId: BigInt(this.chainId),
			});
		}
		return this.apiKit;
	}

	/**
	 * ETH 송금 트랜잭션 생성
	 */
	async createEthTransaction(
		safeAddress: string,
		to: string,
		amount: string, // ETH 단위 (예: "0.1")
		provider: SafeProvider,
	): Promise<string> {
		const protocolKit = await Safe.init({
			provider,
			safeAddress,
		});

		const safeTransactionData: MetaTransactionData = {
			to,
			value: parseUnits(amount, 18).toString(),
			data: "0x",
			operation: OperationType.Call,
		};

		const safeTransaction = await protocolKit.createTransaction({
			transactions: [safeTransactionData],
		});

		// 트랜잭션 서명
		const signedTransaction =
			await protocolKit.signTransaction(safeTransaction);

		// API Kit에 트랜잭션 제출
		const apiKit = this.getApiKit();
		const safeTxHash = await protocolKit.getTransactionHash(signedTransaction);

		await apiKit.proposeTransaction({
			safeAddress,
			safeTransactionData: signedTransaction.data,
			safeTxHash,
			senderAddress: (await protocolKit.getOwners())[0],
			senderSignature:
				signedTransaction.signatures.values().next().value?.data || "",
		});

		return safeTxHash;
	}

	/**
	 * ERC-20 토큰 송금 트랜잭션 생성
	 */
	async createTokenTransaction(
		safeAddress: string,
		tokenAddress: string,
		to: string,
		amount: string, // 토큰 단위 (decimals 적용 전)
		decimals: number,
		provider: SafeProvider,
	): Promise<string> {
		const protocolKit = await Safe.init({
			provider,
			safeAddress,
		});

		// ERC-20 transfer 함수 인코딩
		const data = encodeFunctionData({
			abi: ERC20_ABI,
			functionName: "transfer",
			args: [to as `0x${string}`, parseUnits(amount, decimals)],
		});

		const safeTransactionData: MetaTransactionData = {
			to: tokenAddress,
			value: "0",
			data,
			operation: OperationType.Call,
		};

		const safeTransaction = await protocolKit.createTransaction({
			transactions: [safeTransactionData],
		});

		// 트랜잭션 서명
		const signedTransaction =
			await protocolKit.signTransaction(safeTransaction);

		// API Kit에 트랜잭션 제출
		const apiKit = this.getApiKit();
		const safeTxHash = await protocolKit.getTransactionHash(signedTransaction);

		await apiKit.proposeTransaction({
			safeAddress,
			safeTransactionData: signedTransaction.data,
			safeTxHash,
			senderAddress: (await protocolKit.getOwners())[0],
			senderSignature:
				signedTransaction.signatures.values().next().value?.data || "",
		});

		return safeTxHash;
	}

	/**
	 * 트랜잭션 서명
	 */
	async signTransaction(
		safeAddress: string,
		safeTxHash: string,
		provider: SafeProvider,
	): Promise<void> {
		const protocolKit = await Safe.init({
			provider,
			safeAddress,
		});

		const apiKit = this.getApiKit();

		// 트랜잭션 서명
		const signature = await protocolKit.signHash(safeTxHash);

		// 서명 제출
		await apiKit.confirmTransaction(safeTxHash, signature.data);
	}

	/**
	 * 트랜잭션 실행 (threshold 충족 시)
	 */
	async executeTransaction(
		safeAddress: string,
		safeTxHash: string,
		provider: SafeProvider,
	): Promise<string> {
		const protocolKit = await Safe.init({
			provider,
			safeAddress,
		});

		const apiKit = this.getApiKit();

		// 트랜잭션 정보 가져오기
		const pendingTx = await apiKit.getTransaction(safeTxHash);

		// Safe 트랜잭션 생성
		const safeTransaction = await protocolKit.createTransaction({
			transactions: [
				{
					to: pendingTx.to || "",
					value: pendingTx.value || "0",
					data: pendingTx.data || "0x",
					operation:
						(pendingTx.operation as OperationType) || OperationType.Call,
				},
			],
		});

		// 트랜잭션 실행
		const executeTxResponse =
			await protocolKit.executeTransaction(safeTransaction);

		return executeTxResponse.hash || "";
	}

	/**
	 * 대기 중인 트랜잭션 목록 조회
	 */
	async getPendingTransactions(
		safeAddress: string,
	): Promise<PendingTransaction[]> {
		const apiKit = this.getApiKit();

		const pendingTxs = await apiKit.getPendingTransactions(safeAddress);

		return pendingTxs.results.map((tx) => ({
			safeTxHash: tx.safeTxHash || "",
			to: tx.to || "",
			value: tx.value || "0",
			data: tx.data || "0x",
			nonce:
				typeof tx.nonce === "string" ? parseInt(tx.nonce, 10) : tx.nonce || 0,
			confirmations: tx.confirmations?.length || 0,
			confirmationsRequired: tx.confirmationsRequired || 0,
			isExecuted: tx.isExecuted || false,
		}));
	}

	/**
	 * 트랜잭션 상세 정보 조회
	 */
	async getTransaction(safeTxHash: string): Promise<SafeTransaction> {
		const apiKit = this.getApiKit();

		const tx = await apiKit.getTransaction(safeTxHash);

		return {
			safeTxHash: tx.safeTxHash || "",
			to: tx.to || "",
			value: tx.value || "0",
			data: tx.data || "0x",
			nonce:
				typeof tx.nonce === "string" ? parseInt(tx.nonce, 10) : tx.nonce || 0,
			confirmations: (tx.confirmations || []).map((c) => ({
				owner: c.owner || "",
				signature: c.signature || "",
				submissionDate: c.submissionDate || "",
			})),
			confirmationsRequired: tx.confirmationsRequired || 0,
			isExecuted: tx.isExecuted || false,
			submissionDate: tx.submissionDate || "",
			executionDate: tx.executionDate || undefined,
		};
	}

	/**
	 * ERC-20 토큰 잔액 조회
	 */
	async getTokenBalance(): Promise<{
		balance: string;
		decimals: number;
		symbol: string;
		name: string;
	}> {
		// TODO: 실제 구현에서는 viem publicClient를 통해 토큰 정보 조회
		// 현재는 간단한 구현
		return {
			balance: "0",
			decimals: 18,
			symbol: "TOKEN",
			name: "Token",
		};
	}
}

// 싱글톤 인스턴스
export const transactionService = new TransactionService();
