import { Translation } from "@cocrepo/entity";
import type { LanguageCode } from "@cocrepo/constant";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

/**
 * Translation Repository
 */
@Injectable()
export class TranslationsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("TranslationsRepository");
	}

	/**
	 * 언어 코드와 키로 번역 조회
	 */
	async findByKey(
		languageCode: LanguageCode,
		key: string,
	): Promise<Translation | null> {
		this.logger.debug(`키로 조회: ${languageCode} - ${key}`);

		const result = await this.txHost.tx.translation.findUnique({
			where: {
				languageCode_key: {
					languageCode,
					key,
				},
			},
		});

		return result ? plainToInstance(Translation, result) : null;
	}

	/**
	 * 언어 코드와 카테고리로 번역 목록 조회
	 */
	async findByCategory(
		languageCode: LanguageCode,
		category: string,
	): Promise<Translation[]> {
		this.logger.debug(`카테고리로 조회: ${languageCode} - ${category}`);

		const results = await this.txHost.tx.translation.findMany({
			where: {
				languageCode,
				category,
			},
			orderBy: [{ key: "asc" }],
		});

		return results.map((result) => plainToInstance(Translation, result));
	}

	/**
	 * 필터링 및 페이지네이션을 지원하는 번역 목록 조회
	 */
	async findMany(params: {
		languageCode?: LanguageCode;
		category?: string;
		isTranslated?: boolean;
		key?: string;
		page?: number;
		limit?: number;
	}): Promise<{ data: Translation[]; total: number }> {
		const {
			languageCode,
			category,
			isTranslated,
			key,
			page = 1,
			limit = 20,
		} = params;

		this.logger.debug(
			`필터링 조회: languageCode=${languageCode}, category=${category}, page=${page}, limit=${limit}`,
		);

		// WHERE 조건 구성
		const where: Prisma.TranslationWhereInput = {};

		if (languageCode) {
			where.languageCode = languageCode;
		}

		if (category) {
			where.category = category;
		}

		if (typeof isTranslated === "boolean") {
			where.isTranslated = isTranslated;
		}

		if (key) {
			where.key = {
				contains: key,
				mode: "insensitive",
			};
		}

		// 총 개수 조회
		const total = await this.txHost.tx.translation.count({ where });

		// 페이지네이션 데이터 조회
		const skip = (page - 1) * limit;
		const results = await this.txHost.tx.translation.findMany({
			where,
			orderBy: [{ languageCode: "asc" }, { key: "asc" }],
			skip,
			take: limit,
		});

		return {
			data: results.map((result) => plainToInstance(Translation, result)),
			total,
		};
	}

	/**
	 * ID로 번역 조회
	 */
	async findById(id: string): Promise<Translation | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.translation.findUnique({
			where: { id },
		});

		return result ? plainToInstance(Translation, result) : null;
	}

	/**
	 * 번역 생성
	 */
	async create(
		data: Prisma.TranslationUncheckedCreateInput,
	): Promise<Translation> {
		this.logger.debug(`번역 생성: ${data.languageCode} - ${data.key}`);

		const result = await this.txHost.tx.translation.create({
			data,
		});

		return plainToInstance(Translation, result);
	}

	/**
	 * 번역 업데이트 (ID 기준)
	 */
	async updateById(
		id: string,
		data: Prisma.TranslationUncheckedUpdateInput,
	): Promise<Translation> {
		this.logger.debug(`번역 수정: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.translation.update({
			where: { id },
			data,
		});

		return plainToInstance(Translation, result);
	}

	/**
	 * 번역 Upsert (언어 코드 + 키 기준)
	 */
	async upsert(data: {
		languageCode: LanguageCode;
		key: string;
		text: string;
		category: string;
		isTranslated: boolean;
	}): Promise<Translation> {
		this.logger.debug(`번역 Upsert: ${data.languageCode} - ${data.key}`);

		const result = await this.txHost.tx.translation.upsert({
			where: {
				languageCode_key: {
					languageCode: data.languageCode,
					key: data.key,
				},
			},
			update: {
				text: data.text,
				category: data.category,
				isTranslated: data.isTranslated,
			},
			create: data,
		});

		return plainToInstance(Translation, result);
	}

	/**
	 * 번역 삭제 (ID 기준)
	 */
	async deleteById(id: string): Promise<Translation> {
		this.logger.debug(`번역 삭제: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.translation.delete({
			where: { id },
		});

		return plainToInstance(Translation, result);
	}

	/**
	 * 다중 번역 생성
	 */
	async createMany(
		data: Prisma.TranslationCreateManyInput[],
	): Promise<number> {
		this.logger.debug(`다중 번역 생성: count=${data.length}`);

		const result = await this.txHost.tx.translation.createMany({
			data,
			skipDuplicates: true,
		});

		return result.count;
	}
}
