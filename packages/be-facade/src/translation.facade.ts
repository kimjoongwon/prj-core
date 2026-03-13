import { TRANSLATION_ERRORS, type LanguageCode } from "@cocrepo/constant";
import {
	CreateTranslationDto,
	GetTranslationsDto,
	TranslationResponseDto,
	UpdateTranslationDto,
} from "@cocrepo/dto";
import { TranslationService } from "@cocrepo/service";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";


/**
 * Translations Facade
 * 번역 관리 비즈니스 로직 오케스트레이션
 *
 * ✅ Service Layer를 통해 데이터 접근
 * ❌ Repository/Prisma 직접 호출 금지
 */
@Injectable()
export class TranslationFacade {
	private readonly logger = new Logger(TranslationFacade.name);

	constructor(private readonly translationsService: TranslationService) {}

	/**
	 * 번역 목록 조회 (필터링 및 페이지네이션)
	 *
	 * @param query - 조회 조건
	 * @returns 번역 목록과 페이지네이션 메타데이터
	 */
	async getTranslations(query: GetTranslationsDto): Promise<{
		data: TranslationResponseDto[];
		meta: {
			total: number;
			page: number;
			limit: number;
			totalPages: number;
		};
	}> {
		this.logger.debug(
			`번역 목록 조회: languageCode=${query.languageCode}, category=${query.category}, page=${query.page}`,
		);

		const result = await this.translationsService.getTranslations(query);

		return {
			data: result.data.map((translation) =>
				plainToInstance(TranslationResponseDto, translation),
			),
			meta: {
				total: result.total,
				page: result.page,
				limit: result.limit,
				totalPages: result.totalPages,
			},
		};
	}

	/**
	 * ID로 번역 조회
	 *
	 * @param id - Translation ID
	 * @returns TranslationResponseDto
	 * @throws NotFoundException - 번역을 찾을 수 없는 경우
	 */
	async getTranslationById(id: string): Promise<TranslationResponseDto> {
		this.logger.debug(`번역 조회: id=${id.slice(-8)}`);

		const translation =
			await this.translationsService.getTranslationById(id);

		if (!translation) {
			throw new NotFoundException(
				TRANSLATION_ERRORS.NOT_FOUND,
			);
		}

		return plainToInstance(TranslationResponseDto, translation);
	}

	/**
	 * 언어 코드와 키로 번역 조회
	 *
	 * @param languageCode - 언어 코드
	 * @param key - 번역 키
	 * @returns TranslationResponseDto 또는 null
	 */
	async getTranslationByKey(
		languageCode: LanguageCode,
		key: string,
	): Promise<TranslationResponseDto | null> {
		this.logger.debug(`키로 번역 조회: ${languageCode} - ${key}`);

		const translation = await this.translationsService.getTranslationByKey(
			languageCode,
			key,
		);

		return translation
			? plainToInstance(TranslationResponseDto, translation)
			: null;
	}

	/**
	 * 번역 생성
	 *
	 * @param data - 번역 생성 데이터
	 * @returns 생성된 TranslationResponseDto
	 */
	async createTranslation(
		data: CreateTranslationDto,
	): Promise<TranslationResponseDto> {
		this.logger.debug(`번역 생성: ${data.languageCode} - ${data.key}`);

		const translation =
			await this.translationsService.createTranslation(data);

		return plainToInstance(TranslationResponseDto, translation);
	}

	/**
	 * 번역 수정
	 *
	 * @param id - Translation ID
	 * @param data - 수정 데이터
	 * @returns 수정된 TranslationResponseDto
	 * @throws NotFoundException - 번역을 찾을 수 없는 경우
	 */
	async updateTranslation(
		id: string,
		data: UpdateTranslationDto,
	): Promise<TranslationResponseDto> {
		this.logger.debug(`번역 수정: id=${id.slice(-8)}`);

		const translation = await this.translationsService.updateTranslation(
			id,
			data,
		);

		return plainToInstance(TranslationResponseDto, translation);
	}

	/**
	 * 번역 삭제
	 *
	 * @param id - Translation ID
	 * @returns 삭제된 TranslationResponseDto
	 * @throws NotFoundException - 번역을 찾을 수 없는 경우
	 */
	async deleteTranslation(id: string): Promise<TranslationResponseDto> {
		this.logger.debug(`번역 삭제: id=${id.slice(-8)}`);

		const translation =
			await this.translationsService.deleteTranslation(id);

		return plainToInstance(TranslationResponseDto, translation);
	}

	/**
	 * 번역 Upsert (생성 또는 수정)
	 *
	 * @param data - 번역 데이터
	 * @returns Upsert된 TranslationResponseDto
	 */
	async upsertTranslation(
		data: CreateTranslationDto,
	): Promise<TranslationResponseDto> {
		this.logger.debug(`번역 Upsert: ${data.languageCode} - ${data.key}`);

		const translation =
			await this.translationsService.upsertTranslation(data);

		return plainToInstance(TranslationResponseDto, translation);
	}

	/**
	 * Redis 캐시 무효화
	 *
	 * @param languageCode - 무효화할 언어 코드 (선택적)
	 */
	async invalidateCache(languageCode?: LanguageCode): Promise<void> {
		this.logger.debug(
			`캐시 무효화 요청: ${languageCode ?? "전체 언어"}`,
		);

		await this.translationsService.invalidateCache(languageCode);
	}
}
