import { Injectable } from '@nestjs/common';
import { RoutinesRepository } from '../../repositories/routines.repository';
import { CreateRoutineDto } from '../../dtos/create/create-routine.dto';
import { ContextProvider } from '../../providers/context.provider';
import { AwsService } from '../aws/aws.service';
import { DepotsService } from '../../services/depots.service';

@Injectable()
export class RoutineService {
  constructor(
    private readonly repository: RoutinesRepository,
    private readonly depotsService: DepotsService,
    private readonly awsService: AwsService,
  ) {}

  async create(
    { name, title, description, type, text }: CreateRoutineDto,
    files: Express.Multer.File[],
  ) {
    const tenancyId = ContextProvider.getTenancyId();
    const depotFiles = await Promise.all(
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
          tenancyId,
        };
      }),
    );

    const depot = await this.depotsService.create(depotFiles);

    return this.repository.create({
      data: {
        name,
        tenancyId,
        content: {
          create: {
            dopotId: depot.id,
            title,
            description,
            type,
            text,
          },
        },
      },
    });
  }
}
