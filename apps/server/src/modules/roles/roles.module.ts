import { Module } from '@nestjs/common';
import { RolesController } from '../../shared';

@Module({
  controllers: [RolesController],
})
export class RolesModule {}
