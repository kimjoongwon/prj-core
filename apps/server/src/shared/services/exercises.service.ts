import { Injectable } from '@nestjs/common';
import { ExercisesRepository } from '../repositories';
import { CreateExerciseDto, ExerciseQueryDto, UpdateExerciseDto } from '../dtos';
import { ContextProvider } from '../providers/context.provider';
import { FilesService } from './files.service';
import { CategoryNames } from '../enums/category-names.enum';

@Injectable()
export class ExercisesService {
  constructor(
    private readonly repository: ExercisesRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(
    createExerciseDto: CreateExerciseDto,
    images: Express.Multer.File[],
    videos: Express.Multer.File[],
    thubmnails: Express.Multer.File[],
  ) {
    const {
      count,
      duration,
      task,
      task: {
        label,
        name,
        content: { type, description, title, text },
      },
    } = createExerciseDto;
    const tenantId = ContextProvider.getTenantId();

    const thumbnailFiles = await Promise.all(thubmnails?.map(this.filesService.buildDepotFile));
    const imageFiles = await Promise.all(images?.map(this.filesService.buildDepotFile));
    const videosFiles = await Promise.all(videos?.map(this.filesService.buildDepotFile));

    const exercise = await this.repository.create({
      data: {
        count,
        duration,
        task: {
          create: {
            label,
            name,
            content: {
              create: {
                type,
                description,
                title,
                text,
                tenant: {
                  connect: {
                    id: tenantId,
                  },
                },
                depot: {
                  create: {
                    files: {
                      create: [...imageFiles, ...videosFiles]
                        .map((file) => ({
                          ...file,
                          tenant: {
                            connect: {
                              id: tenantId,
                            },
                          },
                          classification: {
                            create: {
                              category: {
                                connect: {
                                  name: file.mimeType.includes('image')
                                    ? CategoryNames.IMAGE_CONTENT.name
                                    : CategoryNames.VIDEO_CONTENT.name,
                                },
                              },
                            },
                          },
                        }))
                        .concat(
                          thumbnailFiles.map((thumbnailFiles) => ({
                            ...thumbnailFiles,
                            tenant: {
                              connect: {
                                id: tenantId,
                              },
                            },
                            classification: {
                              create: {
                                category: {
                                  connect: {
                                    name: CategoryNames.THUMBNAIL_IMAGE.name,
                                  },
                                },
                              },
                            },
                          })),
                        ),
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return exercise;
  }
  async getManyByQuery(query: ExerciseQueryDto) {
    const args = query.toArgs();
    const countArgs = query.toCountArgs();
    const exercises = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);

    return {
      exercises,
      count,
    };
  }

  getById(id: string) {
    return this.repository.findUnique({ where: { id } });
  }

  updateById(id: string, updateExerciseDto: UpdateExerciseDto) {
    const { task, count, duration } = updateExerciseDto;
    return this.repository.update({
      where: { id },
      data: {
        count,
        duration,
        task: {
          update: {
            label: task.label,
            name: task.name,
            content: {
              update: {
                type: task.content.type,
                description: task.content.description,
                title: task.content.title,
                text: task.content.text,
              },
            },
          },
        },
      },
    });
  }

  deleteById(id: string) {
    return this.repository.delete({ where: { id } });
  }

  removeById(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
