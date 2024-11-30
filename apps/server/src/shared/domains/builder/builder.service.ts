import { Injectable } from '@nestjs/common';
import { loginRoute } from './routes/login.route';
// import { mainPage } from './page/main.page';
// import { userServicePage } from './page/user-service.page';
// import { spaceServicePage } from './page/space-service.page';
// import { depotServicePage } from './page/depot-service.page';
// import { postServicePage } from './page/post-service.page';
import { AppBuilder } from '@shared/types';
// import { getCategoryPage } from './page/post-categories.page';

@Injectable()
export class BuilderService {
  getAppBuilder() {
    const appBuilder: AppBuilder = {
      name: 'ILLIT',
      routes: [
        loginRoute,
        // mainPage,
        // userServicePage,
        // spaceServicePage,
        // depotServicePage,
        // postServicePage,
        // getCategoryPage,
      ],
    };
    return appBuilder;
  }

  // getMainServiceRoutes() {
  //   const pages = this.getPages();
  //   const mainServicePages = pages
  //     .filter((page) => page.pathname.split('/').length === PAGE_INDEX.MAIN_SERVICE)
  //     .map((bottomTabPage) => ({
  //       name: bottomTabPage.name,
  //       pathname: bottomTabPage.pathname,
  //     }));
  //   return mainServicePages;
  // }

  // getServiceItemRoutes() {
  //   const serviceItemPages = this.getPages()
  //     .filter((page) => page.pathname.split('/')?.length === PAGE_INDEX.SERVICE_ITEM)
  //     .map((page) => ({
  //       name: page.name,
  //       pathname: page.pathname,
  //     }));

  //   return serviceItemPages;
  // }
}
