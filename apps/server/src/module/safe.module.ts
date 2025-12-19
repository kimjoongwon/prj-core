import { Module } from "@nestjs/common";
import { SafeController } from "@shared";
import {
  SafeConfirmationRepository,
  SafeTransactionRepository,
  SafeWalletRepository,
} from "../shared/repository/safe.repository";
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
