// import { Tenancy } from '@prisma/client';
// import { ClassField, UUIDField } from '../decorators';
// import {
//   AbstractDto,
//   SpaceDto,
//   GroupDto,
//   CategoryDto,
//   ClassificationDto,
//   AssociationDto,
//   UserDto,
// } from '.';
// export class TenancyDto extends AbstractDto implements Tenancy {
//   @UUIDField()
//   spaceId: string;

//   @ClassField(() => SpaceDto, { nullable: true })
//   space?: SpaceDto | null;

//   @ClassField(() => GroupDto, { nullable: true, each: true })
//   groups?: GroupDto[];

//   @ClassField(() => CategoryDto, { nullable: true, each: true })
//   categories?: CategoryDto[];

//   @ClassField(() => ClassificationDto, { nullable: true, each: true })
//   classifications?: ClassificationDto[];

//   @ClassField(() => AssociationDto, { nullable: true, each: true })
//   associations?: AssociationDto[];

//   @ClassField(() => UserDto, { nullable: true, each: true })
//   users?: UserDto[];
// }
