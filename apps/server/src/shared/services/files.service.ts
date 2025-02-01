import { Injectable } from '@nestjs/common';
import { ContextProvider } from '../providers/context.provider';
import { AwsService } from '../domains/aws/aws.service';

@Injectable()
export class FilesService {
  constructor(private readonly awsService: AwsService) {}

  async upload(file: Express.Multer.File) {
    const url = await this.awsService.uploadToS3(
      file.originalname,
      file,
      file.mimetype.split('/')[1],
    );

    return url;
  }

  async getDepotFile(file: Express.Multer.File) {
    const tenancyId = ContextProvider.getTenancyId();
    const url = await this.upload(file);

    return {
      name: file.originalname,
      url,
      mimeType: file.mimetype,
      size: file.size,
      tenancyId,
    };
  }
}
