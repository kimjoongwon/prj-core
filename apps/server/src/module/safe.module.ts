import { Module } from "@nestjs/common";
import {
	SafeConfirmationRepository,
	SafeController,
	SafeTransactionRepository,
	SafeWalletRepository,
} from "@shared";
import { SafeService } from "../shared/service/resources/safe.service";

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
