import { Module } from "@nestjs/common";
import {
	I18nModule as NestI18nModule,
	QueryResolver,
	AcceptLanguageResolver,
} from "nestjs-i18n";
import { join } from "node:path";

@Module({
	imports: [
		NestI18nModule.forRoot({
			fallbackLanguage: "ko_KR",
			loaderOptions: {
				path: join(__dirname, "../i18n/"),
				watch: process.env.NODE_ENV === "development",
			},
			resolvers: [
				new QueryResolver(["lang", "language"]), // ?lang=en_US
				new AcceptLanguageResolver(), // Accept-Language 헤더
			],
			typesOutputPath: join(__dirname, "../generated/i18n.generated.ts"),
		}),
	],
	exports: [NestI18nModule],
})
export class I18nModule {}
