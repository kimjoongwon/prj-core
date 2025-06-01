import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DepotsRepository } from '../repository/depots.repository';
import { QueryDepotDto } from '../dto';
import { AwsService } from '../domain/aws/aws.service';
import { ContextProvider } from '../provider';
import { CategoriesRepository } from '../repository/categories.repository';
import { CategoryNames } from '../enum/category-names.enum';

@Injectable()
export class DepotsService {
  constructor(
    private readonly repository: DepotsRepository,
    private readonly awsService: AwsService,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  getUnique(args: Prisma.DepotFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getById(id: string) {
    return this.repository.findUnique({
      where: { id },
      include: {
        files: {
          where: {
            removedAt: null,
          },
        },
      },
    });
  }

  async create(files: Express.Multer.File[] = []) {
    const tenantId = ContextProvider.getTenantId();

    const fileDtos = await Promise.all(
      files?.map(async (file) => {
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
          tenantId,
        };
      }),
    );

    return this.repository.create({
      data: {
        files: {
          create: fileDtos,
        },
      },
    });
  }

  deleteById(id: string) {
    return this.repository.delete({ where: { id } });
  }

  async getManyByQuery(query: QueryDepotDto) {
    const args = query.toArgs();
    const countArgs = query.toCountArgs();
    const depots = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      depots,
      count,
    };
  }

  async updateById(
    depotId: string,
    thumbnails: Express.Multer.File[] = [],
    videos: Express.Multer.File[] = [],
    images: Express.Multer.File[] = [],
  ) {
    const tenantId = ContextProvider.getTenantId();

    const imageCategory = await this.categoriesRepository.findFirst({
      where: {
        name: CategoryNames.IMAGE_CONTENT.name,
      },
    });

    const videoCategory = await this.categoriesRepository.findFirst({
      where: {
        name: CategoryNames.VIDEO_CONTENT.name,
      },
    });

    const thumbnailFiles =
      (await Promise.all(
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
            tenantId,
            classification: {
              create: {
                category: {
                  connect: { id: imageCategory.id },
                },
              },
            },
          };
        }),
      )) || [];

    const videoFiles =
      (await Promise.all(
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
            tenantId,
            classification: {
              create: {
                category: {
                  connect: { id: videoCategory.id },
                },
              },
            },
          };
        }),
      )) || [];

    const imageFiles =
      (await Promise.all(
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
            tenantId,
            classification: {
              create: {
                category: {
                  connect: { id: imageCategory.id },
                },
              },
            },
          };
        }),
      )) || [];

    return this.repository.update({
      where: { id: depotId },
      data: {
        files: {
          create: [...imageFiles, ...thumbnailFiles, ...videoFiles],
        },
      },
    });
  }
}
