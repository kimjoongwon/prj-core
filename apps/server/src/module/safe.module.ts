import {
	SafeConfirmationRepository,
	SafeTransactionRepository,
	SafeWalletRepository,
} from "@cocrepo/repository";
import { SafeService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { SafeController } from "@shared";

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
