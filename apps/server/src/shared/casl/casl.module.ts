import { Global, Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory/casl-ability.factory';
import { PrismaService } from 'nestjs-prisma';

@Global()
@Module({
  providers: [PrismaService, CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
