import { LanguageCode, supportedLanguages } from "@cocrepo/constant";
import {
	CreateTranslationDto,
	GetTranslationsDto,
	UpdateTranslationDto,
} from "@cocrepo/dto";
import { Translation } from "@cocrepo/entity";
import type { LanguageCode as PrismaLanguageCode } from "@cocrepo/prisma";
import { TranslationsRepository } from "@cocrepo/repository";
import { buildPagePaginatedResponse } from "@cocrepo/toolkit";
import type { PagePaginatedResponse } from "@cocrepo/type";
import {
	BadRequestException,
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

@Injectable()
export class TranslationCatalogAggregateRoot {
	private readonly logger = new Logger(TranslationCatalogAggregateRoot.name);

	constructor(private readonly repository: TranslationsRepository) {}

	async getTranslations(
		query: GetTranslationsDto,
	): Promise<PagePaginatedResponse<Translation[]>> {
		const page = query.page && query.page > 0 ? query.page : 1;
		const limit = query.limit && query.limit > 0 ? query.limit : 20;

		this.logger.debug(
			`번역 목록 조회: page=${page}, limit=${limit}, languageCode=${query.languageCode ?? "all"}, category=${query.category ?? "all"}`,
		);

		const translationResult = await this.repository.findMany({
			languageCode: query.languageCode as PrismaLanguageCode | undefined,
			category: query.category,
			isTranslated: query.isTranslated,
			key: query.key,
			page,
			limit,
		});

		return buildPagePaginatedResponse(
			translationResult.data,
			translationResult.totalCount,
			page,
			limit,
		);
	}

	async getTranslationById(id: string): Promise<Translation> {
		const translation = await this.repository.findById(id);
		if (!translation) {
			throw new NotFoundException("번역을 찾을 수 없습니다");
		}

		return translation;
	}

	async getCatalog(languageCode: string): Promise<{
		languageCode: LanguageCode;
		messages: Record<string, string>;
	}> {
		if (!supportedLanguages.includes(languageCode as LanguageCode)) {
			throw new BadRequestException("허용된 값이 아닙니다");
		}

		const normalizedLanguageCode = languageCode as LanguageCode;
		const messages = await this.repository.findCatalogByLanguage(
			normalizedLanguageCode,
		);

		return {
			languageCode: normalizedLanguageCode,
			messages,
		};
	}

	async create(dto: CreateTranslationDto): Promise<Translation> {
		this.logger.debug(`번역 생성 시도: ${dto.languageCode}:${dto.key}`);

		const existing = await this.repository.findByLanguageAndKey(
			dto.languageCode as PrismaLanguageCode,
			dto.key,
		);
		if (existing) {
			throw new ConflictException(
				`이미 존재하는 번역 키입니다: ${dto.languageCode}:${dto.key}`,
			);
		}

		return this.repository.create({
			languageCode: dto.languageCode as PrismaLanguageCode,
			key: dto.key,
			text: dto.text,
			category: dto.category,
			isTranslated: dto.isTranslated,
		});
	}

	async update(id: string, dto: UpdateTranslationDto): Promise<Translation> {
		this.logger.debug(`번역 수정 시도: ${id.slice(-8)}`);

		await this.getTranslationById(id);

		return this.repository.updateById(id, {
			...(dto.text !== undefined && { text: dto.text }),
			...(dto.category !== undefined && { category: dto.category }),
			...(dto.isTranslated !== undefined && {
				isTranslated: dto.isTranslated,
			}),
		});
	}

	async remove(id: string): Promise<void> {
		this.logger.debug(`번역 삭제 시도: ${id.slice(-8)}`);

		await this.getTranslationById(id);
		await this.repository.deleteById(id);
	}

	async invalidateAllCache(): Promise<void> {
		this.logger.debug(
			"전체 번역 캐시 무효화 요청을 무시합니다: DB 조회에 Redis 캐시를 사용하지 않습니다",
		);
	}

	async invalidateLanguageCache(languageCode: string): Promise<void> {
		this.logger.debug(
			`언어별 번역 캐시 무효화 요청을 무시합니다: languageCode=${languageCode}`,
		);
	}
}
