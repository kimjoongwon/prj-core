import { Module } from '@nestjs/common';
import { SessionsRoute } from '../routes/sessions.route';

@Module({
  providers: [SessionsRoute],
  exports: [SessionsRoute],
})
export class SessionsRouteModule {}
