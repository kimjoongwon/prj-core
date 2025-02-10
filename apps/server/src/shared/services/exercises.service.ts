import { Injectable } from '@nestjs/common';
import { ExercisesRepository } from '../repositories';
import { CreateExerciseDto, ExerciseQueryDto, UpdateExerciseDto } from '../dtos';
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

    const tenancyId = ContextProvider.getTenancyId();
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
          tenancyId,
        };
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
            tenancyId,
            content: {
              create: {
                description,
                title,
                type,
                authorId: authUser.id,
                depot: {
                  create: {
                    files: {
                      create: depotFiles,
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
