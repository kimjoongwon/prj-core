import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ContextProvider } from '../provider/context.provider';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.cookies?.tenantId;
    const serviceId = req.cookies?.serviceId;
    const serviceName = req.cookies?.serviceName;

    if (tenantId) {
      ContextProvider.setTenantId(tenantId);
    }

    if (serviceId) {
      ContextProvider.setServiceId(serviceId);
    }

    if (serviceName) {
      ContextProvider.setServiceName(serviceName);
    }

    this.logger.log(`Logging HTTP request ${req.method} ${req.url} ${res.statusCode}`);
    next();
  }
}
