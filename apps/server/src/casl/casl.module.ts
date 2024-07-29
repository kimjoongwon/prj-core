import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory/casl-ability.factory';
import { PrismaService } from 'nestjs-prisma';

@Module({
  providers: [PrismaService, CaslAbilityFactory],
})
export class CaslModule {}
