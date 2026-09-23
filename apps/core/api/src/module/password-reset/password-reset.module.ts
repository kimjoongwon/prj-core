import { PasswordResetController } from "@cocrepo/controller";
import {
	OidcDirectPrismaProvider,
	OidcDirectUsersRepository,
} from "@cocrepo/repository";
import { EmailModule, PasswordResetService } from "@cocrepo/service";
import { PasswordResetUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule, EmailModule],
	controllers: [PasswordResetController],
	providers: [
		...PasswordResetUseCaseProviders,
		PasswordResetService,
		// PasswordResetService가 idp 계정을 직접 조회하는 데이터 접근 계층
		// (발급자 모듈이 아니라 Prisma 직결 — core-api에도 필요하다)
		OidcDirectPrismaProvider,
		OidcDirectUsersRepository,
	],
})
export class PasswordResetModule {}
