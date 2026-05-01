import { Translation } from "@cocrepo/entity";
import type { LanguageCode } from "@cocrepo/prisma";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class TranslationsRepository {
	private readonly logger = new Logger("TranslationsRepository");

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	/**
	 * 조건별 번역 목록 조회
	 */
	async findMany(params: {
		languageCode?: LanguageCode;
		category?: string;
		isTranslated?: boolean;
		key?: string;
		page?: number;
		limit?: number;
	}): Promise<{ data: Translation[]; totalCount: number }> {
		const { languageCode, category, isTranslated, key, page, limit } = params;
		const safePage = page && page > 0 ? page : 1;
		const safeLimit = limit && limit > 0 ? limit : 20;
		const where: Prisma.TranslationWhereInput = {
			...(languageCode ? { languageCode } : {}),
			...(category ? { category } : {}),
			...(typeof isTranslated === "boolean" ? { isTranslated } : {}),
			...(key
				? {
						key: {
							contains: key,
							mode: "insensitive",
						},
					}
				: {}),
		};

		this.logger.debug(
			`번역 목록 조회: page=${safePage}, limit=${safeLimit}, languageCode=${languageCode ?? "all"}, category=${category ?? "all"}`,
		);

		const [data, totalCount] = await Promise.all([
			this.txHost.tx.translation.findMany({
				where,
				orderBy: [{ category: "asc" }, { key: "asc" }, { languageCode: "asc" }],
				skip: (safePage - 1) * safeLimit,
				take: safeLimit,
			}),
			this.txHost.tx.translation.count({ where }),
		]);

		return {
			data: data.map((item) => plainToInstance(Translation, item)),
			totalCount,
		};
	}

	/**
	 * ID로 번역 조회
	 */
	async findById(id: string): Promise<Translation | null> {
		this.logger.debug(`ID로 번역 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.translation.findUnique({
			where: { id },
		});

		return result ? plainToInstance(Translation, result) : null;
	}

	/**
	 * ID로 번역 조회 (없으면 에러)
	 */
	async findByIdOrThrow(id: string): Promise<Translation> {
		const result = await this.findById(id);
		if (!result) {
			throw new Error(`Translation not found: ${id}`);
		}
		return result;
	}

	/**
	 * 언어 코드 + 번역 키로 조회
	 */
	async findByLanguageAndKey(
		languageCode: LanguageCode,
		key: string,
	): Promise<Translation | null> {
		this.logger.debug(`언어/키로 번역 조회: ${languageCode}:${key}`);

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
	 * 번역 생성
	 */
	async create(
		data: Prisma.TranslationUncheckedCreateInput,
	): Promise<Translation> {
		this.logger.debug(`번역 생성: ${data.languageCode}:${data.key}`);

		const result = await this.txHost.tx.translation.create({ data });

		return plainToInstance(Translation, result);
	}

	/**
	 * ID로 번역 수정
	 */
	async updateById(
		id: string,
		data: Prisma.TranslationUncheckedUpdateInput,
	): Promise<Translation> {
		this.logger.debug(`번역 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.translation.update({
			where: { id },
			data,
		});

		return plainToInstance(Translation, result);
	}

	/**
	 * ID로 번역 삭제
	 */
	async deleteById(id: string): Promise<Translation> {
		this.logger.debug(`번역 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.translation.delete({
			where: { id },
		});

		return plainToInstance(Translation, result);
	}
}
