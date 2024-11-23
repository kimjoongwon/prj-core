import { Injectable } from '@nestjs/common';
import { State } from '@shared/types';
import { LoginPage } from './login.page';
import { MainPage } from './main.page';

@Injectable()
export class PageService {
  getPages() {
    const pages = [LoginPage, MainPage];
    return pages;
  }
}
