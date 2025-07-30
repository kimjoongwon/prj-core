import { Injectable } from "@nestjs/common";
import {
	CreateRoleClassificationDto,
	RoleClassification,
	UpdateRoleClassificationDto,
} from "@shared/schema";
import { RoleClassificationsRepository } from "../repository/role-classifications.repository";
import { BaseService } from "./base.service";

@Injectable()
export class RoleClassificationsService extends BaseService<
	CreateRoleClassificationDto,
	UpdateRoleClassificationDto,
	any,
	RoleClassification,
	RoleClassificationsRepository
> {
	constructor(readonly repository: RoleClassificationsRepository) {
		super(repository);
	}
}
