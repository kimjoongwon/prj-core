import { Injectable } from '@nestjs/common';
import { PagesService } from '../../entities';
import { $Enums } from '@prisma/client';

@Injectable()
export class PageService {
  constructor(private readonly pagesService: PagesService) {}
  getAllPagesByType(type: $Enums.PageTypes) {
    return this.pagesService.getManyByQuery({
      where: {
        type,
      },
    });
  }
}
