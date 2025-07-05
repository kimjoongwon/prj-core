import { Module } from '@nestjs/common';
import { RolesController } from '@shared/backend';

@Module({
  controllers: [RolesController],
})
export class RolesModule {}
