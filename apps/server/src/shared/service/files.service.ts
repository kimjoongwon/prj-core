import { Injectable } from '@nestjs/common';
import { ContextProvider } from '../provider/context.provider';
import { AwsService } from '../domain/aws/aws.service';
import { FilesRepository } from '../repository';
import { CreateFileDto } from '../dto/create/create-file.dto';

@Injectable()
export class FilesService {
  constructor(
    private readonly awsService: AwsService,
    private readonly repository: FilesRepository,
  ) {}

  getById(id: string) {
    return this.repository.findUnique({
      where: { id },
    });
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

  async createImageFiles(images: Express.Multer.File[]) {}

  async updateById(fileId: string, file: Express.Multer.File) {
    const fileDto = await this.buildDepotFile(file);
    return this.repository.update({
      where: { id: fileId },
      data: fileDto,
    });
  }

  removeById(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
