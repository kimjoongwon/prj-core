import { Action } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class ActionsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("ActionsRepository");
	}

	/**
	 * 모든 Action 조회
	 */
	async findAll(): Promise<Action[]> {
		this.logger.debug("모든 Action 조회");

		const results = await this.txHost.tx.action.findMany({
			where: { removedAt: null },
			orderBy: [{ group: "asc" }, { order: "asc" }, { name: "asc" }],
		});

		return results.map((result) => toDomainEntity(Action, result));
	}

	/**
	 * 그룹별 Action 조회
	 */
	async findByGroup(group: string): Promise<Action[]> {
		this.logger.debug(`그룹별 Action 조회: group=${group}`);

		const results = await this.txHost.tx.action.findMany({
			where: {
				group,
				removedAt: null,
			},
			orderBy: [{ order: "asc" }, { name: "asc" }],
		});

		return results.map((result) => toDomainEntity(Action, result));
	}

	/**
	 * ID로 Action 조회
	 */
	async findById(id: bigint): Promise<Action | null> {
		this.logger.debug(`ID로 Action 조회: ${id.toString()}`);

		const result = await this.txHost.tx.action.findUnique({
			where: { id },
		});

		return result ? toDomainEntity(Action, result) : null;
	}

	/**
	 * 이름으로 Action 조회
	 */
	async findByName(name: string): Promise<Action | null> {
		this.logger.debug(`이름으로 Action 조회: name=${name}`);

		const result = await this.txHost.tx.action.findUnique({
			where: { name },
		});

		return result ? toDomainEntity(Action, result) : null;
	}

	/**
	 * 여러 이름으로 Action 조회
	 */
	async findByNames(names: string[]): Promise<Action[]> {
		this.logger.debug(`여러 이름으로 Action 조회: count=${names.length}`);

		const results = await this.txHost.tx.action.findMany({
			where: {
				name: { in: names },
				removedAt: null,
			},
			orderBy: [{ order: "asc" }, { name: "asc" }],
		});

		return results.map((result) => toDomainEntity(Action, result));
	}

	/**
	 * Action 생성
	 */
	async create(data: Prisma.ActionUncheckedCreateInput): Promise<Action> {
		this.logger.debug(`Action 생성: name=${data.name}`);

		const result = await this.txHost.tx.action.create({
			data,
		});

		return toDomainEntity(Action, result);
	}

	/**
	 * Action 수정
	 */
	async updateById(
		id: bigint,
		data: Prisma.ActionUncheckedUpdateInput,
	): Promise<Action> {
		this.logger.debug(`Action 수정: id=${id.toString()}`);

		const result = await this.txHost.tx.action.update({
			where: { id },
			data,
		});

		return toDomainEntity(Action, result);
	}

	/**
	 * Action 소프트 삭제
	 */
	async removeById(id: bigint): Promise<Action> {
		this.logger.debug(`Action 소프트 삭제: id=${id.toString()}`);

		const result = await this.txHost.tx.action.update({
			where: { id },
			data: { removedAt: new Date() },
		});

		return toDomainEntity(Action, result);
	}

	/**
	 * 다중 Action 생성 (upsert)
	 */
	async upsertMany(
		actions: Prisma.ActionUncheckedCreateInput[],
	): Promise<Action[]> {
		this.logger.debug(`다중 Action upsert: count=${actions.length}`);

		const results: Action[] = [];
		for (const action of actions) {
			const result = await this.txHost.tx.action.upsert({
				where: { name: action.name },
				create: action,
				update: {
					displayName: action.displayName,
					description: action.description,
					group: action.group,
					order: action.order,
					config: action.config,
					removedAt: null,
				},
			});
			results.push(toDomainEntity(Action, result));
		}

		return results;
	}
}
