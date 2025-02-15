import { Injectable } from '@nestjs/common';
import { ExercisesRepository } from '../repositories';
import { CreateExerciseDto, CreateFileDto, ExerciseQueryDto, UpdateExerciseDto } from '../dtos';
import { ContextProvider } from '../providers/context.provider';
import { AwsService } from '../domains/aws/aws.service';

@Injectable()
export class ExercisesService {
  constructor(
    private readonly repository: ExercisesRepository,
    private readonly awsService: AwsService,
  ) {}

  async create(createExerciseDto: CreateExerciseDto, files: Express.Multer.File[]) {
    const { count, duration, description, label, name, text, title, type } = createExerciseDto;

    const tenantId = ContextProvider.getTenantId();
    const authUser = ContextProvider.getAuthUser();

    const depotFiles = await Promise.all(
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
        } as CreateFileDto;
      }),
    );

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
                      createMany: {
                        data: depotFiles,
                      },
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
    return this.repository.update({
      where: { id },
      data: updateExerciseDto,
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
