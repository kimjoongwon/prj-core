import { Injectable } from '@nestjs/common';
import { ContextProvider } from '../providers/context.provider';
import { AwsService } from '../domains/aws/aws.service';
import { FilesRepository } from '../repositories';
import { CreateFileDto } from '../dtos/create/create-file.dto';

@Injectable()
export class FilesService {
  constructor(
    private readonly awsService: AwsService,
    private readonly repository: FilesRepository,
  ) {}

  getById(id: string) {
    return this.repository.findUnique({ where: { id } });
  }

  create(createFileDto: CreateFileDto) {
    return this.repository.create({
      data: createFileDto,
    });
  }

  async upload(file: Express.Multer.File) {
    const url = await this.awsService.uploadToS3(
      file.originalname,
      file,
      file.mimetype.split('/')[1],
    );

    return url;
  }
  async buildDepotFile(file: Express.Multer.File) {
    const tenantId = ContextProvider.getTenantId();
    const url = await this.upload(file);

    return {
      name: file.originalname,
      url,
      mimeType: file.mimetype,
      size: file.size,
      tenantId,
    };
  }

  async createImageFiles(images: Express.Multer.File[]) {
    

  }
}
