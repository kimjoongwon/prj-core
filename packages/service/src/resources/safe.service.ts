import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import {
	SafeConfirmationRepository,
	SafeTransactionRepository,
	SafeWalletRepository,
} from "@cocrepo/repository";

// DTO 타입 정의
export interface CreateSafeWalletDto {
	address: string;
	chainId: number;
	threshold: number;
	owners: string[];
	tenantId: string;
}

export interface CreateSafeTransactionDto {
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

export interface AddConfirmationDto {
	safeTransactionId: string;
	owner: string;
	signature: string;
}

export interface ExecuteTransactionDto {
	safeTxHash: string;
	executionTxHash: string;
}

@Injectable()
export class SafeService {
	private readonly logger: Logger;

	constructor(
		private readonly safeWalletRepository: SafeWalletRepository,
		private readonly safeTransactionRepository: SafeTransactionRepository,
		private readonly safeConfirmationRepository: SafeConfirmationRepository,
	) {
		this.logger = new Logger(SafeService.name);
	}

	// Safe Wallet 관련 메서드
	async createSafeWallet(dto: CreateSafeWalletDto) {
		this.logger.log(`Creating Safe Wallet: ${dto.address}`);
		return await this.safeWalletRepository.create({
			data: {
				address: dto.address,
				chainId: dto.chainId,
				threshold: dto.threshold,
				owners: dto.owners,
				tenant: { connect: { id: dto.tenantId } },
			},
		});
	}

	async getSafeWalletByAddress(address: string) {
		const wallet = await this.safeWalletRepository.findUnique({
			where: { address },
			include: { transactions: true },
		});
		if (!wallet) {
			throw new NotFoundException(`Safe wallet not found: ${address}`);
		}
		return wallet;
	}

	async getSafeWalletsByTenant(tenantId: string) {
		return await this.safeWalletRepository.findMany({
			where: { tenantId, removedAt: null },
			orderBy: { createdAt: "desc" },
		});
	}

	async getSafeWalletsByOwner(ownerAddress: string) {
		return await this.safeWalletRepository.findMany({
			where: {
				owners: { has: ownerAddress },
				removedAt: null,
			},
			orderBy: { createdAt: "desc" },
		});
	}

	// Safe Transaction 관련 메서드
	async createTransaction(dto: CreateSafeTransactionDto) {
		this.logger.log(`Creating Safe Transaction: ${dto.safeTxHash}`);
		return await this.safeTransactionRepository.create({
			data: {
				safeTxHash: dto.safeTxHash,
				safeWallet: { connect: { id: dto.safeWalletId } },
				to: dto.to,
				value: dto.value,
				data: dto.data,
				nonce: dto.nonce,
				operation: dto.operation || 0,
				tokenAddress: dto.tokenAddress,
				tokenSymbol: dto.tokenSymbol,
				tokenDecimals: dto.tokenDecimals,
				confirmationsRequired: dto.confirmationsRequired,
			},
		});
	}

	async getTransactionByHash(safeTxHash: string) {
		const tx = await this.safeTransactionRepository.findUnique({
			where: { safeTxHash },
			include: { confirmations: true, safeWallet: true },
		});
		if (!tx) {
			throw new NotFoundException(`Transaction not found: ${safeTxHash}`);
		}
		return tx;
	}

	async getPendingTransactions(safeWalletId: string) {
		return await this.safeTransactionRepository.findMany({
			where: {
				safeWalletId,
				isExecuted: false,
				removedAt: null,
			},
			include: { confirmations: true },
			orderBy: { nonce: "asc" },
		});
	}

	async getTransactionsByWallet(safeWalletId: string) {
		return await this.safeTransactionRepository.findMany({
			where: { safeWalletId, removedAt: null },
			include: { confirmations: true },
			orderBy: { createdAt: "desc" },
		});
	}

	// Confirmation 관련 메서드
	async addConfirmation(dto: AddConfirmationDto) {
		this.logger.log(
			`Adding confirmation: ${dto.owner} for ${dto.safeTransactionId}`,
		);
		return await this.safeConfirmationRepository.upsert({
			where: {
				safeTransactionId_owner: {
					safeTransactionId: dto.safeTransactionId,
					owner: dto.owner,
				},
			},
			create: {
				safeTransaction: { connect: { id: dto.safeTransactionId } },
				owner: dto.owner,
				signature: dto.signature,
			},
			update: {
				signature: dto.signature,
			},
		});
	}

	async getConfirmations(safeTransactionId: string) {
		return await this.safeConfirmationRepository.findMany({
			where: { safeTransactionId },
			orderBy: { createdAt: "asc" },
		});
	}

	// 트랜잭션 실행 완료 처리
	async markTransactionExecuted(dto: ExecuteTransactionDto) {
		this.logger.log(`Marking transaction as executed: ${dto.safeTxHash}`);
		const tx = await this.safeTransactionRepository.findFirst({
			where: { safeTxHash: dto.safeTxHash },
		});
		if (!tx) {
			throw new NotFoundException(`Transaction not found: ${dto.safeTxHash}`);
		}
		return await this.safeTransactionRepository.update({
			where: { id: tx.id },
			data: {
				isExecuted: true,
				executionTxHash: dto.executionTxHash,
				executedAt: new Date(),
			},
		});
	}
}
