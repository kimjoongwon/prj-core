import { Translation } from "@cocrepo/entity";
import type { LanguageCode } from "@cocrepo/prisma";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { toDomainEntity } from "./to-domain-entity";

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
		const safePage = params.page && params.page > 0 ? params.page : 1;
		const safeLimit = params.limit && params.limit > 0 ? params.limit : 20;
		const where: Prisma.TranslationWhereInput = {
			...(params.languageCode ? { languageCode: params.languageCode } : {}),
			...(params.category ? { category: params.category } : {}),
			...(typeof params.isTranslated === "boolean"
				? { isTranslated: params.isTranslated }
				: {}),
			...(params.key
				? {
						key: {
							contains: params.key,
							mode: "insensitive",
						},
					}
				: {}),
		};

		this.logger.debug(
			`번역 목록 조회: page=${safePage}, limit=${safeLimit}, languageCode=${params.languageCode ?? "all"}, category=${params.category ?? "all"}`,
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
			data: data.map((item) => toDomainEntity(Translation, item)),
			totalCount,
		};
	}

	/**
	 * ID로 번역 조회
	 */
	async findById(id: bigint): Promise<Translation | null> {
		this.logger.debug(`ID로 번역 조회: ${id.toString()}`);

		const result = await this.txHost.tx.translation.findUnique({
			where: { id },
		});

		return result ? toDomainEntity(Translation, result) : null;
	}

	/**
	 * ID로 번역 조회 (없으면 에러)
	 */
	async findByIdOrThrow(id: bigint): Promise<Translation> {
		const result = await this.findById(id);
		if (!result) {
			throw new Error(`Translation not found: ${id.toString()}`);
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

		return result ? toDomainEntity(Translation, result) : null;
	}

	async findCatalogByLanguage(
		languageCode: LanguageCode,
	): Promise<Record<string, string>> {
		this.logger.debug(`언어 catalog 조회: ${languageCode}`);

		const rows = await this.txHost.tx.translation.findMany({
			where: {
				languageCode,
			},
			select: {
				key: true,
				text: true,
			},
			orderBy: [{ key: "asc" }],
		});

		return rows.reduce<Record<string, string>>((catalog, row) => {
			if (row.text.length > 0) {
				catalog[row.key] = row.text;
			}
			return catalog;
		}, {});
	}

	/**
	 * 번역 생성
	 */
	async create(
		data: Prisma.TranslationUncheckedCreateInput,
	): Promise<Translation> {
		this.logger.debug(`번역 생성: ${data.languageCode}:${data.key}`);

		const result = await this.txHost.tx.translation.create({ data });

		return toDomainEntity(Translation, result);
	}

	/**
	 * ID로 번역 수정
	 */
	async updateById(
		id: bigint,
		data: Prisma.TranslationUncheckedUpdateInput,
	): Promise<Translation> {
		this.logger.debug(`번역 수정: ${id.toString()}`);

		const result = await this.txHost.tx.translation.update({
			where: { id },
			data,
		});

		return toDomainEntity(Translation, result);
	}

	/**
	 * ID로 번역 삭제
	 */
	async deleteById(id: bigint): Promise<Translation> {
		this.logger.debug(`번역 삭제: ${id.toString()}`);

		const result = await this.txHost.tx.translation.delete({
			where: { id },
		});

		return toDomainEntity(Translation, result);
	}
}
