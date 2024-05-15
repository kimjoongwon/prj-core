import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { PrismaService } from 'nestjs-prisma';

@Module({
  providers: [RolesService, PrismaService],
  exports: [RolesService],
})
export class RolesModule {}
