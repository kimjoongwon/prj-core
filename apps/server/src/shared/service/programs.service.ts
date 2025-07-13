import { Injectable } from "@nestjs/common";
import { CreateProgramDto, Program, QueryProgramDto, UpdateProgramDto } from "@shared/schema";
import { ProgramsRepository } from "../repository/programs.repository";
import { BaseService } from "./base.service";

@Injectable()
export class ProgramsService extends BaseService<
  CreateProgramDto,
  UpdateProgramDto,
  QueryProgramDto,
  Program,
  ProgramsRepository
> {
  constructor(readonly repository: ProgramsRepository) {
    super(repository);
  }
}
