import { Module } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { PrismaService } from 'nestjs-prisma';

@Module({
  providers: [SpacesService, PrismaService],
  exports: [SpacesService],
})
export class SpacesModule {}
