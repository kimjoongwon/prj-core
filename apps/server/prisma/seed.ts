import { $Enums, PrismaClient } from '@prisma/client';
import { CreateGroupDto } from '@shared';
import { GroupNames } from '../src/shared/enum/group-names.enum';
import { hash } from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const createServices = async () => {
    return await Promise.all(
      [
        { name: $Enums.ServiceNames.user, label: '이용자', seq: 1 },
        { name: $Enums.ServiceNames.space, label: '공간', seq: 2 },
        { name: $Enums.ServiceNames.role, label: '역할', seq: 3 },
        { name: $Enums.ServiceNames.timeline, label: '타임라인', seq: 4 },
        { name: $Enums.ServiceNames.file, label: '파일', seq: 5 },
        { name: $Enums.ServiceNames.task, label: '타스크', seq: 6 },
        { name: $Enums.ServiceNames.program, label: '프로그램', seq: 7 },
      ].map(async (seedService: { name: $Enums.ServiceNames; label: string }) => {
        const service = await prisma.service.findUnique({ where: { name: seedService.name } });
        if (!service) {
          return prisma.service.create({ data: seedService });
        } else {
          return service;
        }
      }),
    );
  };

  await createServices();
  const hashedPassword = await hash('rkdmf12!@', 10);

  const superAdminUser = await prisma.user.upsert({
    where: {
      name: 'plate@gmail.com',
    },
    update: {},
    create: {
      name: 'plate@gmail.com',
      phone: '01073162347',
      password: hashedPassword,
      profiles: {
        create: {
          name: 'Plate',
          nickname: '플레이트',
        },
      },
      tenants: {
        create: {
          main: true,
          roles: {
            create: {
              name: 'SUPER_ADMIN',
            },
          },
          space: {
            create: {
              workspace: {
                create: {
                  name: '(주)플레이트',
                  label: '본점',
                  address: '서울시 강남구',
                  phone: '01073162347',
                  email: 'plate@gmail.com',
                  businessNo: '12345678902',
                  ground: {
                    create: {},
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  spaceGroupSeed.forEach(async (group) => {
    const existGroup = await prisma.group.findFirst({
      where: { name: group.name },
    });
    if (!existGroup) {
      await prisma.group.create({
        data: {
          service: { connect: { seq: 2 } },
          tenant: { connect: { seq: 1 } },
          name: group.name,
        },
      });
    }
  });
  console.log({ superAdminUser });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

const spaceGroupSeed: CreateGroupDto[] = [
  {
    name: GroupNames.TEAM_TRAINING.name,
    label: '',
    serviceId: '',
    tenantId: '',
  },
  {
    name: GroupNames.PERSONAL_TRAINNING.name,
    label: '',
    serviceId: '',
    tenantId: '',
  },
  {
    name: GroupNames.GROUND.name,
    label: '',
    serviceId: '',
    tenantId: '',
  },
  {
    name: GroupNames.PILATES.name,
    label: '',
    serviceId: '',
    tenantId: '',
  },
];
