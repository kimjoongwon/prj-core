import { TRANSLATION_ERRORS, type LanguageCode } from "@cocrepo/constant";
import {
	CreateTranslationDto,
	GetTranslationsDto,
	UpdateTranslationDto,
} from "@cocrepo/dto";
import { Translation } from "@cocrepo/entity";
import type { Prisma } from "@cocrepo/prisma";
import { TranslationsRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import { RedisService } from "../redis/redis.service";
import type {
	CreateTranslationInput,
	UpdateTranslationInput,
	UpsertTranslationInput,
} from "./input/index";


/**
 * Translation 서비스 (Admin용)
 *
 * 번역 데이터의 CRUD 및 캐시 무효화를 관리합니다.
 */
@Injectable()
export class TranslationsService {
	private readonly logger = new Logger(TranslationsService.name);

	constructor(
		private readonly translationsRepository: TranslationsRepository,
		private readonly redisService: RedisService,
	) {}

	/**
	 * 번역 목록 조회 (필터링 및 페이지네이션)
	 *
	 * @param query - 조회 조건
	 * @returns 번역 목록과 총 개수
	 */
	async getTranslations(query: GetTranslationsDto): Promise<{
		data: Translation[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		this.logger.debug(
			`번역 목록 조회: languageCode=${query.languageCode}, category=${query.category}, page=${query.page}`,
		);

		const { data, total } = await this.translationsRepository.findMany({
			languageCode: query.languageCode,
			category: query.category,
			isTranslated: query.isTranslated,
			key: query.key,
			page: query.page ?? 1,
			limit: query.limit ?? 20,
		});

		const page = query.page ?? 1;
		const limit = query.limit ?? 20;
		const totalPages = Math.ceil(total / limit);

		return {
			data,
			total,
			page,
			limit,
			totalPages,
		};
	}

	/**
	 * ID로 번역 조회
	 *
	 * @param id - Translation ID
	 * @returns Translation
	 * @throws NotFoundException - 번역을 찾을 수 없는 경우
	 */
	async getTranslationById(id: string): Promise<Translation> {
		this.logger.debug(`ID로 번역 조회: id=${id.slice(-8)}`);

		const translation = await this.translationsRepository.findById(id);

		if (!translation) {
			throw new NotFoundException(
				TRANSLATION_ERRORS.NOT_FOUND,
			);
		}

		return translation;
	}

	/**
	 * 언어 코드와 키로 번역 조회
	 *
	 * @param languageCode - 언어 코드
	 * @param key - 번역 키
	 * @returns Translation 또는 null
	 */
	async getTranslationByKey(
		languageCode: LanguageCode,
		key: string,
	): Promise<Translation | null> {
		this.logger.debug(`키로 번역 조회: ${languageCode} - ${key}`);

		return this.translationsRepository.findByKey(languageCode, key);
	}

	/**
	 * 번역 생성
	 *
	 * @param input - 번역 생성 데이터
	 * @returns 생성된 Translation
	 * @throws BadRequestException - 중복된 키가 존재하는 경우
	 */
	@Transactional()
	async createTranslation(input: CreateTranslationInput): Promise<Translation> {
		this.logger.debug(`번역 생성: ${input.languageCode} - ${input.key}`);

		// 중복 체크
		const existing = await this.translationsRepository.findByKey(
			input.languageCode,
			input.key,
		);

		if (existing) {
			throw new BadRequestException(
				TRANSLATION_ERRORS.DUPLICATE_KEY,
			);
		}

		// 생성
		const translation = await this.translationsRepository.create(
			input as Prisma.TranslationUncheckedCreateInput,
		);

		// 캐시 무효화 (해당 언어의 모든 캐시)
		await this.invalidateCache(input.languageCode);

		this.logger.log(
			`번역 생성 완료: ${input.languageCode} - ${input.key} (id=${translation.id.slice(-8)})`,
		);

		return translation;
	}

	/**
	 * 번역 수정
	 *
	 * @param id - Translation ID
	 * @param input - 수정 데이터
	 * @returns 수정된 Translation
	 * @throws NotFoundException - 번역을 찾을 수 없는 경우
	 */
	@Transactional()
	async updateTranslation(
		id: string,
		input: UpdateTranslationInput,
	): Promise<Translation> {
		this.logger.debug(`번역 수정: id=${id.slice(-8)}`);

		// 존재 확인
		const existing = await this.translationsRepository.findById(id);

		if (!existing) {
			throw new NotFoundException(
				TRANSLATION_ERRORS.NOT_FOUND,
			);
		}

		// 수정
		const translation = await this.translationsRepository.updateById(
			id,
			input as Prisma.TranslationUncheckedUpdateInput,
		);

		// 캐시 무효화 (해당 언어의 모든 캐시)
		await this.invalidateCache(existing.languageCode as LanguageCode);

		this.logger.log(
			`번역 수정 완료: ${existing.languageCode} - ${existing.key} (id=${id.slice(-8)})`,
		);

		return translation;
	}

	/**
	 * 번역 삭제
	 *
	 * @param id - Translation ID
	 * @returns 삭제된 Translation
	 * @throws NotFoundException - 번역을 찾을 수 없는 경우
	 */
	@Transactional()
	async deleteTranslation(id: string): Promise<Translation> {
		this.logger.debug(`번역 삭제: id=${id.slice(-8)}`);

		// 존재 확인
		const existing = await this.translationsRepository.findById(id);

		if (!existing) {
			throw new NotFoundException(
				TRANSLATION_ERRORS.NOT_FOUND,
			);
		}

		// 삭제
		const translation = await this.translationsRepository.deleteById(id);

		// 캐시 무효화 (해당 언어의 모든 캐시)
		await this.invalidateCache(existing.languageCode as LanguageCode);

		this.logger.log(
			`번역 삭제 완료: ${existing.languageCode} - ${existing.key} (id=${id.slice(-8)})`,
		);

		return translation;
	}

	/**
	 * 번역 Upsert (생성 또는 수정)
	 *
	 * @param input - 번역 데이터
	 * @returns Upsert된 Translation
	 */
	@Transactional()
	async upsertTranslation(input: UpsertTranslationInput): Promise<Translation> {
		this.logger.debug(`번역 Upsert: ${input.languageCode} - ${input.key}`);

		const translation = await this.translationsRepository.upsert({
			languageCode: input.languageCode,
			key: input.key,
			text: input.text,
			category: input.category,
			isTranslated: input.isTranslated,
		});

		// 캐시 무효화 (해당 언어의 모든 캐시)
		await this.invalidateCache(input.languageCode);

		this.logger.log(
			`번역 Upsert 완료: ${input.languageCode} - ${input.key} (id=${translation.id.slice(-8)})`,
		);

		return translation;
	}

	/**
	 * Redis 캐시 무효화
	 *
	 * @param languageCode - 무효화할 언어 코드 (선택적)
	 * @description languageCode가 지정되면 해당 언어의 캐시만, 없으면 모든 캐시 무효화
	 */
	async invalidateCache(languageCode?: LanguageCode): Promise<void> {
		if (languageCode) {
			this.logger.debug(`캐시 무효화: ${languageCode}`);
			const pattern = `i18n:${languageCode}:*`;
			await this.redisService.delByPattern(pattern);
		} else {
			this.logger.debug("전체 캐시 무효화");
			await this.redisService.delByPattern("i18n:*");
		}
	}
}
