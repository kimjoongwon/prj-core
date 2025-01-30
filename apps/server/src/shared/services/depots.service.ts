import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DepotsRepository } from '../repositories/depots.repository';
import { CreateDepotDto, DepotQueryDto, UpdateDepotDto } from '../dtos';
import { ContextProvider } from '../providers';
import { AwsService } from '../domains/aws/aws.service';

@Injectable()
export class DepotsService {
  constructor(
    private readonly repository: DepotsRepository,
    private readonly awsService: AwsService,
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

  async create(createDepotDto: CreateDepotDto, files: Express.Multer.File[]) {
    const tenancyId = ContextProvider.getTanancyId();

    return this.repository.create({
      data: {
        ...createDepotDto,
        files: {
          create: await Promise.all(
            files.map(async (file) => {
              const url = await this.awsService.uploadToS3(
                file.originalname,
                file,
                file.mimetype.split('/')[1],
              );

              return {
                name: file.originalname,
                url,
                mimeType: file.mimetype,
                size: file.size,
                tenancyId: '7917db05-d15d-4e67-8bd1-5da3d36b66ed',
              };
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
    const { files, ...data } = updateDepotDto;
    // 추가 로직 필요
    return this.repository.update({
      where: { id: depotId },
      data: data,
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
