import { join } from "node:path";
import { Module } from "@nestjs/common";
import {
	AcceptLanguageResolver,
	I18nModule as NestI18nModule,
	QueryResolver,
} from "nestjs-i18n";
import { SERVICE_PKG_ROOT } from "./service-pkg-root";
import { I18nTranslationService } from "./translation.service";

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
			typesOutputPath: join(
				SERVICE_PKG_ROOT,
				"src/i18n/generated/i18n.generated.ts",
			),
		}),
	],
	providers: [I18nTranslationService],
	exports: [NestI18nModule, I18nTranslationService],
})
export class I18nModule {}
