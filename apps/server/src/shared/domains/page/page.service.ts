import { Injectable } from '@nestjs/common';
import { PagesService } from '../../entities';
@Injectable()
export class PageService {
  constructor(private readonly pagesService: PagesService) {}
}
