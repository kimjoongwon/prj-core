import { Injectable } from "@nestjs/common";
import {
	CreateUserAssociationDto,
	Prisma,
	QueryUserAssociationDto,
	UpdateUserAssociationDto,
} from "@shared/schema";
import { UserAssociationsRepository } from "../../repository/user-associations.repository";

@Injectable()
export class UserAssociationsService {
	constructor(private readonly repository: UserAssociationsRepository) {}

	getById(id: string) {
		return this.repository.findUnique({ where: { id } });
	}

	deleteById(id: string) {
		return this.repository.delete({ where: { id } });
	}

	create(createUserAssociationDto: CreateUserAssociationDto) {
		return this.repository.create({
			data: createUserAssociationDto,
		});
	}

	async getManyByQuery(query: QueryUserAssociationDto) {
		const include = {
			user: true,
			group: true,
		};
		const args = query.toArgs({ include });
		const countArgs = query.toCountArgs<Prisma.UserAssociationCountArgs>();
		const userAssociations = await this.repository.findMany(args);
		const count = await this.repository.count(countArgs);
		return {
			userAssociations,
			count,
		};
	}

	updateById(id: string, data: UpdateUserAssociationDto) {
		return this.repository.update({ where: { id }, data });
	}

	removeById(id: string) {
		return this.repository.update({
			where: { id },
			data: { removedAt: new Date() },
		});
	}
}
