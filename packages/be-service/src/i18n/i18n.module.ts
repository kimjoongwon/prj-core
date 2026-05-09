import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { Module } from "@nestjs/common";
import {
	AcceptLanguageResolver,
	I18nModule as NestI18nModule,
	QueryResolver,
} from "nestjs-i18n";
import { I18nTranslationService } from "./translation.service";

// 실행 CWD가 워크스페이스 루트(/app) 또는 앱 경로(/app/apps/*/api)일 수 있어
// 존재하는 경로를 우선 선택한다.
const SERVICE_PKG_ROOT_CANDIDATES = [
	resolve(process.cwd(), "packages/be-service"),
	resolve(process.cwd(), "../../../packages/be-service"),
];

const SERVICE_PKG_ROOT =
	SERVICE_PKG_ROOT_CANDIDATES.find((candidate) =>
		existsSync(join(candidate, "src/i18n/locales")),
	) ?? SERVICE_PKG_ROOT_CANDIDATES[0];

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
