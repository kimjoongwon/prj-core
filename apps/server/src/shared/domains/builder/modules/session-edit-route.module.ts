import { Module } from '@nestjs/common';
import { SessionEditRoute } from '../routes/session-edit.route';

@Module({
  providers: [SessionEditRoute],
  exports: [SessionEditRoute],
})
export class SessionEditRouteModule {}
