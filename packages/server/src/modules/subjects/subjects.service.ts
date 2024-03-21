import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SubjectsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}
  onModuleInit() {
    throw new Error('Method not implemented.');
  }
}
