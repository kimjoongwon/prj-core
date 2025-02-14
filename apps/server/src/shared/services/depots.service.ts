import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DepotsRepository } from '../repositories/depots.repository';
import { CreateFileDto, DepotQueryDto, UpdateDepotDto } from '../dtos';
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
    return this.repository.findUnique({ where: { id }, include: { files: true } });
  }

  async create(
    thumbnails: Express.Multer.File[],
    videos: Express.Multer.File[],
    images: Express.Multer.File[],
  ) {
    const thumbnailFiles = await Promise.all(
      thumbnails?.map(async (file) => {
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
        } as CreateFileDto;
      }),
    );

    const videoFiles = await Promise.all(
      videos.map(async (file) => {
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
        } as CreateFileDto;
      }),
    );

    const imageFiles = await Promise.all(
      images.map(async (file) => {
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
        } as CreateFileDto;
      }),
    );

    return this.repository.create({
      data: {
        files: {
          create: [...imageFiles, ...thumbnailFiles, ...videoFiles],
        },
      },
    });
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
