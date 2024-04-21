import { Module } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { PrismaService } from 'nestjs-prisma';
import { SpacesController } from './spaces.controller';

@Module({
  controllers: [SpacesController],
  providers: [SpacesService, PrismaService],
  exports: [SpacesService],
})
export class SpacesModule {}
