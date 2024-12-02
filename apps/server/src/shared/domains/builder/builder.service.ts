import { Injectable } from '@nestjs/common';
import { loginRoute } from './routes/login.route';
import { AppBuilder } from '@shared/types';
import { mainRoute } from './routes/main.route';
import { userServiceRoute } from './routes/user-service.route';
import { getCategoriesRoute } from './routes/categories.route';

@Injectable()
export class BuilderService {
  getRoutes() {
    return [loginRoute, mainRoute, userServiceRoute, getCategoriesRoute('user-service')];
  }

  getAppBuilder() {
    const appBuilder: AppBuilder = {
      name: 'ILLIT',
      routes: this.getRoutes(),
    };
    return appBuilder;
  }
}
