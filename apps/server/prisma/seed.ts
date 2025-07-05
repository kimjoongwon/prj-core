import { $Enums, PrismaClient, CreateGroupDto, GroupNames } from '@shared/schema';
import { hash } from 'bcrypt';
import { userSeedData, groundSeedData, userGroundMapping } from './seed-data';
const prisma = new PrismaClient();
async function main() {

  // 먼저 Role들을 생성
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: { name: 'SUPER_ADMIN' },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: { name: 'USER' },
  });

  // 패스워드 해싱
  const hashedPassword = await hash('1234', 10);

  // Super Admin 유저 생성
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
    },
  });

  // Space 생성
  const superAdminSpace = await prisma.space.create({
    data: {
      tenants: {
        create: {
          main: true,
          userId: superAdminUser.id,
          roleId: superAdminRole.id,
        },
      },
    },
  });

  // 워크스페이스 생성
  const ground = await prisma.ground.create({
    data: {
      name: '(주)플레이트',
      label: '본점',
      address: '서울시 강남구',
      phone: '01073162347',
      email: 'plate@gmail.com',
      businessNo: '12345678902',
      spaceId: superAdminSpace.id,
    },
  });

  // Ground 생성 (임시로 주석 처리)
  // await prisma.ground.create({
  //   data: {
  //     name: '플레이트 본점',
  //     label: '메인 지점',
  //     address: '서울시 강남구',
  //     phone: '01073162347',
  //     email: 'plate@gmail.com',
  //     businessNo: '12345678901', // 다른 번호
  //     spaceId: ground.spaceId,
  //   },
  // });

  spaceGroupSeed.forEach(async (group) => {
    const existGroup = await prisma.group.findFirst({
      where: { name: group.name },
    });
    if (!existGroup) {
      await prisma.group.create({
        data: {
          tenant: { connect: { seq: 1 } },
          name: group.name,
          type: $Enums.GroupTypes.Space,
        },
      });
    }
  });

  // 일반 유저들과 그라운드 생성
  await createRegularUsersAndGrounds(adminRole, userRole);

  console.log({ superAdminUser });
}

async function createRegularUsersAndGrounds(adminRole: any, userRole: any) {
  console.log('일반 유저들과 그라운드 생성 시작...');

  // 각 그라운드 생성
  const createdGrounds: Array<{ ground: any; index: number; spaceId: string }> = [];
  for (let i = 0; i < groundSeedData.length; i++) {
    const groundData = groundSeedData[i];

    try {
      // 그라운드가 이미 존재하는지 확인
      const existingGround = await prisma.ground.findFirst({
        where: { businessNo: groundData.businessNo },
      });

      if (!existingGround) {
        // 먼저 Space 생성
        const space = await prisma.space.create({
          data: {},
        });

        // 그라운드 관리자 유저 생성
        const adminUser = await prisma.user.create({
          data: {
            name: groundData.email,
            phone: groundData.phone,
            password: await hash('admin123!@#', 10),
            profiles: {
              create: {
                name: `${groundData.name} 관리자`,
                nickname: `${groundData.name}관리자`,
              },
            },
          },
        });

        // Tenant 생성 (그라운드 관리자용)
        const tenant = await prisma.tenant.create({
          data: {
            main: true,
            userId: adminUser.id,
            spaceId: space.id,
            roleId: adminRole.id,
          },
        });

        // 그라운드 생성
        const ground = await prisma.ground.create({
          data: {
            name: groundData.name,
            label: groundData.label,
            address: groundData.address,
            phone: groundData.phone,
            email: groundData.email,
            businessNo: groundData.businessNo,
            spaceId: space.id,
          },
        });

        createdGrounds.push({
          ground,
          index: i,
          spaceId: space.id,
        });

        console.log(`그라운드 생성 완료: ${groundData.name}`);
      } else {
        console.log(`그라운드 이미 존재: ${groundData.name}`);
        createdGrounds.push({
          ground: existingGround,
          index: i,
          spaceId: existingGround.spaceId,
        });
      }
    } catch (error) {
      console.error(`그라운드 생성 실패 (${groundData.name}):`, error);
    }
  }

  // 일반 유저들 생성 및 그라운드에 할당
  for (let userIndex = 0; userIndex < userSeedData.length; userIndex++) {
    const userData = userSeedData[userIndex];
    const userMapping = userGroundMapping[userIndex];

    try {
      // 유저가 이미 존재하는지 확인
      const existingUser = await prisma.user.findFirst({
        where: { name: userData.email },
      });

      if (!existingUser) {
        const hashedPassword = await hash(userData.password, 10);

        // 유저가 소속될 그라운드들
        const userGrounds: Array<{ ground: any; index: number; spaceId: string }> = [];
        for (const groundIndex of userMapping.groundIndices) {
          const groundInfo = createdGrounds.find((g) => g.index === groundIndex);
          if (groundInfo) {
            userGrounds.push(groundInfo);
          }
        }

        if (userGrounds.length > 0) {
          // 유저 생성
          const user = await prisma.user.create({
            data: {
              name: userData.email,
              phone: userData.phone,
              password: hashedPassword,
              profiles: {
                create: {
                  name: userData.profile.name,
                  nickname: userData.profile.nickname,
                },
              },
            },
          });

          // 각 그라운드에 대한 Tenant 생성
          for (let i = 0; i < userGrounds.length; i++) {
            const groundInfo = userGrounds[i];
            const isMain = i === 0; // 첫 번째 그라운드를 메인으로 설정

            const tenant = await prisma.tenant.create({
              data: {
                main: isMain,
                userId: user.id,
                spaceId: groundInfo.spaceId,
                roleId: userRole.id, // 기존에 생성된 userRole 사용
              },
            });
          }

          console.log(
            `일반 유저 생성 완료: ${userData.email} (그라운드 ${userGrounds.length}개 소속)`,
          );
        }
      } else {
        console.log(`유저 이미 존재: ${userData.email}`);
      }
    } catch (error) {
      console.error(`일반 유저 생성 실패 (${userData.email}):`, error);
    }
  }

  console.log('일반 유저들과 그라운드 생성 완료!');
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

const spaceGroupSeed: Array<{ name: string; label: string; tenantId: string }> = [
  {
    name: GroupNames.TEAM_TRAINING.name,
    label: '',
    tenantId: '',
  },
  {
    name: GroupNames.PERSONAL_TRAINNING.name,
    label: '',
    tenantId: '',
  },
  {
    name: GroupNames.GROUND.name,
    label: '',
    tenantId: '',
  },
  {
    name: GroupNames.PILATES.name,
    label: '',
    tenantId: '',
  },
];
