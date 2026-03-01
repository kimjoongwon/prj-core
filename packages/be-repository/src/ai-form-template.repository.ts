import { AIFormField, AIFormTemplate } from "@cocrepo/entity";
import {
	FormFieldType,
	Prisma,
	PrismaClient,
} from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

/**
 * AI 폼 템플릿 필드 생성 데이터 타입
 */
type FieldCreateData = {
	fieldName: string;
	fieldLabel?: string;
	fieldType: FormFieldType;
	prompt: string;
	isRequired?: boolean;
	defaultValue?: string;
	validationRegex?: string;
	validationMessage?: string;
	maxLength?: number;
	options?: Prisma.JsonValue;
	order?: number;
	groupId?: string;
	metadata?: Prisma.JsonValue;
};

@Injectable()
export class AIFormTemplatesRepository {
	private readonly logger = new Logger("AIFormTemplatesRepository");

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	/**
	 * ID로 조회 (필드 포함)
	 */
	async findById(id: string): Promise<AIFormTemplate | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.aIFormTemplate.findUnique({
			where: { id },
			include: {
				fields: {
					orderBy: { order: "asc" },
				},
			},
		});

		return result ? plainToInstance(AIFormTemplate, result) : null;
	}

	/**
	 * ID로 조회 (없으면 에러)
	 */
	async findByIdOrThrow(id: string): Promise<AIFormTemplate> {
		const result = await this.findById(id);
		if (!result) {
			throw new Error(`AIFormTemplate not found: ${id}`);
		}
		return result;
	}

	/**
	 * 목록 조회
	 */
	async findMany(params: {
		where?: Prisma.AIFormTemplateWhereInput;
		orderBy?: Prisma.AIFormTemplateOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ data: AIFormTemplate[]; totalCount: number }> {
		const { where, orderBy, skip, take } = params;
		this.logger.debug("AI 폼 템플릿 목록 조회");

		const notRemoved: Prisma.AIFormTemplateWhereInput = {
			...where,
			removedAt: null,
		};

		const [data, totalCount] = await Promise.all([
			this.txHost.tx.aIFormTemplate.findMany({
				where: notRemoved,
				orderBy: orderBy ?? [{ priority: "desc" }, { createdAt: "desc" }],
				skip,
				take,
			}),
			this.txHost.tx.aIFormTemplate.count({ where: notRemoved }),
		]);

		return {
			data: data.map((item) => plainToInstance(AIFormTemplate, item)),
			totalCount,
		};
	}

	/**
	 * 도메인별 템플릿 목록 조회
	 */
	async findManyByTargetDomain(
		targetDomain: string,
		params?: {
			spaceId?: string;
			skip?: number;
			take?: number;
		},
	): Promise<{ data: AIFormTemplate[]; totalCount: number }> {
		this.logger.debug(`도메인별 조회: ${targetDomain}`);

		const where: Prisma.AIFormTemplateWhereInput = {
			targetDomain,
			removedAt: null,
		};

		if (params?.spaceId) {
			where.spaceId = params.spaceId;
		}

		const [data, totalCount] = await Promise.all([
			this.txHost.tx.aIFormTemplate.findMany({
				where,
				orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
				skip: params?.skip,
				take: params?.take,
			}),
			this.txHost.tx.aIFormTemplate.count({ where }),
		]);

		return {
			data: data.map((item) => plainToInstance(AIFormTemplate, item)),
			totalCount,
		};
	}

	/**
	 * ID로 필드 포함 조회
	 */
	async findByIdWithFields(id: string): Promise<AIFormTemplate | null> {
		this.logger.debug(`필드 포함 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.aIFormTemplate.findUnique({
			where: { id },
			include: {
				fields: {
					orderBy: { order: "asc" },
				},
			},
		});

		return result ? plainToInstance(AIFormTemplate, result) : null;
	}

	/**
	 * 생성
	 */
	async create(
		data: Prisma.AIFormTemplateUncheckedCreateInput,
	): Promise<AIFormTemplate> {
		this.logger.debug(`생성 중: ${data.name}`);

		const result = await this.txHost.tx.aIFormTemplate.create({ data });

		return plainToInstance(AIFormTemplate, result);
	}

	/**
	 * 필드와 함께 생성
	 */
	async createWithFields(
		templateData: Prisma.AIFormTemplateUncheckedCreateInput,
		fields: FieldCreateData[],
	): Promise<AIFormTemplate> {
		this.logger.debug(`필드 포함 생성 중: ${templateData.name}`);

		const result = await this.txHost.tx.aIFormTemplate.create({
			data: {
				...templateData,
				fields: {
					create: fields.map((field) => ({
						fieldName: field.fieldName,
						fieldLabel: field.fieldLabel,
						fieldType: field.fieldType,
						prompt: field.prompt,
						isRequired: field.isRequired ?? true,
						defaultValue: field.defaultValue,
						validationRegex: field.validationRegex,
						validationMessage: field.validationMessage,
						maxLength: field.maxLength,
						options: field.options,
						order: field.order ?? 0,
						groupId: field.groupId,
						metadata: field.metadata,
					})),
				},
			},
			include: {
				fields: {
					orderBy: { order: "asc" },
				},
			},
		});

		return plainToInstance(AIFormTemplate, result);
	}

	/**
	 * ID로 업데이트
	 */
	async updateById(
		id: string,
		data: Prisma.AIFormTemplateUncheckedUpdateInput,
	): Promise<AIFormTemplate> {
		this.logger.debug(`업데이트 중: ${id.slice(-8)}`);

		const result = await this.txHost.tx.aIFormTemplate.update({
			where: { id },
			data,
		});

		return plainToInstance(AIFormTemplate, result);
	}

	/**
	 * 필드와 함께 업데이트 (기존 필드 삭제 후 재생성)
	 */
	async updateWithFields(
		id: string,
		templateData: Prisma.AIFormTemplateUncheckedUpdateInput,
		fields: FieldCreateData[],
	): Promise<AIFormTemplate> {
		this.logger.debug(`필드 포함 업데이트 중: ${id.slice(-8)}`);

		// 기존 필드 전체 삭제
		await this.txHost.tx.aIFormField.deleteMany({
			where: { templateId: id },
		});

		// 템플릿 업데이트 + 새 필드 생성
		const result = await this.txHost.tx.aIFormTemplate.update({
			where: { id },
			data: {
				...templateData,
				fields: {
					create: fields.map((field) => ({
						fieldName: field.fieldName,
						fieldLabel: field.fieldLabel,
						fieldType: field.fieldType,
						prompt: field.prompt,
						isRequired: field.isRequired ?? true,
						defaultValue: field.defaultValue,
						validationRegex: field.validationRegex,
						validationMessage: field.validationMessage,
						maxLength: field.maxLength,
						options: field.options,
						order: field.order ?? 0,
						groupId: field.groupId,
						metadata: field.metadata,
					})),
				},
			},
			include: {
				fields: {
					orderBy: { order: "asc" },
				},
			},
		});

		return plainToInstance(AIFormTemplate, result);
	}

	/**
	 * 소프트 삭제
	 */
	async removeById(id: string): Promise<AIFormTemplate> {
		this.logger.debug(`소프트 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.aIFormTemplate.update({
			where: { id },
			data: { removedAt: new Date() },
		});

		return plainToInstance(AIFormTemplate, result);
	}

	/**
	 * 물리 삭제
	 */
	async deleteById(id: string): Promise<AIFormTemplate> {
		this.logger.debug(`물리 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.aIFormTemplate.delete({
			where: { id },
		});

		return plainToInstance(AIFormTemplate, result);
	}

	// ============================================================================
	// 필드 관련 메서드
	// ============================================================================

	/**
	 * 템플릿의 모든 필드 조회
	 */
	async findFieldsByTemplateId(templateId: string): Promise<AIFormField[]> {
		this.logger.debug(`필드 목록 조회: ${templateId.slice(-8)}`);

		const fields = await this.txHost.tx.aIFormField.findMany({
			where: { templateId },
			orderBy: { order: "asc" },
		});

		return fields.map((field) => plainToInstance(AIFormField, field));
	}

	/**
	 * 단일 필드 생성
	 */
	async createField(
		data: Prisma.AIFormFieldUncheckedCreateInput,
	): Promise<AIFormField> {
		this.logger.debug(`필드 생성: ${data.fieldName}`);

		const result = await this.txHost.tx.aIFormField.create({ data });

		return plainToInstance(AIFormField, result);
	}

	/**
	 * 단일 필드 업데이트
	 */
	async updateFieldById(
		id: string,
		data: Prisma.AIFormFieldUncheckedUpdateInput,
	): Promise<AIFormField> {
		this.logger.debug(`필드 업데이트: ${id.slice(-8)}`);

		const result = await this.txHost.tx.aIFormField.update({
			where: { id },
			data,
		});

		return plainToInstance(AIFormField, result);
	}

	/**
	 * 단일 필드 삭제
	 */
	async deleteFieldById(id: string): Promise<AIFormField> {
		this.logger.debug(`필드 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.aIFormField.delete({
			where: { id },
		});

		return plainToInstance(AIFormField, result);
	}
}
