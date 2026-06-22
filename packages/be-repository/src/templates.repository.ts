import { Template } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class TemplatesRepository {
	private readonly logger = new Logger("TemplatesRepository");

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	/**
	 * ID로 조회 (variables 포함)
	 */
	async findById(id: string): Promise<Template | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.template.findUnique({
			where: { id },
			include: { variables: true },
		});

		return result ? plainToInstance(Template, result) : null;
	}

	/**
	 * ID로 조회 (없으면 에러)
	 */
	async findByIdOrThrow(id: string): Promise<Template> {
		const result = await this.findById(id);
		if (!result) {
			throw new Error(`Template not found: ${id}`);
		}
		return result;
	}

	/**
	 * code(unique key)로 조회 (variables 포함, 소프트 삭제 제외)
	 */
	async findByCode(code: string): Promise<Template | null> {
		this.logger.debug(`code로 조회: ${code}`);

		const result = await this.txHost.tx.template.findFirst({
			where: { code, removedAt: null },
			include: { variables: true },
		});

		return result ? plainToInstance(Template, result) : null;
	}

	/**
	 * 목록 조회 (variables 미포함)
	 */
	async findMany(params: {
		where: Prisma.TemplateWhereInput;
		orderBy: Prisma.TemplateOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ data: Template[]; totalCount: number }> {
		this.logger.debug("템플릿 목록 조회");

		const notRemoved: Prisma.TemplateWhereInput = {
			...params.where,
			removedAt: null,
		};

		const [data, totalCount] = await Promise.all([
			this.txHost.tx.template.findMany({
				where: notRemoved,
				orderBy: params.orderBy,
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.template.count({ where: notRemoved }),
		]);

		return {
			data: data.map((item) => plainToInstance(Template, item)),
			totalCount,
		};
	}

	/**
	 * 생성
	 */
	async create(data: Prisma.TemplateUncheckedCreateInput): Promise<Template> {
		this.logger.debug(`생성 중: ${data.code}`);

		const result = await this.txHost.tx.template.create({ data });

		return plainToInstance(Template, result);
	}

	/**
	 * Template + 변수 목록 함께 생성
	 */
	async createWithVariables(
		templateData: Prisma.TemplateUncheckedCreateInput,
		variables: Array<{
			name: string;
			description?: string;
			defaultValue?: string;
			isRequired?: boolean;
		}>,
	): Promise<Template> {
		this.logger.debug(`변수 포함 생성 중: ${templateData.code}`);

		const result = await this.txHost.tx.template.create({
			data: {
				...templateData,
				variables: {
					create: variables,
				},
			},
			include: { variables: true },
		});

		return plainToInstance(Template, result);
	}

	/**
	 * ID로 업데이트
	 */
	async updateById(
		id: string,
		data: Prisma.TemplateUncheckedUpdateInput,
	): Promise<Template> {
		this.logger.debug(`업데이트 중: ${id.slice(-8)}`);

		const result = await this.txHost.tx.template.update({
			where: { id },
			data,
		});

		return plainToInstance(Template, result);
	}

	/**
	 * Template 업데이트 + 변수 전체 교체 (기존 삭제 → 새로 생성)
	 */
	async updateWithVariables(
		id: string,
		templateData: Prisma.TemplateUncheckedUpdateInput,
		variables: Array<{
			name: string;
			description?: string;
			defaultValue?: string;
			isRequired?: boolean;
		}>,
	): Promise<Template> {
		this.logger.debug(`변수 포함 업데이트 중: ${id.slice(-8)}`);

		// 기존 변수 전체 삭제
		await this.txHost.tx.templateVariable.deleteMany({
			where: { templateId: id },
		});

		// 템플릿 업데이트 + 새 변수 생성
		const result = await this.txHost.tx.template.update({
			where: { id },
			data: {
				...templateData,
				variables: {
					create: variables,
				},
			},
			include: { variables: true },
		});

		return plainToInstance(Template, result);
	}

	/**
	 * 소프트 삭제 (removedAt 설정 + isActive 비활성화)
	 */
	async removeById(id: string): Promise<Template> {
		this.logger.debug(`소프트 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.template.update({
			where: { id },
			data: { removedAt: new Date(), isActive: false },
		});

		return plainToInstance(Template, result);
	}
}
