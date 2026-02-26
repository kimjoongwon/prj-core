import { Module } from "@nestjs/common";
import {
	I18nModule as NestI18nModule,
	QueryResolver,
	AcceptLanguageResolver,
} from "nestjs-i18n";
import { join, resolve } from "node:path";
import { TranslationService } from "./translation.service";

// webpack 번들 환경에서는 __dirname이 원본 소스 위치가 아닌 출력 파일 위치를 가리킴
// process.cwd() 기반으로 패키지 경로를 해석하면 tsc/webpack 모두 호환
// apps/core/api 또는 apps/idp/api에서 packages/be-service까지: ../../../packages/be-service
const SERVICE_PKG_ROOT = resolve(process.cwd(), "../../../packages/be-service");

@Module({
	imports: [
		NestI18nModule.forRoot({
			fallbackLanguage: "ko_KR",
			loaderOptions: {
				path: join(SERVICE_PKG_ROOT, "src/i18n/locales/"),
				watch: process.env.NODE_ENV === "development",
			},
			resolvers: [
				new QueryResolver(["lang", "language"]), // ?lang=en_US
				new AcceptLanguageResolver(), // Accept-Language 헤더
			],
			typesOutputPath: join(SERVICE_PKG_ROOT, "src/i18n/generated/i18n.generated.ts"),
		}),
	],
	providers: [TranslationService],
	exports: [NestI18nModule, TranslationService],
})
export class I18nModule {}
