import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import {
	AddConfirmationDto,
	CreateSafeTransactionDto,
	CreateSafeWalletDto,
	ExecuteTransactionDto,
	SafeService,
} from "../../service/resources/safe.service";

@Controller()
export class SafeController {
	constructor(private readonly safeService: SafeService) {}

	// Safe Wallet 엔드포인트
	@Post("wallets")
	async createWallet(@Body() dto: CreateSafeWalletDto) {
		return await this.safeService.createSafeWallet(dto);
	}

	@Get("wallets/:address")
	async getWalletByAddress(@Param("address") address: string) {
		return await this.safeService.getSafeWalletByAddress(address);
	}

	@Get("wallets")
	async getWalletsByOwner(@Query("owner") ownerAddress: string) {
		return await this.safeService.getSafeWalletsByOwner(ownerAddress);
	}

	@Get("tenants/:tenantId/wallets")
	async getWalletsByTenant(@Param("tenantId") tenantId: string) {
		return await this.safeService.getSafeWalletsByTenant(tenantId);
	}

	// Safe Transaction 엔드포인트
	@Post("transactions")
	async createTransaction(@Body() dto: CreateSafeTransactionDto) {
		return await this.safeService.createTransaction(dto);
	}

	@Get("transactions/:safeTxHash")
	async getTransactionByHash(@Param("safeTxHash") safeTxHash: string) {
		return await this.safeService.getTransactionByHash(safeTxHash);
	}

	@Get("wallets/:walletId/transactions")
	async getTransactionsByWallet(@Param("walletId") walletId: string) {
		return await this.safeService.getTransactionsByWallet(walletId);
	}

	@Get("wallets/:walletId/transactions/pending")
	async getPendingTransactions(@Param("walletId") walletId: string) {
		return await this.safeService.getPendingTransactions(walletId);
	}

	// Confirmation 엔드포인트
	@Post("confirmations")
	async addConfirmation(@Body() dto: AddConfirmationDto) {
		return await this.safeService.addConfirmation(dto);
	}

	@Get("transactions/:transactionId/confirmations")
	async getConfirmations(@Param("transactionId") transactionId: string) {
		return await this.safeService.getConfirmations(transactionId);
	}

	// 트랜잭션 실행 완료
	@Put("transactions/execute")
	async markExecuted(@Body() dto: ExecuteTransactionDto) {
		return await this.safeService.markTransactionExecuted(dto);
	}
}
