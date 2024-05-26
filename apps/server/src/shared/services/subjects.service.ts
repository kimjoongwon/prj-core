import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSubjects() {
    const prisma = this.prisma;
    async function getModelNames() {
      const modelNames = Object.keys(prisma).filter(
        (modelName) =>
          !(
            modelName.includes('$') ||
            modelName.includes('_') ||
            modelName.includes('prismaServiceOptions')
          ),
      );
      return modelNames;
    }

    const modelNames = await getModelNames();

    const createSubjectDtos = modelNames.map((modelName) => ({
      name: modelName,
    }));

    return this.prisma.subject.createMany({
      data: createSubjectDtos,
    });
  }
}
