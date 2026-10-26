import type { LanguageCode } from "@cocrepo/prisma";
import { PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";

@Injectable()
export class TranslationsRepository {
	private readonly logger = new Logger("TranslationsRepository");

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

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
}
