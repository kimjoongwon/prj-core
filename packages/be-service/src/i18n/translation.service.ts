import {
	CONTEXT_KEYS,
	DEFAULT_LANGUAGE,
	type LanguageCode,
} from "@cocrepo/constant";
import { type PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { I18nService } from "nestjs-i18n";
import { PrismaService } from "../prisma/prisma.service";

/**
 * 다국어 번역 서비스
 *
 * 번역 우선순위:
 * 1. 데이터베이스 확인
 * 2. JSON 파일 확인 (nestjs-i18n)
 * 3. 기본 언어로 폴백 (ko_KR)
 * 4. 키 자체 반환
 */
@Injectable()
export class I18nTranslationService {
	private readonly logger = new Logger(I18nTranslationService.name);

	constructor(
		private readonly i18n: I18nService,
		private readonly cls: ClsService,
		private readonly prisma: PrismaService,
	) {}

	private async findDbTranslation(
		languageCode: LanguageCode,
		key: string,
	): Promise<string | null> {
		try {
			const dbTranslation = await (
				this.prisma as unknown as PrismaClient
			).translation.findUnique({
				where: { languageCode_key: { languageCode, key } },
			});

			return dbTranslation?.text ?? null;
		} catch (error) {
			this.logger.warn(
				`DB 번역 조회 실패 (${languageCode}:${key}) - ${error instanceof Error ? error.message : String(error)}`,
			);
			return null;
		}
	}

	/**
	 * 번역 키를 현재 언어로 번역합니다
	 */
	async translate(key: string): Promise<string> {
		const language =
			this.cls.get<LanguageCode>(CONTEXT_KEYS.LANGUAGE) ?? DEFAULT_LANGUAGE;

		// 1. 데이터베이스 확인
		const dbTranslation = await this.findDbTranslation(language, key);
		if (dbTranslation) {
			return dbTranslation;
		}

		// 2. JSON 파일 확인 (nestjs-i18n)
		const translation = this.i18n.translate(key, { lang: language }) as string;
		if (translation !== key) {
			return translation;
		}

		// 3. 기본 언어로 폴백
		if (language !== DEFAULT_LANGUAGE) {
			const fallback = this.i18n.translate(key, {
				lang: DEFAULT_LANGUAGE,
			}) as string;
			return fallback !== key ? fallback : key;
		}

		// 4. 최후의 수단: 키 자체 반환
		return key;
	}

	/**
	 * 특정 언어와 키로 번역을 가져옵니다
	 */
	async getTranslation(
		languageCode: LanguageCode,
		key: string,
	): Promise<string | null> {
		const dbTranslation = await this.findDbTranslation(languageCode, key);
		if (dbTranslation) {
			return dbTranslation;
		}

		const translation = this.i18n.translate(key, {
			lang: languageCode,
		}) as string;
		return translation !== key ? translation : null;
	}
}
