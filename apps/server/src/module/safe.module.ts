import { Module } from "@nestjs/common";
import {
	SafeConfirmationRepository,
	SafeController,
	SafeService,
	SafeTransactionRepository,
	SafeWalletRepository,
} from "@shared";

@Module({
	controllers: [SafeController],
	providers: [
		SafeService,
		SafeWalletRepository,
		SafeTransactionRepository,
		SafeConfirmationRepository,
	],
	exports: [SafeService],
})
export class SafeModule {}
