import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DepotsRepository } from '../repositories/depots.repository';
import { DepotQueryDto, UpdateDepotDto } from '../dtos';
import { ContextProvider } from '../providers';
import { AwsService } from '../domains/aws/aws.service';
import { FilesService } from './files.service';

@Injectable()
export class DepotsService {
  constructor(
    private readonly repository: DepotsRepository,
    private readonly awsService: AwsService,
    private readonly filesService: FilesService,
  ) {}

  getUnique(args: Prisma.DepotFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getById(id: string) {
    return this.repository.findUnique({ where: { id } });
  }

  getFirst(args: Prisma.DepotFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  updateMany(args: Prisma.DepotUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  deleteById(id: string) {
    return this.repository.delete({ where: { id } });
  }

  async create(files: Express.Multer.File[]) {
    return this.repository.create({
      data: {
        files: {
          create: await Promise.all(
            files.map(async (file) => {
              const depotFile = await this.filesService.getDepotFile(file);
              return depotFile;
            }),
          ),
        },
      },
    });
  }

  async getManyByQuery(query: DepotQueryDto) {
    const args = query.toArgs();
    const countArgs = query.toCountArgs();
    const depots = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      depots,
      count,
    };
  }

  updateById(depotId: string, updateDepotDto: UpdateDepotDto) {
    // 추가 로직 필요
    return this.repository.update({
      where: { id: depotId },
      data: updateDepotDto,
    });
  }

  removeManyByIds(ids: string[]) {
    return this.repository.updateMany({
      where: { id: { in: ids } },
      data: { removedAt: new Date() },
    });
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
