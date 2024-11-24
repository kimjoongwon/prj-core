import { Injectable } from '@nestjs/common';
import { loginPage } from './page/login.page';
import { mainPage } from './page/main.page';
import { userServicePage } from './page/user-service.page';
import { spaceServicePage } from './page/space-service.page';
import { depotServicePage } from './page/depot-service.page';
import { postServicePage } from './page/post-service.page';

@Injectable()
export class PageService {
  getPages() {
    const pages = [
      loginPage,
      mainPage,
      userServicePage,
      spaceServicePage,
      depotServicePage,
      postServicePage,
    ];
    return pages;
  }

  getMainServicePages() {
    const pages = this.getPages();
    const mainServicePages = pages
      .filter((page) => page.main)
      .map((bottomTabPage) => ({
        name: bottomTabPage.name,
        pathname: bottomTabPage.pathname,
      }));
    return mainServicePages;
  }
}
