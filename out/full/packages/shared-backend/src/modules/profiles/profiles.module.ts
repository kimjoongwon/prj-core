import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { PrismaService } from 'nestjs-prisma';

@Module({
  providers: [ProfilesService, PrismaService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
