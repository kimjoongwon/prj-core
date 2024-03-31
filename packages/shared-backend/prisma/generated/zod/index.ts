import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','name','phone','password','deletedAt','updatedAt','createdAt']);

export const ProfileScalarFieldEnumSchema = z.enum(['id','nickname','userId','createdAt','updatedAt','deletedAt']);

export const CategoryScalarFieldEnumSchema = z.enum(['id','name','serviceId','spaceId','ancestorIds','parentId','createdAt','updatedAt','deletedAt']);

export const GroupScalarFieldEnumSchema = z.enum(['id','name','serviceId','spaceId','createdAt','updatedAt','deletedAt']);

export const ServiceScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt','deletedAt']);

export const AssignmentScalarFieldEnumSchema = z.enum(['id','groupId','serviceId','serviceItemId','createdAt','updatedAt','deletedAt']);

export const RoleScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt','deletedAt']);

export const TenantScalarFieldEnumSchema = z.enum(['id','userId','spaceId','roleId','createdAt','updatedAt','deletedAt']);

export const ClassificationScalarFieldEnumSchema = z.enum(['id','serviceId','serviceItemId','categoryId','createdAt','updatedAt','deletedAt']);

export const SpaceScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt','deletedAt']);

export const EmailTemplateScalarFieldEnumSchema = z.enum(['id','name','subject','content','createdAt','updatedAt','deletedAt']);

export const SessionScalarFieldEnumSchema = z.enum(['id','name','tenantId','dates','createdAt','updatedAt','deletedAt']);

export const TimelineScalarFieldEnumSchema = z.enum(['id','name','sessionId','date','createdAt','updatedAt','deletedAt']);

export const TimelineItemScalarFieldEnumSchema = z.enum(['id','timelineId','sessionId','title','startDateTime','endDateTime','description','address','maxCapacity','minCapacity','createdAt','updatedAt','deletedAt']);

export const ReservationScalarFieldEnumSchema = z.enum(['id','status','timelineItemId','createdAt','updatedAt','deletedAt']);

export const SubjectScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt','deletedAt']);

export const AbilityScalarFieldEnumSchema = z.enum(['id','type','roleId','action','subjectId','createdAt','updatedAt','deletedAt']);

export const PageScalarFieldEnumSchema = z.enum(['id','name','pathname','subjectId','createdAt','updatedAt','deletedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const SERVICE_NAMESchema = z.enum(['userService','settingService']);

export type SERVICE_NAMEType = `${z.infer<typeof SERVICE_NAMESchema>}`

export const SubjectConditionsSchema = z.enum(['Equal','GreaterThan','GreaterThanOrEqual','LessThan','LessThanOrEqual','In']);

export type SubjectConditionsType = `${z.infer<typeof SubjectConditionsSchema>}`

export const AbilityActionsSchema = z.enum(['CREATE','READ','UPDATE','DELETE','ACCESS']);

export type AbilityActionsType = `${z.infer<typeof AbilityActionsSchema>}`

export const AbilityTypesSchema = z.enum(['CAN','CAN_NOT']);

export type AbilityTypesType = `${z.infer<typeof AbilityTypesSchema>}`

export const EmailTemplatesSchema = z.enum(['REGISTER','FORGET_PASSWORD']);

export type EmailTemplatesType = `${z.infer<typeof EmailTemplatesSchema>}`

export const RolesSchema = z.enum(['USER','SUPER_ADMIN']);

export type RolesType = `${z.infer<typeof RolesSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string(),
  name: z.string(),
  phone: z.string(),
  password: z.string(),
  deletedAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// PROFILE SCHEMA
/////////////////////////////////////////

export const ProfileSchema = z.object({
  id: z.string().cuid(),
  nickname: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type Profile = z.infer<typeof ProfileSchema>

/////////////////////////////////////////
// CATEGORY SCHEMA
/////////////////////////////////////////

export const CategorySchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  serviceId: z.string(),
  spaceId: z.string(),
  ancestorIds: z.string().array(),
  parentId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type Category = z.infer<typeof CategorySchema>

/////////////////////////////////////////
// GROUP SCHEMA
/////////////////////////////////////////

export const GroupSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  serviceId: z.string(),
  spaceId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type Group = z.infer<typeof GroupSchema>

/////////////////////////////////////////
// SERVICE SCHEMA
/////////////////////////////////////////

export const ServiceSchema = z.object({
  name: SERVICE_NAMESchema,
  id: z.string().cuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type Service = z.infer<typeof ServiceSchema>

/////////////////////////////////////////
// ASSIGNMENT SCHEMA
/////////////////////////////////////////

export const AssignmentSchema = z.object({
  id: z.string().cuid(),
  groupId: z.string(),
  serviceId: z.string(),
  serviceItemId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type Assignment = z.infer<typeof AssignmentSchema>

/////////////////////////////////////////
// ROLE SCHEMA
/////////////////////////////////////////

export const RoleSchema = z.object({
  name: RolesSchema,
  id: z.string().cuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type Role = z.infer<typeof RoleSchema>

/////////////////////////////////////////
// TENANT SCHEMA
/////////////////////////////////////////

export const TenantSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  spaceId: z.string(),
  roleId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type Tenant = z.infer<typeof TenantSchema>

/////////////////////////////////////////
// CLASSIFICATION SCHEMA
/////////////////////////////////////////

export const ClassificationSchema = z.object({
  id: z.string().cuid(),
  serviceId: z.string(),
  serviceItemId: z.string(),
  categoryId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type Classification = z.infer<typeof ClassificationSchema>

/////////////////////////////////////////
// SPACE SCHEMA
/////////////////////////////////////////

export const SpaceSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type Space = z.infer<typeof SpaceSchema>

/////////////////////////////////////////
// EMAIL TEMPLATE SCHEMA
/////////////////////////////////////////

export const EmailTemplateSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  subject: z.string(),
  content: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type EmailTemplate = z.infer<typeof EmailTemplateSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  tenantId: z.string(),
  dates: z.coerce.date().array(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// TIMELINE SCHEMA
/////////////////////////////////////////

export const TimelineSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  sessionId: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type Timeline = z.infer<typeof TimelineSchema>

/////////////////////////////////////////
// TIMELINE ITEM SCHEMA
/////////////////////////////////////////

export const TimelineItemSchema = z.object({
  id: z.string().cuid(),
  timelineId: z.string().nullable(),
  sessionId: z.string(),
  title: z.string(),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  description: z.string(),
  address: z.string().nullable(),
  maxCapacity: z.number().int(),
  minCapacity: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type TimelineItem = z.infer<typeof TimelineItemSchema>

/////////////////////////////////////////
// RESERVATION SCHEMA
/////////////////////////////////////////

export const ReservationSchema = z.object({
  id: z.string().cuid(),
  status: z.string(),
  timelineItemId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type Reservation = z.infer<typeof ReservationSchema>

/////////////////////////////////////////
// SUBJECT SCHEMA
/////////////////////////////////////////

export const SubjectSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type Subject = z.infer<typeof SubjectSchema>

/////////////////////////////////////////
// ABILITY SCHEMA
/////////////////////////////////////////

export const AbilitySchema = z.object({
  type: AbilityTypesSchema,
  action: AbilityActionsSchema,
  id: z.string().cuid(),
  roleId: z.string(),
  subjectId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type Ability = z.infer<typeof AbilitySchema>

/////////////////////////////////////////
// PAGE SCHEMA
/////////////////////////////////////////

export const PageSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  pathname: z.string(),
  subjectId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),
})

export type Page = z.infer<typeof PageSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  profiles: z.union([z.boolean(),z.lazy(() => ProfileFindManyArgsSchema)]).optional(),
  tenants: z.union([z.boolean(),z.lazy(() => TenantFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  profiles: z.boolean().optional(),
  tenants: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  name: z.boolean().optional(),
  phone: z.boolean().optional(),
  password: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  profiles: z.union([z.boolean(),z.lazy(() => ProfileFindManyArgsSchema)]).optional(),
  tenants: z.union([z.boolean(),z.lazy(() => TenantFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PROFILE
//------------------------------------------------------

export const ProfileIncludeSchema: z.ZodType<Prisma.ProfileInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const ProfileArgsSchema: z.ZodType<Prisma.ProfileDefaultArgs> = z.object({
  select: z.lazy(() => ProfileSelectSchema).optional(),
  include: z.lazy(() => ProfileIncludeSchema).optional(),
}).strict();

export const ProfileSelectSchema: z.ZodType<Prisma.ProfileSelect> = z.object({
  id: z.boolean().optional(),
  nickname: z.boolean().optional(),
  userId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// CATEGORY
//------------------------------------------------------

export const CategoryIncludeSchema: z.ZodType<Prisma.CategoryInclude> = z.object({
  space: z.union([z.boolean(),z.lazy(() => SpaceArgsSchema)]).optional(),
  classifications: z.union([z.boolean(),z.lazy(() => ClassificationFindManyArgsSchema)]).optional(),
  service: z.union([z.boolean(),z.lazy(() => ServiceArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CategoryArgsSchema: z.ZodType<Prisma.CategoryDefaultArgs> = z.object({
  select: z.lazy(() => CategorySelectSchema).optional(),
  include: z.lazy(() => CategoryIncludeSchema).optional(),
}).strict();

export const CategoryCountOutputTypeArgsSchema: z.ZodType<Prisma.CategoryCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CategoryCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CategoryCountOutputTypeSelectSchema: z.ZodType<Prisma.CategoryCountOutputTypeSelect> = z.object({
  classifications: z.boolean().optional(),
}).strict();

export const CategorySelectSchema: z.ZodType<Prisma.CategorySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  serviceId: z.boolean().optional(),
  spaceId: z.boolean().optional(),
  ancestorIds: z.boolean().optional(),
  parentId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  space: z.union([z.boolean(),z.lazy(() => SpaceArgsSchema)]).optional(),
  classifications: z.union([z.boolean(),z.lazy(() => ClassificationFindManyArgsSchema)]).optional(),
  service: z.union([z.boolean(),z.lazy(() => ServiceArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict()

// GROUP
//------------------------------------------------------

export const GroupIncludeSchema: z.ZodType<Prisma.GroupInclude> = z.object({
  space: z.union([z.boolean(),z.lazy(() => SpaceArgsSchema)]).optional(),
  assignments: z.union([z.boolean(),z.lazy(() => AssignmentFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => GroupCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const GroupArgsSchema: z.ZodType<Prisma.GroupDefaultArgs> = z.object({
  select: z.lazy(() => GroupSelectSchema).optional(),
  include: z.lazy(() => GroupIncludeSchema).optional(),
}).strict();

export const GroupCountOutputTypeArgsSchema: z.ZodType<Prisma.GroupCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => GroupCountOutputTypeSelectSchema).nullish(),
}).strict();

export const GroupCountOutputTypeSelectSchema: z.ZodType<Prisma.GroupCountOutputTypeSelect> = z.object({
  assignments: z.boolean().optional(),
}).strict();

export const GroupSelectSchema: z.ZodType<Prisma.GroupSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  serviceId: z.boolean().optional(),
  spaceId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  space: z.union([z.boolean(),z.lazy(() => SpaceArgsSchema)]).optional(),
  assignments: z.union([z.boolean(),z.lazy(() => AssignmentFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => GroupCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SERVICE
//------------------------------------------------------

export const ServiceIncludeSchema: z.ZodType<Prisma.ServiceInclude> = z.object({
  classifications: z.union([z.boolean(),z.lazy(() => ClassificationFindManyArgsSchema)]).optional(),
  assignments: z.union([z.boolean(),z.lazy(() => AssignmentFindManyArgsSchema)]).optional(),
  categories: z.union([z.boolean(),z.lazy(() => CategoryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ServiceCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ServiceArgsSchema: z.ZodType<Prisma.ServiceDefaultArgs> = z.object({
  select: z.lazy(() => ServiceSelectSchema).optional(),
  include: z.lazy(() => ServiceIncludeSchema).optional(),
}).strict();

export const ServiceCountOutputTypeArgsSchema: z.ZodType<Prisma.ServiceCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ServiceCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ServiceCountOutputTypeSelectSchema: z.ZodType<Prisma.ServiceCountOutputTypeSelect> = z.object({
  classifications: z.boolean().optional(),
  assignments: z.boolean().optional(),
  categories: z.boolean().optional(),
}).strict();

export const ServiceSelectSchema: z.ZodType<Prisma.ServiceSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  classifications: z.union([z.boolean(),z.lazy(() => ClassificationFindManyArgsSchema)]).optional(),
  assignments: z.union([z.boolean(),z.lazy(() => AssignmentFindManyArgsSchema)]).optional(),
  categories: z.union([z.boolean(),z.lazy(() => CategoryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ServiceCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ASSIGNMENT
//------------------------------------------------------

export const AssignmentIncludeSchema: z.ZodType<Prisma.AssignmentInclude> = z.object({
  group: z.union([z.boolean(),z.lazy(() => GroupArgsSchema)]).optional(),
  service: z.union([z.boolean(),z.lazy(() => ServiceArgsSchema)]).optional(),
}).strict()

export const AssignmentArgsSchema: z.ZodType<Prisma.AssignmentDefaultArgs> = z.object({
  select: z.lazy(() => AssignmentSelectSchema).optional(),
  include: z.lazy(() => AssignmentIncludeSchema).optional(),
}).strict();

export const AssignmentSelectSchema: z.ZodType<Prisma.AssignmentSelect> = z.object({
  id: z.boolean().optional(),
  groupId: z.boolean().optional(),
  serviceId: z.boolean().optional(),
  serviceItemId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  group: z.union([z.boolean(),z.lazy(() => GroupArgsSchema)]).optional(),
  service: z.union([z.boolean(),z.lazy(() => ServiceArgsSchema)]).optional(),
}).strict()

// ROLE
//------------------------------------------------------

export const RoleIncludeSchema: z.ZodType<Prisma.RoleInclude> = z.object({
  tenants: z.union([z.boolean(),z.lazy(() => TenantFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RoleCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const RoleArgsSchema: z.ZodType<Prisma.RoleDefaultArgs> = z.object({
  select: z.lazy(() => RoleSelectSchema).optional(),
  include: z.lazy(() => RoleIncludeSchema).optional(),
}).strict();

export const RoleCountOutputTypeArgsSchema: z.ZodType<Prisma.RoleCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => RoleCountOutputTypeSelectSchema).nullish(),
}).strict();

export const RoleCountOutputTypeSelectSchema: z.ZodType<Prisma.RoleCountOutputTypeSelect> = z.object({
  tenants: z.boolean().optional(),
}).strict();

export const RoleSelectSchema: z.ZodType<Prisma.RoleSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  tenants: z.union([z.boolean(),z.lazy(() => TenantFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RoleCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TENANT
//------------------------------------------------------

export const TenantIncludeSchema: z.ZodType<Prisma.TenantInclude> = z.object({
  role: z.union([z.boolean(),z.lazy(() => RoleArgsSchema)]).optional(),
  space: z.union([z.boolean(),z.lazy(() => SpaceArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const TenantArgsSchema: z.ZodType<Prisma.TenantDefaultArgs> = z.object({
  select: z.lazy(() => TenantSelectSchema).optional(),
  include: z.lazy(() => TenantIncludeSchema).optional(),
}).strict();

export const TenantSelectSchema: z.ZodType<Prisma.TenantSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  spaceId: z.boolean().optional(),
  roleId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  role: z.union([z.boolean(),z.lazy(() => RoleArgsSchema)]).optional(),
  space: z.union([z.boolean(),z.lazy(() => SpaceArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// CLASSIFICATION
//------------------------------------------------------

export const ClassificationIncludeSchema: z.ZodType<Prisma.ClassificationInclude> = z.object({
  service: z.union([z.boolean(),z.lazy(() => ServiceArgsSchema)]).optional(),
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
}).strict()

export const ClassificationArgsSchema: z.ZodType<Prisma.ClassificationDefaultArgs> = z.object({
  select: z.lazy(() => ClassificationSelectSchema).optional(),
  include: z.lazy(() => ClassificationIncludeSchema).optional(),
}).strict();

export const ClassificationSelectSchema: z.ZodType<Prisma.ClassificationSelect> = z.object({
  id: z.boolean().optional(),
  serviceId: z.boolean().optional(),
  serviceItemId: z.boolean().optional(),
  categoryId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  service: z.union([z.boolean(),z.lazy(() => ServiceArgsSchema)]).optional(),
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
}).strict()

// SPACE
//------------------------------------------------------

export const SpaceIncludeSchema: z.ZodType<Prisma.SpaceInclude> = z.object({
  tenants: z.union([z.boolean(),z.lazy(() => TenantFindManyArgsSchema)]).optional(),
  categories: z.union([z.boolean(),z.lazy(() => CategoryFindManyArgsSchema)]).optional(),
  groups: z.union([z.boolean(),z.lazy(() => GroupFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SpaceCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const SpaceArgsSchema: z.ZodType<Prisma.SpaceDefaultArgs> = z.object({
  select: z.lazy(() => SpaceSelectSchema).optional(),
  include: z.lazy(() => SpaceIncludeSchema).optional(),
}).strict();

export const SpaceCountOutputTypeArgsSchema: z.ZodType<Prisma.SpaceCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => SpaceCountOutputTypeSelectSchema).nullish(),
}).strict();

export const SpaceCountOutputTypeSelectSchema: z.ZodType<Prisma.SpaceCountOutputTypeSelect> = z.object({
  tenants: z.boolean().optional(),
  categories: z.boolean().optional(),
  groups: z.boolean().optional(),
}).strict();

export const SpaceSelectSchema: z.ZodType<Prisma.SpaceSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  tenants: z.union([z.boolean(),z.lazy(() => TenantFindManyArgsSchema)]).optional(),
  categories: z.union([z.boolean(),z.lazy(() => CategoryFindManyArgsSchema)]).optional(),
  groups: z.union([z.boolean(),z.lazy(() => GroupFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SpaceCountOutputTypeArgsSchema)]).optional(),
}).strict()

// EMAIL TEMPLATE
//------------------------------------------------------

export const EmailTemplateSelectSchema: z.ZodType<Prisma.EmailTemplateSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  subject: z.boolean().optional(),
  content: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
}).strict()

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z.object({
  timelines: z.union([z.boolean(),z.lazy(() => TimelineFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SessionCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z.object({
  select: z.lazy(() => SessionSelectSchema).optional(),
  include: z.lazy(() => SessionIncludeSchema).optional(),
}).strict();

export const SessionCountOutputTypeArgsSchema: z.ZodType<Prisma.SessionCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => SessionCountOutputTypeSelectSchema).nullish(),
}).strict();

export const SessionCountOutputTypeSelectSchema: z.ZodType<Prisma.SessionCountOutputTypeSelect> = z.object({
  timelines: z.boolean().optional(),
}).strict();

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  tenantId: z.boolean().optional(),
  dates: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  timelines: z.union([z.boolean(),z.lazy(() => TimelineFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SessionCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TIMELINE
//------------------------------------------------------

export const TimelineIncludeSchema: z.ZodType<Prisma.TimelineInclude> = z.object({
  session: z.union([z.boolean(),z.lazy(() => SessionArgsSchema)]).optional(),
  timelineItems: z.union([z.boolean(),z.lazy(() => TimelineItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TimelineCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TimelineArgsSchema: z.ZodType<Prisma.TimelineDefaultArgs> = z.object({
  select: z.lazy(() => TimelineSelectSchema).optional(),
  include: z.lazy(() => TimelineIncludeSchema).optional(),
}).strict();

export const TimelineCountOutputTypeArgsSchema: z.ZodType<Prisma.TimelineCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TimelineCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TimelineCountOutputTypeSelectSchema: z.ZodType<Prisma.TimelineCountOutputTypeSelect> = z.object({
  timelineItems: z.boolean().optional(),
}).strict();

export const TimelineSelectSchema: z.ZodType<Prisma.TimelineSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  sessionId: z.boolean().optional(),
  date: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  session: z.union([z.boolean(),z.lazy(() => SessionArgsSchema)]).optional(),
  timelineItems: z.union([z.boolean(),z.lazy(() => TimelineItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TimelineCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TIMELINE ITEM
//------------------------------------------------------

export const TimelineItemIncludeSchema: z.ZodType<Prisma.TimelineItemInclude> = z.object({
  reservations: z.union([z.boolean(),z.lazy(() => ReservationFindManyArgsSchema)]).optional(),
  timeline: z.union([z.boolean(),z.lazy(() => TimelineArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TimelineItemCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TimelineItemArgsSchema: z.ZodType<Prisma.TimelineItemDefaultArgs> = z.object({
  select: z.lazy(() => TimelineItemSelectSchema).optional(),
  include: z.lazy(() => TimelineItemIncludeSchema).optional(),
}).strict();

export const TimelineItemCountOutputTypeArgsSchema: z.ZodType<Prisma.TimelineItemCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TimelineItemCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TimelineItemCountOutputTypeSelectSchema: z.ZodType<Prisma.TimelineItemCountOutputTypeSelect> = z.object({
  reservations: z.boolean().optional(),
}).strict();

export const TimelineItemSelectSchema: z.ZodType<Prisma.TimelineItemSelect> = z.object({
  id: z.boolean().optional(),
  timelineId: z.boolean().optional(),
  sessionId: z.boolean().optional(),
  title: z.boolean().optional(),
  startDateTime: z.boolean().optional(),
  endDateTime: z.boolean().optional(),
  description: z.boolean().optional(),
  address: z.boolean().optional(),
  maxCapacity: z.boolean().optional(),
  minCapacity: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  reservations: z.union([z.boolean(),z.lazy(() => ReservationFindManyArgsSchema)]).optional(),
  timeline: z.union([z.boolean(),z.lazy(() => TimelineArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TimelineItemCountOutputTypeArgsSchema)]).optional(),
}).strict()

// RESERVATION
//------------------------------------------------------

export const ReservationIncludeSchema: z.ZodType<Prisma.ReservationInclude> = z.object({
  timelineItem: z.union([z.boolean(),z.lazy(() => TimelineItemArgsSchema)]).optional(),
}).strict()

export const ReservationArgsSchema: z.ZodType<Prisma.ReservationDefaultArgs> = z.object({
  select: z.lazy(() => ReservationSelectSchema).optional(),
  include: z.lazy(() => ReservationIncludeSchema).optional(),
}).strict();

export const ReservationSelectSchema: z.ZodType<Prisma.ReservationSelect> = z.object({
  id: z.boolean().optional(),
  status: z.boolean().optional(),
  timelineItemId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  timelineItem: z.union([z.boolean(),z.lazy(() => TimelineItemArgsSchema)]).optional(),
}).strict()

// SUBJECT
//------------------------------------------------------

export const SubjectIncludeSchema: z.ZodType<Prisma.SubjectInclude> = z.object({
  abilities: z.union([z.boolean(),z.lazy(() => AbilityFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SubjectCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const SubjectArgsSchema: z.ZodType<Prisma.SubjectDefaultArgs> = z.object({
  select: z.lazy(() => SubjectSelectSchema).optional(),
  include: z.lazy(() => SubjectIncludeSchema).optional(),
}).strict();

export const SubjectCountOutputTypeArgsSchema: z.ZodType<Prisma.SubjectCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => SubjectCountOutputTypeSelectSchema).nullish(),
}).strict();

export const SubjectCountOutputTypeSelectSchema: z.ZodType<Prisma.SubjectCountOutputTypeSelect> = z.object({
  abilities: z.boolean().optional(),
}).strict();

export const SubjectSelectSchema: z.ZodType<Prisma.SubjectSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  abilities: z.union([z.boolean(),z.lazy(() => AbilityFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SubjectCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ABILITY
//------------------------------------------------------

export const AbilityIncludeSchema: z.ZodType<Prisma.AbilityInclude> = z.object({
  subject: z.union([z.boolean(),z.lazy(() => SubjectArgsSchema)]).optional(),
}).strict()

export const AbilityArgsSchema: z.ZodType<Prisma.AbilityDefaultArgs> = z.object({
  select: z.lazy(() => AbilitySelectSchema).optional(),
  include: z.lazy(() => AbilityIncludeSchema).optional(),
}).strict();

export const AbilitySelectSchema: z.ZodType<Prisma.AbilitySelect> = z.object({
  id: z.boolean().optional(),
  type: z.boolean().optional(),
  roleId: z.boolean().optional(),
  action: z.boolean().optional(),
  subjectId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  subject: z.union([z.boolean(),z.lazy(() => SubjectArgsSchema)]).optional(),
}).strict()

// PAGE
//------------------------------------------------------

export const PageSelectSchema: z.ZodType<Prisma.PageSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  pathname: z.boolean().optional(),
  subjectId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  profiles: z.lazy(() => ProfileListRelationFilterSchema).optional(),
  tenants: z.lazy(() => TenantListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  profiles: z.lazy(() => ProfileOrderByRelationAggregateInputSchema).optional(),
  tenants: z.lazy(() => TenantOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    email: z.string(),
    name: z.string(),
    phone: z.string()
  }),
  z.object({
    id: z.string().cuid(),
    email: z.string(),
    name: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    email: z.string(),
    phone: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    email: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    name: z.string(),
    phone: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    name: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    phone: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    email: z.string(),
    name: z.string(),
    phone: z.string(),
  }),
  z.object({
    email: z.string(),
    name: z.string(),
  }),
  z.object({
    email: z.string(),
    phone: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
  z.object({
    name: z.string(),
    phone: z.string(),
  }),
  z.object({
    name: z.string(),
  }),
  z.object({
    phone: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  email: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  profiles: z.lazy(() => ProfileListRelationFilterSchema).optional(),
  tenants: z.lazy(() => TenantListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProfileWhereInputSchema: z.ZodType<Prisma.ProfileWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProfileWhereInputSchema),z.lazy(() => ProfileWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProfileWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProfileWhereInputSchema),z.lazy(() => ProfileWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  nickname: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const ProfileOrderByWithRelationInputSchema: z.ZodType<Prisma.ProfileOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  nickname: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const ProfileWhereUniqueInputSchema: z.ZodType<Prisma.ProfileWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => ProfileWhereInputSchema),z.lazy(() => ProfileWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProfileWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProfileWhereInputSchema),z.lazy(() => ProfileWhereInputSchema).array() ]).optional(),
  nickname: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const ProfileOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProfileOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  nickname: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ProfileCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProfileMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProfileMinOrderByAggregateInputSchema).optional()
}).strict();

export const ProfileScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProfileScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema),z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema),z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  nickname: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const CategoryWhereInputSchema: z.ZodType<Prisma.CategoryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  spaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ancestorIds: z.lazy(() => StringNullableListFilterSchema).optional(),
  parentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  space: z.union([ z.lazy(() => SpaceRelationFilterSchema),z.lazy(() => SpaceWhereInputSchema) ]).optional(),
  classifications: z.lazy(() => ClassificationListRelationFilterSchema).optional(),
  service: z.union([ z.lazy(() => ServiceRelationFilterSchema),z.lazy(() => ServiceWhereInputSchema) ]).optional(),
}).strict();

export const CategoryOrderByWithRelationInputSchema: z.ZodType<Prisma.CategoryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  ancestorIds: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  space: z.lazy(() => SpaceOrderByWithRelationInputSchema).optional(),
  classifications: z.lazy(() => ClassificationOrderByRelationAggregateInputSchema).optional(),
  service: z.lazy(() => ServiceOrderByWithRelationInputSchema).optional()
}).strict();

export const CategoryWhereUniqueInputSchema: z.ZodType<Prisma.CategoryWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    name: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    name: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional(),
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  spaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ancestorIds: z.lazy(() => StringNullableListFilterSchema).optional(),
  parentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  space: z.union([ z.lazy(() => SpaceRelationFilterSchema),z.lazy(() => SpaceWhereInputSchema) ]).optional(),
  classifications: z.lazy(() => ClassificationListRelationFilterSchema).optional(),
  service: z.union([ z.lazy(() => ServiceRelationFilterSchema),z.lazy(() => ServiceWhereInputSchema) ]).optional(),
}).strict());

export const CategoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.CategoryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  ancestorIds: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => CategoryCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CategoryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CategoryMinOrderByAggregateInputSchema).optional()
}).strict();

export const CategoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CategoryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema),z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema),z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  spaceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ancestorIds: z.lazy(() => StringNullableListFilterSchema).optional(),
  parentId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const GroupWhereInputSchema: z.ZodType<Prisma.GroupWhereInput> = z.object({
  AND: z.union([ z.lazy(() => GroupWhereInputSchema),z.lazy(() => GroupWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GroupWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GroupWhereInputSchema),z.lazy(() => GroupWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  spaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  space: z.union([ z.lazy(() => SpaceRelationFilterSchema),z.lazy(() => SpaceWhereInputSchema) ]).optional(),
  assignments: z.lazy(() => AssignmentListRelationFilterSchema).optional()
}).strict();

export const GroupOrderByWithRelationInputSchema: z.ZodType<Prisma.GroupOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  space: z.lazy(() => SpaceOrderByWithRelationInputSchema).optional(),
  assignments: z.lazy(() => AssignmentOrderByRelationAggregateInputSchema).optional()
}).strict();

export const GroupWhereUniqueInputSchema: z.ZodType<Prisma.GroupWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => GroupWhereInputSchema),z.lazy(() => GroupWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GroupWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GroupWhereInputSchema),z.lazy(() => GroupWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  spaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  space: z.union([ z.lazy(() => SpaceRelationFilterSchema),z.lazy(() => SpaceWhereInputSchema) ]).optional(),
  assignments: z.lazy(() => AssignmentListRelationFilterSchema).optional()
}).strict());

export const GroupOrderByWithAggregationInputSchema: z.ZodType<Prisma.GroupOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => GroupCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => GroupMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => GroupMinOrderByAggregateInputSchema).optional()
}).strict();

export const GroupScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.GroupScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => GroupScalarWhereWithAggregatesInputSchema),z.lazy(() => GroupScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => GroupScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GroupScalarWhereWithAggregatesInputSchema),z.lazy(() => GroupScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  spaceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ServiceWhereInputSchema: z.ZodType<Prisma.ServiceWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ServiceWhereInputSchema),z.lazy(() => ServiceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceWhereInputSchema),z.lazy(() => ServiceWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => EnumSERVICE_NAMEFilterSchema),z.lazy(() => SERVICE_NAMESchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  classifications: z.lazy(() => ClassificationListRelationFilterSchema).optional(),
  assignments: z.lazy(() => AssignmentListRelationFilterSchema).optional(),
  categories: z.lazy(() => CategoryListRelationFilterSchema).optional()
}).strict();

export const ServiceOrderByWithRelationInputSchema: z.ZodType<Prisma.ServiceOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  classifications: z.lazy(() => ClassificationOrderByRelationAggregateInputSchema).optional(),
  assignments: z.lazy(() => AssignmentOrderByRelationAggregateInputSchema).optional(),
  categories: z.lazy(() => CategoryOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ServiceWhereUniqueInputSchema: z.ZodType<Prisma.ServiceWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    name: z.lazy(() => SERVICE_NAMESchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    name: z.lazy(() => SERVICE_NAMESchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => SERVICE_NAMESchema).optional(),
  AND: z.union([ z.lazy(() => ServiceWhereInputSchema),z.lazy(() => ServiceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceWhereInputSchema),z.lazy(() => ServiceWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  classifications: z.lazy(() => ClassificationListRelationFilterSchema).optional(),
  assignments: z.lazy(() => AssignmentListRelationFilterSchema).optional(),
  categories: z.lazy(() => CategoryListRelationFilterSchema).optional()
}).strict());

export const ServiceOrderByWithAggregationInputSchema: z.ZodType<Prisma.ServiceOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ServiceCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ServiceMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ServiceMinOrderByAggregateInputSchema).optional()
}).strict();

export const ServiceScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ServiceScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ServiceScalarWhereWithAggregatesInputSchema),z.lazy(() => ServiceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceScalarWhereWithAggregatesInputSchema),z.lazy(() => ServiceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => EnumSERVICE_NAMEWithAggregatesFilterSchema),z.lazy(() => SERVICE_NAMESchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const AssignmentWhereInputSchema: z.ZodType<Prisma.AssignmentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AssignmentWhereInputSchema),z.lazy(() => AssignmentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AssignmentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AssignmentWhereInputSchema),z.lazy(() => AssignmentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  groupId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  serviceItemId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  group: z.union([ z.lazy(() => GroupRelationFilterSchema),z.lazy(() => GroupWhereInputSchema) ]).optional(),
  service: z.union([ z.lazy(() => ServiceRelationFilterSchema),z.lazy(() => ServiceWhereInputSchema) ]).optional(),
}).strict();

export const AssignmentOrderByWithRelationInputSchema: z.ZodType<Prisma.AssignmentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  groupId: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  serviceItemId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  group: z.lazy(() => GroupOrderByWithRelationInputSchema).optional(),
  service: z.lazy(() => ServiceOrderByWithRelationInputSchema).optional()
}).strict();

export const AssignmentWhereUniqueInputSchema: z.ZodType<Prisma.AssignmentWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => AssignmentWhereInputSchema),z.lazy(() => AssignmentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AssignmentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AssignmentWhereInputSchema),z.lazy(() => AssignmentWhereInputSchema).array() ]).optional(),
  groupId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  serviceItemId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  group: z.union([ z.lazy(() => GroupRelationFilterSchema),z.lazy(() => GroupWhereInputSchema) ]).optional(),
  service: z.union([ z.lazy(() => ServiceRelationFilterSchema),z.lazy(() => ServiceWhereInputSchema) ]).optional(),
}).strict());

export const AssignmentOrderByWithAggregationInputSchema: z.ZodType<Prisma.AssignmentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  groupId: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  serviceItemId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => AssignmentCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AssignmentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AssignmentMinOrderByAggregateInputSchema).optional()
}).strict();

export const AssignmentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AssignmentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AssignmentScalarWhereWithAggregatesInputSchema),z.lazy(() => AssignmentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AssignmentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AssignmentScalarWhereWithAggregatesInputSchema),z.lazy(() => AssignmentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  groupId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  serviceItemId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const RoleWhereInputSchema: z.ZodType<Prisma.RoleWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RoleWhereInputSchema),z.lazy(() => RoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoleWhereInputSchema),z.lazy(() => RoleWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => EnumRolesFilterSchema),z.lazy(() => RolesSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  tenants: z.lazy(() => TenantListRelationFilterSchema).optional()
}).strict();

export const RoleOrderByWithRelationInputSchema: z.ZodType<Prisma.RoleOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  tenants: z.lazy(() => TenantOrderByRelationAggregateInputSchema).optional()
}).strict();

export const RoleWhereUniqueInputSchema: z.ZodType<Prisma.RoleWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    name: z.lazy(() => RolesSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    name: z.lazy(() => RolesSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => RolesSchema).optional(),
  AND: z.union([ z.lazy(() => RoleWhereInputSchema),z.lazy(() => RoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoleWhereInputSchema),z.lazy(() => RoleWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  tenants: z.lazy(() => TenantListRelationFilterSchema).optional()
}).strict());

export const RoleOrderByWithAggregationInputSchema: z.ZodType<Prisma.RoleOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => RoleCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RoleMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RoleMinOrderByAggregateInputSchema).optional()
}).strict();

export const RoleScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RoleScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RoleScalarWhereWithAggregatesInputSchema),z.lazy(() => RoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoleScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoleScalarWhereWithAggregatesInputSchema),z.lazy(() => RoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => EnumRolesWithAggregatesFilterSchema),z.lazy(() => RolesSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const TenantWhereInputSchema: z.ZodType<Prisma.TenantWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TenantWhereInputSchema),z.lazy(() => TenantWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TenantWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TenantWhereInputSchema),z.lazy(() => TenantWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  spaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  roleId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleRelationFilterSchema),z.lazy(() => RoleWhereInputSchema) ]).optional(),
  space: z.union([ z.lazy(() => SpaceRelationFilterSchema),z.lazy(() => SpaceWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const TenantOrderByWithRelationInputSchema: z.ZodType<Prisma.TenantOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  role: z.lazy(() => RoleOrderByWithRelationInputSchema).optional(),
  space: z.lazy(() => SpaceOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const TenantWhereUniqueInputSchema: z.ZodType<Prisma.TenantWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => TenantWhereInputSchema),z.lazy(() => TenantWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TenantWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TenantWhereInputSchema),z.lazy(() => TenantWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  spaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  roleId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleRelationFilterSchema),z.lazy(() => RoleWhereInputSchema) ]).optional(),
  space: z.union([ z.lazy(() => SpaceRelationFilterSchema),z.lazy(() => SpaceWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const TenantOrderByWithAggregationInputSchema: z.ZodType<Prisma.TenantOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => TenantCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TenantMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TenantMinOrderByAggregateInputSchema).optional()
}).strict();

export const TenantScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TenantScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TenantScalarWhereWithAggregatesInputSchema),z.lazy(() => TenantScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TenantScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TenantScalarWhereWithAggregatesInputSchema),z.lazy(() => TenantScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  spaceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  roleId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ClassificationWhereInputSchema: z.ZodType<Prisma.ClassificationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ClassificationWhereInputSchema),z.lazy(() => ClassificationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClassificationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClassificationWhereInputSchema),z.lazy(() => ClassificationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  serviceItemId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  service: z.union([ z.lazy(() => ServiceRelationFilterSchema),z.lazy(() => ServiceWhereInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategoryRelationFilterSchema),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
}).strict();

export const ClassificationOrderByWithRelationInputSchema: z.ZodType<Prisma.ClassificationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  serviceItemId: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  service: z.lazy(() => ServiceOrderByWithRelationInputSchema).optional(),
  category: z.lazy(() => CategoryOrderByWithRelationInputSchema).optional()
}).strict();

export const ClassificationWhereUniqueInputSchema: z.ZodType<Prisma.ClassificationWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => ClassificationWhereInputSchema),z.lazy(() => ClassificationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClassificationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClassificationWhereInputSchema),z.lazy(() => ClassificationWhereInputSchema).array() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  serviceItemId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  service: z.union([ z.lazy(() => ServiceRelationFilterSchema),z.lazy(() => ServiceWhereInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategoryRelationFilterSchema),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
}).strict());

export const ClassificationOrderByWithAggregationInputSchema: z.ZodType<Prisma.ClassificationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  serviceItemId: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ClassificationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ClassificationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ClassificationMinOrderByAggregateInputSchema).optional()
}).strict();

export const ClassificationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ClassificationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ClassificationScalarWhereWithAggregatesInputSchema),z.lazy(() => ClassificationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClassificationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClassificationScalarWhereWithAggregatesInputSchema),z.lazy(() => ClassificationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  serviceItemId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const SpaceWhereInputSchema: z.ZodType<Prisma.SpaceWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SpaceWhereInputSchema),z.lazy(() => SpaceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SpaceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SpaceWhereInputSchema),z.lazy(() => SpaceWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  tenants: z.lazy(() => TenantListRelationFilterSchema).optional(),
  categories: z.lazy(() => CategoryListRelationFilterSchema).optional(),
  groups: z.lazy(() => GroupListRelationFilterSchema).optional()
}).strict();

export const SpaceOrderByWithRelationInputSchema: z.ZodType<Prisma.SpaceOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  tenants: z.lazy(() => TenantOrderByRelationAggregateInputSchema).optional(),
  categories: z.lazy(() => CategoryOrderByRelationAggregateInputSchema).optional(),
  groups: z.lazy(() => GroupOrderByRelationAggregateInputSchema).optional()
}).strict();

export const SpaceWhereUniqueInputSchema: z.ZodType<Prisma.SpaceWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    name: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    name: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional(),
  AND: z.union([ z.lazy(() => SpaceWhereInputSchema),z.lazy(() => SpaceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SpaceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SpaceWhereInputSchema),z.lazy(() => SpaceWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  tenants: z.lazy(() => TenantListRelationFilterSchema).optional(),
  categories: z.lazy(() => CategoryListRelationFilterSchema).optional(),
  groups: z.lazy(() => GroupListRelationFilterSchema).optional()
}).strict());

export const SpaceOrderByWithAggregationInputSchema: z.ZodType<Prisma.SpaceOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => SpaceCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SpaceMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SpaceMinOrderByAggregateInputSchema).optional()
}).strict();

export const SpaceScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SpaceScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SpaceScalarWhereWithAggregatesInputSchema),z.lazy(() => SpaceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SpaceScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SpaceScalarWhereWithAggregatesInputSchema),z.lazy(() => SpaceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const EmailTemplateWhereInputSchema: z.ZodType<Prisma.EmailTemplateWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EmailTemplateWhereInputSchema),z.lazy(() => EmailTemplateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailTemplateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailTemplateWhereInputSchema),z.lazy(() => EmailTemplateWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  subject: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const EmailTemplateOrderByWithRelationInputSchema: z.ZodType<Prisma.EmailTemplateOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  subject: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
}).strict();

export const EmailTemplateWhereUniqueInputSchema: z.ZodType<Prisma.EmailTemplateWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    name: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    name: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional(),
  AND: z.union([ z.lazy(() => EmailTemplateWhereInputSchema),z.lazy(() => EmailTemplateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailTemplateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailTemplateWhereInputSchema),z.lazy(() => EmailTemplateWhereInputSchema).array() ]).optional(),
  subject: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict());

export const EmailTemplateOrderByWithAggregationInputSchema: z.ZodType<Prisma.EmailTemplateOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  subject: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => EmailTemplateCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EmailTemplateMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EmailTemplateMinOrderByAggregateInputSchema).optional()
}).strict();

export const EmailTemplateScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EmailTemplateScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EmailTemplateScalarWhereWithAggregatesInputSchema),z.lazy(() => EmailTemplateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EmailTemplateScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EmailTemplateScalarWhereWithAggregatesInputSchema),z.lazy(() => EmailTemplateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  subject: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tenantId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dates: z.lazy(() => DateTimeNullableListFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  timelines: z.lazy(() => TimelineListRelationFilterSchema).optional()
}).strict();

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  tenantId: z.lazy(() => SortOrderSchema).optional(),
  dates: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  timelines: z.lazy(() => TimelineOrderByRelationAggregateInputSchema).optional()
}).strict();

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tenantId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dates: z.lazy(() => DateTimeNullableListFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  timelines: z.lazy(() => TimelineListRelationFilterSchema).optional()
}).strict());

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  tenantId: z.lazy(() => SortOrderSchema).optional(),
  dates: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional()
}).strict();

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tenantId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  dates: z.lazy(() => DateTimeNullableListFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const TimelineWhereInputSchema: z.ZodType<Prisma.TimelineWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TimelineWhereInputSchema),z.lazy(() => TimelineWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TimelineWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TimelineWhereInputSchema),z.lazy(() => TimelineWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sessionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  session: z.union([ z.lazy(() => SessionRelationFilterSchema),z.lazy(() => SessionWhereInputSchema) ]).optional(),
  timelineItems: z.lazy(() => TimelineItemListRelationFilterSchema).optional()
}).strict();

export const TimelineOrderByWithRelationInputSchema: z.ZodType<Prisma.TimelineOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sessionId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  session: z.lazy(() => SessionOrderByWithRelationInputSchema).optional(),
  timelineItems: z.lazy(() => TimelineItemOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TimelineWhereUniqueInputSchema: z.ZodType<Prisma.TimelineWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => TimelineWhereInputSchema),z.lazy(() => TimelineWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TimelineWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TimelineWhereInputSchema),z.lazy(() => TimelineWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sessionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  session: z.union([ z.lazy(() => SessionRelationFilterSchema),z.lazy(() => SessionWhereInputSchema) ]).optional(),
  timelineItems: z.lazy(() => TimelineItemListRelationFilterSchema).optional()
}).strict());

export const TimelineOrderByWithAggregationInputSchema: z.ZodType<Prisma.TimelineOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sessionId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => TimelineCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TimelineMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TimelineMinOrderByAggregateInputSchema).optional()
}).strict();

export const TimelineScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TimelineScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TimelineScalarWhereWithAggregatesInputSchema),z.lazy(() => TimelineScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TimelineScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TimelineScalarWhereWithAggregatesInputSchema),z.lazy(() => TimelineScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  sessionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const TimelineItemWhereInputSchema: z.ZodType<Prisma.TimelineItemWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TimelineItemWhereInputSchema),z.lazy(() => TimelineItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TimelineItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TimelineItemWhereInputSchema),z.lazy(() => TimelineItemWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  timelineId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sessionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startDateTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endDateTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  maxCapacity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  minCapacity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  reservations: z.lazy(() => ReservationListRelationFilterSchema).optional(),
  timeline: z.union([ z.lazy(() => TimelineNullableRelationFilterSchema),z.lazy(() => TimelineWhereInputSchema) ]).optional().nullable(),
}).strict();

export const TimelineItemOrderByWithRelationInputSchema: z.ZodType<Prisma.TimelineItemOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  timelineId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sessionId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  startDateTime: z.lazy(() => SortOrderSchema).optional(),
  endDateTime: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  maxCapacity: z.lazy(() => SortOrderSchema).optional(),
  minCapacity: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  reservations: z.lazy(() => ReservationOrderByRelationAggregateInputSchema).optional(),
  timeline: z.lazy(() => TimelineOrderByWithRelationInputSchema).optional()
}).strict();

export const TimelineItemWhereUniqueInputSchema: z.ZodType<Prisma.TimelineItemWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => TimelineItemWhereInputSchema),z.lazy(() => TimelineItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TimelineItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TimelineItemWhereInputSchema),z.lazy(() => TimelineItemWhereInputSchema).array() ]).optional(),
  timelineId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sessionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startDateTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endDateTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  maxCapacity: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  minCapacity: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  reservations: z.lazy(() => ReservationListRelationFilterSchema).optional(),
  timeline: z.union([ z.lazy(() => TimelineNullableRelationFilterSchema),z.lazy(() => TimelineWhereInputSchema) ]).optional().nullable(),
}).strict());

export const TimelineItemOrderByWithAggregationInputSchema: z.ZodType<Prisma.TimelineItemOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  timelineId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sessionId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  startDateTime: z.lazy(() => SortOrderSchema).optional(),
  endDateTime: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  maxCapacity: z.lazy(() => SortOrderSchema).optional(),
  minCapacity: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => TimelineItemCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TimelineItemAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TimelineItemMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TimelineItemMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TimelineItemSumOrderByAggregateInputSchema).optional()
}).strict();

export const TimelineItemScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TimelineItemScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TimelineItemScalarWhereWithAggregatesInputSchema),z.lazy(() => TimelineItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TimelineItemScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TimelineItemScalarWhereWithAggregatesInputSchema),z.lazy(() => TimelineItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  timelineId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  sessionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  startDateTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  endDateTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  maxCapacity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  minCapacity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ReservationWhereInputSchema: z.ZodType<Prisma.ReservationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ReservationWhereInputSchema),z.lazy(() => ReservationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReservationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReservationWhereInputSchema),z.lazy(() => ReservationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  timelineItemId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  timelineItem: z.union([ z.lazy(() => TimelineItemRelationFilterSchema),z.lazy(() => TimelineItemWhereInputSchema) ]).optional(),
}).strict();

export const ReservationOrderByWithRelationInputSchema: z.ZodType<Prisma.ReservationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  timelineItemId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  timelineItem: z.lazy(() => TimelineItemOrderByWithRelationInputSchema).optional()
}).strict();

export const ReservationWhereUniqueInputSchema: z.ZodType<Prisma.ReservationWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => ReservationWhereInputSchema),z.lazy(() => ReservationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReservationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReservationWhereInputSchema),z.lazy(() => ReservationWhereInputSchema).array() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  timelineItemId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  timelineItem: z.union([ z.lazy(() => TimelineItemRelationFilterSchema),z.lazy(() => TimelineItemWhereInputSchema) ]).optional(),
}).strict());

export const ReservationOrderByWithAggregationInputSchema: z.ZodType<Prisma.ReservationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  timelineItemId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ReservationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ReservationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ReservationMinOrderByAggregateInputSchema).optional()
}).strict();

export const ReservationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ReservationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ReservationScalarWhereWithAggregatesInputSchema),z.lazy(() => ReservationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReservationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReservationScalarWhereWithAggregatesInputSchema),z.lazy(() => ReservationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  timelineItemId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const SubjectWhereInputSchema: z.ZodType<Prisma.SubjectWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SubjectWhereInputSchema),z.lazy(() => SubjectWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubjectWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubjectWhereInputSchema),z.lazy(() => SubjectWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  abilities: z.lazy(() => AbilityListRelationFilterSchema).optional()
}).strict();

export const SubjectOrderByWithRelationInputSchema: z.ZodType<Prisma.SubjectOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  abilities: z.lazy(() => AbilityOrderByRelationAggregateInputSchema).optional()
}).strict();

export const SubjectWhereUniqueInputSchema: z.ZodType<Prisma.SubjectWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    name: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    name: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional(),
  AND: z.union([ z.lazy(() => SubjectWhereInputSchema),z.lazy(() => SubjectWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubjectWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubjectWhereInputSchema),z.lazy(() => SubjectWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  abilities: z.lazy(() => AbilityListRelationFilterSchema).optional()
}).strict());

export const SubjectOrderByWithAggregationInputSchema: z.ZodType<Prisma.SubjectOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => SubjectCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SubjectMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SubjectMinOrderByAggregateInputSchema).optional()
}).strict();

export const SubjectScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SubjectScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SubjectScalarWhereWithAggregatesInputSchema),z.lazy(() => SubjectScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubjectScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubjectScalarWhereWithAggregatesInputSchema),z.lazy(() => SubjectScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const AbilityWhereInputSchema: z.ZodType<Prisma.AbilityWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AbilityWhereInputSchema),z.lazy(() => AbilityWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AbilityWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AbilityWhereInputSchema),z.lazy(() => AbilityWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumAbilityTypesFilterSchema),z.lazy(() => AbilityTypesSchema) ]).optional(),
  roleId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  action: z.union([ z.lazy(() => EnumAbilityActionsFilterSchema),z.lazy(() => AbilityActionsSchema) ]).optional(),
  subjectId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  subject: z.union([ z.lazy(() => SubjectRelationFilterSchema),z.lazy(() => SubjectWhereInputSchema) ]).optional(),
}).strict();

export const AbilityOrderByWithRelationInputSchema: z.ZodType<Prisma.AbilityOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  subjectId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  subject: z.lazy(() => SubjectOrderByWithRelationInputSchema).optional()
}).strict();

export const AbilityWhereUniqueInputSchema: z.ZodType<Prisma.AbilityWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => AbilityWhereInputSchema),z.lazy(() => AbilityWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AbilityWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AbilityWhereInputSchema),z.lazy(() => AbilityWhereInputSchema).array() ]).optional(),
  type: z.union([ z.lazy(() => EnumAbilityTypesFilterSchema),z.lazy(() => AbilityTypesSchema) ]).optional(),
  roleId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  action: z.union([ z.lazy(() => EnumAbilityActionsFilterSchema),z.lazy(() => AbilityActionsSchema) ]).optional(),
  subjectId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  subject: z.union([ z.lazy(() => SubjectRelationFilterSchema),z.lazy(() => SubjectWhereInputSchema) ]).optional(),
}).strict());

export const AbilityOrderByWithAggregationInputSchema: z.ZodType<Prisma.AbilityOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  subjectId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => AbilityCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AbilityMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AbilityMinOrderByAggregateInputSchema).optional()
}).strict();

export const AbilityScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AbilityScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AbilityScalarWhereWithAggregatesInputSchema),z.lazy(() => AbilityScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AbilityScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AbilityScalarWhereWithAggregatesInputSchema),z.lazy(() => AbilityScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumAbilityTypesWithAggregatesFilterSchema),z.lazy(() => AbilityTypesSchema) ]).optional(),
  roleId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  action: z.union([ z.lazy(() => EnumAbilityActionsWithAggregatesFilterSchema),z.lazy(() => AbilityActionsSchema) ]).optional(),
  subjectId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const PageWhereInputSchema: z.ZodType<Prisma.PageWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PageWhereInputSchema),z.lazy(() => PageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PageWhereInputSchema),z.lazy(() => PageWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  pathname: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  subjectId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const PageOrderByWithRelationInputSchema: z.ZodType<Prisma.PageOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  pathname: z.lazy(() => SortOrderSchema).optional(),
  subjectId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
}).strict();

export const PageWhereUniqueInputSchema: z.ZodType<Prisma.PageWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    name: z.string(),
    pathname: z.string()
  }),
  z.object({
    id: z.string().cuid(),
    name: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    pathname: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    name: z.string(),
    pathname: z.string(),
  }),
  z.object({
    name: z.string(),
  }),
  z.object({
    pathname: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional(),
  pathname: z.string().optional(),
  AND: z.union([ z.lazy(() => PageWhereInputSchema),z.lazy(() => PageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PageWhereInputSchema),z.lazy(() => PageWhereInputSchema).array() ]).optional(),
  subjectId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict());

export const PageOrderByWithAggregationInputSchema: z.ZodType<Prisma.PageOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  pathname: z.lazy(() => SortOrderSchema).optional(),
  subjectId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => PageCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PageMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PageMinOrderByAggregateInputSchema).optional()
}).strict();

export const PageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PageScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PageScalarWhereWithAggregatesInputSchema),z.lazy(() => PageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PageScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PageScalarWhereWithAggregatesInputSchema),z.lazy(() => PageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  pathname: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  subjectId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string(),
  phone: z.string(),
  password: z.string(),
  deletedAt: z.coerce.date().optional().nullable(),
  updatedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  profiles: z.lazy(() => ProfileCreateNestedManyWithoutUserInputSchema).optional(),
  tenants: z.lazy(() => TenantCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string(),
  phone: z.string(),
  password: z.string(),
  deletedAt: z.coerce.date().optional().nullable(),
  updatedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  profiles: z.lazy(() => ProfileUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tenants: z.lazy(() => TenantUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profiles: z.lazy(() => ProfileUpdateManyWithoutUserNestedInputSchema).optional(),
  tenants: z.lazy(() => TenantUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profiles: z.lazy(() => ProfileUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tenants: z.lazy(() => TenantUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string(),
  phone: z.string(),
  password: z.string(),
  deletedAt: z.coerce.date().optional().nullable(),
  updatedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProfileCreateInputSchema: z.ZodType<Prisma.ProfileCreateInput> = z.object({
  id: z.string().cuid().optional(),
  nickname: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutProfilesInputSchema)
}).strict();

export const ProfileUncheckedCreateInputSchema: z.ZodType<Prisma.ProfileUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  nickname: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ProfileUpdateInputSchema: z.ZodType<Prisma.ProfileUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nickname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutProfilesNestedInputSchema).optional()
}).strict();

export const ProfileUncheckedUpdateInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nickname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProfileCreateManyInputSchema: z.ZodType<Prisma.ProfileCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  nickname: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ProfileUpdateManyMutationInputSchema: z.ZodType<Prisma.ProfileUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nickname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProfileUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nickname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CategoryCreateInputSchema: z.ZodType<Prisma.CategoryCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  ancestorIds: z.union([ z.lazy(() => CategoryCreateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  space: z.lazy(() => SpaceCreateNestedOneWithoutCategoriesInputSchema),
  classifications: z.lazy(() => ClassificationCreateNestedManyWithoutCategoryInputSchema).optional(),
  service: z.lazy(() => ServiceCreateNestedOneWithoutCategoriesInputSchema)
}).strict();

export const CategoryUncheckedCreateInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  serviceId: z.string(),
  spaceId: z.string(),
  ancestorIds: z.union([ z.lazy(() => CategoryCreateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  classifications: z.lazy(() => ClassificationUncheckedCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryUpdateInputSchema: z.ZodType<Prisma.CategoryUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ancestorIds: z.union([ z.lazy(() => CategoryUpdateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  space: z.lazy(() => SpaceUpdateOneRequiredWithoutCategoriesNestedInputSchema).optional(),
  classifications: z.lazy(() => ClassificationUpdateManyWithoutCategoryNestedInputSchema).optional(),
  service: z.lazy(() => ServiceUpdateOneRequiredWithoutCategoriesNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ancestorIds: z.union([ z.lazy(() => CategoryUpdateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classifications: z.lazy(() => ClassificationUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryCreateManyInputSchema: z.ZodType<Prisma.CategoryCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  serviceId: z.string(),
  spaceId: z.string(),
  ancestorIds: z.union([ z.lazy(() => CategoryCreateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const CategoryUpdateManyMutationInputSchema: z.ZodType<Prisma.CategoryUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ancestorIds: z.union([ z.lazy(() => CategoryUpdateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CategoryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ancestorIds: z.union([ z.lazy(() => CategoryUpdateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const GroupCreateInputSchema: z.ZodType<Prisma.GroupCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  serviceId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  space: z.lazy(() => SpaceCreateNestedOneWithoutGroupsInputSchema),
  assignments: z.lazy(() => AssignmentCreateNestedManyWithoutGroupInputSchema).optional()
}).strict();

export const GroupUncheckedCreateInputSchema: z.ZodType<Prisma.GroupUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  serviceId: z.string(),
  spaceId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  assignments: z.lazy(() => AssignmentUncheckedCreateNestedManyWithoutGroupInputSchema).optional()
}).strict();

export const GroupUpdateInputSchema: z.ZodType<Prisma.GroupUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  space: z.lazy(() => SpaceUpdateOneRequiredWithoutGroupsNestedInputSchema).optional(),
  assignments: z.lazy(() => AssignmentUpdateManyWithoutGroupNestedInputSchema).optional()
}).strict();

export const GroupUncheckedUpdateInputSchema: z.ZodType<Prisma.GroupUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assignments: z.lazy(() => AssignmentUncheckedUpdateManyWithoutGroupNestedInputSchema).optional()
}).strict();

export const GroupCreateManyInputSchema: z.ZodType<Prisma.GroupCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  serviceId: z.string(),
  spaceId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const GroupUpdateManyMutationInputSchema: z.ZodType<Prisma.GroupUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const GroupUncheckedUpdateManyInputSchema: z.ZodType<Prisma.GroupUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ServiceCreateInputSchema: z.ZodType<Prisma.ServiceCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => SERVICE_NAMESchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  classifications: z.lazy(() => ClassificationCreateNestedManyWithoutServiceInputSchema).optional(),
  assignments: z.lazy(() => AssignmentCreateNestedManyWithoutServiceInputSchema).optional(),
  categories: z.lazy(() => CategoryCreateNestedManyWithoutServiceInputSchema).optional()
}).strict();

export const ServiceUncheckedCreateInputSchema: z.ZodType<Prisma.ServiceUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => SERVICE_NAMESchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  classifications: z.lazy(() => ClassificationUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
  assignments: z.lazy(() => AssignmentUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutServiceInputSchema).optional()
}).strict();

export const ServiceUpdateInputSchema: z.ZodType<Prisma.ServiceUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => SERVICE_NAMESchema),z.lazy(() => EnumSERVICE_NAMEFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classifications: z.lazy(() => ClassificationUpdateManyWithoutServiceNestedInputSchema).optional(),
  assignments: z.lazy(() => AssignmentUpdateManyWithoutServiceNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUpdateManyWithoutServiceNestedInputSchema).optional()
}).strict();

export const ServiceUncheckedUpdateInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => SERVICE_NAMESchema),z.lazy(() => EnumSERVICE_NAMEFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classifications: z.lazy(() => ClassificationUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
  assignments: z.lazy(() => AssignmentUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutServiceNestedInputSchema).optional()
}).strict();

export const ServiceCreateManyInputSchema: z.ZodType<Prisma.ServiceCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => SERVICE_NAMESchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ServiceUpdateManyMutationInputSchema: z.ZodType<Prisma.ServiceUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => SERVICE_NAMESchema),z.lazy(() => EnumSERVICE_NAMEFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ServiceUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => SERVICE_NAMESchema),z.lazy(() => EnumSERVICE_NAMEFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AssignmentCreateInputSchema: z.ZodType<Prisma.AssignmentCreateInput> = z.object({
  id: z.string().cuid().optional(),
  serviceItemId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  group: z.lazy(() => GroupCreateNestedOneWithoutAssignmentsInputSchema),
  service: z.lazy(() => ServiceCreateNestedOneWithoutAssignmentsInputSchema)
}).strict();

export const AssignmentUncheckedCreateInputSchema: z.ZodType<Prisma.AssignmentUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  groupId: z.string(),
  serviceId: z.string(),
  serviceItemId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const AssignmentUpdateInputSchema: z.ZodType<Prisma.AssignmentUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  group: z.lazy(() => GroupUpdateOneRequiredWithoutAssignmentsNestedInputSchema).optional(),
  service: z.lazy(() => ServiceUpdateOneRequiredWithoutAssignmentsNestedInputSchema).optional()
}).strict();

export const AssignmentUncheckedUpdateInputSchema: z.ZodType<Prisma.AssignmentUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  groupId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AssignmentCreateManyInputSchema: z.ZodType<Prisma.AssignmentCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  groupId: z.string(),
  serviceId: z.string(),
  serviceItemId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const AssignmentUpdateManyMutationInputSchema: z.ZodType<Prisma.AssignmentUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AssignmentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AssignmentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  groupId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RoleCreateInputSchema: z.ZodType<Prisma.RoleCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => RolesSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  tenants: z.lazy(() => TenantCreateNestedManyWithoutRoleInputSchema).optional()
}).strict();

export const RoleUncheckedCreateInputSchema: z.ZodType<Prisma.RoleUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => RolesSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  tenants: z.lazy(() => TenantUncheckedCreateNestedManyWithoutRoleInputSchema).optional()
}).strict();

export const RoleUpdateInputSchema: z.ZodType<Prisma.RoleUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => RolesSchema),z.lazy(() => EnumRolesFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tenants: z.lazy(() => TenantUpdateManyWithoutRoleNestedInputSchema).optional()
}).strict();

export const RoleUncheckedUpdateInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => RolesSchema),z.lazy(() => EnumRolesFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tenants: z.lazy(() => TenantUncheckedUpdateManyWithoutRoleNestedInputSchema).optional()
}).strict();

export const RoleCreateManyInputSchema: z.ZodType<Prisma.RoleCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => RolesSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const RoleUpdateManyMutationInputSchema: z.ZodType<Prisma.RoleUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => RolesSchema),z.lazy(() => EnumRolesFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RoleUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => RolesSchema),z.lazy(() => EnumRolesFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TenantCreateInputSchema: z.ZodType<Prisma.TenantCreateInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  role: z.lazy(() => RoleCreateNestedOneWithoutTenantsInputSchema),
  space: z.lazy(() => SpaceCreateNestedOneWithoutTenantsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutTenantsInputSchema)
}).strict();

export const TenantUncheckedCreateInputSchema: z.ZodType<Prisma.TenantUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  spaceId: z.string(),
  roleId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const TenantUpdateInputSchema: z.ZodType<Prisma.TenantUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.lazy(() => RoleUpdateOneRequiredWithoutTenantsNestedInputSchema).optional(),
  space: z.lazy(() => SpaceUpdateOneRequiredWithoutTenantsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutTenantsNestedInputSchema).optional()
}).strict();

export const TenantUncheckedUpdateInputSchema: z.ZodType<Prisma.TenantUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TenantCreateManyInputSchema: z.ZodType<Prisma.TenantCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  spaceId: z.string(),
  roleId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const TenantUpdateManyMutationInputSchema: z.ZodType<Prisma.TenantUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TenantUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TenantUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ClassificationCreateInputSchema: z.ZodType<Prisma.ClassificationCreateInput> = z.object({
  id: z.string().cuid().optional(),
  serviceItemId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  service: z.lazy(() => ServiceCreateNestedOneWithoutClassificationsInputSchema),
  category: z.lazy(() => CategoryCreateNestedOneWithoutClassificationsInputSchema)
}).strict();

export const ClassificationUncheckedCreateInputSchema: z.ZodType<Prisma.ClassificationUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  serviceId: z.string(),
  serviceItemId: z.string(),
  categoryId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ClassificationUpdateInputSchema: z.ZodType<Prisma.ClassificationUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  service: z.lazy(() => ServiceUpdateOneRequiredWithoutClassificationsNestedInputSchema).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutClassificationsNestedInputSchema).optional()
}).strict();

export const ClassificationUncheckedUpdateInputSchema: z.ZodType<Prisma.ClassificationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ClassificationCreateManyInputSchema: z.ZodType<Prisma.ClassificationCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  serviceId: z.string(),
  serviceItemId: z.string(),
  categoryId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ClassificationUpdateManyMutationInputSchema: z.ZodType<Prisma.ClassificationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ClassificationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ClassificationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SpaceCreateInputSchema: z.ZodType<Prisma.SpaceCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  tenants: z.lazy(() => TenantCreateNestedManyWithoutSpaceInputSchema).optional(),
  categories: z.lazy(() => CategoryCreateNestedManyWithoutSpaceInputSchema).optional(),
  groups: z.lazy(() => GroupCreateNestedManyWithoutSpaceInputSchema).optional()
}).strict();

export const SpaceUncheckedCreateInputSchema: z.ZodType<Prisma.SpaceUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  tenants: z.lazy(() => TenantUncheckedCreateNestedManyWithoutSpaceInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutSpaceInputSchema).optional(),
  groups: z.lazy(() => GroupUncheckedCreateNestedManyWithoutSpaceInputSchema).optional()
}).strict();

export const SpaceUpdateInputSchema: z.ZodType<Prisma.SpaceUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tenants: z.lazy(() => TenantUpdateManyWithoutSpaceNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUpdateManyWithoutSpaceNestedInputSchema).optional(),
  groups: z.lazy(() => GroupUpdateManyWithoutSpaceNestedInputSchema).optional()
}).strict();

export const SpaceUncheckedUpdateInputSchema: z.ZodType<Prisma.SpaceUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tenants: z.lazy(() => TenantUncheckedUpdateManyWithoutSpaceNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutSpaceNestedInputSchema).optional(),
  groups: z.lazy(() => GroupUncheckedUpdateManyWithoutSpaceNestedInputSchema).optional()
}).strict();

export const SpaceCreateManyInputSchema: z.ZodType<Prisma.SpaceCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const SpaceUpdateManyMutationInputSchema: z.ZodType<Prisma.SpaceUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SpaceUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SpaceUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EmailTemplateCreateInputSchema: z.ZodType<Prisma.EmailTemplateCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  subject: z.string(),
  content: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const EmailTemplateUncheckedCreateInputSchema: z.ZodType<Prisma.EmailTemplateUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  subject: z.string(),
  content: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const EmailTemplateUpdateInputSchema: z.ZodType<Prisma.EmailTemplateUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EmailTemplateUncheckedUpdateInputSchema: z.ZodType<Prisma.EmailTemplateUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EmailTemplateCreateManyInputSchema: z.ZodType<Prisma.EmailTemplateCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  subject: z.string(),
  content: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const EmailTemplateUpdateManyMutationInputSchema: z.ZodType<Prisma.EmailTemplateUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EmailTemplateUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EmailTemplateUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subject: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  tenantId: z.string(),
  dates: z.union([ z.lazy(() => SessionCreatedatesInputSchema),z.coerce.date().array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  timelines: z.lazy(() => TimelineCreateNestedManyWithoutSessionInputSchema).optional()
}).strict();

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  tenantId: z.string(),
  dates: z.union([ z.lazy(() => SessionCreatedatesInputSchema),z.coerce.date().array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  timelines: z.lazy(() => TimelineUncheckedCreateNestedManyWithoutSessionInputSchema).optional()
}).strict();

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tenantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dates: z.union([ z.lazy(() => SessionUpdatedatesInputSchema),z.coerce.date().array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timelines: z.lazy(() => TimelineUpdateManyWithoutSessionNestedInputSchema).optional()
}).strict();

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tenantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dates: z.union([ z.lazy(() => SessionUpdatedatesInputSchema),z.coerce.date().array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timelines: z.lazy(() => TimelineUncheckedUpdateManyWithoutSessionNestedInputSchema).optional()
}).strict();

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  tenantId: z.string(),
  dates: z.union([ z.lazy(() => SessionCreatedatesInputSchema),z.coerce.date().array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tenantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dates: z.union([ z.lazy(() => SessionUpdatedatesInputSchema),z.coerce.date().array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tenantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dates: z.union([ z.lazy(() => SessionUpdatedatesInputSchema),z.coerce.date().array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TimelineCreateInputSchema: z.ZodType<Prisma.TimelineCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  session: z.lazy(() => SessionCreateNestedOneWithoutTimelinesInputSchema),
  timelineItems: z.lazy(() => TimelineItemCreateNestedManyWithoutTimelineInputSchema).optional()
}).strict();

export const TimelineUncheckedCreateInputSchema: z.ZodType<Prisma.TimelineUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  sessionId: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  timelineItems: z.lazy(() => TimelineItemUncheckedCreateNestedManyWithoutTimelineInputSchema).optional()
}).strict();

export const TimelineUpdateInputSchema: z.ZodType<Prisma.TimelineUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session: z.lazy(() => SessionUpdateOneRequiredWithoutTimelinesNestedInputSchema).optional(),
  timelineItems: z.lazy(() => TimelineItemUpdateManyWithoutTimelineNestedInputSchema).optional()
}).strict();

export const TimelineUncheckedUpdateInputSchema: z.ZodType<Prisma.TimelineUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timelineItems: z.lazy(() => TimelineItemUncheckedUpdateManyWithoutTimelineNestedInputSchema).optional()
}).strict();

export const TimelineCreateManyInputSchema: z.ZodType<Prisma.TimelineCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  sessionId: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const TimelineUpdateManyMutationInputSchema: z.ZodType<Prisma.TimelineUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TimelineUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TimelineUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TimelineItemCreateInputSchema: z.ZodType<Prisma.TimelineItemCreateInput> = z.object({
  id: z.string().cuid().optional(),
  sessionId: z.string(),
  title: z.string(),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  description: z.string(),
  address: z.string().optional().nullable(),
  maxCapacity: z.number().int(),
  minCapacity: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  reservations: z.lazy(() => ReservationCreateNestedManyWithoutTimelineItemInputSchema).optional(),
  timeline: z.lazy(() => TimelineCreateNestedOneWithoutTimelineItemsInputSchema).optional()
}).strict();

export const TimelineItemUncheckedCreateInputSchema: z.ZodType<Prisma.TimelineItemUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  timelineId: z.string().optional().nullable(),
  sessionId: z.string(),
  title: z.string(),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  description: z.string(),
  address: z.string().optional().nullable(),
  maxCapacity: z.number().int(),
  minCapacity: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  reservations: z.lazy(() => ReservationUncheckedCreateNestedManyWithoutTimelineItemInputSchema).optional()
}).strict();

export const TimelineItemUpdateInputSchema: z.ZodType<Prisma.TimelineItemUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  reservations: z.lazy(() => ReservationUpdateManyWithoutTimelineItemNestedInputSchema).optional(),
  timeline: z.lazy(() => TimelineUpdateOneWithoutTimelineItemsNestedInputSchema).optional()
}).strict();

export const TimelineItemUncheckedUpdateInputSchema: z.ZodType<Prisma.TimelineItemUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timelineId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  reservations: z.lazy(() => ReservationUncheckedUpdateManyWithoutTimelineItemNestedInputSchema).optional()
}).strict();

export const TimelineItemCreateManyInputSchema: z.ZodType<Prisma.TimelineItemCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  timelineId: z.string().optional().nullable(),
  sessionId: z.string(),
  title: z.string(),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  description: z.string(),
  address: z.string().optional().nullable(),
  maxCapacity: z.number().int(),
  minCapacity: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const TimelineItemUpdateManyMutationInputSchema: z.ZodType<Prisma.TimelineItemUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TimelineItemUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TimelineItemUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timelineId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReservationCreateInputSchema: z.ZodType<Prisma.ReservationCreateInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  timelineItem: z.lazy(() => TimelineItemCreateNestedOneWithoutReservationsInputSchema)
}).strict();

export const ReservationUncheckedCreateInputSchema: z.ZodType<Prisma.ReservationUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.string(),
  timelineItemId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReservationUpdateInputSchema: z.ZodType<Prisma.ReservationUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timelineItem: z.lazy(() => TimelineItemUpdateOneRequiredWithoutReservationsNestedInputSchema).optional()
}).strict();

export const ReservationUncheckedUpdateInputSchema: z.ZodType<Prisma.ReservationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timelineItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReservationCreateManyInputSchema: z.ZodType<Prisma.ReservationCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.string(),
  timelineItemId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReservationUpdateManyMutationInputSchema: z.ZodType<Prisma.ReservationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReservationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ReservationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timelineItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SubjectCreateInputSchema: z.ZodType<Prisma.SubjectCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  abilities: z.lazy(() => AbilityCreateNestedManyWithoutSubjectInputSchema).optional()
}).strict();

export const SubjectUncheckedCreateInputSchema: z.ZodType<Prisma.SubjectUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  abilities: z.lazy(() => AbilityUncheckedCreateNestedManyWithoutSubjectInputSchema).optional()
}).strict();

export const SubjectUpdateInputSchema: z.ZodType<Prisma.SubjectUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  abilities: z.lazy(() => AbilityUpdateManyWithoutSubjectNestedInputSchema).optional()
}).strict();

export const SubjectUncheckedUpdateInputSchema: z.ZodType<Prisma.SubjectUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  abilities: z.lazy(() => AbilityUncheckedUpdateManyWithoutSubjectNestedInputSchema).optional()
}).strict();

export const SubjectCreateManyInputSchema: z.ZodType<Prisma.SubjectCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const SubjectUpdateManyMutationInputSchema: z.ZodType<Prisma.SubjectUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SubjectUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SubjectUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AbilityCreateInputSchema: z.ZodType<Prisma.AbilityCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => AbilityTypesSchema),
  roleId: z.string(),
  action: z.lazy(() => AbilityActionsSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  subject: z.lazy(() => SubjectCreateNestedOneWithoutAbilitiesInputSchema)
}).strict();

export const AbilityUncheckedCreateInputSchema: z.ZodType<Prisma.AbilityUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => AbilityTypesSchema),
  roleId: z.string(),
  action: z.lazy(() => AbilityActionsSchema),
  subjectId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const AbilityUpdateInputSchema: z.ZodType<Prisma.AbilityUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AbilityTypesSchema),z.lazy(() => EnumAbilityTypesFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => AbilityActionsSchema),z.lazy(() => EnumAbilityActionsFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subject: z.lazy(() => SubjectUpdateOneRequiredWithoutAbilitiesNestedInputSchema).optional()
}).strict();

export const AbilityUncheckedUpdateInputSchema: z.ZodType<Prisma.AbilityUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AbilityTypesSchema),z.lazy(() => EnumAbilityTypesFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => AbilityActionsSchema),z.lazy(() => EnumAbilityActionsFieldUpdateOperationsInputSchema) ]).optional(),
  subjectId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AbilityCreateManyInputSchema: z.ZodType<Prisma.AbilityCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => AbilityTypesSchema),
  roleId: z.string(),
  action: z.lazy(() => AbilityActionsSchema),
  subjectId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const AbilityUpdateManyMutationInputSchema: z.ZodType<Prisma.AbilityUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AbilityTypesSchema),z.lazy(() => EnumAbilityTypesFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => AbilityActionsSchema),z.lazy(() => EnumAbilityActionsFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AbilityUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AbilityUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AbilityTypesSchema),z.lazy(() => EnumAbilityTypesFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => AbilityActionsSchema),z.lazy(() => EnumAbilityActionsFieldUpdateOperationsInputSchema) ]).optional(),
  subjectId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PageCreateInputSchema: z.ZodType<Prisma.PageCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  pathname: z.string(),
  subjectId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const PageUncheckedCreateInputSchema: z.ZodType<Prisma.PageUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  pathname: z.string(),
  subjectId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const PageUpdateInputSchema: z.ZodType<Prisma.PageUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pathname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subjectId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PageUncheckedUpdateInputSchema: z.ZodType<Prisma.PageUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pathname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subjectId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PageCreateManyInputSchema: z.ZodType<Prisma.PageCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  pathname: z.string(),
  subjectId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const PageUpdateManyMutationInputSchema: z.ZodType<Prisma.PageUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pathname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subjectId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PageUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pathname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subjectId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const ProfileListRelationFilterSchema: z.ZodType<Prisma.ProfileListRelationFilter> = z.object({
  every: z.lazy(() => ProfileWhereInputSchema).optional(),
  some: z.lazy(() => ProfileWhereInputSchema).optional(),
  none: z.lazy(() => ProfileWhereInputSchema).optional()
}).strict();

export const TenantListRelationFilterSchema: z.ZodType<Prisma.TenantListRelationFilter> = z.object({
  every: z.lazy(() => TenantWhereInputSchema).optional(),
  some: z.lazy(() => TenantWhereInputSchema).optional(),
  none: z.lazy(() => TenantWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const ProfileOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProfileOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TenantOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TenantOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const ProfileCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProfileCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  nickname: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProfileMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProfileMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  nickname: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProfileMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProfileMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  nickname: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const SpaceRelationFilterSchema: z.ZodType<Prisma.SpaceRelationFilter> = z.object({
  is: z.lazy(() => SpaceWhereInputSchema).optional(),
  isNot: z.lazy(() => SpaceWhereInputSchema).optional()
}).strict();

export const ClassificationListRelationFilterSchema: z.ZodType<Prisma.ClassificationListRelationFilter> = z.object({
  every: z.lazy(() => ClassificationWhereInputSchema).optional(),
  some: z.lazy(() => ClassificationWhereInputSchema).optional(),
  none: z.lazy(() => ClassificationWhereInputSchema).optional()
}).strict();

export const ServiceRelationFilterSchema: z.ZodType<Prisma.ServiceRelationFilter> = z.object({
  is: z.lazy(() => ServiceWhereInputSchema).optional(),
  isNot: z.lazy(() => ServiceWhereInputSchema).optional()
}).strict();

export const ClassificationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ClassificationOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  ancestorIds: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const AssignmentListRelationFilterSchema: z.ZodType<Prisma.AssignmentListRelationFilter> = z.object({
  every: z.lazy(() => AssignmentWhereInputSchema).optional(),
  some: z.lazy(() => AssignmentWhereInputSchema).optional(),
  none: z.lazy(() => AssignmentWhereInputSchema).optional()
}).strict();

export const AssignmentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AssignmentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GroupCountOrderByAggregateInputSchema: z.ZodType<Prisma.GroupCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GroupMaxOrderByAggregateInputSchema: z.ZodType<Prisma.GroupMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GroupMinOrderByAggregateInputSchema: z.ZodType<Prisma.GroupMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumSERVICE_NAMEFilterSchema: z.ZodType<Prisma.EnumSERVICE_NAMEFilter> = z.object({
  equals: z.lazy(() => SERVICE_NAMESchema).optional(),
  in: z.lazy(() => SERVICE_NAMESchema).array().optional(),
  notIn: z.lazy(() => SERVICE_NAMESchema).array().optional(),
  not: z.union([ z.lazy(() => SERVICE_NAMESchema),z.lazy(() => NestedEnumSERVICE_NAMEFilterSchema) ]).optional(),
}).strict();

export const CategoryListRelationFilterSchema: z.ZodType<Prisma.CategoryListRelationFilter> = z.object({
  every: z.lazy(() => CategoryWhereInputSchema).optional(),
  some: z.lazy(() => CategoryWhereInputSchema).optional(),
  none: z.lazy(() => CategoryWhereInputSchema).optional()
}).strict();

export const CategoryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CategoryOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ServiceCountOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ServiceMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ServiceMinOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumSERVICE_NAMEWithAggregatesFilterSchema: z.ZodType<Prisma.EnumSERVICE_NAMEWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SERVICE_NAMESchema).optional(),
  in: z.lazy(() => SERVICE_NAMESchema).array().optional(),
  notIn: z.lazy(() => SERVICE_NAMESchema).array().optional(),
  not: z.union([ z.lazy(() => SERVICE_NAMESchema),z.lazy(() => NestedEnumSERVICE_NAMEWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSERVICE_NAMEFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSERVICE_NAMEFilterSchema).optional()
}).strict();

export const GroupRelationFilterSchema: z.ZodType<Prisma.GroupRelationFilter> = z.object({
  is: z.lazy(() => GroupWhereInputSchema).optional(),
  isNot: z.lazy(() => GroupWhereInputSchema).optional()
}).strict();

export const AssignmentCountOrderByAggregateInputSchema: z.ZodType<Prisma.AssignmentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  groupId: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  serviceItemId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AssignmentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AssignmentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  groupId: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  serviceItemId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AssignmentMinOrderByAggregateInputSchema: z.ZodType<Prisma.AssignmentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  groupId: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  serviceItemId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumRolesFilterSchema: z.ZodType<Prisma.EnumRolesFilter> = z.object({
  equals: z.lazy(() => RolesSchema).optional(),
  in: z.lazy(() => RolesSchema).array().optional(),
  notIn: z.lazy(() => RolesSchema).array().optional(),
  not: z.union([ z.lazy(() => RolesSchema),z.lazy(() => NestedEnumRolesFilterSchema) ]).optional(),
}).strict();

export const RoleCountOrderByAggregateInputSchema: z.ZodType<Prisma.RoleCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoleMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RoleMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoleMinOrderByAggregateInputSchema: z.ZodType<Prisma.RoleMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumRolesWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRolesWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RolesSchema).optional(),
  in: z.lazy(() => RolesSchema).array().optional(),
  notIn: z.lazy(() => RolesSchema).array().optional(),
  not: z.union([ z.lazy(() => RolesSchema),z.lazy(() => NestedEnumRolesWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRolesFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRolesFilterSchema).optional()
}).strict();

export const RoleRelationFilterSchema: z.ZodType<Prisma.RoleRelationFilter> = z.object({
  is: z.lazy(() => RoleWhereInputSchema).optional(),
  isNot: z.lazy(() => RoleWhereInputSchema).optional()
}).strict();

export const TenantCountOrderByAggregateInputSchema: z.ZodType<Prisma.TenantCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TenantMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TenantMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TenantMinOrderByAggregateInputSchema: z.ZodType<Prisma.TenantMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryRelationFilterSchema: z.ZodType<Prisma.CategoryRelationFilter> = z.object({
  is: z.lazy(() => CategoryWhereInputSchema).optional(),
  isNot: z.lazy(() => CategoryWhereInputSchema).optional()
}).strict();

export const ClassificationCountOrderByAggregateInputSchema: z.ZodType<Prisma.ClassificationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  serviceItemId: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClassificationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ClassificationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  serviceItemId: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClassificationMinOrderByAggregateInputSchema: z.ZodType<Prisma.ClassificationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  serviceItemId: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GroupListRelationFilterSchema: z.ZodType<Prisma.GroupListRelationFilter> = z.object({
  every: z.lazy(() => GroupWhereInputSchema).optional(),
  some: z.lazy(() => GroupWhereInputSchema).optional(),
  none: z.lazy(() => GroupWhereInputSchema).optional()
}).strict();

export const GroupOrderByRelationAggregateInputSchema: z.ZodType<Prisma.GroupOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SpaceCountOrderByAggregateInputSchema: z.ZodType<Prisma.SpaceCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SpaceMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SpaceMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SpaceMinOrderByAggregateInputSchema: z.ZodType<Prisma.SpaceMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailTemplateCountOrderByAggregateInputSchema: z.ZodType<Prisma.EmailTemplateCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  subject: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailTemplateMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EmailTemplateMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  subject: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EmailTemplateMinOrderByAggregateInputSchema: z.ZodType<Prisma.EmailTemplateMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  subject: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableListFilterSchema: z.ZodType<Prisma.DateTimeNullableListFilter> = z.object({
  equals: z.coerce.date().array().optional().nullable(),
  has: z.coerce.date().optional().nullable(),
  hasEvery: z.coerce.date().array().optional(),
  hasSome: z.coerce.date().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const TimelineListRelationFilterSchema: z.ZodType<Prisma.TimelineListRelationFilter> = z.object({
  every: z.lazy(() => TimelineWhereInputSchema).optional(),
  some: z.lazy(() => TimelineWhereInputSchema).optional(),
  none: z.lazy(() => TimelineWhereInputSchema).optional()
}).strict();

export const TimelineOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TimelineOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  tenantId: z.lazy(() => SortOrderSchema).optional(),
  dates: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  tenantId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  tenantId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionRelationFilterSchema: z.ZodType<Prisma.SessionRelationFilter> = z.object({
  is: z.lazy(() => SessionWhereInputSchema).optional(),
  isNot: z.lazy(() => SessionWhereInputSchema).optional()
}).strict();

export const TimelineItemListRelationFilterSchema: z.ZodType<Prisma.TimelineItemListRelationFilter> = z.object({
  every: z.lazy(() => TimelineItemWhereInputSchema).optional(),
  some: z.lazy(() => TimelineItemWhereInputSchema).optional(),
  none: z.lazy(() => TimelineItemWhereInputSchema).optional()
}).strict();

export const TimelineItemOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TimelineItemOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TimelineCountOrderByAggregateInputSchema: z.ZodType<Prisma.TimelineCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sessionId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TimelineMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TimelineMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sessionId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TimelineMinOrderByAggregateInputSchema: z.ZodType<Prisma.TimelineMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sessionId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const ReservationListRelationFilterSchema: z.ZodType<Prisma.ReservationListRelationFilter> = z.object({
  every: z.lazy(() => ReservationWhereInputSchema).optional(),
  some: z.lazy(() => ReservationWhereInputSchema).optional(),
  none: z.lazy(() => ReservationWhereInputSchema).optional()
}).strict();

export const TimelineNullableRelationFilterSchema: z.ZodType<Prisma.TimelineNullableRelationFilter> = z.object({
  is: z.lazy(() => TimelineWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => TimelineWhereInputSchema).optional().nullable()
}).strict();

export const ReservationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ReservationOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TimelineItemCountOrderByAggregateInputSchema: z.ZodType<Prisma.TimelineItemCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  timelineId: z.lazy(() => SortOrderSchema).optional(),
  sessionId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  startDateTime: z.lazy(() => SortOrderSchema).optional(),
  endDateTime: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  maxCapacity: z.lazy(() => SortOrderSchema).optional(),
  minCapacity: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TimelineItemAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TimelineItemAvgOrderByAggregateInput> = z.object({
  maxCapacity: z.lazy(() => SortOrderSchema).optional(),
  minCapacity: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TimelineItemMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TimelineItemMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  timelineId: z.lazy(() => SortOrderSchema).optional(),
  sessionId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  startDateTime: z.lazy(() => SortOrderSchema).optional(),
  endDateTime: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  maxCapacity: z.lazy(() => SortOrderSchema).optional(),
  minCapacity: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TimelineItemMinOrderByAggregateInputSchema: z.ZodType<Prisma.TimelineItemMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  timelineId: z.lazy(() => SortOrderSchema).optional(),
  sessionId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  startDateTime: z.lazy(() => SortOrderSchema).optional(),
  endDateTime: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  maxCapacity: z.lazy(() => SortOrderSchema).optional(),
  minCapacity: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TimelineItemSumOrderByAggregateInputSchema: z.ZodType<Prisma.TimelineItemSumOrderByAggregateInput> = z.object({
  maxCapacity: z.lazy(() => SortOrderSchema).optional(),
  minCapacity: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const TimelineItemRelationFilterSchema: z.ZodType<Prisma.TimelineItemRelationFilter> = z.object({
  is: z.lazy(() => TimelineItemWhereInputSchema).optional(),
  isNot: z.lazy(() => TimelineItemWhereInputSchema).optional()
}).strict();

export const ReservationCountOrderByAggregateInputSchema: z.ZodType<Prisma.ReservationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  timelineItemId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReservationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ReservationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  timelineItemId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReservationMinOrderByAggregateInputSchema: z.ZodType<Prisma.ReservationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  timelineItemId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AbilityListRelationFilterSchema: z.ZodType<Prisma.AbilityListRelationFilter> = z.object({
  every: z.lazy(() => AbilityWhereInputSchema).optional(),
  some: z.lazy(() => AbilityWhereInputSchema).optional(),
  none: z.lazy(() => AbilityWhereInputSchema).optional()
}).strict();

export const AbilityOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AbilityOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SubjectCountOrderByAggregateInputSchema: z.ZodType<Prisma.SubjectCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SubjectMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SubjectMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SubjectMinOrderByAggregateInputSchema: z.ZodType<Prisma.SubjectMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumAbilityTypesFilterSchema: z.ZodType<Prisma.EnumAbilityTypesFilter> = z.object({
  equals: z.lazy(() => AbilityTypesSchema).optional(),
  in: z.lazy(() => AbilityTypesSchema).array().optional(),
  notIn: z.lazy(() => AbilityTypesSchema).array().optional(),
  not: z.union([ z.lazy(() => AbilityTypesSchema),z.lazy(() => NestedEnumAbilityTypesFilterSchema) ]).optional(),
}).strict();

export const EnumAbilityActionsFilterSchema: z.ZodType<Prisma.EnumAbilityActionsFilter> = z.object({
  equals: z.lazy(() => AbilityActionsSchema).optional(),
  in: z.lazy(() => AbilityActionsSchema).array().optional(),
  notIn: z.lazy(() => AbilityActionsSchema).array().optional(),
  not: z.union([ z.lazy(() => AbilityActionsSchema),z.lazy(() => NestedEnumAbilityActionsFilterSchema) ]).optional(),
}).strict();

export const SubjectRelationFilterSchema: z.ZodType<Prisma.SubjectRelationFilter> = z.object({
  is: z.lazy(() => SubjectWhereInputSchema).optional(),
  isNot: z.lazy(() => SubjectWhereInputSchema).optional()
}).strict();

export const AbilityCountOrderByAggregateInputSchema: z.ZodType<Prisma.AbilityCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  subjectId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AbilityMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AbilityMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  subjectId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AbilityMinOrderByAggregateInputSchema: z.ZodType<Prisma.AbilityMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  action: z.lazy(() => SortOrderSchema).optional(),
  subjectId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumAbilityTypesWithAggregatesFilterSchema: z.ZodType<Prisma.EnumAbilityTypesWithAggregatesFilter> = z.object({
  equals: z.lazy(() => AbilityTypesSchema).optional(),
  in: z.lazy(() => AbilityTypesSchema).array().optional(),
  notIn: z.lazy(() => AbilityTypesSchema).array().optional(),
  not: z.union([ z.lazy(() => AbilityTypesSchema),z.lazy(() => NestedEnumAbilityTypesWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAbilityTypesFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAbilityTypesFilterSchema).optional()
}).strict();

export const EnumAbilityActionsWithAggregatesFilterSchema: z.ZodType<Prisma.EnumAbilityActionsWithAggregatesFilter> = z.object({
  equals: z.lazy(() => AbilityActionsSchema).optional(),
  in: z.lazy(() => AbilityActionsSchema).array().optional(),
  notIn: z.lazy(() => AbilityActionsSchema).array().optional(),
  not: z.union([ z.lazy(() => AbilityActionsSchema),z.lazy(() => NestedEnumAbilityActionsWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAbilityActionsFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAbilityActionsFilterSchema).optional()
}).strict();

export const PageCountOrderByAggregateInputSchema: z.ZodType<Prisma.PageCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  pathname: z.lazy(() => SortOrderSchema).optional(),
  subjectId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PageMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  pathname: z.lazy(() => SortOrderSchema).optional(),
  subjectId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PageMinOrderByAggregateInputSchema: z.ZodType<Prisma.PageMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  pathname: z.lazy(() => SortOrderSchema).optional(),
  subjectId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProfileCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ProfileCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileCreateWithoutUserInputSchema).array(),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema),z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProfileCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProfileWhereUniqueInputSchema),z.lazy(() => ProfileWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TenantCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.TenantCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => TenantCreateWithoutUserInputSchema),z.lazy(() => TenantCreateWithoutUserInputSchema).array(),z.lazy(() => TenantUncheckedCreateWithoutUserInputSchema),z.lazy(() => TenantUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TenantCreateOrConnectWithoutUserInputSchema),z.lazy(() => TenantCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TenantCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProfileUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ProfileUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileCreateWithoutUserInputSchema).array(),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema),z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProfileCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProfileWhereUniqueInputSchema),z.lazy(() => ProfileWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TenantUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.TenantUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => TenantCreateWithoutUserInputSchema),z.lazy(() => TenantCreateWithoutUserInputSchema).array(),z.lazy(() => TenantUncheckedCreateWithoutUserInputSchema),z.lazy(() => TenantUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TenantCreateOrConnectWithoutUserInputSchema),z.lazy(() => TenantCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TenantCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const ProfileUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ProfileUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileCreateWithoutUserInputSchema).array(),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema),z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProfileUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ProfileUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProfileCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProfileWhereUniqueInputSchema),z.lazy(() => ProfileWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProfileWhereUniqueInputSchema),z.lazy(() => ProfileWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProfileWhereUniqueInputSchema),z.lazy(() => ProfileWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProfileWhereUniqueInputSchema),z.lazy(() => ProfileWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProfileUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ProfileUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProfileUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ProfileUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProfileScalarWhereInputSchema),z.lazy(() => ProfileScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TenantUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.TenantUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => TenantCreateWithoutUserInputSchema),z.lazy(() => TenantCreateWithoutUserInputSchema).array(),z.lazy(() => TenantUncheckedCreateWithoutUserInputSchema),z.lazy(() => TenantUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TenantCreateOrConnectWithoutUserInputSchema),z.lazy(() => TenantCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TenantUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TenantUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TenantCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TenantUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TenantUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TenantUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => TenantUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TenantScalarWhereInputSchema),z.lazy(() => TenantScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProfileUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileCreateWithoutUserInputSchema).array(),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema),z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProfileUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ProfileUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProfileCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProfileWhereUniqueInputSchema),z.lazy(() => ProfileWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProfileWhereUniqueInputSchema),z.lazy(() => ProfileWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProfileWhereUniqueInputSchema),z.lazy(() => ProfileWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProfileWhereUniqueInputSchema),z.lazy(() => ProfileWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProfileUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ProfileUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProfileUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ProfileUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProfileScalarWhereInputSchema),z.lazy(() => ProfileScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TenantUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.TenantUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => TenantCreateWithoutUserInputSchema),z.lazy(() => TenantCreateWithoutUserInputSchema).array(),z.lazy(() => TenantUncheckedCreateWithoutUserInputSchema),z.lazy(() => TenantUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TenantCreateOrConnectWithoutUserInputSchema),z.lazy(() => TenantCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TenantUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TenantUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TenantCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TenantUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TenantUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TenantUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => TenantUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TenantScalarWhereInputSchema),z.lazy(() => TenantScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutProfilesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutProfilesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutProfilesInputSchema),z.lazy(() => UserUncheckedCreateWithoutProfilesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutProfilesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutProfilesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutProfilesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutProfilesInputSchema),z.lazy(() => UserUncheckedCreateWithoutProfilesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutProfilesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutProfilesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutProfilesInputSchema),z.lazy(() => UserUpdateWithoutProfilesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutProfilesInputSchema) ]).optional(),
}).strict();

export const CategoryCreateancestorIdsInputSchema: z.ZodType<Prisma.CategoryCreateancestorIdsInput> = z.object({
  set: z.string().array()
}).strict();

export const SpaceCreateNestedOneWithoutCategoriesInputSchema: z.ZodType<Prisma.SpaceCreateNestedOneWithoutCategoriesInput> = z.object({
  create: z.union([ z.lazy(() => SpaceCreateWithoutCategoriesInputSchema),z.lazy(() => SpaceUncheckedCreateWithoutCategoriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SpaceCreateOrConnectWithoutCategoriesInputSchema).optional(),
  connect: z.lazy(() => SpaceWhereUniqueInputSchema).optional()
}).strict();

export const ClassificationCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.ClassificationCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => ClassificationCreateWithoutCategoryInputSchema),z.lazy(() => ClassificationCreateWithoutCategoryInputSchema).array(),z.lazy(() => ClassificationUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => ClassificationUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassificationCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => ClassificationCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassificationCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ServiceCreateNestedOneWithoutCategoriesInputSchema: z.ZodType<Prisma.ServiceCreateNestedOneWithoutCategoriesInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutCategoriesInputSchema),z.lazy(() => ServiceUncheckedCreateWithoutCategoriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ServiceCreateOrConnectWithoutCategoriesInputSchema).optional(),
  connect: z.lazy(() => ServiceWhereUniqueInputSchema).optional()
}).strict();

export const ClassificationUncheckedCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.ClassificationUncheckedCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => ClassificationCreateWithoutCategoryInputSchema),z.lazy(() => ClassificationCreateWithoutCategoryInputSchema).array(),z.lazy(() => ClassificationUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => ClassificationUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassificationCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => ClassificationCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassificationCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CategoryUpdateancestorIdsInputSchema: z.ZodType<Prisma.CategoryUpdateancestorIdsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const SpaceUpdateOneRequiredWithoutCategoriesNestedInputSchema: z.ZodType<Prisma.SpaceUpdateOneRequiredWithoutCategoriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => SpaceCreateWithoutCategoriesInputSchema),z.lazy(() => SpaceUncheckedCreateWithoutCategoriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SpaceCreateOrConnectWithoutCategoriesInputSchema).optional(),
  upsert: z.lazy(() => SpaceUpsertWithoutCategoriesInputSchema).optional(),
  connect: z.lazy(() => SpaceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SpaceUpdateToOneWithWhereWithoutCategoriesInputSchema),z.lazy(() => SpaceUpdateWithoutCategoriesInputSchema),z.lazy(() => SpaceUncheckedUpdateWithoutCategoriesInputSchema) ]).optional(),
}).strict();

export const ClassificationUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.ClassificationUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClassificationCreateWithoutCategoryInputSchema),z.lazy(() => ClassificationCreateWithoutCategoryInputSchema).array(),z.lazy(() => ClassificationUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => ClassificationUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassificationCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => ClassificationCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClassificationUpsertWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => ClassificationUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassificationCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClassificationUpdateWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => ClassificationUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClassificationUpdateManyWithWhereWithoutCategoryInputSchema),z.lazy(() => ClassificationUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClassificationScalarWhereInputSchema),z.lazy(() => ClassificationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ServiceUpdateOneRequiredWithoutCategoriesNestedInputSchema: z.ZodType<Prisma.ServiceUpdateOneRequiredWithoutCategoriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutCategoriesInputSchema),z.lazy(() => ServiceUncheckedCreateWithoutCategoriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ServiceCreateOrConnectWithoutCategoriesInputSchema).optional(),
  upsert: z.lazy(() => ServiceUpsertWithoutCategoriesInputSchema).optional(),
  connect: z.lazy(() => ServiceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ServiceUpdateToOneWithWhereWithoutCategoriesInputSchema),z.lazy(() => ServiceUpdateWithoutCategoriesInputSchema),z.lazy(() => ServiceUncheckedUpdateWithoutCategoriesInputSchema) ]).optional(),
}).strict();

export const ClassificationUncheckedUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.ClassificationUncheckedUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClassificationCreateWithoutCategoryInputSchema),z.lazy(() => ClassificationCreateWithoutCategoryInputSchema).array(),z.lazy(() => ClassificationUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => ClassificationUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassificationCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => ClassificationCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClassificationUpsertWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => ClassificationUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassificationCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClassificationUpdateWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => ClassificationUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClassificationUpdateManyWithWhereWithoutCategoryInputSchema),z.lazy(() => ClassificationUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClassificationScalarWhereInputSchema),z.lazy(() => ClassificationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SpaceCreateNestedOneWithoutGroupsInputSchema: z.ZodType<Prisma.SpaceCreateNestedOneWithoutGroupsInput> = z.object({
  create: z.union([ z.lazy(() => SpaceCreateWithoutGroupsInputSchema),z.lazy(() => SpaceUncheckedCreateWithoutGroupsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SpaceCreateOrConnectWithoutGroupsInputSchema).optional(),
  connect: z.lazy(() => SpaceWhereUniqueInputSchema).optional()
}).strict();

export const AssignmentCreateNestedManyWithoutGroupInputSchema: z.ZodType<Prisma.AssignmentCreateNestedManyWithoutGroupInput> = z.object({
  create: z.union([ z.lazy(() => AssignmentCreateWithoutGroupInputSchema),z.lazy(() => AssignmentCreateWithoutGroupInputSchema).array(),z.lazy(() => AssignmentUncheckedCreateWithoutGroupInputSchema),z.lazy(() => AssignmentUncheckedCreateWithoutGroupInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AssignmentCreateOrConnectWithoutGroupInputSchema),z.lazy(() => AssignmentCreateOrConnectWithoutGroupInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AssignmentCreateManyGroupInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AssignmentUncheckedCreateNestedManyWithoutGroupInputSchema: z.ZodType<Prisma.AssignmentUncheckedCreateNestedManyWithoutGroupInput> = z.object({
  create: z.union([ z.lazy(() => AssignmentCreateWithoutGroupInputSchema),z.lazy(() => AssignmentCreateWithoutGroupInputSchema).array(),z.lazy(() => AssignmentUncheckedCreateWithoutGroupInputSchema),z.lazy(() => AssignmentUncheckedCreateWithoutGroupInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AssignmentCreateOrConnectWithoutGroupInputSchema),z.lazy(() => AssignmentCreateOrConnectWithoutGroupInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AssignmentCreateManyGroupInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SpaceUpdateOneRequiredWithoutGroupsNestedInputSchema: z.ZodType<Prisma.SpaceUpdateOneRequiredWithoutGroupsNestedInput> = z.object({
  create: z.union([ z.lazy(() => SpaceCreateWithoutGroupsInputSchema),z.lazy(() => SpaceUncheckedCreateWithoutGroupsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SpaceCreateOrConnectWithoutGroupsInputSchema).optional(),
  upsert: z.lazy(() => SpaceUpsertWithoutGroupsInputSchema).optional(),
  connect: z.lazy(() => SpaceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SpaceUpdateToOneWithWhereWithoutGroupsInputSchema),z.lazy(() => SpaceUpdateWithoutGroupsInputSchema),z.lazy(() => SpaceUncheckedUpdateWithoutGroupsInputSchema) ]).optional(),
}).strict();

export const AssignmentUpdateManyWithoutGroupNestedInputSchema: z.ZodType<Prisma.AssignmentUpdateManyWithoutGroupNestedInput> = z.object({
  create: z.union([ z.lazy(() => AssignmentCreateWithoutGroupInputSchema),z.lazy(() => AssignmentCreateWithoutGroupInputSchema).array(),z.lazy(() => AssignmentUncheckedCreateWithoutGroupInputSchema),z.lazy(() => AssignmentUncheckedCreateWithoutGroupInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AssignmentCreateOrConnectWithoutGroupInputSchema),z.lazy(() => AssignmentCreateOrConnectWithoutGroupInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AssignmentUpsertWithWhereUniqueWithoutGroupInputSchema),z.lazy(() => AssignmentUpsertWithWhereUniqueWithoutGroupInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AssignmentCreateManyGroupInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AssignmentUpdateWithWhereUniqueWithoutGroupInputSchema),z.lazy(() => AssignmentUpdateWithWhereUniqueWithoutGroupInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AssignmentUpdateManyWithWhereWithoutGroupInputSchema),z.lazy(() => AssignmentUpdateManyWithWhereWithoutGroupInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AssignmentScalarWhereInputSchema),z.lazy(() => AssignmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AssignmentUncheckedUpdateManyWithoutGroupNestedInputSchema: z.ZodType<Prisma.AssignmentUncheckedUpdateManyWithoutGroupNestedInput> = z.object({
  create: z.union([ z.lazy(() => AssignmentCreateWithoutGroupInputSchema),z.lazy(() => AssignmentCreateWithoutGroupInputSchema).array(),z.lazy(() => AssignmentUncheckedCreateWithoutGroupInputSchema),z.lazy(() => AssignmentUncheckedCreateWithoutGroupInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AssignmentCreateOrConnectWithoutGroupInputSchema),z.lazy(() => AssignmentCreateOrConnectWithoutGroupInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AssignmentUpsertWithWhereUniqueWithoutGroupInputSchema),z.lazy(() => AssignmentUpsertWithWhereUniqueWithoutGroupInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AssignmentCreateManyGroupInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AssignmentUpdateWithWhereUniqueWithoutGroupInputSchema),z.lazy(() => AssignmentUpdateWithWhereUniqueWithoutGroupInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AssignmentUpdateManyWithWhereWithoutGroupInputSchema),z.lazy(() => AssignmentUpdateManyWithWhereWithoutGroupInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AssignmentScalarWhereInputSchema),z.lazy(() => AssignmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClassificationCreateNestedManyWithoutServiceInputSchema: z.ZodType<Prisma.ClassificationCreateNestedManyWithoutServiceInput> = z.object({
  create: z.union([ z.lazy(() => ClassificationCreateWithoutServiceInputSchema),z.lazy(() => ClassificationCreateWithoutServiceInputSchema).array(),z.lazy(() => ClassificationUncheckedCreateWithoutServiceInputSchema),z.lazy(() => ClassificationUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassificationCreateOrConnectWithoutServiceInputSchema),z.lazy(() => ClassificationCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassificationCreateManyServiceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AssignmentCreateNestedManyWithoutServiceInputSchema: z.ZodType<Prisma.AssignmentCreateNestedManyWithoutServiceInput> = z.object({
  create: z.union([ z.lazy(() => AssignmentCreateWithoutServiceInputSchema),z.lazy(() => AssignmentCreateWithoutServiceInputSchema).array(),z.lazy(() => AssignmentUncheckedCreateWithoutServiceInputSchema),z.lazy(() => AssignmentUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AssignmentCreateOrConnectWithoutServiceInputSchema),z.lazy(() => AssignmentCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AssignmentCreateManyServiceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CategoryCreateNestedManyWithoutServiceInputSchema: z.ZodType<Prisma.CategoryCreateNestedManyWithoutServiceInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutServiceInputSchema),z.lazy(() => CategoryCreateWithoutServiceInputSchema).array(),z.lazy(() => CategoryUncheckedCreateWithoutServiceInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryCreateOrConnectWithoutServiceInputSchema),z.lazy(() => CategoryCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryCreateManyServiceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClassificationUncheckedCreateNestedManyWithoutServiceInputSchema: z.ZodType<Prisma.ClassificationUncheckedCreateNestedManyWithoutServiceInput> = z.object({
  create: z.union([ z.lazy(() => ClassificationCreateWithoutServiceInputSchema),z.lazy(() => ClassificationCreateWithoutServiceInputSchema).array(),z.lazy(() => ClassificationUncheckedCreateWithoutServiceInputSchema),z.lazy(() => ClassificationUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassificationCreateOrConnectWithoutServiceInputSchema),z.lazy(() => ClassificationCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassificationCreateManyServiceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AssignmentUncheckedCreateNestedManyWithoutServiceInputSchema: z.ZodType<Prisma.AssignmentUncheckedCreateNestedManyWithoutServiceInput> = z.object({
  create: z.union([ z.lazy(() => AssignmentCreateWithoutServiceInputSchema),z.lazy(() => AssignmentCreateWithoutServiceInputSchema).array(),z.lazy(() => AssignmentUncheckedCreateWithoutServiceInputSchema),z.lazy(() => AssignmentUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AssignmentCreateOrConnectWithoutServiceInputSchema),z.lazy(() => AssignmentCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AssignmentCreateManyServiceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CategoryUncheckedCreateNestedManyWithoutServiceInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateNestedManyWithoutServiceInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutServiceInputSchema),z.lazy(() => CategoryCreateWithoutServiceInputSchema).array(),z.lazy(() => CategoryUncheckedCreateWithoutServiceInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryCreateOrConnectWithoutServiceInputSchema),z.lazy(() => CategoryCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryCreateManyServiceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumSERVICE_NAMEFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumSERVICE_NAMEFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => SERVICE_NAMESchema).optional()
}).strict();

export const ClassificationUpdateManyWithoutServiceNestedInputSchema: z.ZodType<Prisma.ClassificationUpdateManyWithoutServiceNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClassificationCreateWithoutServiceInputSchema),z.lazy(() => ClassificationCreateWithoutServiceInputSchema).array(),z.lazy(() => ClassificationUncheckedCreateWithoutServiceInputSchema),z.lazy(() => ClassificationUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassificationCreateOrConnectWithoutServiceInputSchema),z.lazy(() => ClassificationCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClassificationUpsertWithWhereUniqueWithoutServiceInputSchema),z.lazy(() => ClassificationUpsertWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassificationCreateManyServiceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClassificationUpdateWithWhereUniqueWithoutServiceInputSchema),z.lazy(() => ClassificationUpdateWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClassificationUpdateManyWithWhereWithoutServiceInputSchema),z.lazy(() => ClassificationUpdateManyWithWhereWithoutServiceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClassificationScalarWhereInputSchema),z.lazy(() => ClassificationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AssignmentUpdateManyWithoutServiceNestedInputSchema: z.ZodType<Prisma.AssignmentUpdateManyWithoutServiceNestedInput> = z.object({
  create: z.union([ z.lazy(() => AssignmentCreateWithoutServiceInputSchema),z.lazy(() => AssignmentCreateWithoutServiceInputSchema).array(),z.lazy(() => AssignmentUncheckedCreateWithoutServiceInputSchema),z.lazy(() => AssignmentUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AssignmentCreateOrConnectWithoutServiceInputSchema),z.lazy(() => AssignmentCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AssignmentUpsertWithWhereUniqueWithoutServiceInputSchema),z.lazy(() => AssignmentUpsertWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AssignmentCreateManyServiceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AssignmentUpdateWithWhereUniqueWithoutServiceInputSchema),z.lazy(() => AssignmentUpdateWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AssignmentUpdateManyWithWhereWithoutServiceInputSchema),z.lazy(() => AssignmentUpdateManyWithWhereWithoutServiceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AssignmentScalarWhereInputSchema),z.lazy(() => AssignmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CategoryUpdateManyWithoutServiceNestedInputSchema: z.ZodType<Prisma.CategoryUpdateManyWithoutServiceNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutServiceInputSchema),z.lazy(() => CategoryCreateWithoutServiceInputSchema).array(),z.lazy(() => CategoryUncheckedCreateWithoutServiceInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryCreateOrConnectWithoutServiceInputSchema),z.lazy(() => CategoryCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CategoryUpsertWithWhereUniqueWithoutServiceInputSchema),z.lazy(() => CategoryUpsertWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryCreateManyServiceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateWithWhereUniqueWithoutServiceInputSchema),z.lazy(() => CategoryUpdateWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CategoryUpdateManyWithWhereWithoutServiceInputSchema),z.lazy(() => CategoryUpdateManyWithWhereWithoutServiceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CategoryScalarWhereInputSchema),z.lazy(() => CategoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClassificationUncheckedUpdateManyWithoutServiceNestedInputSchema: z.ZodType<Prisma.ClassificationUncheckedUpdateManyWithoutServiceNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClassificationCreateWithoutServiceInputSchema),z.lazy(() => ClassificationCreateWithoutServiceInputSchema).array(),z.lazy(() => ClassificationUncheckedCreateWithoutServiceInputSchema),z.lazy(() => ClassificationUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClassificationCreateOrConnectWithoutServiceInputSchema),z.lazy(() => ClassificationCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClassificationUpsertWithWhereUniqueWithoutServiceInputSchema),z.lazy(() => ClassificationUpsertWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClassificationCreateManyServiceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClassificationWhereUniqueInputSchema),z.lazy(() => ClassificationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClassificationUpdateWithWhereUniqueWithoutServiceInputSchema),z.lazy(() => ClassificationUpdateWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClassificationUpdateManyWithWhereWithoutServiceInputSchema),z.lazy(() => ClassificationUpdateManyWithWhereWithoutServiceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClassificationScalarWhereInputSchema),z.lazy(() => ClassificationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AssignmentUncheckedUpdateManyWithoutServiceNestedInputSchema: z.ZodType<Prisma.AssignmentUncheckedUpdateManyWithoutServiceNestedInput> = z.object({
  create: z.union([ z.lazy(() => AssignmentCreateWithoutServiceInputSchema),z.lazy(() => AssignmentCreateWithoutServiceInputSchema).array(),z.lazy(() => AssignmentUncheckedCreateWithoutServiceInputSchema),z.lazy(() => AssignmentUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AssignmentCreateOrConnectWithoutServiceInputSchema),z.lazy(() => AssignmentCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AssignmentUpsertWithWhereUniqueWithoutServiceInputSchema),z.lazy(() => AssignmentUpsertWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AssignmentCreateManyServiceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AssignmentWhereUniqueInputSchema),z.lazy(() => AssignmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AssignmentUpdateWithWhereUniqueWithoutServiceInputSchema),z.lazy(() => AssignmentUpdateWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AssignmentUpdateManyWithWhereWithoutServiceInputSchema),z.lazy(() => AssignmentUpdateManyWithWhereWithoutServiceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AssignmentScalarWhereInputSchema),z.lazy(() => AssignmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CategoryUncheckedUpdateManyWithoutServiceNestedInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyWithoutServiceNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutServiceInputSchema),z.lazy(() => CategoryCreateWithoutServiceInputSchema).array(),z.lazy(() => CategoryUncheckedCreateWithoutServiceInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryCreateOrConnectWithoutServiceInputSchema),z.lazy(() => CategoryCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CategoryUpsertWithWhereUniqueWithoutServiceInputSchema),z.lazy(() => CategoryUpsertWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryCreateManyServiceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateWithWhereUniqueWithoutServiceInputSchema),z.lazy(() => CategoryUpdateWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CategoryUpdateManyWithWhereWithoutServiceInputSchema),z.lazy(() => CategoryUpdateManyWithWhereWithoutServiceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CategoryScalarWhereInputSchema),z.lazy(() => CategoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const GroupCreateNestedOneWithoutAssignmentsInputSchema: z.ZodType<Prisma.GroupCreateNestedOneWithoutAssignmentsInput> = z.object({
  create: z.union([ z.lazy(() => GroupCreateWithoutAssignmentsInputSchema),z.lazy(() => GroupUncheckedCreateWithoutAssignmentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => GroupCreateOrConnectWithoutAssignmentsInputSchema).optional(),
  connect: z.lazy(() => GroupWhereUniqueInputSchema).optional()
}).strict();

export const ServiceCreateNestedOneWithoutAssignmentsInputSchema: z.ZodType<Prisma.ServiceCreateNestedOneWithoutAssignmentsInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutAssignmentsInputSchema),z.lazy(() => ServiceUncheckedCreateWithoutAssignmentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ServiceCreateOrConnectWithoutAssignmentsInputSchema).optional(),
  connect: z.lazy(() => ServiceWhereUniqueInputSchema).optional()
}).strict();

export const GroupUpdateOneRequiredWithoutAssignmentsNestedInputSchema: z.ZodType<Prisma.GroupUpdateOneRequiredWithoutAssignmentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => GroupCreateWithoutAssignmentsInputSchema),z.lazy(() => GroupUncheckedCreateWithoutAssignmentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => GroupCreateOrConnectWithoutAssignmentsInputSchema).optional(),
  upsert: z.lazy(() => GroupUpsertWithoutAssignmentsInputSchema).optional(),
  connect: z.lazy(() => GroupWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => GroupUpdateToOneWithWhereWithoutAssignmentsInputSchema),z.lazy(() => GroupUpdateWithoutAssignmentsInputSchema),z.lazy(() => GroupUncheckedUpdateWithoutAssignmentsInputSchema) ]).optional(),
}).strict();

export const ServiceUpdateOneRequiredWithoutAssignmentsNestedInputSchema: z.ZodType<Prisma.ServiceUpdateOneRequiredWithoutAssignmentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutAssignmentsInputSchema),z.lazy(() => ServiceUncheckedCreateWithoutAssignmentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ServiceCreateOrConnectWithoutAssignmentsInputSchema).optional(),
  upsert: z.lazy(() => ServiceUpsertWithoutAssignmentsInputSchema).optional(),
  connect: z.lazy(() => ServiceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ServiceUpdateToOneWithWhereWithoutAssignmentsInputSchema),z.lazy(() => ServiceUpdateWithoutAssignmentsInputSchema),z.lazy(() => ServiceUncheckedUpdateWithoutAssignmentsInputSchema) ]).optional(),
}).strict();

export const TenantCreateNestedManyWithoutRoleInputSchema: z.ZodType<Prisma.TenantCreateNestedManyWithoutRoleInput> = z.object({
  create: z.union([ z.lazy(() => TenantCreateWithoutRoleInputSchema),z.lazy(() => TenantCreateWithoutRoleInputSchema).array(),z.lazy(() => TenantUncheckedCreateWithoutRoleInputSchema),z.lazy(() => TenantUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TenantCreateOrConnectWithoutRoleInputSchema),z.lazy(() => TenantCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TenantCreateManyRoleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TenantUncheckedCreateNestedManyWithoutRoleInputSchema: z.ZodType<Prisma.TenantUncheckedCreateNestedManyWithoutRoleInput> = z.object({
  create: z.union([ z.lazy(() => TenantCreateWithoutRoleInputSchema),z.lazy(() => TenantCreateWithoutRoleInputSchema).array(),z.lazy(() => TenantUncheckedCreateWithoutRoleInputSchema),z.lazy(() => TenantUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TenantCreateOrConnectWithoutRoleInputSchema),z.lazy(() => TenantCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TenantCreateManyRoleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumRolesFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRolesFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => RolesSchema).optional()
}).strict();

export const TenantUpdateManyWithoutRoleNestedInputSchema: z.ZodType<Prisma.TenantUpdateManyWithoutRoleNestedInput> = z.object({
  create: z.union([ z.lazy(() => TenantCreateWithoutRoleInputSchema),z.lazy(() => TenantCreateWithoutRoleInputSchema).array(),z.lazy(() => TenantUncheckedCreateWithoutRoleInputSchema),z.lazy(() => TenantUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TenantCreateOrConnectWithoutRoleInputSchema),z.lazy(() => TenantCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TenantUpsertWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => TenantUpsertWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TenantCreateManyRoleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TenantUpdateWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => TenantUpdateWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TenantUpdateManyWithWhereWithoutRoleInputSchema),z.lazy(() => TenantUpdateManyWithWhereWithoutRoleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TenantScalarWhereInputSchema),z.lazy(() => TenantScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TenantUncheckedUpdateManyWithoutRoleNestedInputSchema: z.ZodType<Prisma.TenantUncheckedUpdateManyWithoutRoleNestedInput> = z.object({
  create: z.union([ z.lazy(() => TenantCreateWithoutRoleInputSchema),z.lazy(() => TenantCreateWithoutRoleInputSchema).array(),z.lazy(() => TenantUncheckedCreateWithoutRoleInputSchema),z.lazy(() => TenantUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TenantCreateOrConnectWithoutRoleInputSchema),z.lazy(() => TenantCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TenantUpsertWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => TenantUpsertWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TenantCreateManyRoleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TenantUpdateWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => TenantUpdateWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TenantUpdateManyWithWhereWithoutRoleInputSchema),z.lazy(() => TenantUpdateManyWithWhereWithoutRoleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TenantScalarWhereInputSchema),z.lazy(() => TenantScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RoleCreateNestedOneWithoutTenantsInputSchema: z.ZodType<Prisma.RoleCreateNestedOneWithoutTenantsInput> = z.object({
  create: z.union([ z.lazy(() => RoleCreateWithoutTenantsInputSchema),z.lazy(() => RoleUncheckedCreateWithoutTenantsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoleCreateOrConnectWithoutTenantsInputSchema).optional(),
  connect: z.lazy(() => RoleWhereUniqueInputSchema).optional()
}).strict();

export const SpaceCreateNestedOneWithoutTenantsInputSchema: z.ZodType<Prisma.SpaceCreateNestedOneWithoutTenantsInput> = z.object({
  create: z.union([ z.lazy(() => SpaceCreateWithoutTenantsInputSchema),z.lazy(() => SpaceUncheckedCreateWithoutTenantsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SpaceCreateOrConnectWithoutTenantsInputSchema).optional(),
  connect: z.lazy(() => SpaceWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutTenantsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutTenantsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTenantsInputSchema),z.lazy(() => UserUncheckedCreateWithoutTenantsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTenantsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const RoleUpdateOneRequiredWithoutTenantsNestedInputSchema: z.ZodType<Prisma.RoleUpdateOneRequiredWithoutTenantsNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoleCreateWithoutTenantsInputSchema),z.lazy(() => RoleUncheckedCreateWithoutTenantsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoleCreateOrConnectWithoutTenantsInputSchema).optional(),
  upsert: z.lazy(() => RoleUpsertWithoutTenantsInputSchema).optional(),
  connect: z.lazy(() => RoleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RoleUpdateToOneWithWhereWithoutTenantsInputSchema),z.lazy(() => RoleUpdateWithoutTenantsInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutTenantsInputSchema) ]).optional(),
}).strict();

export const SpaceUpdateOneRequiredWithoutTenantsNestedInputSchema: z.ZodType<Prisma.SpaceUpdateOneRequiredWithoutTenantsNestedInput> = z.object({
  create: z.union([ z.lazy(() => SpaceCreateWithoutTenantsInputSchema),z.lazy(() => SpaceUncheckedCreateWithoutTenantsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SpaceCreateOrConnectWithoutTenantsInputSchema).optional(),
  upsert: z.lazy(() => SpaceUpsertWithoutTenantsInputSchema).optional(),
  connect: z.lazy(() => SpaceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SpaceUpdateToOneWithWhereWithoutTenantsInputSchema),z.lazy(() => SpaceUpdateWithoutTenantsInputSchema),z.lazy(() => SpaceUncheckedUpdateWithoutTenantsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutTenantsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutTenantsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTenantsInputSchema),z.lazy(() => UserUncheckedCreateWithoutTenantsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTenantsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutTenantsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutTenantsInputSchema),z.lazy(() => UserUpdateWithoutTenantsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTenantsInputSchema) ]).optional(),
}).strict();

export const ServiceCreateNestedOneWithoutClassificationsInputSchema: z.ZodType<Prisma.ServiceCreateNestedOneWithoutClassificationsInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutClassificationsInputSchema),z.lazy(() => ServiceUncheckedCreateWithoutClassificationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ServiceCreateOrConnectWithoutClassificationsInputSchema).optional(),
  connect: z.lazy(() => ServiceWhereUniqueInputSchema).optional()
}).strict();

export const CategoryCreateNestedOneWithoutClassificationsInputSchema: z.ZodType<Prisma.CategoryCreateNestedOneWithoutClassificationsInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutClassificationsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutClassificationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutClassificationsInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional()
}).strict();

export const ServiceUpdateOneRequiredWithoutClassificationsNestedInputSchema: z.ZodType<Prisma.ServiceUpdateOneRequiredWithoutClassificationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutClassificationsInputSchema),z.lazy(() => ServiceUncheckedCreateWithoutClassificationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ServiceCreateOrConnectWithoutClassificationsInputSchema).optional(),
  upsert: z.lazy(() => ServiceUpsertWithoutClassificationsInputSchema).optional(),
  connect: z.lazy(() => ServiceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ServiceUpdateToOneWithWhereWithoutClassificationsInputSchema),z.lazy(() => ServiceUpdateWithoutClassificationsInputSchema),z.lazy(() => ServiceUncheckedUpdateWithoutClassificationsInputSchema) ]).optional(),
}).strict();

export const CategoryUpdateOneRequiredWithoutClassificationsNestedInputSchema: z.ZodType<Prisma.CategoryUpdateOneRequiredWithoutClassificationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutClassificationsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutClassificationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutClassificationsInputSchema).optional(),
  upsert: z.lazy(() => CategoryUpsertWithoutClassificationsInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateToOneWithWhereWithoutClassificationsInputSchema),z.lazy(() => CategoryUpdateWithoutClassificationsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutClassificationsInputSchema) ]).optional(),
}).strict();

export const TenantCreateNestedManyWithoutSpaceInputSchema: z.ZodType<Prisma.TenantCreateNestedManyWithoutSpaceInput> = z.object({
  create: z.union([ z.lazy(() => TenantCreateWithoutSpaceInputSchema),z.lazy(() => TenantCreateWithoutSpaceInputSchema).array(),z.lazy(() => TenantUncheckedCreateWithoutSpaceInputSchema),z.lazy(() => TenantUncheckedCreateWithoutSpaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TenantCreateOrConnectWithoutSpaceInputSchema),z.lazy(() => TenantCreateOrConnectWithoutSpaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TenantCreateManySpaceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CategoryCreateNestedManyWithoutSpaceInputSchema: z.ZodType<Prisma.CategoryCreateNestedManyWithoutSpaceInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutSpaceInputSchema),z.lazy(() => CategoryCreateWithoutSpaceInputSchema).array(),z.lazy(() => CategoryUncheckedCreateWithoutSpaceInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutSpaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryCreateOrConnectWithoutSpaceInputSchema),z.lazy(() => CategoryCreateOrConnectWithoutSpaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryCreateManySpaceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const GroupCreateNestedManyWithoutSpaceInputSchema: z.ZodType<Prisma.GroupCreateNestedManyWithoutSpaceInput> = z.object({
  create: z.union([ z.lazy(() => GroupCreateWithoutSpaceInputSchema),z.lazy(() => GroupCreateWithoutSpaceInputSchema).array(),z.lazy(() => GroupUncheckedCreateWithoutSpaceInputSchema),z.lazy(() => GroupUncheckedCreateWithoutSpaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GroupCreateOrConnectWithoutSpaceInputSchema),z.lazy(() => GroupCreateOrConnectWithoutSpaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GroupCreateManySpaceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => GroupWhereUniqueInputSchema),z.lazy(() => GroupWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TenantUncheckedCreateNestedManyWithoutSpaceInputSchema: z.ZodType<Prisma.TenantUncheckedCreateNestedManyWithoutSpaceInput> = z.object({
  create: z.union([ z.lazy(() => TenantCreateWithoutSpaceInputSchema),z.lazy(() => TenantCreateWithoutSpaceInputSchema).array(),z.lazy(() => TenantUncheckedCreateWithoutSpaceInputSchema),z.lazy(() => TenantUncheckedCreateWithoutSpaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TenantCreateOrConnectWithoutSpaceInputSchema),z.lazy(() => TenantCreateOrConnectWithoutSpaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TenantCreateManySpaceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CategoryUncheckedCreateNestedManyWithoutSpaceInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateNestedManyWithoutSpaceInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutSpaceInputSchema),z.lazy(() => CategoryCreateWithoutSpaceInputSchema).array(),z.lazy(() => CategoryUncheckedCreateWithoutSpaceInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutSpaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryCreateOrConnectWithoutSpaceInputSchema),z.lazy(() => CategoryCreateOrConnectWithoutSpaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryCreateManySpaceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const GroupUncheckedCreateNestedManyWithoutSpaceInputSchema: z.ZodType<Prisma.GroupUncheckedCreateNestedManyWithoutSpaceInput> = z.object({
  create: z.union([ z.lazy(() => GroupCreateWithoutSpaceInputSchema),z.lazy(() => GroupCreateWithoutSpaceInputSchema).array(),z.lazy(() => GroupUncheckedCreateWithoutSpaceInputSchema),z.lazy(() => GroupUncheckedCreateWithoutSpaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GroupCreateOrConnectWithoutSpaceInputSchema),z.lazy(() => GroupCreateOrConnectWithoutSpaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GroupCreateManySpaceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => GroupWhereUniqueInputSchema),z.lazy(() => GroupWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TenantUpdateManyWithoutSpaceNestedInputSchema: z.ZodType<Prisma.TenantUpdateManyWithoutSpaceNestedInput> = z.object({
  create: z.union([ z.lazy(() => TenantCreateWithoutSpaceInputSchema),z.lazy(() => TenantCreateWithoutSpaceInputSchema).array(),z.lazy(() => TenantUncheckedCreateWithoutSpaceInputSchema),z.lazy(() => TenantUncheckedCreateWithoutSpaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TenantCreateOrConnectWithoutSpaceInputSchema),z.lazy(() => TenantCreateOrConnectWithoutSpaceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TenantUpsertWithWhereUniqueWithoutSpaceInputSchema),z.lazy(() => TenantUpsertWithWhereUniqueWithoutSpaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TenantCreateManySpaceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TenantUpdateWithWhereUniqueWithoutSpaceInputSchema),z.lazy(() => TenantUpdateWithWhereUniqueWithoutSpaceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TenantUpdateManyWithWhereWithoutSpaceInputSchema),z.lazy(() => TenantUpdateManyWithWhereWithoutSpaceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TenantScalarWhereInputSchema),z.lazy(() => TenantScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CategoryUpdateManyWithoutSpaceNestedInputSchema: z.ZodType<Prisma.CategoryUpdateManyWithoutSpaceNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutSpaceInputSchema),z.lazy(() => CategoryCreateWithoutSpaceInputSchema).array(),z.lazy(() => CategoryUncheckedCreateWithoutSpaceInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutSpaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryCreateOrConnectWithoutSpaceInputSchema),z.lazy(() => CategoryCreateOrConnectWithoutSpaceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CategoryUpsertWithWhereUniqueWithoutSpaceInputSchema),z.lazy(() => CategoryUpsertWithWhereUniqueWithoutSpaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryCreateManySpaceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateWithWhereUniqueWithoutSpaceInputSchema),z.lazy(() => CategoryUpdateWithWhereUniqueWithoutSpaceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CategoryUpdateManyWithWhereWithoutSpaceInputSchema),z.lazy(() => CategoryUpdateManyWithWhereWithoutSpaceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CategoryScalarWhereInputSchema),z.lazy(() => CategoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const GroupUpdateManyWithoutSpaceNestedInputSchema: z.ZodType<Prisma.GroupUpdateManyWithoutSpaceNestedInput> = z.object({
  create: z.union([ z.lazy(() => GroupCreateWithoutSpaceInputSchema),z.lazy(() => GroupCreateWithoutSpaceInputSchema).array(),z.lazy(() => GroupUncheckedCreateWithoutSpaceInputSchema),z.lazy(() => GroupUncheckedCreateWithoutSpaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GroupCreateOrConnectWithoutSpaceInputSchema),z.lazy(() => GroupCreateOrConnectWithoutSpaceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => GroupUpsertWithWhereUniqueWithoutSpaceInputSchema),z.lazy(() => GroupUpsertWithWhereUniqueWithoutSpaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GroupCreateManySpaceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => GroupWhereUniqueInputSchema),z.lazy(() => GroupWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => GroupWhereUniqueInputSchema),z.lazy(() => GroupWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => GroupWhereUniqueInputSchema),z.lazy(() => GroupWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => GroupWhereUniqueInputSchema),z.lazy(() => GroupWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => GroupUpdateWithWhereUniqueWithoutSpaceInputSchema),z.lazy(() => GroupUpdateWithWhereUniqueWithoutSpaceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => GroupUpdateManyWithWhereWithoutSpaceInputSchema),z.lazy(() => GroupUpdateManyWithWhereWithoutSpaceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => GroupScalarWhereInputSchema),z.lazy(() => GroupScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TenantUncheckedUpdateManyWithoutSpaceNestedInputSchema: z.ZodType<Prisma.TenantUncheckedUpdateManyWithoutSpaceNestedInput> = z.object({
  create: z.union([ z.lazy(() => TenantCreateWithoutSpaceInputSchema),z.lazy(() => TenantCreateWithoutSpaceInputSchema).array(),z.lazy(() => TenantUncheckedCreateWithoutSpaceInputSchema),z.lazy(() => TenantUncheckedCreateWithoutSpaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TenantCreateOrConnectWithoutSpaceInputSchema),z.lazy(() => TenantCreateOrConnectWithoutSpaceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TenantUpsertWithWhereUniqueWithoutSpaceInputSchema),z.lazy(() => TenantUpsertWithWhereUniqueWithoutSpaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TenantCreateManySpaceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TenantWhereUniqueInputSchema),z.lazy(() => TenantWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TenantUpdateWithWhereUniqueWithoutSpaceInputSchema),z.lazy(() => TenantUpdateWithWhereUniqueWithoutSpaceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TenantUpdateManyWithWhereWithoutSpaceInputSchema),z.lazy(() => TenantUpdateManyWithWhereWithoutSpaceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TenantScalarWhereInputSchema),z.lazy(() => TenantScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CategoryUncheckedUpdateManyWithoutSpaceNestedInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyWithoutSpaceNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutSpaceInputSchema),z.lazy(() => CategoryCreateWithoutSpaceInputSchema).array(),z.lazy(() => CategoryUncheckedCreateWithoutSpaceInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutSpaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryCreateOrConnectWithoutSpaceInputSchema),z.lazy(() => CategoryCreateOrConnectWithoutSpaceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CategoryUpsertWithWhereUniqueWithoutSpaceInputSchema),z.lazy(() => CategoryUpsertWithWhereUniqueWithoutSpaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryCreateManySpaceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema),z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateWithWhereUniqueWithoutSpaceInputSchema),z.lazy(() => CategoryUpdateWithWhereUniqueWithoutSpaceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CategoryUpdateManyWithWhereWithoutSpaceInputSchema),z.lazy(() => CategoryUpdateManyWithWhereWithoutSpaceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CategoryScalarWhereInputSchema),z.lazy(() => CategoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const GroupUncheckedUpdateManyWithoutSpaceNestedInputSchema: z.ZodType<Prisma.GroupUncheckedUpdateManyWithoutSpaceNestedInput> = z.object({
  create: z.union([ z.lazy(() => GroupCreateWithoutSpaceInputSchema),z.lazy(() => GroupCreateWithoutSpaceInputSchema).array(),z.lazy(() => GroupUncheckedCreateWithoutSpaceInputSchema),z.lazy(() => GroupUncheckedCreateWithoutSpaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GroupCreateOrConnectWithoutSpaceInputSchema),z.lazy(() => GroupCreateOrConnectWithoutSpaceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => GroupUpsertWithWhereUniqueWithoutSpaceInputSchema),z.lazy(() => GroupUpsertWithWhereUniqueWithoutSpaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GroupCreateManySpaceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => GroupWhereUniqueInputSchema),z.lazy(() => GroupWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => GroupWhereUniqueInputSchema),z.lazy(() => GroupWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => GroupWhereUniqueInputSchema),z.lazy(() => GroupWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => GroupWhereUniqueInputSchema),z.lazy(() => GroupWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => GroupUpdateWithWhereUniqueWithoutSpaceInputSchema),z.lazy(() => GroupUpdateWithWhereUniqueWithoutSpaceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => GroupUpdateManyWithWhereWithoutSpaceInputSchema),z.lazy(() => GroupUpdateManyWithWhereWithoutSpaceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => GroupScalarWhereInputSchema),z.lazy(() => GroupScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionCreatedatesInputSchema: z.ZodType<Prisma.SessionCreatedatesInput> = z.object({
  set: z.coerce.date().array()
}).strict();

export const TimelineCreateNestedManyWithoutSessionInputSchema: z.ZodType<Prisma.TimelineCreateNestedManyWithoutSessionInput> = z.object({
  create: z.union([ z.lazy(() => TimelineCreateWithoutSessionInputSchema),z.lazy(() => TimelineCreateWithoutSessionInputSchema).array(),z.lazy(() => TimelineUncheckedCreateWithoutSessionInputSchema),z.lazy(() => TimelineUncheckedCreateWithoutSessionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TimelineCreateOrConnectWithoutSessionInputSchema),z.lazy(() => TimelineCreateOrConnectWithoutSessionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TimelineCreateManySessionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TimelineWhereUniqueInputSchema),z.lazy(() => TimelineWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TimelineUncheckedCreateNestedManyWithoutSessionInputSchema: z.ZodType<Prisma.TimelineUncheckedCreateNestedManyWithoutSessionInput> = z.object({
  create: z.union([ z.lazy(() => TimelineCreateWithoutSessionInputSchema),z.lazy(() => TimelineCreateWithoutSessionInputSchema).array(),z.lazy(() => TimelineUncheckedCreateWithoutSessionInputSchema),z.lazy(() => TimelineUncheckedCreateWithoutSessionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TimelineCreateOrConnectWithoutSessionInputSchema),z.lazy(() => TimelineCreateOrConnectWithoutSessionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TimelineCreateManySessionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TimelineWhereUniqueInputSchema),z.lazy(() => TimelineWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionUpdatedatesInputSchema: z.ZodType<Prisma.SessionUpdatedatesInput> = z.object({
  set: z.coerce.date().array().optional(),
  push: z.union([ z.coerce.date(),z.coerce.date().array() ]).optional(),
}).strict();

export const TimelineUpdateManyWithoutSessionNestedInputSchema: z.ZodType<Prisma.TimelineUpdateManyWithoutSessionNestedInput> = z.object({
  create: z.union([ z.lazy(() => TimelineCreateWithoutSessionInputSchema),z.lazy(() => TimelineCreateWithoutSessionInputSchema).array(),z.lazy(() => TimelineUncheckedCreateWithoutSessionInputSchema),z.lazy(() => TimelineUncheckedCreateWithoutSessionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TimelineCreateOrConnectWithoutSessionInputSchema),z.lazy(() => TimelineCreateOrConnectWithoutSessionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TimelineUpsertWithWhereUniqueWithoutSessionInputSchema),z.lazy(() => TimelineUpsertWithWhereUniqueWithoutSessionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TimelineCreateManySessionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TimelineWhereUniqueInputSchema),z.lazy(() => TimelineWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TimelineWhereUniqueInputSchema),z.lazy(() => TimelineWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TimelineWhereUniqueInputSchema),z.lazy(() => TimelineWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TimelineWhereUniqueInputSchema),z.lazy(() => TimelineWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TimelineUpdateWithWhereUniqueWithoutSessionInputSchema),z.lazy(() => TimelineUpdateWithWhereUniqueWithoutSessionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TimelineUpdateManyWithWhereWithoutSessionInputSchema),z.lazy(() => TimelineUpdateManyWithWhereWithoutSessionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TimelineScalarWhereInputSchema),z.lazy(() => TimelineScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TimelineUncheckedUpdateManyWithoutSessionNestedInputSchema: z.ZodType<Prisma.TimelineUncheckedUpdateManyWithoutSessionNestedInput> = z.object({
  create: z.union([ z.lazy(() => TimelineCreateWithoutSessionInputSchema),z.lazy(() => TimelineCreateWithoutSessionInputSchema).array(),z.lazy(() => TimelineUncheckedCreateWithoutSessionInputSchema),z.lazy(() => TimelineUncheckedCreateWithoutSessionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TimelineCreateOrConnectWithoutSessionInputSchema),z.lazy(() => TimelineCreateOrConnectWithoutSessionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TimelineUpsertWithWhereUniqueWithoutSessionInputSchema),z.lazy(() => TimelineUpsertWithWhereUniqueWithoutSessionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TimelineCreateManySessionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TimelineWhereUniqueInputSchema),z.lazy(() => TimelineWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TimelineWhereUniqueInputSchema),z.lazy(() => TimelineWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TimelineWhereUniqueInputSchema),z.lazy(() => TimelineWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TimelineWhereUniqueInputSchema),z.lazy(() => TimelineWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TimelineUpdateWithWhereUniqueWithoutSessionInputSchema),z.lazy(() => TimelineUpdateWithWhereUniqueWithoutSessionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TimelineUpdateManyWithWhereWithoutSessionInputSchema),z.lazy(() => TimelineUpdateManyWithWhereWithoutSessionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TimelineScalarWhereInputSchema),z.lazy(() => TimelineScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionCreateNestedOneWithoutTimelinesInputSchema: z.ZodType<Prisma.SessionCreateNestedOneWithoutTimelinesInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutTimelinesInputSchema),z.lazy(() => SessionUncheckedCreateWithoutTimelinesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SessionCreateOrConnectWithoutTimelinesInputSchema).optional(),
  connect: z.lazy(() => SessionWhereUniqueInputSchema).optional()
}).strict();

export const TimelineItemCreateNestedManyWithoutTimelineInputSchema: z.ZodType<Prisma.TimelineItemCreateNestedManyWithoutTimelineInput> = z.object({
  create: z.union([ z.lazy(() => TimelineItemCreateWithoutTimelineInputSchema),z.lazy(() => TimelineItemCreateWithoutTimelineInputSchema).array(),z.lazy(() => TimelineItemUncheckedCreateWithoutTimelineInputSchema),z.lazy(() => TimelineItemUncheckedCreateWithoutTimelineInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TimelineItemCreateOrConnectWithoutTimelineInputSchema),z.lazy(() => TimelineItemCreateOrConnectWithoutTimelineInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TimelineItemCreateManyTimelineInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TimelineItemWhereUniqueInputSchema),z.lazy(() => TimelineItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TimelineItemUncheckedCreateNestedManyWithoutTimelineInputSchema: z.ZodType<Prisma.TimelineItemUncheckedCreateNestedManyWithoutTimelineInput> = z.object({
  create: z.union([ z.lazy(() => TimelineItemCreateWithoutTimelineInputSchema),z.lazy(() => TimelineItemCreateWithoutTimelineInputSchema).array(),z.lazy(() => TimelineItemUncheckedCreateWithoutTimelineInputSchema),z.lazy(() => TimelineItemUncheckedCreateWithoutTimelineInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TimelineItemCreateOrConnectWithoutTimelineInputSchema),z.lazy(() => TimelineItemCreateOrConnectWithoutTimelineInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TimelineItemCreateManyTimelineInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TimelineItemWhereUniqueInputSchema),z.lazy(() => TimelineItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionUpdateOneRequiredWithoutTimelinesNestedInputSchema: z.ZodType<Prisma.SessionUpdateOneRequiredWithoutTimelinesNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutTimelinesInputSchema),z.lazy(() => SessionUncheckedCreateWithoutTimelinesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SessionCreateOrConnectWithoutTimelinesInputSchema).optional(),
  upsert: z.lazy(() => SessionUpsertWithoutTimelinesInputSchema).optional(),
  connect: z.lazy(() => SessionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SessionUpdateToOneWithWhereWithoutTimelinesInputSchema),z.lazy(() => SessionUpdateWithoutTimelinesInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutTimelinesInputSchema) ]).optional(),
}).strict();

export const TimelineItemUpdateManyWithoutTimelineNestedInputSchema: z.ZodType<Prisma.TimelineItemUpdateManyWithoutTimelineNestedInput> = z.object({
  create: z.union([ z.lazy(() => TimelineItemCreateWithoutTimelineInputSchema),z.lazy(() => TimelineItemCreateWithoutTimelineInputSchema).array(),z.lazy(() => TimelineItemUncheckedCreateWithoutTimelineInputSchema),z.lazy(() => TimelineItemUncheckedCreateWithoutTimelineInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TimelineItemCreateOrConnectWithoutTimelineInputSchema),z.lazy(() => TimelineItemCreateOrConnectWithoutTimelineInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TimelineItemUpsertWithWhereUniqueWithoutTimelineInputSchema),z.lazy(() => TimelineItemUpsertWithWhereUniqueWithoutTimelineInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TimelineItemCreateManyTimelineInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TimelineItemWhereUniqueInputSchema),z.lazy(() => TimelineItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TimelineItemWhereUniqueInputSchema),z.lazy(() => TimelineItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TimelineItemWhereUniqueInputSchema),z.lazy(() => TimelineItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TimelineItemWhereUniqueInputSchema),z.lazy(() => TimelineItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TimelineItemUpdateWithWhereUniqueWithoutTimelineInputSchema),z.lazy(() => TimelineItemUpdateWithWhereUniqueWithoutTimelineInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TimelineItemUpdateManyWithWhereWithoutTimelineInputSchema),z.lazy(() => TimelineItemUpdateManyWithWhereWithoutTimelineInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TimelineItemScalarWhereInputSchema),z.lazy(() => TimelineItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TimelineItemUncheckedUpdateManyWithoutTimelineNestedInputSchema: z.ZodType<Prisma.TimelineItemUncheckedUpdateManyWithoutTimelineNestedInput> = z.object({
  create: z.union([ z.lazy(() => TimelineItemCreateWithoutTimelineInputSchema),z.lazy(() => TimelineItemCreateWithoutTimelineInputSchema).array(),z.lazy(() => TimelineItemUncheckedCreateWithoutTimelineInputSchema),z.lazy(() => TimelineItemUncheckedCreateWithoutTimelineInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TimelineItemCreateOrConnectWithoutTimelineInputSchema),z.lazy(() => TimelineItemCreateOrConnectWithoutTimelineInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TimelineItemUpsertWithWhereUniqueWithoutTimelineInputSchema),z.lazy(() => TimelineItemUpsertWithWhereUniqueWithoutTimelineInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TimelineItemCreateManyTimelineInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TimelineItemWhereUniqueInputSchema),z.lazy(() => TimelineItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TimelineItemWhereUniqueInputSchema),z.lazy(() => TimelineItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TimelineItemWhereUniqueInputSchema),z.lazy(() => TimelineItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TimelineItemWhereUniqueInputSchema),z.lazy(() => TimelineItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TimelineItemUpdateWithWhereUniqueWithoutTimelineInputSchema),z.lazy(() => TimelineItemUpdateWithWhereUniqueWithoutTimelineInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TimelineItemUpdateManyWithWhereWithoutTimelineInputSchema),z.lazy(() => TimelineItemUpdateManyWithWhereWithoutTimelineInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TimelineItemScalarWhereInputSchema),z.lazy(() => TimelineItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReservationCreateNestedManyWithoutTimelineItemInputSchema: z.ZodType<Prisma.ReservationCreateNestedManyWithoutTimelineItemInput> = z.object({
  create: z.union([ z.lazy(() => ReservationCreateWithoutTimelineItemInputSchema),z.lazy(() => ReservationCreateWithoutTimelineItemInputSchema).array(),z.lazy(() => ReservationUncheckedCreateWithoutTimelineItemInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutTimelineItemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReservationCreateOrConnectWithoutTimelineItemInputSchema),z.lazy(() => ReservationCreateOrConnectWithoutTimelineItemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReservationCreateManyTimelineItemInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TimelineCreateNestedOneWithoutTimelineItemsInputSchema: z.ZodType<Prisma.TimelineCreateNestedOneWithoutTimelineItemsInput> = z.object({
  create: z.union([ z.lazy(() => TimelineCreateWithoutTimelineItemsInputSchema),z.lazy(() => TimelineUncheckedCreateWithoutTimelineItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TimelineCreateOrConnectWithoutTimelineItemsInputSchema).optional(),
  connect: z.lazy(() => TimelineWhereUniqueInputSchema).optional()
}).strict();

export const ReservationUncheckedCreateNestedManyWithoutTimelineItemInputSchema: z.ZodType<Prisma.ReservationUncheckedCreateNestedManyWithoutTimelineItemInput> = z.object({
  create: z.union([ z.lazy(() => ReservationCreateWithoutTimelineItemInputSchema),z.lazy(() => ReservationCreateWithoutTimelineItemInputSchema).array(),z.lazy(() => ReservationUncheckedCreateWithoutTimelineItemInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutTimelineItemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReservationCreateOrConnectWithoutTimelineItemInputSchema),z.lazy(() => ReservationCreateOrConnectWithoutTimelineItemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReservationCreateManyTimelineItemInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const ReservationUpdateManyWithoutTimelineItemNestedInputSchema: z.ZodType<Prisma.ReservationUpdateManyWithoutTimelineItemNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReservationCreateWithoutTimelineItemInputSchema),z.lazy(() => ReservationCreateWithoutTimelineItemInputSchema).array(),z.lazy(() => ReservationUncheckedCreateWithoutTimelineItemInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutTimelineItemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReservationCreateOrConnectWithoutTimelineItemInputSchema),z.lazy(() => ReservationCreateOrConnectWithoutTimelineItemInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReservationUpsertWithWhereUniqueWithoutTimelineItemInputSchema),z.lazy(() => ReservationUpsertWithWhereUniqueWithoutTimelineItemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReservationCreateManyTimelineItemInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReservationUpdateWithWhereUniqueWithoutTimelineItemInputSchema),z.lazy(() => ReservationUpdateWithWhereUniqueWithoutTimelineItemInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReservationUpdateManyWithWhereWithoutTimelineItemInputSchema),z.lazy(() => ReservationUpdateManyWithWhereWithoutTimelineItemInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReservationScalarWhereInputSchema),z.lazy(() => ReservationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TimelineUpdateOneWithoutTimelineItemsNestedInputSchema: z.ZodType<Prisma.TimelineUpdateOneWithoutTimelineItemsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TimelineCreateWithoutTimelineItemsInputSchema),z.lazy(() => TimelineUncheckedCreateWithoutTimelineItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TimelineCreateOrConnectWithoutTimelineItemsInputSchema).optional(),
  upsert: z.lazy(() => TimelineUpsertWithoutTimelineItemsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => TimelineWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => TimelineWhereInputSchema) ]).optional(),
  connect: z.lazy(() => TimelineWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TimelineUpdateToOneWithWhereWithoutTimelineItemsInputSchema),z.lazy(() => TimelineUpdateWithoutTimelineItemsInputSchema),z.lazy(() => TimelineUncheckedUpdateWithoutTimelineItemsInputSchema) ]).optional(),
}).strict();

export const ReservationUncheckedUpdateManyWithoutTimelineItemNestedInputSchema: z.ZodType<Prisma.ReservationUncheckedUpdateManyWithoutTimelineItemNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReservationCreateWithoutTimelineItemInputSchema),z.lazy(() => ReservationCreateWithoutTimelineItemInputSchema).array(),z.lazy(() => ReservationUncheckedCreateWithoutTimelineItemInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutTimelineItemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReservationCreateOrConnectWithoutTimelineItemInputSchema),z.lazy(() => ReservationCreateOrConnectWithoutTimelineItemInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReservationUpsertWithWhereUniqueWithoutTimelineItemInputSchema),z.lazy(() => ReservationUpsertWithWhereUniqueWithoutTimelineItemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReservationCreateManyTimelineItemInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReservationWhereUniqueInputSchema),z.lazy(() => ReservationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReservationUpdateWithWhereUniqueWithoutTimelineItemInputSchema),z.lazy(() => ReservationUpdateWithWhereUniqueWithoutTimelineItemInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReservationUpdateManyWithWhereWithoutTimelineItemInputSchema),z.lazy(() => ReservationUpdateManyWithWhereWithoutTimelineItemInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReservationScalarWhereInputSchema),z.lazy(() => ReservationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TimelineItemCreateNestedOneWithoutReservationsInputSchema: z.ZodType<Prisma.TimelineItemCreateNestedOneWithoutReservationsInput> = z.object({
  create: z.union([ z.lazy(() => TimelineItemCreateWithoutReservationsInputSchema),z.lazy(() => TimelineItemUncheckedCreateWithoutReservationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TimelineItemCreateOrConnectWithoutReservationsInputSchema).optional(),
  connect: z.lazy(() => TimelineItemWhereUniqueInputSchema).optional()
}).strict();

export const TimelineItemUpdateOneRequiredWithoutReservationsNestedInputSchema: z.ZodType<Prisma.TimelineItemUpdateOneRequiredWithoutReservationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TimelineItemCreateWithoutReservationsInputSchema),z.lazy(() => TimelineItemUncheckedCreateWithoutReservationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TimelineItemCreateOrConnectWithoutReservationsInputSchema).optional(),
  upsert: z.lazy(() => TimelineItemUpsertWithoutReservationsInputSchema).optional(),
  connect: z.lazy(() => TimelineItemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TimelineItemUpdateToOneWithWhereWithoutReservationsInputSchema),z.lazy(() => TimelineItemUpdateWithoutReservationsInputSchema),z.lazy(() => TimelineItemUncheckedUpdateWithoutReservationsInputSchema) ]).optional(),
}).strict();

export const AbilityCreateNestedManyWithoutSubjectInputSchema: z.ZodType<Prisma.AbilityCreateNestedManyWithoutSubjectInput> = z.object({
  create: z.union([ z.lazy(() => AbilityCreateWithoutSubjectInputSchema),z.lazy(() => AbilityCreateWithoutSubjectInputSchema).array(),z.lazy(() => AbilityUncheckedCreateWithoutSubjectInputSchema),z.lazy(() => AbilityUncheckedCreateWithoutSubjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AbilityCreateOrConnectWithoutSubjectInputSchema),z.lazy(() => AbilityCreateOrConnectWithoutSubjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AbilityCreateManySubjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AbilityWhereUniqueInputSchema),z.lazy(() => AbilityWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AbilityUncheckedCreateNestedManyWithoutSubjectInputSchema: z.ZodType<Prisma.AbilityUncheckedCreateNestedManyWithoutSubjectInput> = z.object({
  create: z.union([ z.lazy(() => AbilityCreateWithoutSubjectInputSchema),z.lazy(() => AbilityCreateWithoutSubjectInputSchema).array(),z.lazy(() => AbilityUncheckedCreateWithoutSubjectInputSchema),z.lazy(() => AbilityUncheckedCreateWithoutSubjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AbilityCreateOrConnectWithoutSubjectInputSchema),z.lazy(() => AbilityCreateOrConnectWithoutSubjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AbilityCreateManySubjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AbilityWhereUniqueInputSchema),z.lazy(() => AbilityWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AbilityUpdateManyWithoutSubjectNestedInputSchema: z.ZodType<Prisma.AbilityUpdateManyWithoutSubjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => AbilityCreateWithoutSubjectInputSchema),z.lazy(() => AbilityCreateWithoutSubjectInputSchema).array(),z.lazy(() => AbilityUncheckedCreateWithoutSubjectInputSchema),z.lazy(() => AbilityUncheckedCreateWithoutSubjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AbilityCreateOrConnectWithoutSubjectInputSchema),z.lazy(() => AbilityCreateOrConnectWithoutSubjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AbilityUpsertWithWhereUniqueWithoutSubjectInputSchema),z.lazy(() => AbilityUpsertWithWhereUniqueWithoutSubjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AbilityCreateManySubjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AbilityWhereUniqueInputSchema),z.lazy(() => AbilityWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AbilityWhereUniqueInputSchema),z.lazy(() => AbilityWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AbilityWhereUniqueInputSchema),z.lazy(() => AbilityWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AbilityWhereUniqueInputSchema),z.lazy(() => AbilityWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AbilityUpdateWithWhereUniqueWithoutSubjectInputSchema),z.lazy(() => AbilityUpdateWithWhereUniqueWithoutSubjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AbilityUpdateManyWithWhereWithoutSubjectInputSchema),z.lazy(() => AbilityUpdateManyWithWhereWithoutSubjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AbilityScalarWhereInputSchema),z.lazy(() => AbilityScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AbilityUncheckedUpdateManyWithoutSubjectNestedInputSchema: z.ZodType<Prisma.AbilityUncheckedUpdateManyWithoutSubjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => AbilityCreateWithoutSubjectInputSchema),z.lazy(() => AbilityCreateWithoutSubjectInputSchema).array(),z.lazy(() => AbilityUncheckedCreateWithoutSubjectInputSchema),z.lazy(() => AbilityUncheckedCreateWithoutSubjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AbilityCreateOrConnectWithoutSubjectInputSchema),z.lazy(() => AbilityCreateOrConnectWithoutSubjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AbilityUpsertWithWhereUniqueWithoutSubjectInputSchema),z.lazy(() => AbilityUpsertWithWhereUniqueWithoutSubjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AbilityCreateManySubjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AbilityWhereUniqueInputSchema),z.lazy(() => AbilityWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AbilityWhereUniqueInputSchema),z.lazy(() => AbilityWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AbilityWhereUniqueInputSchema),z.lazy(() => AbilityWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AbilityWhereUniqueInputSchema),z.lazy(() => AbilityWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AbilityUpdateWithWhereUniqueWithoutSubjectInputSchema),z.lazy(() => AbilityUpdateWithWhereUniqueWithoutSubjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AbilityUpdateManyWithWhereWithoutSubjectInputSchema),z.lazy(() => AbilityUpdateManyWithWhereWithoutSubjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AbilityScalarWhereInputSchema),z.lazy(() => AbilityScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SubjectCreateNestedOneWithoutAbilitiesInputSchema: z.ZodType<Prisma.SubjectCreateNestedOneWithoutAbilitiesInput> = z.object({
  create: z.union([ z.lazy(() => SubjectCreateWithoutAbilitiesInputSchema),z.lazy(() => SubjectUncheckedCreateWithoutAbilitiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SubjectCreateOrConnectWithoutAbilitiesInputSchema).optional(),
  connect: z.lazy(() => SubjectWhereUniqueInputSchema).optional()
}).strict();

export const EnumAbilityTypesFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumAbilityTypesFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => AbilityTypesSchema).optional()
}).strict();

export const EnumAbilityActionsFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumAbilityActionsFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => AbilityActionsSchema).optional()
}).strict();

export const SubjectUpdateOneRequiredWithoutAbilitiesNestedInputSchema: z.ZodType<Prisma.SubjectUpdateOneRequiredWithoutAbilitiesNestedInput> = z.object({
  create: z.union([ z.lazy(() => SubjectCreateWithoutAbilitiesInputSchema),z.lazy(() => SubjectUncheckedCreateWithoutAbilitiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SubjectCreateOrConnectWithoutAbilitiesInputSchema).optional(),
  upsert: z.lazy(() => SubjectUpsertWithoutAbilitiesInputSchema).optional(),
  connect: z.lazy(() => SubjectWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SubjectUpdateToOneWithWhereWithoutAbilitiesInputSchema),z.lazy(() => SubjectUpdateWithoutAbilitiesInputSchema),z.lazy(() => SubjectUncheckedUpdateWithoutAbilitiesInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedEnumSERVICE_NAMEFilterSchema: z.ZodType<Prisma.NestedEnumSERVICE_NAMEFilter> = z.object({
  equals: z.lazy(() => SERVICE_NAMESchema).optional(),
  in: z.lazy(() => SERVICE_NAMESchema).array().optional(),
  notIn: z.lazy(() => SERVICE_NAMESchema).array().optional(),
  not: z.union([ z.lazy(() => SERVICE_NAMESchema),z.lazy(() => NestedEnumSERVICE_NAMEFilterSchema) ]).optional(),
}).strict();

export const NestedEnumSERVICE_NAMEWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumSERVICE_NAMEWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SERVICE_NAMESchema).optional(),
  in: z.lazy(() => SERVICE_NAMESchema).array().optional(),
  notIn: z.lazy(() => SERVICE_NAMESchema).array().optional(),
  not: z.union([ z.lazy(() => SERVICE_NAMESchema),z.lazy(() => NestedEnumSERVICE_NAMEWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSERVICE_NAMEFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSERVICE_NAMEFilterSchema).optional()
}).strict();

export const NestedEnumRolesFilterSchema: z.ZodType<Prisma.NestedEnumRolesFilter> = z.object({
  equals: z.lazy(() => RolesSchema).optional(),
  in: z.lazy(() => RolesSchema).array().optional(),
  notIn: z.lazy(() => RolesSchema).array().optional(),
  not: z.union([ z.lazy(() => RolesSchema),z.lazy(() => NestedEnumRolesFilterSchema) ]).optional(),
}).strict();

export const NestedEnumRolesWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRolesWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RolesSchema).optional(),
  in: z.lazy(() => RolesSchema).array().optional(),
  notIn: z.lazy(() => RolesSchema).array().optional(),
  not: z.union([ z.lazy(() => RolesSchema),z.lazy(() => NestedEnumRolesWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRolesFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRolesFilterSchema).optional()
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedEnumAbilityTypesFilterSchema: z.ZodType<Prisma.NestedEnumAbilityTypesFilter> = z.object({
  equals: z.lazy(() => AbilityTypesSchema).optional(),
  in: z.lazy(() => AbilityTypesSchema).array().optional(),
  notIn: z.lazy(() => AbilityTypesSchema).array().optional(),
  not: z.union([ z.lazy(() => AbilityTypesSchema),z.lazy(() => NestedEnumAbilityTypesFilterSchema) ]).optional(),
}).strict();

export const NestedEnumAbilityActionsFilterSchema: z.ZodType<Prisma.NestedEnumAbilityActionsFilter> = z.object({
  equals: z.lazy(() => AbilityActionsSchema).optional(),
  in: z.lazy(() => AbilityActionsSchema).array().optional(),
  notIn: z.lazy(() => AbilityActionsSchema).array().optional(),
  not: z.union([ z.lazy(() => AbilityActionsSchema),z.lazy(() => NestedEnumAbilityActionsFilterSchema) ]).optional(),
}).strict();

export const NestedEnumAbilityTypesWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumAbilityTypesWithAggregatesFilter> = z.object({
  equals: z.lazy(() => AbilityTypesSchema).optional(),
  in: z.lazy(() => AbilityTypesSchema).array().optional(),
  notIn: z.lazy(() => AbilityTypesSchema).array().optional(),
  not: z.union([ z.lazy(() => AbilityTypesSchema),z.lazy(() => NestedEnumAbilityTypesWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAbilityTypesFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAbilityTypesFilterSchema).optional()
}).strict();

export const NestedEnumAbilityActionsWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumAbilityActionsWithAggregatesFilter> = z.object({
  equals: z.lazy(() => AbilityActionsSchema).optional(),
  in: z.lazy(() => AbilityActionsSchema).array().optional(),
  notIn: z.lazy(() => AbilityActionsSchema).array().optional(),
  not: z.union([ z.lazy(() => AbilityActionsSchema),z.lazy(() => NestedEnumAbilityActionsWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAbilityActionsFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAbilityActionsFilterSchema).optional()
}).strict();

export const ProfileCreateWithoutUserInputSchema: z.ZodType<Prisma.ProfileCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  nickname: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ProfileUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ProfileUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  nickname: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ProfileCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ProfileCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ProfileWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ProfileCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ProfileCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProfileCreateManyUserInputSchema),z.lazy(() => ProfileCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TenantCreateWithoutUserInputSchema: z.ZodType<Prisma.TenantCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  role: z.lazy(() => RoleCreateNestedOneWithoutTenantsInputSchema),
  space: z.lazy(() => SpaceCreateNestedOneWithoutTenantsInputSchema)
}).strict();

export const TenantUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.TenantUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  spaceId: z.string(),
  roleId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const TenantCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.TenantCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => TenantWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TenantCreateWithoutUserInputSchema),z.lazy(() => TenantUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const TenantCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.TenantCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TenantCreateManyUserInputSchema),z.lazy(() => TenantCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProfileUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ProfileUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ProfileWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProfileUpdateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ProfileUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ProfileUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ProfileWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProfileUpdateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ProfileUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ProfileUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ProfileScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProfileUpdateManyMutationInputSchema),z.lazy(() => ProfileUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ProfileScalarWhereInputSchema: z.ZodType<Prisma.ProfileScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProfileScalarWhereInputSchema),z.lazy(() => ProfileScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProfileScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProfileScalarWhereInputSchema),z.lazy(() => ProfileScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  nickname: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const TenantUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.TenantUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => TenantWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TenantUpdateWithoutUserInputSchema),z.lazy(() => TenantUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => TenantCreateWithoutUserInputSchema),z.lazy(() => TenantUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const TenantUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.TenantUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => TenantWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TenantUpdateWithoutUserInputSchema),z.lazy(() => TenantUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const TenantUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.TenantUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => TenantScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TenantUpdateManyMutationInputSchema),z.lazy(() => TenantUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const TenantScalarWhereInputSchema: z.ZodType<Prisma.TenantScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TenantScalarWhereInputSchema),z.lazy(() => TenantScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TenantScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TenantScalarWhereInputSchema),z.lazy(() => TenantScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  spaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  roleId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const UserCreateWithoutProfilesInputSchema: z.ZodType<Prisma.UserCreateWithoutProfilesInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string(),
  phone: z.string(),
  password: z.string(),
  deletedAt: z.coerce.date().optional().nullable(),
  updatedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  tenants: z.lazy(() => TenantCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutProfilesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutProfilesInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string(),
  phone: z.string(),
  password: z.string(),
  deletedAt: z.coerce.date().optional().nullable(),
  updatedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  tenants: z.lazy(() => TenantUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutProfilesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutProfilesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutProfilesInputSchema),z.lazy(() => UserUncheckedCreateWithoutProfilesInputSchema) ]),
}).strict();

export const UserUpsertWithoutProfilesInputSchema: z.ZodType<Prisma.UserUpsertWithoutProfilesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutProfilesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutProfilesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutProfilesInputSchema),z.lazy(() => UserUncheckedCreateWithoutProfilesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutProfilesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutProfilesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutProfilesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutProfilesInputSchema) ]),
}).strict();

export const UserUpdateWithoutProfilesInputSchema: z.ZodType<Prisma.UserUpdateWithoutProfilesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tenants: z.lazy(() => TenantUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutProfilesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutProfilesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tenants: z.lazy(() => TenantUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const SpaceCreateWithoutCategoriesInputSchema: z.ZodType<Prisma.SpaceCreateWithoutCategoriesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  tenants: z.lazy(() => TenantCreateNestedManyWithoutSpaceInputSchema).optional(),
  groups: z.lazy(() => GroupCreateNestedManyWithoutSpaceInputSchema).optional()
}).strict();

export const SpaceUncheckedCreateWithoutCategoriesInputSchema: z.ZodType<Prisma.SpaceUncheckedCreateWithoutCategoriesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  tenants: z.lazy(() => TenantUncheckedCreateNestedManyWithoutSpaceInputSchema).optional(),
  groups: z.lazy(() => GroupUncheckedCreateNestedManyWithoutSpaceInputSchema).optional()
}).strict();

export const SpaceCreateOrConnectWithoutCategoriesInputSchema: z.ZodType<Prisma.SpaceCreateOrConnectWithoutCategoriesInput> = z.object({
  where: z.lazy(() => SpaceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SpaceCreateWithoutCategoriesInputSchema),z.lazy(() => SpaceUncheckedCreateWithoutCategoriesInputSchema) ]),
}).strict();

export const ClassificationCreateWithoutCategoryInputSchema: z.ZodType<Prisma.ClassificationCreateWithoutCategoryInput> = z.object({
  id: z.string().cuid().optional(),
  serviceItemId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  service: z.lazy(() => ServiceCreateNestedOneWithoutClassificationsInputSchema)
}).strict();

export const ClassificationUncheckedCreateWithoutCategoryInputSchema: z.ZodType<Prisma.ClassificationUncheckedCreateWithoutCategoryInput> = z.object({
  id: z.string().cuid().optional(),
  serviceId: z.string(),
  serviceItemId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ClassificationCreateOrConnectWithoutCategoryInputSchema: z.ZodType<Prisma.ClassificationCreateOrConnectWithoutCategoryInput> = z.object({
  where: z.lazy(() => ClassificationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClassificationCreateWithoutCategoryInputSchema),z.lazy(() => ClassificationUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const ClassificationCreateManyCategoryInputEnvelopeSchema: z.ZodType<Prisma.ClassificationCreateManyCategoryInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ClassificationCreateManyCategoryInputSchema),z.lazy(() => ClassificationCreateManyCategoryInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ServiceCreateWithoutCategoriesInputSchema: z.ZodType<Prisma.ServiceCreateWithoutCategoriesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => SERVICE_NAMESchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  classifications: z.lazy(() => ClassificationCreateNestedManyWithoutServiceInputSchema).optional(),
  assignments: z.lazy(() => AssignmentCreateNestedManyWithoutServiceInputSchema).optional()
}).strict();

export const ServiceUncheckedCreateWithoutCategoriesInputSchema: z.ZodType<Prisma.ServiceUncheckedCreateWithoutCategoriesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => SERVICE_NAMESchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  classifications: z.lazy(() => ClassificationUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
  assignments: z.lazy(() => AssignmentUncheckedCreateNestedManyWithoutServiceInputSchema).optional()
}).strict();

export const ServiceCreateOrConnectWithoutCategoriesInputSchema: z.ZodType<Prisma.ServiceCreateOrConnectWithoutCategoriesInput> = z.object({
  where: z.lazy(() => ServiceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ServiceCreateWithoutCategoriesInputSchema),z.lazy(() => ServiceUncheckedCreateWithoutCategoriesInputSchema) ]),
}).strict();

export const SpaceUpsertWithoutCategoriesInputSchema: z.ZodType<Prisma.SpaceUpsertWithoutCategoriesInput> = z.object({
  update: z.union([ z.lazy(() => SpaceUpdateWithoutCategoriesInputSchema),z.lazy(() => SpaceUncheckedUpdateWithoutCategoriesInputSchema) ]),
  create: z.union([ z.lazy(() => SpaceCreateWithoutCategoriesInputSchema),z.lazy(() => SpaceUncheckedCreateWithoutCategoriesInputSchema) ]),
  where: z.lazy(() => SpaceWhereInputSchema).optional()
}).strict();

export const SpaceUpdateToOneWithWhereWithoutCategoriesInputSchema: z.ZodType<Prisma.SpaceUpdateToOneWithWhereWithoutCategoriesInput> = z.object({
  where: z.lazy(() => SpaceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SpaceUpdateWithoutCategoriesInputSchema),z.lazy(() => SpaceUncheckedUpdateWithoutCategoriesInputSchema) ]),
}).strict();

export const SpaceUpdateWithoutCategoriesInputSchema: z.ZodType<Prisma.SpaceUpdateWithoutCategoriesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tenants: z.lazy(() => TenantUpdateManyWithoutSpaceNestedInputSchema).optional(),
  groups: z.lazy(() => GroupUpdateManyWithoutSpaceNestedInputSchema).optional()
}).strict();

export const SpaceUncheckedUpdateWithoutCategoriesInputSchema: z.ZodType<Prisma.SpaceUncheckedUpdateWithoutCategoriesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tenants: z.lazy(() => TenantUncheckedUpdateManyWithoutSpaceNestedInputSchema).optional(),
  groups: z.lazy(() => GroupUncheckedUpdateManyWithoutSpaceNestedInputSchema).optional()
}).strict();

export const ClassificationUpsertWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.ClassificationUpsertWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => ClassificationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ClassificationUpdateWithoutCategoryInputSchema),z.lazy(() => ClassificationUncheckedUpdateWithoutCategoryInputSchema) ]),
  create: z.union([ z.lazy(() => ClassificationCreateWithoutCategoryInputSchema),z.lazy(() => ClassificationUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const ClassificationUpdateWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.ClassificationUpdateWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => ClassificationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ClassificationUpdateWithoutCategoryInputSchema),z.lazy(() => ClassificationUncheckedUpdateWithoutCategoryInputSchema) ]),
}).strict();

export const ClassificationUpdateManyWithWhereWithoutCategoryInputSchema: z.ZodType<Prisma.ClassificationUpdateManyWithWhereWithoutCategoryInput> = z.object({
  where: z.lazy(() => ClassificationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ClassificationUpdateManyMutationInputSchema),z.lazy(() => ClassificationUncheckedUpdateManyWithoutCategoryInputSchema) ]),
}).strict();

export const ClassificationScalarWhereInputSchema: z.ZodType<Prisma.ClassificationScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ClassificationScalarWhereInputSchema),z.lazy(() => ClassificationScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClassificationScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClassificationScalarWhereInputSchema),z.lazy(() => ClassificationScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  serviceItemId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ServiceUpsertWithoutCategoriesInputSchema: z.ZodType<Prisma.ServiceUpsertWithoutCategoriesInput> = z.object({
  update: z.union([ z.lazy(() => ServiceUpdateWithoutCategoriesInputSchema),z.lazy(() => ServiceUncheckedUpdateWithoutCategoriesInputSchema) ]),
  create: z.union([ z.lazy(() => ServiceCreateWithoutCategoriesInputSchema),z.lazy(() => ServiceUncheckedCreateWithoutCategoriesInputSchema) ]),
  where: z.lazy(() => ServiceWhereInputSchema).optional()
}).strict();

export const ServiceUpdateToOneWithWhereWithoutCategoriesInputSchema: z.ZodType<Prisma.ServiceUpdateToOneWithWhereWithoutCategoriesInput> = z.object({
  where: z.lazy(() => ServiceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ServiceUpdateWithoutCategoriesInputSchema),z.lazy(() => ServiceUncheckedUpdateWithoutCategoriesInputSchema) ]),
}).strict();

export const ServiceUpdateWithoutCategoriesInputSchema: z.ZodType<Prisma.ServiceUpdateWithoutCategoriesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => SERVICE_NAMESchema),z.lazy(() => EnumSERVICE_NAMEFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classifications: z.lazy(() => ClassificationUpdateManyWithoutServiceNestedInputSchema).optional(),
  assignments: z.lazy(() => AssignmentUpdateManyWithoutServiceNestedInputSchema).optional()
}).strict();

export const ServiceUncheckedUpdateWithoutCategoriesInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateWithoutCategoriesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => SERVICE_NAMESchema),z.lazy(() => EnumSERVICE_NAMEFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classifications: z.lazy(() => ClassificationUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
  assignments: z.lazy(() => AssignmentUncheckedUpdateManyWithoutServiceNestedInputSchema).optional()
}).strict();

export const SpaceCreateWithoutGroupsInputSchema: z.ZodType<Prisma.SpaceCreateWithoutGroupsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  tenants: z.lazy(() => TenantCreateNestedManyWithoutSpaceInputSchema).optional(),
  categories: z.lazy(() => CategoryCreateNestedManyWithoutSpaceInputSchema).optional()
}).strict();

export const SpaceUncheckedCreateWithoutGroupsInputSchema: z.ZodType<Prisma.SpaceUncheckedCreateWithoutGroupsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  tenants: z.lazy(() => TenantUncheckedCreateNestedManyWithoutSpaceInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutSpaceInputSchema).optional()
}).strict();

export const SpaceCreateOrConnectWithoutGroupsInputSchema: z.ZodType<Prisma.SpaceCreateOrConnectWithoutGroupsInput> = z.object({
  where: z.lazy(() => SpaceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SpaceCreateWithoutGroupsInputSchema),z.lazy(() => SpaceUncheckedCreateWithoutGroupsInputSchema) ]),
}).strict();

export const AssignmentCreateWithoutGroupInputSchema: z.ZodType<Prisma.AssignmentCreateWithoutGroupInput> = z.object({
  id: z.string().cuid().optional(),
  serviceItemId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  service: z.lazy(() => ServiceCreateNestedOneWithoutAssignmentsInputSchema)
}).strict();

export const AssignmentUncheckedCreateWithoutGroupInputSchema: z.ZodType<Prisma.AssignmentUncheckedCreateWithoutGroupInput> = z.object({
  id: z.string().cuid().optional(),
  serviceId: z.string(),
  serviceItemId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const AssignmentCreateOrConnectWithoutGroupInputSchema: z.ZodType<Prisma.AssignmentCreateOrConnectWithoutGroupInput> = z.object({
  where: z.lazy(() => AssignmentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AssignmentCreateWithoutGroupInputSchema),z.lazy(() => AssignmentUncheckedCreateWithoutGroupInputSchema) ]),
}).strict();

export const AssignmentCreateManyGroupInputEnvelopeSchema: z.ZodType<Prisma.AssignmentCreateManyGroupInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AssignmentCreateManyGroupInputSchema),z.lazy(() => AssignmentCreateManyGroupInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SpaceUpsertWithoutGroupsInputSchema: z.ZodType<Prisma.SpaceUpsertWithoutGroupsInput> = z.object({
  update: z.union([ z.lazy(() => SpaceUpdateWithoutGroupsInputSchema),z.lazy(() => SpaceUncheckedUpdateWithoutGroupsInputSchema) ]),
  create: z.union([ z.lazy(() => SpaceCreateWithoutGroupsInputSchema),z.lazy(() => SpaceUncheckedCreateWithoutGroupsInputSchema) ]),
  where: z.lazy(() => SpaceWhereInputSchema).optional()
}).strict();

export const SpaceUpdateToOneWithWhereWithoutGroupsInputSchema: z.ZodType<Prisma.SpaceUpdateToOneWithWhereWithoutGroupsInput> = z.object({
  where: z.lazy(() => SpaceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SpaceUpdateWithoutGroupsInputSchema),z.lazy(() => SpaceUncheckedUpdateWithoutGroupsInputSchema) ]),
}).strict();

export const SpaceUpdateWithoutGroupsInputSchema: z.ZodType<Prisma.SpaceUpdateWithoutGroupsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tenants: z.lazy(() => TenantUpdateManyWithoutSpaceNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUpdateManyWithoutSpaceNestedInputSchema).optional()
}).strict();

export const SpaceUncheckedUpdateWithoutGroupsInputSchema: z.ZodType<Prisma.SpaceUncheckedUpdateWithoutGroupsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tenants: z.lazy(() => TenantUncheckedUpdateManyWithoutSpaceNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutSpaceNestedInputSchema).optional()
}).strict();

export const AssignmentUpsertWithWhereUniqueWithoutGroupInputSchema: z.ZodType<Prisma.AssignmentUpsertWithWhereUniqueWithoutGroupInput> = z.object({
  where: z.lazy(() => AssignmentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AssignmentUpdateWithoutGroupInputSchema),z.lazy(() => AssignmentUncheckedUpdateWithoutGroupInputSchema) ]),
  create: z.union([ z.lazy(() => AssignmentCreateWithoutGroupInputSchema),z.lazy(() => AssignmentUncheckedCreateWithoutGroupInputSchema) ]),
}).strict();

export const AssignmentUpdateWithWhereUniqueWithoutGroupInputSchema: z.ZodType<Prisma.AssignmentUpdateWithWhereUniqueWithoutGroupInput> = z.object({
  where: z.lazy(() => AssignmentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AssignmentUpdateWithoutGroupInputSchema),z.lazy(() => AssignmentUncheckedUpdateWithoutGroupInputSchema) ]),
}).strict();

export const AssignmentUpdateManyWithWhereWithoutGroupInputSchema: z.ZodType<Prisma.AssignmentUpdateManyWithWhereWithoutGroupInput> = z.object({
  where: z.lazy(() => AssignmentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AssignmentUpdateManyMutationInputSchema),z.lazy(() => AssignmentUncheckedUpdateManyWithoutGroupInputSchema) ]),
}).strict();

export const AssignmentScalarWhereInputSchema: z.ZodType<Prisma.AssignmentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AssignmentScalarWhereInputSchema),z.lazy(() => AssignmentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AssignmentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AssignmentScalarWhereInputSchema),z.lazy(() => AssignmentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  groupId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  serviceItemId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ClassificationCreateWithoutServiceInputSchema: z.ZodType<Prisma.ClassificationCreateWithoutServiceInput> = z.object({
  id: z.string().cuid().optional(),
  serviceItemId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutClassificationsInputSchema)
}).strict();

export const ClassificationUncheckedCreateWithoutServiceInputSchema: z.ZodType<Prisma.ClassificationUncheckedCreateWithoutServiceInput> = z.object({
  id: z.string().cuid().optional(),
  serviceItemId: z.string(),
  categoryId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ClassificationCreateOrConnectWithoutServiceInputSchema: z.ZodType<Prisma.ClassificationCreateOrConnectWithoutServiceInput> = z.object({
  where: z.lazy(() => ClassificationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClassificationCreateWithoutServiceInputSchema),z.lazy(() => ClassificationUncheckedCreateWithoutServiceInputSchema) ]),
}).strict();

export const ClassificationCreateManyServiceInputEnvelopeSchema: z.ZodType<Prisma.ClassificationCreateManyServiceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ClassificationCreateManyServiceInputSchema),z.lazy(() => ClassificationCreateManyServiceInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AssignmentCreateWithoutServiceInputSchema: z.ZodType<Prisma.AssignmentCreateWithoutServiceInput> = z.object({
  id: z.string().cuid().optional(),
  serviceItemId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  group: z.lazy(() => GroupCreateNestedOneWithoutAssignmentsInputSchema)
}).strict();

export const AssignmentUncheckedCreateWithoutServiceInputSchema: z.ZodType<Prisma.AssignmentUncheckedCreateWithoutServiceInput> = z.object({
  id: z.string().cuid().optional(),
  groupId: z.string(),
  serviceItemId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const AssignmentCreateOrConnectWithoutServiceInputSchema: z.ZodType<Prisma.AssignmentCreateOrConnectWithoutServiceInput> = z.object({
  where: z.lazy(() => AssignmentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AssignmentCreateWithoutServiceInputSchema),z.lazy(() => AssignmentUncheckedCreateWithoutServiceInputSchema) ]),
}).strict();

export const AssignmentCreateManyServiceInputEnvelopeSchema: z.ZodType<Prisma.AssignmentCreateManyServiceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AssignmentCreateManyServiceInputSchema),z.lazy(() => AssignmentCreateManyServiceInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CategoryCreateWithoutServiceInputSchema: z.ZodType<Prisma.CategoryCreateWithoutServiceInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  ancestorIds: z.union([ z.lazy(() => CategoryCreateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  space: z.lazy(() => SpaceCreateNestedOneWithoutCategoriesInputSchema),
  classifications: z.lazy(() => ClassificationCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryUncheckedCreateWithoutServiceInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutServiceInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  spaceId: z.string(),
  ancestorIds: z.union([ z.lazy(() => CategoryCreateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  classifications: z.lazy(() => ClassificationUncheckedCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryCreateOrConnectWithoutServiceInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutServiceInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryCreateWithoutServiceInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutServiceInputSchema) ]),
}).strict();

export const CategoryCreateManyServiceInputEnvelopeSchema: z.ZodType<Prisma.CategoryCreateManyServiceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CategoryCreateManyServiceInputSchema),z.lazy(() => CategoryCreateManyServiceInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ClassificationUpsertWithWhereUniqueWithoutServiceInputSchema: z.ZodType<Prisma.ClassificationUpsertWithWhereUniqueWithoutServiceInput> = z.object({
  where: z.lazy(() => ClassificationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ClassificationUpdateWithoutServiceInputSchema),z.lazy(() => ClassificationUncheckedUpdateWithoutServiceInputSchema) ]),
  create: z.union([ z.lazy(() => ClassificationCreateWithoutServiceInputSchema),z.lazy(() => ClassificationUncheckedCreateWithoutServiceInputSchema) ]),
}).strict();

export const ClassificationUpdateWithWhereUniqueWithoutServiceInputSchema: z.ZodType<Prisma.ClassificationUpdateWithWhereUniqueWithoutServiceInput> = z.object({
  where: z.lazy(() => ClassificationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ClassificationUpdateWithoutServiceInputSchema),z.lazy(() => ClassificationUncheckedUpdateWithoutServiceInputSchema) ]),
}).strict();

export const ClassificationUpdateManyWithWhereWithoutServiceInputSchema: z.ZodType<Prisma.ClassificationUpdateManyWithWhereWithoutServiceInput> = z.object({
  where: z.lazy(() => ClassificationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ClassificationUpdateManyMutationInputSchema),z.lazy(() => ClassificationUncheckedUpdateManyWithoutServiceInputSchema) ]),
}).strict();

export const AssignmentUpsertWithWhereUniqueWithoutServiceInputSchema: z.ZodType<Prisma.AssignmentUpsertWithWhereUniqueWithoutServiceInput> = z.object({
  where: z.lazy(() => AssignmentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AssignmentUpdateWithoutServiceInputSchema),z.lazy(() => AssignmentUncheckedUpdateWithoutServiceInputSchema) ]),
  create: z.union([ z.lazy(() => AssignmentCreateWithoutServiceInputSchema),z.lazy(() => AssignmentUncheckedCreateWithoutServiceInputSchema) ]),
}).strict();

export const AssignmentUpdateWithWhereUniqueWithoutServiceInputSchema: z.ZodType<Prisma.AssignmentUpdateWithWhereUniqueWithoutServiceInput> = z.object({
  where: z.lazy(() => AssignmentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AssignmentUpdateWithoutServiceInputSchema),z.lazy(() => AssignmentUncheckedUpdateWithoutServiceInputSchema) ]),
}).strict();

export const AssignmentUpdateManyWithWhereWithoutServiceInputSchema: z.ZodType<Prisma.AssignmentUpdateManyWithWhereWithoutServiceInput> = z.object({
  where: z.lazy(() => AssignmentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AssignmentUpdateManyMutationInputSchema),z.lazy(() => AssignmentUncheckedUpdateManyWithoutServiceInputSchema) ]),
}).strict();

export const CategoryUpsertWithWhereUniqueWithoutServiceInputSchema: z.ZodType<Prisma.CategoryUpsertWithWhereUniqueWithoutServiceInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CategoryUpdateWithoutServiceInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutServiceInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryCreateWithoutServiceInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutServiceInputSchema) ]),
}).strict();

export const CategoryUpdateWithWhereUniqueWithoutServiceInputSchema: z.ZodType<Prisma.CategoryUpdateWithWhereUniqueWithoutServiceInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CategoryUpdateWithoutServiceInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutServiceInputSchema) ]),
}).strict();

export const CategoryUpdateManyWithWhereWithoutServiceInputSchema: z.ZodType<Prisma.CategoryUpdateManyWithWhereWithoutServiceInput> = z.object({
  where: z.lazy(() => CategoryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CategoryUpdateManyMutationInputSchema),z.lazy(() => CategoryUncheckedUpdateManyWithoutServiceInputSchema) ]),
}).strict();

export const CategoryScalarWhereInputSchema: z.ZodType<Prisma.CategoryScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryScalarWhereInputSchema),z.lazy(() => CategoryScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryScalarWhereInputSchema),z.lazy(() => CategoryScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  spaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ancestorIds: z.lazy(() => StringNullableListFilterSchema).optional(),
  parentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const GroupCreateWithoutAssignmentsInputSchema: z.ZodType<Prisma.GroupCreateWithoutAssignmentsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  serviceId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  space: z.lazy(() => SpaceCreateNestedOneWithoutGroupsInputSchema)
}).strict();

export const GroupUncheckedCreateWithoutAssignmentsInputSchema: z.ZodType<Prisma.GroupUncheckedCreateWithoutAssignmentsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  serviceId: z.string(),
  spaceId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const GroupCreateOrConnectWithoutAssignmentsInputSchema: z.ZodType<Prisma.GroupCreateOrConnectWithoutAssignmentsInput> = z.object({
  where: z.lazy(() => GroupWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => GroupCreateWithoutAssignmentsInputSchema),z.lazy(() => GroupUncheckedCreateWithoutAssignmentsInputSchema) ]),
}).strict();

export const ServiceCreateWithoutAssignmentsInputSchema: z.ZodType<Prisma.ServiceCreateWithoutAssignmentsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => SERVICE_NAMESchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  classifications: z.lazy(() => ClassificationCreateNestedManyWithoutServiceInputSchema).optional(),
  categories: z.lazy(() => CategoryCreateNestedManyWithoutServiceInputSchema).optional()
}).strict();

export const ServiceUncheckedCreateWithoutAssignmentsInputSchema: z.ZodType<Prisma.ServiceUncheckedCreateWithoutAssignmentsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => SERVICE_NAMESchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  classifications: z.lazy(() => ClassificationUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutServiceInputSchema).optional()
}).strict();

export const ServiceCreateOrConnectWithoutAssignmentsInputSchema: z.ZodType<Prisma.ServiceCreateOrConnectWithoutAssignmentsInput> = z.object({
  where: z.lazy(() => ServiceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ServiceCreateWithoutAssignmentsInputSchema),z.lazy(() => ServiceUncheckedCreateWithoutAssignmentsInputSchema) ]),
}).strict();

export const GroupUpsertWithoutAssignmentsInputSchema: z.ZodType<Prisma.GroupUpsertWithoutAssignmentsInput> = z.object({
  update: z.union([ z.lazy(() => GroupUpdateWithoutAssignmentsInputSchema),z.lazy(() => GroupUncheckedUpdateWithoutAssignmentsInputSchema) ]),
  create: z.union([ z.lazy(() => GroupCreateWithoutAssignmentsInputSchema),z.lazy(() => GroupUncheckedCreateWithoutAssignmentsInputSchema) ]),
  where: z.lazy(() => GroupWhereInputSchema).optional()
}).strict();

export const GroupUpdateToOneWithWhereWithoutAssignmentsInputSchema: z.ZodType<Prisma.GroupUpdateToOneWithWhereWithoutAssignmentsInput> = z.object({
  where: z.lazy(() => GroupWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => GroupUpdateWithoutAssignmentsInputSchema),z.lazy(() => GroupUncheckedUpdateWithoutAssignmentsInputSchema) ]),
}).strict();

export const GroupUpdateWithoutAssignmentsInputSchema: z.ZodType<Prisma.GroupUpdateWithoutAssignmentsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  space: z.lazy(() => SpaceUpdateOneRequiredWithoutGroupsNestedInputSchema).optional()
}).strict();

export const GroupUncheckedUpdateWithoutAssignmentsInputSchema: z.ZodType<Prisma.GroupUncheckedUpdateWithoutAssignmentsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ServiceUpsertWithoutAssignmentsInputSchema: z.ZodType<Prisma.ServiceUpsertWithoutAssignmentsInput> = z.object({
  update: z.union([ z.lazy(() => ServiceUpdateWithoutAssignmentsInputSchema),z.lazy(() => ServiceUncheckedUpdateWithoutAssignmentsInputSchema) ]),
  create: z.union([ z.lazy(() => ServiceCreateWithoutAssignmentsInputSchema),z.lazy(() => ServiceUncheckedCreateWithoutAssignmentsInputSchema) ]),
  where: z.lazy(() => ServiceWhereInputSchema).optional()
}).strict();

export const ServiceUpdateToOneWithWhereWithoutAssignmentsInputSchema: z.ZodType<Prisma.ServiceUpdateToOneWithWhereWithoutAssignmentsInput> = z.object({
  where: z.lazy(() => ServiceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ServiceUpdateWithoutAssignmentsInputSchema),z.lazy(() => ServiceUncheckedUpdateWithoutAssignmentsInputSchema) ]),
}).strict();

export const ServiceUpdateWithoutAssignmentsInputSchema: z.ZodType<Prisma.ServiceUpdateWithoutAssignmentsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => SERVICE_NAMESchema),z.lazy(() => EnumSERVICE_NAMEFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classifications: z.lazy(() => ClassificationUpdateManyWithoutServiceNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUpdateManyWithoutServiceNestedInputSchema).optional()
}).strict();

export const ServiceUncheckedUpdateWithoutAssignmentsInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateWithoutAssignmentsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => SERVICE_NAMESchema),z.lazy(() => EnumSERVICE_NAMEFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classifications: z.lazy(() => ClassificationUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutServiceNestedInputSchema).optional()
}).strict();

export const TenantCreateWithoutRoleInputSchema: z.ZodType<Prisma.TenantCreateWithoutRoleInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  space: z.lazy(() => SpaceCreateNestedOneWithoutTenantsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutTenantsInputSchema)
}).strict();

export const TenantUncheckedCreateWithoutRoleInputSchema: z.ZodType<Prisma.TenantUncheckedCreateWithoutRoleInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  spaceId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const TenantCreateOrConnectWithoutRoleInputSchema: z.ZodType<Prisma.TenantCreateOrConnectWithoutRoleInput> = z.object({
  where: z.lazy(() => TenantWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TenantCreateWithoutRoleInputSchema),z.lazy(() => TenantUncheckedCreateWithoutRoleInputSchema) ]),
}).strict();

export const TenantCreateManyRoleInputEnvelopeSchema: z.ZodType<Prisma.TenantCreateManyRoleInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TenantCreateManyRoleInputSchema),z.lazy(() => TenantCreateManyRoleInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TenantUpsertWithWhereUniqueWithoutRoleInputSchema: z.ZodType<Prisma.TenantUpsertWithWhereUniqueWithoutRoleInput> = z.object({
  where: z.lazy(() => TenantWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TenantUpdateWithoutRoleInputSchema),z.lazy(() => TenantUncheckedUpdateWithoutRoleInputSchema) ]),
  create: z.union([ z.lazy(() => TenantCreateWithoutRoleInputSchema),z.lazy(() => TenantUncheckedCreateWithoutRoleInputSchema) ]),
}).strict();

export const TenantUpdateWithWhereUniqueWithoutRoleInputSchema: z.ZodType<Prisma.TenantUpdateWithWhereUniqueWithoutRoleInput> = z.object({
  where: z.lazy(() => TenantWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TenantUpdateWithoutRoleInputSchema),z.lazy(() => TenantUncheckedUpdateWithoutRoleInputSchema) ]),
}).strict();

export const TenantUpdateManyWithWhereWithoutRoleInputSchema: z.ZodType<Prisma.TenantUpdateManyWithWhereWithoutRoleInput> = z.object({
  where: z.lazy(() => TenantScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TenantUpdateManyMutationInputSchema),z.lazy(() => TenantUncheckedUpdateManyWithoutRoleInputSchema) ]),
}).strict();

export const RoleCreateWithoutTenantsInputSchema: z.ZodType<Prisma.RoleCreateWithoutTenantsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => RolesSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const RoleUncheckedCreateWithoutTenantsInputSchema: z.ZodType<Prisma.RoleUncheckedCreateWithoutTenantsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => RolesSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const RoleCreateOrConnectWithoutTenantsInputSchema: z.ZodType<Prisma.RoleCreateOrConnectWithoutTenantsInput> = z.object({
  where: z.lazy(() => RoleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoleCreateWithoutTenantsInputSchema),z.lazy(() => RoleUncheckedCreateWithoutTenantsInputSchema) ]),
}).strict();

export const SpaceCreateWithoutTenantsInputSchema: z.ZodType<Prisma.SpaceCreateWithoutTenantsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  categories: z.lazy(() => CategoryCreateNestedManyWithoutSpaceInputSchema).optional(),
  groups: z.lazy(() => GroupCreateNestedManyWithoutSpaceInputSchema).optional()
}).strict();

export const SpaceUncheckedCreateWithoutTenantsInputSchema: z.ZodType<Prisma.SpaceUncheckedCreateWithoutTenantsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutSpaceInputSchema).optional(),
  groups: z.lazy(() => GroupUncheckedCreateNestedManyWithoutSpaceInputSchema).optional()
}).strict();

export const SpaceCreateOrConnectWithoutTenantsInputSchema: z.ZodType<Prisma.SpaceCreateOrConnectWithoutTenantsInput> = z.object({
  where: z.lazy(() => SpaceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SpaceCreateWithoutTenantsInputSchema),z.lazy(() => SpaceUncheckedCreateWithoutTenantsInputSchema) ]),
}).strict();

export const UserCreateWithoutTenantsInputSchema: z.ZodType<Prisma.UserCreateWithoutTenantsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string(),
  phone: z.string(),
  password: z.string(),
  deletedAt: z.coerce.date().optional().nullable(),
  updatedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  profiles: z.lazy(() => ProfileCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutTenantsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutTenantsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string(),
  phone: z.string(),
  password: z.string(),
  deletedAt: z.coerce.date().optional().nullable(),
  updatedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  profiles: z.lazy(() => ProfileUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutTenantsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTenantsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutTenantsInputSchema),z.lazy(() => UserUncheckedCreateWithoutTenantsInputSchema) ]),
}).strict();

export const RoleUpsertWithoutTenantsInputSchema: z.ZodType<Prisma.RoleUpsertWithoutTenantsInput> = z.object({
  update: z.union([ z.lazy(() => RoleUpdateWithoutTenantsInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutTenantsInputSchema) ]),
  create: z.union([ z.lazy(() => RoleCreateWithoutTenantsInputSchema),z.lazy(() => RoleUncheckedCreateWithoutTenantsInputSchema) ]),
  where: z.lazy(() => RoleWhereInputSchema).optional()
}).strict();

export const RoleUpdateToOneWithWhereWithoutTenantsInputSchema: z.ZodType<Prisma.RoleUpdateToOneWithWhereWithoutTenantsInput> = z.object({
  where: z.lazy(() => RoleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RoleUpdateWithoutTenantsInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutTenantsInputSchema) ]),
}).strict();

export const RoleUpdateWithoutTenantsInputSchema: z.ZodType<Prisma.RoleUpdateWithoutTenantsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => RolesSchema),z.lazy(() => EnumRolesFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RoleUncheckedUpdateWithoutTenantsInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateWithoutTenantsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => RolesSchema),z.lazy(() => EnumRolesFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SpaceUpsertWithoutTenantsInputSchema: z.ZodType<Prisma.SpaceUpsertWithoutTenantsInput> = z.object({
  update: z.union([ z.lazy(() => SpaceUpdateWithoutTenantsInputSchema),z.lazy(() => SpaceUncheckedUpdateWithoutTenantsInputSchema) ]),
  create: z.union([ z.lazy(() => SpaceCreateWithoutTenantsInputSchema),z.lazy(() => SpaceUncheckedCreateWithoutTenantsInputSchema) ]),
  where: z.lazy(() => SpaceWhereInputSchema).optional()
}).strict();

export const SpaceUpdateToOneWithWhereWithoutTenantsInputSchema: z.ZodType<Prisma.SpaceUpdateToOneWithWhereWithoutTenantsInput> = z.object({
  where: z.lazy(() => SpaceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SpaceUpdateWithoutTenantsInputSchema),z.lazy(() => SpaceUncheckedUpdateWithoutTenantsInputSchema) ]),
}).strict();

export const SpaceUpdateWithoutTenantsInputSchema: z.ZodType<Prisma.SpaceUpdateWithoutTenantsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  categories: z.lazy(() => CategoryUpdateManyWithoutSpaceNestedInputSchema).optional(),
  groups: z.lazy(() => GroupUpdateManyWithoutSpaceNestedInputSchema).optional()
}).strict();

export const SpaceUncheckedUpdateWithoutTenantsInputSchema: z.ZodType<Prisma.SpaceUncheckedUpdateWithoutTenantsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutSpaceNestedInputSchema).optional(),
  groups: z.lazy(() => GroupUncheckedUpdateManyWithoutSpaceNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutTenantsInputSchema: z.ZodType<Prisma.UserUpsertWithoutTenantsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutTenantsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTenantsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutTenantsInputSchema),z.lazy(() => UserUncheckedCreateWithoutTenantsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutTenantsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTenantsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutTenantsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTenantsInputSchema) ]),
}).strict();

export const UserUpdateWithoutTenantsInputSchema: z.ZodType<Prisma.UserUpdateWithoutTenantsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profiles: z.lazy(() => ProfileUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutTenantsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutTenantsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profiles: z.lazy(() => ProfileUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ServiceCreateWithoutClassificationsInputSchema: z.ZodType<Prisma.ServiceCreateWithoutClassificationsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => SERVICE_NAMESchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  assignments: z.lazy(() => AssignmentCreateNestedManyWithoutServiceInputSchema).optional(),
  categories: z.lazy(() => CategoryCreateNestedManyWithoutServiceInputSchema).optional()
}).strict();

export const ServiceUncheckedCreateWithoutClassificationsInputSchema: z.ZodType<Prisma.ServiceUncheckedCreateWithoutClassificationsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.lazy(() => SERVICE_NAMESchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  assignments: z.lazy(() => AssignmentUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutServiceInputSchema).optional()
}).strict();

export const ServiceCreateOrConnectWithoutClassificationsInputSchema: z.ZodType<Prisma.ServiceCreateOrConnectWithoutClassificationsInput> = z.object({
  where: z.lazy(() => ServiceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ServiceCreateWithoutClassificationsInputSchema),z.lazy(() => ServiceUncheckedCreateWithoutClassificationsInputSchema) ]),
}).strict();

export const CategoryCreateWithoutClassificationsInputSchema: z.ZodType<Prisma.CategoryCreateWithoutClassificationsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  ancestorIds: z.union([ z.lazy(() => CategoryCreateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  space: z.lazy(() => SpaceCreateNestedOneWithoutCategoriesInputSchema),
  service: z.lazy(() => ServiceCreateNestedOneWithoutCategoriesInputSchema)
}).strict();

export const CategoryUncheckedCreateWithoutClassificationsInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutClassificationsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  serviceId: z.string(),
  spaceId: z.string(),
  ancestorIds: z.union([ z.lazy(() => CategoryCreateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const CategoryCreateOrConnectWithoutClassificationsInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutClassificationsInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryCreateWithoutClassificationsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutClassificationsInputSchema) ]),
}).strict();

export const ServiceUpsertWithoutClassificationsInputSchema: z.ZodType<Prisma.ServiceUpsertWithoutClassificationsInput> = z.object({
  update: z.union([ z.lazy(() => ServiceUpdateWithoutClassificationsInputSchema),z.lazy(() => ServiceUncheckedUpdateWithoutClassificationsInputSchema) ]),
  create: z.union([ z.lazy(() => ServiceCreateWithoutClassificationsInputSchema),z.lazy(() => ServiceUncheckedCreateWithoutClassificationsInputSchema) ]),
  where: z.lazy(() => ServiceWhereInputSchema).optional()
}).strict();

export const ServiceUpdateToOneWithWhereWithoutClassificationsInputSchema: z.ZodType<Prisma.ServiceUpdateToOneWithWhereWithoutClassificationsInput> = z.object({
  where: z.lazy(() => ServiceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ServiceUpdateWithoutClassificationsInputSchema),z.lazy(() => ServiceUncheckedUpdateWithoutClassificationsInputSchema) ]),
}).strict();

export const ServiceUpdateWithoutClassificationsInputSchema: z.ZodType<Prisma.ServiceUpdateWithoutClassificationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => SERVICE_NAMESchema),z.lazy(() => EnumSERVICE_NAMEFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assignments: z.lazy(() => AssignmentUpdateManyWithoutServiceNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUpdateManyWithoutServiceNestedInputSchema).optional()
}).strict();

export const ServiceUncheckedUpdateWithoutClassificationsInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateWithoutClassificationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => SERVICE_NAMESchema),z.lazy(() => EnumSERVICE_NAMEFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assignments: z.lazy(() => AssignmentUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
  categories: z.lazy(() => CategoryUncheckedUpdateManyWithoutServiceNestedInputSchema).optional()
}).strict();

export const CategoryUpsertWithoutClassificationsInputSchema: z.ZodType<Prisma.CategoryUpsertWithoutClassificationsInput> = z.object({
  update: z.union([ z.lazy(() => CategoryUpdateWithoutClassificationsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutClassificationsInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryCreateWithoutClassificationsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutClassificationsInputSchema) ]),
  where: z.lazy(() => CategoryWhereInputSchema).optional()
}).strict();

export const CategoryUpdateToOneWithWhereWithoutClassificationsInputSchema: z.ZodType<Prisma.CategoryUpdateToOneWithWhereWithoutClassificationsInput> = z.object({
  where: z.lazy(() => CategoryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CategoryUpdateWithoutClassificationsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutClassificationsInputSchema) ]),
}).strict();

export const CategoryUpdateWithoutClassificationsInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutClassificationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ancestorIds: z.union([ z.lazy(() => CategoryUpdateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  space: z.lazy(() => SpaceUpdateOneRequiredWithoutCategoriesNestedInputSchema).optional(),
  service: z.lazy(() => ServiceUpdateOneRequiredWithoutCategoriesNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateWithoutClassificationsInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutClassificationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ancestorIds: z.union([ z.lazy(() => CategoryUpdateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TenantCreateWithoutSpaceInputSchema: z.ZodType<Prisma.TenantCreateWithoutSpaceInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  role: z.lazy(() => RoleCreateNestedOneWithoutTenantsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutTenantsInputSchema)
}).strict();

export const TenantUncheckedCreateWithoutSpaceInputSchema: z.ZodType<Prisma.TenantUncheckedCreateWithoutSpaceInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  roleId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const TenantCreateOrConnectWithoutSpaceInputSchema: z.ZodType<Prisma.TenantCreateOrConnectWithoutSpaceInput> = z.object({
  where: z.lazy(() => TenantWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TenantCreateWithoutSpaceInputSchema),z.lazy(() => TenantUncheckedCreateWithoutSpaceInputSchema) ]),
}).strict();

export const TenantCreateManySpaceInputEnvelopeSchema: z.ZodType<Prisma.TenantCreateManySpaceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TenantCreateManySpaceInputSchema),z.lazy(() => TenantCreateManySpaceInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CategoryCreateWithoutSpaceInputSchema: z.ZodType<Prisma.CategoryCreateWithoutSpaceInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  ancestorIds: z.union([ z.lazy(() => CategoryCreateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  classifications: z.lazy(() => ClassificationCreateNestedManyWithoutCategoryInputSchema).optional(),
  service: z.lazy(() => ServiceCreateNestedOneWithoutCategoriesInputSchema)
}).strict();

export const CategoryUncheckedCreateWithoutSpaceInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutSpaceInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  serviceId: z.string(),
  ancestorIds: z.union([ z.lazy(() => CategoryCreateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  classifications: z.lazy(() => ClassificationUncheckedCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryCreateOrConnectWithoutSpaceInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutSpaceInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryCreateWithoutSpaceInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutSpaceInputSchema) ]),
}).strict();

export const CategoryCreateManySpaceInputEnvelopeSchema: z.ZodType<Prisma.CategoryCreateManySpaceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CategoryCreateManySpaceInputSchema),z.lazy(() => CategoryCreateManySpaceInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const GroupCreateWithoutSpaceInputSchema: z.ZodType<Prisma.GroupCreateWithoutSpaceInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  serviceId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  assignments: z.lazy(() => AssignmentCreateNestedManyWithoutGroupInputSchema).optional()
}).strict();

export const GroupUncheckedCreateWithoutSpaceInputSchema: z.ZodType<Prisma.GroupUncheckedCreateWithoutSpaceInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  serviceId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  assignments: z.lazy(() => AssignmentUncheckedCreateNestedManyWithoutGroupInputSchema).optional()
}).strict();

export const GroupCreateOrConnectWithoutSpaceInputSchema: z.ZodType<Prisma.GroupCreateOrConnectWithoutSpaceInput> = z.object({
  where: z.lazy(() => GroupWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => GroupCreateWithoutSpaceInputSchema),z.lazy(() => GroupUncheckedCreateWithoutSpaceInputSchema) ]),
}).strict();

export const GroupCreateManySpaceInputEnvelopeSchema: z.ZodType<Prisma.GroupCreateManySpaceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => GroupCreateManySpaceInputSchema),z.lazy(() => GroupCreateManySpaceInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TenantUpsertWithWhereUniqueWithoutSpaceInputSchema: z.ZodType<Prisma.TenantUpsertWithWhereUniqueWithoutSpaceInput> = z.object({
  where: z.lazy(() => TenantWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TenantUpdateWithoutSpaceInputSchema),z.lazy(() => TenantUncheckedUpdateWithoutSpaceInputSchema) ]),
  create: z.union([ z.lazy(() => TenantCreateWithoutSpaceInputSchema),z.lazy(() => TenantUncheckedCreateWithoutSpaceInputSchema) ]),
}).strict();

export const TenantUpdateWithWhereUniqueWithoutSpaceInputSchema: z.ZodType<Prisma.TenantUpdateWithWhereUniqueWithoutSpaceInput> = z.object({
  where: z.lazy(() => TenantWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TenantUpdateWithoutSpaceInputSchema),z.lazy(() => TenantUncheckedUpdateWithoutSpaceInputSchema) ]),
}).strict();

export const TenantUpdateManyWithWhereWithoutSpaceInputSchema: z.ZodType<Prisma.TenantUpdateManyWithWhereWithoutSpaceInput> = z.object({
  where: z.lazy(() => TenantScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TenantUpdateManyMutationInputSchema),z.lazy(() => TenantUncheckedUpdateManyWithoutSpaceInputSchema) ]),
}).strict();

export const CategoryUpsertWithWhereUniqueWithoutSpaceInputSchema: z.ZodType<Prisma.CategoryUpsertWithWhereUniqueWithoutSpaceInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CategoryUpdateWithoutSpaceInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutSpaceInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryCreateWithoutSpaceInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutSpaceInputSchema) ]),
}).strict();

export const CategoryUpdateWithWhereUniqueWithoutSpaceInputSchema: z.ZodType<Prisma.CategoryUpdateWithWhereUniqueWithoutSpaceInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CategoryUpdateWithoutSpaceInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutSpaceInputSchema) ]),
}).strict();

export const CategoryUpdateManyWithWhereWithoutSpaceInputSchema: z.ZodType<Prisma.CategoryUpdateManyWithWhereWithoutSpaceInput> = z.object({
  where: z.lazy(() => CategoryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CategoryUpdateManyMutationInputSchema),z.lazy(() => CategoryUncheckedUpdateManyWithoutSpaceInputSchema) ]),
}).strict();

export const GroupUpsertWithWhereUniqueWithoutSpaceInputSchema: z.ZodType<Prisma.GroupUpsertWithWhereUniqueWithoutSpaceInput> = z.object({
  where: z.lazy(() => GroupWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => GroupUpdateWithoutSpaceInputSchema),z.lazy(() => GroupUncheckedUpdateWithoutSpaceInputSchema) ]),
  create: z.union([ z.lazy(() => GroupCreateWithoutSpaceInputSchema),z.lazy(() => GroupUncheckedCreateWithoutSpaceInputSchema) ]),
}).strict();

export const GroupUpdateWithWhereUniqueWithoutSpaceInputSchema: z.ZodType<Prisma.GroupUpdateWithWhereUniqueWithoutSpaceInput> = z.object({
  where: z.lazy(() => GroupWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => GroupUpdateWithoutSpaceInputSchema),z.lazy(() => GroupUncheckedUpdateWithoutSpaceInputSchema) ]),
}).strict();

export const GroupUpdateManyWithWhereWithoutSpaceInputSchema: z.ZodType<Prisma.GroupUpdateManyWithWhereWithoutSpaceInput> = z.object({
  where: z.lazy(() => GroupScalarWhereInputSchema),
  data: z.union([ z.lazy(() => GroupUpdateManyMutationInputSchema),z.lazy(() => GroupUncheckedUpdateManyWithoutSpaceInputSchema) ]),
}).strict();

export const GroupScalarWhereInputSchema: z.ZodType<Prisma.GroupScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => GroupScalarWhereInputSchema),z.lazy(() => GroupScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GroupScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GroupScalarWhereInputSchema),z.lazy(() => GroupScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  spaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const TimelineCreateWithoutSessionInputSchema: z.ZodType<Prisma.TimelineCreateWithoutSessionInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  timelineItems: z.lazy(() => TimelineItemCreateNestedManyWithoutTimelineInputSchema).optional()
}).strict();

export const TimelineUncheckedCreateWithoutSessionInputSchema: z.ZodType<Prisma.TimelineUncheckedCreateWithoutSessionInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  timelineItems: z.lazy(() => TimelineItemUncheckedCreateNestedManyWithoutTimelineInputSchema).optional()
}).strict();

export const TimelineCreateOrConnectWithoutSessionInputSchema: z.ZodType<Prisma.TimelineCreateOrConnectWithoutSessionInput> = z.object({
  where: z.lazy(() => TimelineWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TimelineCreateWithoutSessionInputSchema),z.lazy(() => TimelineUncheckedCreateWithoutSessionInputSchema) ]),
}).strict();

export const TimelineCreateManySessionInputEnvelopeSchema: z.ZodType<Prisma.TimelineCreateManySessionInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TimelineCreateManySessionInputSchema),z.lazy(() => TimelineCreateManySessionInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TimelineUpsertWithWhereUniqueWithoutSessionInputSchema: z.ZodType<Prisma.TimelineUpsertWithWhereUniqueWithoutSessionInput> = z.object({
  where: z.lazy(() => TimelineWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TimelineUpdateWithoutSessionInputSchema),z.lazy(() => TimelineUncheckedUpdateWithoutSessionInputSchema) ]),
  create: z.union([ z.lazy(() => TimelineCreateWithoutSessionInputSchema),z.lazy(() => TimelineUncheckedCreateWithoutSessionInputSchema) ]),
}).strict();

export const TimelineUpdateWithWhereUniqueWithoutSessionInputSchema: z.ZodType<Prisma.TimelineUpdateWithWhereUniqueWithoutSessionInput> = z.object({
  where: z.lazy(() => TimelineWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TimelineUpdateWithoutSessionInputSchema),z.lazy(() => TimelineUncheckedUpdateWithoutSessionInputSchema) ]),
}).strict();

export const TimelineUpdateManyWithWhereWithoutSessionInputSchema: z.ZodType<Prisma.TimelineUpdateManyWithWhereWithoutSessionInput> = z.object({
  where: z.lazy(() => TimelineScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TimelineUpdateManyMutationInputSchema),z.lazy(() => TimelineUncheckedUpdateManyWithoutSessionInputSchema) ]),
}).strict();

export const TimelineScalarWhereInputSchema: z.ZodType<Prisma.TimelineScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TimelineScalarWhereInputSchema),z.lazy(() => TimelineScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TimelineScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TimelineScalarWhereInputSchema),z.lazy(() => TimelineScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sessionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const SessionCreateWithoutTimelinesInputSchema: z.ZodType<Prisma.SessionCreateWithoutTimelinesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  tenantId: z.string(),
  dates: z.union([ z.lazy(() => SessionCreatedatesInputSchema),z.coerce.date().array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const SessionUncheckedCreateWithoutTimelinesInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutTimelinesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  tenantId: z.string(),
  dates: z.union([ z.lazy(() => SessionCreatedatesInputSchema),z.coerce.date().array() ]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const SessionCreateOrConnectWithoutTimelinesInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutTimelinesInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SessionCreateWithoutTimelinesInputSchema),z.lazy(() => SessionUncheckedCreateWithoutTimelinesInputSchema) ]),
}).strict();

export const TimelineItemCreateWithoutTimelineInputSchema: z.ZodType<Prisma.TimelineItemCreateWithoutTimelineInput> = z.object({
  id: z.string().cuid().optional(),
  sessionId: z.string(),
  title: z.string(),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  description: z.string(),
  address: z.string().optional().nullable(),
  maxCapacity: z.number().int(),
  minCapacity: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  reservations: z.lazy(() => ReservationCreateNestedManyWithoutTimelineItemInputSchema).optional()
}).strict();

export const TimelineItemUncheckedCreateWithoutTimelineInputSchema: z.ZodType<Prisma.TimelineItemUncheckedCreateWithoutTimelineInput> = z.object({
  id: z.string().cuid().optional(),
  sessionId: z.string(),
  title: z.string(),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  description: z.string(),
  address: z.string().optional().nullable(),
  maxCapacity: z.number().int(),
  minCapacity: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  reservations: z.lazy(() => ReservationUncheckedCreateNestedManyWithoutTimelineItemInputSchema).optional()
}).strict();

export const TimelineItemCreateOrConnectWithoutTimelineInputSchema: z.ZodType<Prisma.TimelineItemCreateOrConnectWithoutTimelineInput> = z.object({
  where: z.lazy(() => TimelineItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TimelineItemCreateWithoutTimelineInputSchema),z.lazy(() => TimelineItemUncheckedCreateWithoutTimelineInputSchema) ]),
}).strict();

export const TimelineItemCreateManyTimelineInputEnvelopeSchema: z.ZodType<Prisma.TimelineItemCreateManyTimelineInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TimelineItemCreateManyTimelineInputSchema),z.lazy(() => TimelineItemCreateManyTimelineInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SessionUpsertWithoutTimelinesInputSchema: z.ZodType<Prisma.SessionUpsertWithoutTimelinesInput> = z.object({
  update: z.union([ z.lazy(() => SessionUpdateWithoutTimelinesInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutTimelinesInputSchema) ]),
  create: z.union([ z.lazy(() => SessionCreateWithoutTimelinesInputSchema),z.lazy(() => SessionUncheckedCreateWithoutTimelinesInputSchema) ]),
  where: z.lazy(() => SessionWhereInputSchema).optional()
}).strict();

export const SessionUpdateToOneWithWhereWithoutTimelinesInputSchema: z.ZodType<Prisma.SessionUpdateToOneWithWhereWithoutTimelinesInput> = z.object({
  where: z.lazy(() => SessionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SessionUpdateWithoutTimelinesInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutTimelinesInputSchema) ]),
}).strict();

export const SessionUpdateWithoutTimelinesInputSchema: z.ZodType<Prisma.SessionUpdateWithoutTimelinesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tenantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dates: z.union([ z.lazy(() => SessionUpdatedatesInputSchema),z.coerce.date().array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionUncheckedUpdateWithoutTimelinesInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutTimelinesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tenantId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dates: z.union([ z.lazy(() => SessionUpdatedatesInputSchema),z.coerce.date().array() ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TimelineItemUpsertWithWhereUniqueWithoutTimelineInputSchema: z.ZodType<Prisma.TimelineItemUpsertWithWhereUniqueWithoutTimelineInput> = z.object({
  where: z.lazy(() => TimelineItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TimelineItemUpdateWithoutTimelineInputSchema),z.lazy(() => TimelineItemUncheckedUpdateWithoutTimelineInputSchema) ]),
  create: z.union([ z.lazy(() => TimelineItemCreateWithoutTimelineInputSchema),z.lazy(() => TimelineItemUncheckedCreateWithoutTimelineInputSchema) ]),
}).strict();

export const TimelineItemUpdateWithWhereUniqueWithoutTimelineInputSchema: z.ZodType<Prisma.TimelineItemUpdateWithWhereUniqueWithoutTimelineInput> = z.object({
  where: z.lazy(() => TimelineItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TimelineItemUpdateWithoutTimelineInputSchema),z.lazy(() => TimelineItemUncheckedUpdateWithoutTimelineInputSchema) ]),
}).strict();

export const TimelineItemUpdateManyWithWhereWithoutTimelineInputSchema: z.ZodType<Prisma.TimelineItemUpdateManyWithWhereWithoutTimelineInput> = z.object({
  where: z.lazy(() => TimelineItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TimelineItemUpdateManyMutationInputSchema),z.lazy(() => TimelineItemUncheckedUpdateManyWithoutTimelineInputSchema) ]),
}).strict();

export const TimelineItemScalarWhereInputSchema: z.ZodType<Prisma.TimelineItemScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TimelineItemScalarWhereInputSchema),z.lazy(() => TimelineItemScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TimelineItemScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TimelineItemScalarWhereInputSchema),z.lazy(() => TimelineItemScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  timelineId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sessionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startDateTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endDateTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  maxCapacity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  minCapacity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ReservationCreateWithoutTimelineItemInputSchema: z.ZodType<Prisma.ReservationCreateWithoutTimelineItemInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReservationUncheckedCreateWithoutTimelineItemInputSchema: z.ZodType<Prisma.ReservationUncheckedCreateWithoutTimelineItemInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReservationCreateOrConnectWithoutTimelineItemInputSchema: z.ZodType<Prisma.ReservationCreateOrConnectWithoutTimelineItemInput> = z.object({
  where: z.lazy(() => ReservationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ReservationCreateWithoutTimelineItemInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutTimelineItemInputSchema) ]),
}).strict();

export const ReservationCreateManyTimelineItemInputEnvelopeSchema: z.ZodType<Prisma.ReservationCreateManyTimelineItemInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ReservationCreateManyTimelineItemInputSchema),z.lazy(() => ReservationCreateManyTimelineItemInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TimelineCreateWithoutTimelineItemsInputSchema: z.ZodType<Prisma.TimelineCreateWithoutTimelineItemsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  session: z.lazy(() => SessionCreateNestedOneWithoutTimelinesInputSchema)
}).strict();

export const TimelineUncheckedCreateWithoutTimelineItemsInputSchema: z.ZodType<Prisma.TimelineUncheckedCreateWithoutTimelineItemsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  sessionId: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const TimelineCreateOrConnectWithoutTimelineItemsInputSchema: z.ZodType<Prisma.TimelineCreateOrConnectWithoutTimelineItemsInput> = z.object({
  where: z.lazy(() => TimelineWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TimelineCreateWithoutTimelineItemsInputSchema),z.lazy(() => TimelineUncheckedCreateWithoutTimelineItemsInputSchema) ]),
}).strict();

export const ReservationUpsertWithWhereUniqueWithoutTimelineItemInputSchema: z.ZodType<Prisma.ReservationUpsertWithWhereUniqueWithoutTimelineItemInput> = z.object({
  where: z.lazy(() => ReservationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ReservationUpdateWithoutTimelineItemInputSchema),z.lazy(() => ReservationUncheckedUpdateWithoutTimelineItemInputSchema) ]),
  create: z.union([ z.lazy(() => ReservationCreateWithoutTimelineItemInputSchema),z.lazy(() => ReservationUncheckedCreateWithoutTimelineItemInputSchema) ]),
}).strict();

export const ReservationUpdateWithWhereUniqueWithoutTimelineItemInputSchema: z.ZodType<Prisma.ReservationUpdateWithWhereUniqueWithoutTimelineItemInput> = z.object({
  where: z.lazy(() => ReservationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ReservationUpdateWithoutTimelineItemInputSchema),z.lazy(() => ReservationUncheckedUpdateWithoutTimelineItemInputSchema) ]),
}).strict();

export const ReservationUpdateManyWithWhereWithoutTimelineItemInputSchema: z.ZodType<Prisma.ReservationUpdateManyWithWhereWithoutTimelineItemInput> = z.object({
  where: z.lazy(() => ReservationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ReservationUpdateManyMutationInputSchema),z.lazy(() => ReservationUncheckedUpdateManyWithoutTimelineItemInputSchema) ]),
}).strict();

export const ReservationScalarWhereInputSchema: z.ZodType<Prisma.ReservationScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ReservationScalarWhereInputSchema),z.lazy(() => ReservationScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReservationScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReservationScalarWhereInputSchema),z.lazy(() => ReservationScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  timelineItemId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const TimelineUpsertWithoutTimelineItemsInputSchema: z.ZodType<Prisma.TimelineUpsertWithoutTimelineItemsInput> = z.object({
  update: z.union([ z.lazy(() => TimelineUpdateWithoutTimelineItemsInputSchema),z.lazy(() => TimelineUncheckedUpdateWithoutTimelineItemsInputSchema) ]),
  create: z.union([ z.lazy(() => TimelineCreateWithoutTimelineItemsInputSchema),z.lazy(() => TimelineUncheckedCreateWithoutTimelineItemsInputSchema) ]),
  where: z.lazy(() => TimelineWhereInputSchema).optional()
}).strict();

export const TimelineUpdateToOneWithWhereWithoutTimelineItemsInputSchema: z.ZodType<Prisma.TimelineUpdateToOneWithWhereWithoutTimelineItemsInput> = z.object({
  where: z.lazy(() => TimelineWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TimelineUpdateWithoutTimelineItemsInputSchema),z.lazy(() => TimelineUncheckedUpdateWithoutTimelineItemsInputSchema) ]),
}).strict();

export const TimelineUpdateWithoutTimelineItemsInputSchema: z.ZodType<Prisma.TimelineUpdateWithoutTimelineItemsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session: z.lazy(() => SessionUpdateOneRequiredWithoutTimelinesNestedInputSchema).optional()
}).strict();

export const TimelineUncheckedUpdateWithoutTimelineItemsInputSchema: z.ZodType<Prisma.TimelineUncheckedUpdateWithoutTimelineItemsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TimelineItemCreateWithoutReservationsInputSchema: z.ZodType<Prisma.TimelineItemCreateWithoutReservationsInput> = z.object({
  id: z.string().cuid().optional(),
  sessionId: z.string(),
  title: z.string(),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  description: z.string(),
  address: z.string().optional().nullable(),
  maxCapacity: z.number().int(),
  minCapacity: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable(),
  timeline: z.lazy(() => TimelineCreateNestedOneWithoutTimelineItemsInputSchema).optional()
}).strict();

export const TimelineItemUncheckedCreateWithoutReservationsInputSchema: z.ZodType<Prisma.TimelineItemUncheckedCreateWithoutReservationsInput> = z.object({
  id: z.string().cuid().optional(),
  timelineId: z.string().optional().nullable(),
  sessionId: z.string(),
  title: z.string(),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  description: z.string(),
  address: z.string().optional().nullable(),
  maxCapacity: z.number().int(),
  minCapacity: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const TimelineItemCreateOrConnectWithoutReservationsInputSchema: z.ZodType<Prisma.TimelineItemCreateOrConnectWithoutReservationsInput> = z.object({
  where: z.lazy(() => TimelineItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TimelineItemCreateWithoutReservationsInputSchema),z.lazy(() => TimelineItemUncheckedCreateWithoutReservationsInputSchema) ]),
}).strict();

export const TimelineItemUpsertWithoutReservationsInputSchema: z.ZodType<Prisma.TimelineItemUpsertWithoutReservationsInput> = z.object({
  update: z.union([ z.lazy(() => TimelineItemUpdateWithoutReservationsInputSchema),z.lazy(() => TimelineItemUncheckedUpdateWithoutReservationsInputSchema) ]),
  create: z.union([ z.lazy(() => TimelineItemCreateWithoutReservationsInputSchema),z.lazy(() => TimelineItemUncheckedCreateWithoutReservationsInputSchema) ]),
  where: z.lazy(() => TimelineItemWhereInputSchema).optional()
}).strict();

export const TimelineItemUpdateToOneWithWhereWithoutReservationsInputSchema: z.ZodType<Prisma.TimelineItemUpdateToOneWithWhereWithoutReservationsInput> = z.object({
  where: z.lazy(() => TimelineItemWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TimelineItemUpdateWithoutReservationsInputSchema),z.lazy(() => TimelineItemUncheckedUpdateWithoutReservationsInputSchema) ]),
}).strict();

export const TimelineItemUpdateWithoutReservationsInputSchema: z.ZodType<Prisma.TimelineItemUpdateWithoutReservationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeline: z.lazy(() => TimelineUpdateOneWithoutTimelineItemsNestedInputSchema).optional()
}).strict();

export const TimelineItemUncheckedUpdateWithoutReservationsInputSchema: z.ZodType<Prisma.TimelineItemUncheckedUpdateWithoutReservationsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timelineId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AbilityCreateWithoutSubjectInputSchema: z.ZodType<Prisma.AbilityCreateWithoutSubjectInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => AbilityTypesSchema),
  roleId: z.string(),
  action: z.lazy(() => AbilityActionsSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const AbilityUncheckedCreateWithoutSubjectInputSchema: z.ZodType<Prisma.AbilityUncheckedCreateWithoutSubjectInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => AbilityTypesSchema),
  roleId: z.string(),
  action: z.lazy(() => AbilityActionsSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const AbilityCreateOrConnectWithoutSubjectInputSchema: z.ZodType<Prisma.AbilityCreateOrConnectWithoutSubjectInput> = z.object({
  where: z.lazy(() => AbilityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AbilityCreateWithoutSubjectInputSchema),z.lazy(() => AbilityUncheckedCreateWithoutSubjectInputSchema) ]),
}).strict();

export const AbilityCreateManySubjectInputEnvelopeSchema: z.ZodType<Prisma.AbilityCreateManySubjectInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AbilityCreateManySubjectInputSchema),z.lazy(() => AbilityCreateManySubjectInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AbilityUpsertWithWhereUniqueWithoutSubjectInputSchema: z.ZodType<Prisma.AbilityUpsertWithWhereUniqueWithoutSubjectInput> = z.object({
  where: z.lazy(() => AbilityWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AbilityUpdateWithoutSubjectInputSchema),z.lazy(() => AbilityUncheckedUpdateWithoutSubjectInputSchema) ]),
  create: z.union([ z.lazy(() => AbilityCreateWithoutSubjectInputSchema),z.lazy(() => AbilityUncheckedCreateWithoutSubjectInputSchema) ]),
}).strict();

export const AbilityUpdateWithWhereUniqueWithoutSubjectInputSchema: z.ZodType<Prisma.AbilityUpdateWithWhereUniqueWithoutSubjectInput> = z.object({
  where: z.lazy(() => AbilityWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AbilityUpdateWithoutSubjectInputSchema),z.lazy(() => AbilityUncheckedUpdateWithoutSubjectInputSchema) ]),
}).strict();

export const AbilityUpdateManyWithWhereWithoutSubjectInputSchema: z.ZodType<Prisma.AbilityUpdateManyWithWhereWithoutSubjectInput> = z.object({
  where: z.lazy(() => AbilityScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AbilityUpdateManyMutationInputSchema),z.lazy(() => AbilityUncheckedUpdateManyWithoutSubjectInputSchema) ]),
}).strict();

export const AbilityScalarWhereInputSchema: z.ZodType<Prisma.AbilityScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AbilityScalarWhereInputSchema),z.lazy(() => AbilityScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AbilityScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AbilityScalarWhereInputSchema),z.lazy(() => AbilityScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumAbilityTypesFilterSchema),z.lazy(() => AbilityTypesSchema) ]).optional(),
  roleId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  action: z.union([ z.lazy(() => EnumAbilityActionsFilterSchema),z.lazy(() => AbilityActionsSchema) ]).optional(),
  subjectId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const SubjectCreateWithoutAbilitiesInputSchema: z.ZodType<Prisma.SubjectCreateWithoutAbilitiesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const SubjectUncheckedCreateWithoutAbilitiesInputSchema: z.ZodType<Prisma.SubjectUncheckedCreateWithoutAbilitiesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const SubjectCreateOrConnectWithoutAbilitiesInputSchema: z.ZodType<Prisma.SubjectCreateOrConnectWithoutAbilitiesInput> = z.object({
  where: z.lazy(() => SubjectWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SubjectCreateWithoutAbilitiesInputSchema),z.lazy(() => SubjectUncheckedCreateWithoutAbilitiesInputSchema) ]),
}).strict();

export const SubjectUpsertWithoutAbilitiesInputSchema: z.ZodType<Prisma.SubjectUpsertWithoutAbilitiesInput> = z.object({
  update: z.union([ z.lazy(() => SubjectUpdateWithoutAbilitiesInputSchema),z.lazy(() => SubjectUncheckedUpdateWithoutAbilitiesInputSchema) ]),
  create: z.union([ z.lazy(() => SubjectCreateWithoutAbilitiesInputSchema),z.lazy(() => SubjectUncheckedCreateWithoutAbilitiesInputSchema) ]),
  where: z.lazy(() => SubjectWhereInputSchema).optional()
}).strict();

export const SubjectUpdateToOneWithWhereWithoutAbilitiesInputSchema: z.ZodType<Prisma.SubjectUpdateToOneWithWhereWithoutAbilitiesInput> = z.object({
  where: z.lazy(() => SubjectWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SubjectUpdateWithoutAbilitiesInputSchema),z.lazy(() => SubjectUncheckedUpdateWithoutAbilitiesInputSchema) ]),
}).strict();

export const SubjectUpdateWithoutAbilitiesInputSchema: z.ZodType<Prisma.SubjectUpdateWithoutAbilitiesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SubjectUncheckedUpdateWithoutAbilitiesInputSchema: z.ZodType<Prisma.SubjectUncheckedUpdateWithoutAbilitiesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProfileCreateManyUserInputSchema: z.ZodType<Prisma.ProfileCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  nickname: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const TenantCreateManyUserInputSchema: z.ZodType<Prisma.TenantCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  spaceId: z.string(),
  roleId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ProfileUpdateWithoutUserInputSchema: z.ZodType<Prisma.ProfileUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nickname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProfileUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nickname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProfileUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nickname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TenantUpdateWithoutUserInputSchema: z.ZodType<Prisma.TenantUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.lazy(() => RoleUpdateOneRequiredWithoutTenantsNestedInputSchema).optional(),
  space: z.lazy(() => SpaceUpdateOneRequiredWithoutTenantsNestedInputSchema).optional()
}).strict();

export const TenantUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.TenantUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TenantUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.TenantUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ClassificationCreateManyCategoryInputSchema: z.ZodType<Prisma.ClassificationCreateManyCategoryInput> = z.object({
  id: z.string().cuid().optional(),
  serviceId: z.string(),
  serviceItemId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ClassificationUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.ClassificationUpdateWithoutCategoryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  service: z.lazy(() => ServiceUpdateOneRequiredWithoutClassificationsNestedInputSchema).optional()
}).strict();

export const ClassificationUncheckedUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.ClassificationUncheckedUpdateWithoutCategoryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ClassificationUncheckedUpdateManyWithoutCategoryInputSchema: z.ZodType<Prisma.ClassificationUncheckedUpdateManyWithoutCategoryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AssignmentCreateManyGroupInputSchema: z.ZodType<Prisma.AssignmentCreateManyGroupInput> = z.object({
  id: z.string().cuid().optional(),
  serviceId: z.string(),
  serviceItemId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const AssignmentUpdateWithoutGroupInputSchema: z.ZodType<Prisma.AssignmentUpdateWithoutGroupInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  service: z.lazy(() => ServiceUpdateOneRequiredWithoutAssignmentsNestedInputSchema).optional()
}).strict();

export const AssignmentUncheckedUpdateWithoutGroupInputSchema: z.ZodType<Prisma.AssignmentUncheckedUpdateWithoutGroupInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AssignmentUncheckedUpdateManyWithoutGroupInputSchema: z.ZodType<Prisma.AssignmentUncheckedUpdateManyWithoutGroupInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ClassificationCreateManyServiceInputSchema: z.ZodType<Prisma.ClassificationCreateManyServiceInput> = z.object({
  id: z.string().cuid().optional(),
  serviceItemId: z.string(),
  categoryId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const AssignmentCreateManyServiceInputSchema: z.ZodType<Prisma.AssignmentCreateManyServiceInput> = z.object({
  id: z.string().cuid().optional(),
  groupId: z.string(),
  serviceItemId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const CategoryCreateManyServiceInputSchema: z.ZodType<Prisma.CategoryCreateManyServiceInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  spaceId: z.string(),
  ancestorIds: z.union([ z.lazy(() => CategoryCreateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ClassificationUpdateWithoutServiceInputSchema: z.ZodType<Prisma.ClassificationUpdateWithoutServiceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutClassificationsNestedInputSchema).optional()
}).strict();

export const ClassificationUncheckedUpdateWithoutServiceInputSchema: z.ZodType<Prisma.ClassificationUncheckedUpdateWithoutServiceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ClassificationUncheckedUpdateManyWithoutServiceInputSchema: z.ZodType<Prisma.ClassificationUncheckedUpdateManyWithoutServiceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AssignmentUpdateWithoutServiceInputSchema: z.ZodType<Prisma.AssignmentUpdateWithoutServiceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  group: z.lazy(() => GroupUpdateOneRequiredWithoutAssignmentsNestedInputSchema).optional()
}).strict();

export const AssignmentUncheckedUpdateWithoutServiceInputSchema: z.ZodType<Prisma.AssignmentUncheckedUpdateWithoutServiceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  groupId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AssignmentUncheckedUpdateManyWithoutServiceInputSchema: z.ZodType<Prisma.AssignmentUncheckedUpdateManyWithoutServiceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  groupId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CategoryUpdateWithoutServiceInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutServiceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ancestorIds: z.union([ z.lazy(() => CategoryUpdateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  space: z.lazy(() => SpaceUpdateOneRequiredWithoutCategoriesNestedInputSchema).optional(),
  classifications: z.lazy(() => ClassificationUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateWithoutServiceInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutServiceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ancestorIds: z.union([ z.lazy(() => CategoryUpdateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classifications: z.lazy(() => ClassificationUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateManyWithoutServiceInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyWithoutServiceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ancestorIds: z.union([ z.lazy(() => CategoryUpdateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TenantCreateManyRoleInputSchema: z.ZodType<Prisma.TenantCreateManyRoleInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  spaceId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const TenantUpdateWithoutRoleInputSchema: z.ZodType<Prisma.TenantUpdateWithoutRoleInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  space: z.lazy(() => SpaceUpdateOneRequiredWithoutTenantsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutTenantsNestedInputSchema).optional()
}).strict();

export const TenantUncheckedUpdateWithoutRoleInputSchema: z.ZodType<Prisma.TenantUncheckedUpdateWithoutRoleInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TenantUncheckedUpdateManyWithoutRoleInputSchema: z.ZodType<Prisma.TenantUncheckedUpdateManyWithoutRoleInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TenantCreateManySpaceInputSchema: z.ZodType<Prisma.TenantCreateManySpaceInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  roleId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const CategoryCreateManySpaceInputSchema: z.ZodType<Prisma.CategoryCreateManySpaceInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  serviceId: z.string(),
  ancestorIds: z.union([ z.lazy(() => CategoryCreateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const GroupCreateManySpaceInputSchema: z.ZodType<Prisma.GroupCreateManySpaceInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  serviceId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const TenantUpdateWithoutSpaceInputSchema: z.ZodType<Prisma.TenantUpdateWithoutSpaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.lazy(() => RoleUpdateOneRequiredWithoutTenantsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutTenantsNestedInputSchema).optional()
}).strict();

export const TenantUncheckedUpdateWithoutSpaceInputSchema: z.ZodType<Prisma.TenantUncheckedUpdateWithoutSpaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TenantUncheckedUpdateManyWithoutSpaceInputSchema: z.ZodType<Prisma.TenantUncheckedUpdateManyWithoutSpaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CategoryUpdateWithoutSpaceInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutSpaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ancestorIds: z.union([ z.lazy(() => CategoryUpdateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classifications: z.lazy(() => ClassificationUpdateManyWithoutCategoryNestedInputSchema).optional(),
  service: z.lazy(() => ServiceUpdateOneRequiredWithoutCategoriesNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateWithoutSpaceInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutSpaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ancestorIds: z.union([ z.lazy(() => CategoryUpdateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  classifications: z.lazy(() => ClassificationUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateManyWithoutSpaceInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyWithoutSpaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ancestorIds: z.union([ z.lazy(() => CategoryUpdateancestorIdsInputSchema),z.string().array() ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const GroupUpdateWithoutSpaceInputSchema: z.ZodType<Prisma.GroupUpdateWithoutSpaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assignments: z.lazy(() => AssignmentUpdateManyWithoutGroupNestedInputSchema).optional()
}).strict();

export const GroupUncheckedUpdateWithoutSpaceInputSchema: z.ZodType<Prisma.GroupUncheckedUpdateWithoutSpaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assignments: z.lazy(() => AssignmentUncheckedUpdateManyWithoutGroupNestedInputSchema).optional()
}).strict();

export const GroupUncheckedUpdateManyWithoutSpaceInputSchema: z.ZodType<Prisma.GroupUncheckedUpdateManyWithoutSpaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TimelineCreateManySessionInputSchema: z.ZodType<Prisma.TimelineCreateManySessionInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const TimelineUpdateWithoutSessionInputSchema: z.ZodType<Prisma.TimelineUpdateWithoutSessionInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timelineItems: z.lazy(() => TimelineItemUpdateManyWithoutTimelineNestedInputSchema).optional()
}).strict();

export const TimelineUncheckedUpdateWithoutSessionInputSchema: z.ZodType<Prisma.TimelineUncheckedUpdateWithoutSessionInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timelineItems: z.lazy(() => TimelineItemUncheckedUpdateManyWithoutTimelineNestedInputSchema).optional()
}).strict();

export const TimelineUncheckedUpdateManyWithoutSessionInputSchema: z.ZodType<Prisma.TimelineUncheckedUpdateManyWithoutSessionInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TimelineItemCreateManyTimelineInputSchema: z.ZodType<Prisma.TimelineItemCreateManyTimelineInput> = z.object({
  id: z.string().cuid().optional(),
  sessionId: z.string(),
  title: z.string(),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  description: z.string(),
  address: z.string().optional().nullable(),
  maxCapacity: z.number().int(),
  minCapacity: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const TimelineItemUpdateWithoutTimelineInputSchema: z.ZodType<Prisma.TimelineItemUpdateWithoutTimelineInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  reservations: z.lazy(() => ReservationUpdateManyWithoutTimelineItemNestedInputSchema).optional()
}).strict();

export const TimelineItemUncheckedUpdateWithoutTimelineInputSchema: z.ZodType<Prisma.TimelineItemUncheckedUpdateWithoutTimelineInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  reservations: z.lazy(() => ReservationUncheckedUpdateManyWithoutTimelineItemNestedInputSchema).optional()
}).strict();

export const TimelineItemUncheckedUpdateManyWithoutTimelineInputSchema: z.ZodType<Prisma.TimelineItemUncheckedUpdateManyWithoutTimelineInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  minCapacity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReservationCreateManyTimelineItemInputSchema: z.ZodType<Prisma.ReservationCreateManyTimelineItemInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReservationUpdateWithoutTimelineItemInputSchema: z.ZodType<Prisma.ReservationUpdateWithoutTimelineItemInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReservationUncheckedUpdateWithoutTimelineItemInputSchema: z.ZodType<Prisma.ReservationUncheckedUpdateWithoutTimelineItemInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReservationUncheckedUpdateManyWithoutTimelineItemInputSchema: z.ZodType<Prisma.ReservationUncheckedUpdateManyWithoutTimelineItemInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AbilityCreateManySubjectInputSchema: z.ZodType<Prisma.AbilityCreateManySubjectInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.lazy(() => AbilityTypesSchema),
  roleId: z.string(),
  action: z.lazy(() => AbilityActionsSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const AbilityUpdateWithoutSubjectInputSchema: z.ZodType<Prisma.AbilityUpdateWithoutSubjectInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AbilityTypesSchema),z.lazy(() => EnumAbilityTypesFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => AbilityActionsSchema),z.lazy(() => EnumAbilityActionsFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AbilityUncheckedUpdateWithoutSubjectInputSchema: z.ZodType<Prisma.AbilityUncheckedUpdateWithoutSubjectInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AbilityTypesSchema),z.lazy(() => EnumAbilityTypesFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => AbilityActionsSchema),z.lazy(() => EnumAbilityActionsFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AbilityUncheckedUpdateManyWithoutSubjectInputSchema: z.ZodType<Prisma.AbilityUncheckedUpdateManyWithoutSubjectInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AbilityTypesSchema),z.lazy(() => EnumAbilityTypesFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  action: z.union([ z.lazy(() => AbilityActionsSchema),z.lazy(() => EnumAbilityActionsFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const ProfileFindFirstArgsSchema: z.ZodType<Prisma.ProfileFindFirstArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereInputSchema.optional(),
  orderBy: z.union([ ProfileOrderByWithRelationInputSchema.array(),ProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: ProfileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProfileScalarFieldEnumSchema,ProfileScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProfileFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProfileFindFirstOrThrowArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereInputSchema.optional(),
  orderBy: z.union([ ProfileOrderByWithRelationInputSchema.array(),ProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: ProfileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProfileScalarFieldEnumSchema,ProfileScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProfileFindManyArgsSchema: z.ZodType<Prisma.ProfileFindManyArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereInputSchema.optional(),
  orderBy: z.union([ ProfileOrderByWithRelationInputSchema.array(),ProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: ProfileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProfileScalarFieldEnumSchema,ProfileScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProfileAggregateArgsSchema: z.ZodType<Prisma.ProfileAggregateArgs> = z.object({
  where: ProfileWhereInputSchema.optional(),
  orderBy: z.union([ ProfileOrderByWithRelationInputSchema.array(),ProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: ProfileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProfileGroupByArgsSchema: z.ZodType<Prisma.ProfileGroupByArgs> = z.object({
  where: ProfileWhereInputSchema.optional(),
  orderBy: z.union([ ProfileOrderByWithAggregationInputSchema.array(),ProfileOrderByWithAggregationInputSchema ]).optional(),
  by: ProfileScalarFieldEnumSchema.array(),
  having: ProfileScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProfileFindUniqueArgsSchema: z.ZodType<Prisma.ProfileFindUniqueArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereUniqueInputSchema,
}).strict() ;

export const ProfileFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProfileFindUniqueOrThrowArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereUniqueInputSchema,
}).strict() ;

export const CategoryFindFirstArgsSchema: z.ZodType<Prisma.CategoryFindFirstArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindFirstOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryFindManyArgsSchema: z.ZodType<Prisma.CategoryFindManyArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryAggregateArgsSchema: z.ZodType<Prisma.CategoryAggregateArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CategoryGroupByArgsSchema: z.ZodType<Prisma.CategoryGroupByArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithAggregationInputSchema.array(),CategoryOrderByWithAggregationInputSchema ]).optional(),
  by: CategoryScalarFieldEnumSchema.array(),
  having: CategoryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CategoryFindUniqueArgsSchema: z.ZodType<Prisma.CategoryFindUniqueArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const CategoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindUniqueOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const GroupFindFirstArgsSchema: z.ZodType<Prisma.GroupFindFirstArgs> = z.object({
  select: GroupSelectSchema.optional(),
  include: GroupIncludeSchema.optional(),
  where: GroupWhereInputSchema.optional(),
  orderBy: z.union([ GroupOrderByWithRelationInputSchema.array(),GroupOrderByWithRelationInputSchema ]).optional(),
  cursor: GroupWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GroupScalarFieldEnumSchema,GroupScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const GroupFindFirstOrThrowArgsSchema: z.ZodType<Prisma.GroupFindFirstOrThrowArgs> = z.object({
  select: GroupSelectSchema.optional(),
  include: GroupIncludeSchema.optional(),
  where: GroupWhereInputSchema.optional(),
  orderBy: z.union([ GroupOrderByWithRelationInputSchema.array(),GroupOrderByWithRelationInputSchema ]).optional(),
  cursor: GroupWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GroupScalarFieldEnumSchema,GroupScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const GroupFindManyArgsSchema: z.ZodType<Prisma.GroupFindManyArgs> = z.object({
  select: GroupSelectSchema.optional(),
  include: GroupIncludeSchema.optional(),
  where: GroupWhereInputSchema.optional(),
  orderBy: z.union([ GroupOrderByWithRelationInputSchema.array(),GroupOrderByWithRelationInputSchema ]).optional(),
  cursor: GroupWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GroupScalarFieldEnumSchema,GroupScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const GroupAggregateArgsSchema: z.ZodType<Prisma.GroupAggregateArgs> = z.object({
  where: GroupWhereInputSchema.optional(),
  orderBy: z.union([ GroupOrderByWithRelationInputSchema.array(),GroupOrderByWithRelationInputSchema ]).optional(),
  cursor: GroupWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const GroupGroupByArgsSchema: z.ZodType<Prisma.GroupGroupByArgs> = z.object({
  where: GroupWhereInputSchema.optional(),
  orderBy: z.union([ GroupOrderByWithAggregationInputSchema.array(),GroupOrderByWithAggregationInputSchema ]).optional(),
  by: GroupScalarFieldEnumSchema.array(),
  having: GroupScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const GroupFindUniqueArgsSchema: z.ZodType<Prisma.GroupFindUniqueArgs> = z.object({
  select: GroupSelectSchema.optional(),
  include: GroupIncludeSchema.optional(),
  where: GroupWhereUniqueInputSchema,
}).strict() ;

export const GroupFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.GroupFindUniqueOrThrowArgs> = z.object({
  select: GroupSelectSchema.optional(),
  include: GroupIncludeSchema.optional(),
  where: GroupWhereUniqueInputSchema,
}).strict() ;

export const ServiceFindFirstArgsSchema: z.ZodType<Prisma.ServiceFindFirstArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  where: ServiceWhereInputSchema.optional(),
  orderBy: z.union([ ServiceOrderByWithRelationInputSchema.array(),ServiceOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ServiceScalarFieldEnumSchema,ServiceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ServiceFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ServiceFindFirstOrThrowArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  where: ServiceWhereInputSchema.optional(),
  orderBy: z.union([ ServiceOrderByWithRelationInputSchema.array(),ServiceOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ServiceScalarFieldEnumSchema,ServiceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ServiceFindManyArgsSchema: z.ZodType<Prisma.ServiceFindManyArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  where: ServiceWhereInputSchema.optional(),
  orderBy: z.union([ ServiceOrderByWithRelationInputSchema.array(),ServiceOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ServiceScalarFieldEnumSchema,ServiceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ServiceAggregateArgsSchema: z.ZodType<Prisma.ServiceAggregateArgs> = z.object({
  where: ServiceWhereInputSchema.optional(),
  orderBy: z.union([ ServiceOrderByWithRelationInputSchema.array(),ServiceOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ServiceGroupByArgsSchema: z.ZodType<Prisma.ServiceGroupByArgs> = z.object({
  where: ServiceWhereInputSchema.optional(),
  orderBy: z.union([ ServiceOrderByWithAggregationInputSchema.array(),ServiceOrderByWithAggregationInputSchema ]).optional(),
  by: ServiceScalarFieldEnumSchema.array(),
  having: ServiceScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ServiceFindUniqueArgsSchema: z.ZodType<Prisma.ServiceFindUniqueArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  where: ServiceWhereUniqueInputSchema,
}).strict() ;

export const ServiceFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ServiceFindUniqueOrThrowArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  where: ServiceWhereUniqueInputSchema,
}).strict() ;

export const AssignmentFindFirstArgsSchema: z.ZodType<Prisma.AssignmentFindFirstArgs> = z.object({
  select: AssignmentSelectSchema.optional(),
  include: AssignmentIncludeSchema.optional(),
  where: AssignmentWhereInputSchema.optional(),
  orderBy: z.union([ AssignmentOrderByWithRelationInputSchema.array(),AssignmentOrderByWithRelationInputSchema ]).optional(),
  cursor: AssignmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AssignmentScalarFieldEnumSchema,AssignmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AssignmentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AssignmentFindFirstOrThrowArgs> = z.object({
  select: AssignmentSelectSchema.optional(),
  include: AssignmentIncludeSchema.optional(),
  where: AssignmentWhereInputSchema.optional(),
  orderBy: z.union([ AssignmentOrderByWithRelationInputSchema.array(),AssignmentOrderByWithRelationInputSchema ]).optional(),
  cursor: AssignmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AssignmentScalarFieldEnumSchema,AssignmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AssignmentFindManyArgsSchema: z.ZodType<Prisma.AssignmentFindManyArgs> = z.object({
  select: AssignmentSelectSchema.optional(),
  include: AssignmentIncludeSchema.optional(),
  where: AssignmentWhereInputSchema.optional(),
  orderBy: z.union([ AssignmentOrderByWithRelationInputSchema.array(),AssignmentOrderByWithRelationInputSchema ]).optional(),
  cursor: AssignmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AssignmentScalarFieldEnumSchema,AssignmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AssignmentAggregateArgsSchema: z.ZodType<Prisma.AssignmentAggregateArgs> = z.object({
  where: AssignmentWhereInputSchema.optional(),
  orderBy: z.union([ AssignmentOrderByWithRelationInputSchema.array(),AssignmentOrderByWithRelationInputSchema ]).optional(),
  cursor: AssignmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AssignmentGroupByArgsSchema: z.ZodType<Prisma.AssignmentGroupByArgs> = z.object({
  where: AssignmentWhereInputSchema.optional(),
  orderBy: z.union([ AssignmentOrderByWithAggregationInputSchema.array(),AssignmentOrderByWithAggregationInputSchema ]).optional(),
  by: AssignmentScalarFieldEnumSchema.array(),
  having: AssignmentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AssignmentFindUniqueArgsSchema: z.ZodType<Prisma.AssignmentFindUniqueArgs> = z.object({
  select: AssignmentSelectSchema.optional(),
  include: AssignmentIncludeSchema.optional(),
  where: AssignmentWhereUniqueInputSchema,
}).strict() ;

export const AssignmentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AssignmentFindUniqueOrThrowArgs> = z.object({
  select: AssignmentSelectSchema.optional(),
  include: AssignmentIncludeSchema.optional(),
  where: AssignmentWhereUniqueInputSchema,
}).strict() ;

export const RoleFindFirstArgsSchema: z.ZodType<Prisma.RoleFindFirstArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereInputSchema.optional(),
  orderBy: z.union([ RoleOrderByWithRelationInputSchema.array(),RoleOrderByWithRelationInputSchema ]).optional(),
  cursor: RoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoleScalarFieldEnumSchema,RoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoleFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RoleFindFirstOrThrowArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereInputSchema.optional(),
  orderBy: z.union([ RoleOrderByWithRelationInputSchema.array(),RoleOrderByWithRelationInputSchema ]).optional(),
  cursor: RoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoleScalarFieldEnumSchema,RoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoleFindManyArgsSchema: z.ZodType<Prisma.RoleFindManyArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereInputSchema.optional(),
  orderBy: z.union([ RoleOrderByWithRelationInputSchema.array(),RoleOrderByWithRelationInputSchema ]).optional(),
  cursor: RoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoleScalarFieldEnumSchema,RoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoleAggregateArgsSchema: z.ZodType<Prisma.RoleAggregateArgs> = z.object({
  where: RoleWhereInputSchema.optional(),
  orderBy: z.union([ RoleOrderByWithRelationInputSchema.array(),RoleOrderByWithRelationInputSchema ]).optional(),
  cursor: RoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RoleGroupByArgsSchema: z.ZodType<Prisma.RoleGroupByArgs> = z.object({
  where: RoleWhereInputSchema.optional(),
  orderBy: z.union([ RoleOrderByWithAggregationInputSchema.array(),RoleOrderByWithAggregationInputSchema ]).optional(),
  by: RoleScalarFieldEnumSchema.array(),
  having: RoleScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RoleFindUniqueArgsSchema: z.ZodType<Prisma.RoleFindUniqueArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereUniqueInputSchema,
}).strict() ;

export const RoleFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RoleFindUniqueOrThrowArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereUniqueInputSchema,
}).strict() ;

export const TenantFindFirstArgsSchema: z.ZodType<Prisma.TenantFindFirstArgs> = z.object({
  select: TenantSelectSchema.optional(),
  include: TenantIncludeSchema.optional(),
  where: TenantWhereInputSchema.optional(),
  orderBy: z.union([ TenantOrderByWithRelationInputSchema.array(),TenantOrderByWithRelationInputSchema ]).optional(),
  cursor: TenantWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TenantScalarFieldEnumSchema,TenantScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TenantFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TenantFindFirstOrThrowArgs> = z.object({
  select: TenantSelectSchema.optional(),
  include: TenantIncludeSchema.optional(),
  where: TenantWhereInputSchema.optional(),
  orderBy: z.union([ TenantOrderByWithRelationInputSchema.array(),TenantOrderByWithRelationInputSchema ]).optional(),
  cursor: TenantWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TenantScalarFieldEnumSchema,TenantScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TenantFindManyArgsSchema: z.ZodType<Prisma.TenantFindManyArgs> = z.object({
  select: TenantSelectSchema.optional(),
  include: TenantIncludeSchema.optional(),
  where: TenantWhereInputSchema.optional(),
  orderBy: z.union([ TenantOrderByWithRelationInputSchema.array(),TenantOrderByWithRelationInputSchema ]).optional(),
  cursor: TenantWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TenantScalarFieldEnumSchema,TenantScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TenantAggregateArgsSchema: z.ZodType<Prisma.TenantAggregateArgs> = z.object({
  where: TenantWhereInputSchema.optional(),
  orderBy: z.union([ TenantOrderByWithRelationInputSchema.array(),TenantOrderByWithRelationInputSchema ]).optional(),
  cursor: TenantWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TenantGroupByArgsSchema: z.ZodType<Prisma.TenantGroupByArgs> = z.object({
  where: TenantWhereInputSchema.optional(),
  orderBy: z.union([ TenantOrderByWithAggregationInputSchema.array(),TenantOrderByWithAggregationInputSchema ]).optional(),
  by: TenantScalarFieldEnumSchema.array(),
  having: TenantScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TenantFindUniqueArgsSchema: z.ZodType<Prisma.TenantFindUniqueArgs> = z.object({
  select: TenantSelectSchema.optional(),
  include: TenantIncludeSchema.optional(),
  where: TenantWhereUniqueInputSchema,
}).strict() ;

export const TenantFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TenantFindUniqueOrThrowArgs> = z.object({
  select: TenantSelectSchema.optional(),
  include: TenantIncludeSchema.optional(),
  where: TenantWhereUniqueInputSchema,
}).strict() ;

export const ClassificationFindFirstArgsSchema: z.ZodType<Prisma.ClassificationFindFirstArgs> = z.object({
  select: ClassificationSelectSchema.optional(),
  include: ClassificationIncludeSchema.optional(),
  where: ClassificationWhereInputSchema.optional(),
  orderBy: z.union([ ClassificationOrderByWithRelationInputSchema.array(),ClassificationOrderByWithRelationInputSchema ]).optional(),
  cursor: ClassificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClassificationScalarFieldEnumSchema,ClassificationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ClassificationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ClassificationFindFirstOrThrowArgs> = z.object({
  select: ClassificationSelectSchema.optional(),
  include: ClassificationIncludeSchema.optional(),
  where: ClassificationWhereInputSchema.optional(),
  orderBy: z.union([ ClassificationOrderByWithRelationInputSchema.array(),ClassificationOrderByWithRelationInputSchema ]).optional(),
  cursor: ClassificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClassificationScalarFieldEnumSchema,ClassificationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ClassificationFindManyArgsSchema: z.ZodType<Prisma.ClassificationFindManyArgs> = z.object({
  select: ClassificationSelectSchema.optional(),
  include: ClassificationIncludeSchema.optional(),
  where: ClassificationWhereInputSchema.optional(),
  orderBy: z.union([ ClassificationOrderByWithRelationInputSchema.array(),ClassificationOrderByWithRelationInputSchema ]).optional(),
  cursor: ClassificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClassificationScalarFieldEnumSchema,ClassificationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ClassificationAggregateArgsSchema: z.ZodType<Prisma.ClassificationAggregateArgs> = z.object({
  where: ClassificationWhereInputSchema.optional(),
  orderBy: z.union([ ClassificationOrderByWithRelationInputSchema.array(),ClassificationOrderByWithRelationInputSchema ]).optional(),
  cursor: ClassificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ClassificationGroupByArgsSchema: z.ZodType<Prisma.ClassificationGroupByArgs> = z.object({
  where: ClassificationWhereInputSchema.optional(),
  orderBy: z.union([ ClassificationOrderByWithAggregationInputSchema.array(),ClassificationOrderByWithAggregationInputSchema ]).optional(),
  by: ClassificationScalarFieldEnumSchema.array(),
  having: ClassificationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ClassificationFindUniqueArgsSchema: z.ZodType<Prisma.ClassificationFindUniqueArgs> = z.object({
  select: ClassificationSelectSchema.optional(),
  include: ClassificationIncludeSchema.optional(),
  where: ClassificationWhereUniqueInputSchema,
}).strict() ;

export const ClassificationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ClassificationFindUniqueOrThrowArgs> = z.object({
  select: ClassificationSelectSchema.optional(),
  include: ClassificationIncludeSchema.optional(),
  where: ClassificationWhereUniqueInputSchema,
}).strict() ;

export const SpaceFindFirstArgsSchema: z.ZodType<Prisma.SpaceFindFirstArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  where: SpaceWhereInputSchema.optional(),
  orderBy: z.union([ SpaceOrderByWithRelationInputSchema.array(),SpaceOrderByWithRelationInputSchema ]).optional(),
  cursor: SpaceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SpaceScalarFieldEnumSchema,SpaceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SpaceFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SpaceFindFirstOrThrowArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  where: SpaceWhereInputSchema.optional(),
  orderBy: z.union([ SpaceOrderByWithRelationInputSchema.array(),SpaceOrderByWithRelationInputSchema ]).optional(),
  cursor: SpaceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SpaceScalarFieldEnumSchema,SpaceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SpaceFindManyArgsSchema: z.ZodType<Prisma.SpaceFindManyArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  where: SpaceWhereInputSchema.optional(),
  orderBy: z.union([ SpaceOrderByWithRelationInputSchema.array(),SpaceOrderByWithRelationInputSchema ]).optional(),
  cursor: SpaceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SpaceScalarFieldEnumSchema,SpaceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SpaceAggregateArgsSchema: z.ZodType<Prisma.SpaceAggregateArgs> = z.object({
  where: SpaceWhereInputSchema.optional(),
  orderBy: z.union([ SpaceOrderByWithRelationInputSchema.array(),SpaceOrderByWithRelationInputSchema ]).optional(),
  cursor: SpaceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SpaceGroupByArgsSchema: z.ZodType<Prisma.SpaceGroupByArgs> = z.object({
  where: SpaceWhereInputSchema.optional(),
  orderBy: z.union([ SpaceOrderByWithAggregationInputSchema.array(),SpaceOrderByWithAggregationInputSchema ]).optional(),
  by: SpaceScalarFieldEnumSchema.array(),
  having: SpaceScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SpaceFindUniqueArgsSchema: z.ZodType<Prisma.SpaceFindUniqueArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  where: SpaceWhereUniqueInputSchema,
}).strict() ;

export const SpaceFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SpaceFindUniqueOrThrowArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  where: SpaceWhereUniqueInputSchema,
}).strict() ;

export const EmailTemplateFindFirstArgsSchema: z.ZodType<Prisma.EmailTemplateFindFirstArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  where: EmailTemplateWhereInputSchema.optional(),
  orderBy: z.union([ EmailTemplateOrderByWithRelationInputSchema.array(),EmailTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EmailTemplateScalarFieldEnumSchema,EmailTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EmailTemplateFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EmailTemplateFindFirstOrThrowArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  where: EmailTemplateWhereInputSchema.optional(),
  orderBy: z.union([ EmailTemplateOrderByWithRelationInputSchema.array(),EmailTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EmailTemplateScalarFieldEnumSchema,EmailTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EmailTemplateFindManyArgsSchema: z.ZodType<Prisma.EmailTemplateFindManyArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  where: EmailTemplateWhereInputSchema.optional(),
  orderBy: z.union([ EmailTemplateOrderByWithRelationInputSchema.array(),EmailTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EmailTemplateScalarFieldEnumSchema,EmailTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EmailTemplateAggregateArgsSchema: z.ZodType<Prisma.EmailTemplateAggregateArgs> = z.object({
  where: EmailTemplateWhereInputSchema.optional(),
  orderBy: z.union([ EmailTemplateOrderByWithRelationInputSchema.array(),EmailTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: EmailTemplateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EmailTemplateGroupByArgsSchema: z.ZodType<Prisma.EmailTemplateGroupByArgs> = z.object({
  where: EmailTemplateWhereInputSchema.optional(),
  orderBy: z.union([ EmailTemplateOrderByWithAggregationInputSchema.array(),EmailTemplateOrderByWithAggregationInputSchema ]).optional(),
  by: EmailTemplateScalarFieldEnumSchema.array(),
  having: EmailTemplateScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EmailTemplateFindUniqueArgsSchema: z.ZodType<Prisma.EmailTemplateFindUniqueArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  where: EmailTemplateWhereUniqueInputSchema,
}).strict() ;

export const EmailTemplateFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EmailTemplateFindUniqueOrThrowArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  where: EmailTemplateWhereUniqueInputSchema,
}).strict() ;

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithAggregationInputSchema.array(),SessionOrderByWithAggregationInputSchema ]).optional(),
  by: SessionScalarFieldEnumSchema.array(),
  having: SessionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const TimelineFindFirstArgsSchema: z.ZodType<Prisma.TimelineFindFirstArgs> = z.object({
  select: TimelineSelectSchema.optional(),
  include: TimelineIncludeSchema.optional(),
  where: TimelineWhereInputSchema.optional(),
  orderBy: z.union([ TimelineOrderByWithRelationInputSchema.array(),TimelineOrderByWithRelationInputSchema ]).optional(),
  cursor: TimelineWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TimelineScalarFieldEnumSchema,TimelineScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TimelineFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TimelineFindFirstOrThrowArgs> = z.object({
  select: TimelineSelectSchema.optional(),
  include: TimelineIncludeSchema.optional(),
  where: TimelineWhereInputSchema.optional(),
  orderBy: z.union([ TimelineOrderByWithRelationInputSchema.array(),TimelineOrderByWithRelationInputSchema ]).optional(),
  cursor: TimelineWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TimelineScalarFieldEnumSchema,TimelineScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TimelineFindManyArgsSchema: z.ZodType<Prisma.TimelineFindManyArgs> = z.object({
  select: TimelineSelectSchema.optional(),
  include: TimelineIncludeSchema.optional(),
  where: TimelineWhereInputSchema.optional(),
  orderBy: z.union([ TimelineOrderByWithRelationInputSchema.array(),TimelineOrderByWithRelationInputSchema ]).optional(),
  cursor: TimelineWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TimelineScalarFieldEnumSchema,TimelineScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TimelineAggregateArgsSchema: z.ZodType<Prisma.TimelineAggregateArgs> = z.object({
  where: TimelineWhereInputSchema.optional(),
  orderBy: z.union([ TimelineOrderByWithRelationInputSchema.array(),TimelineOrderByWithRelationInputSchema ]).optional(),
  cursor: TimelineWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TimelineGroupByArgsSchema: z.ZodType<Prisma.TimelineGroupByArgs> = z.object({
  where: TimelineWhereInputSchema.optional(),
  orderBy: z.union([ TimelineOrderByWithAggregationInputSchema.array(),TimelineOrderByWithAggregationInputSchema ]).optional(),
  by: TimelineScalarFieldEnumSchema.array(),
  having: TimelineScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TimelineFindUniqueArgsSchema: z.ZodType<Prisma.TimelineFindUniqueArgs> = z.object({
  select: TimelineSelectSchema.optional(),
  include: TimelineIncludeSchema.optional(),
  where: TimelineWhereUniqueInputSchema,
}).strict() ;

export const TimelineFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TimelineFindUniqueOrThrowArgs> = z.object({
  select: TimelineSelectSchema.optional(),
  include: TimelineIncludeSchema.optional(),
  where: TimelineWhereUniqueInputSchema,
}).strict() ;

export const TimelineItemFindFirstArgsSchema: z.ZodType<Prisma.TimelineItemFindFirstArgs> = z.object({
  select: TimelineItemSelectSchema.optional(),
  include: TimelineItemIncludeSchema.optional(),
  where: TimelineItemWhereInputSchema.optional(),
  orderBy: z.union([ TimelineItemOrderByWithRelationInputSchema.array(),TimelineItemOrderByWithRelationInputSchema ]).optional(),
  cursor: TimelineItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TimelineItemScalarFieldEnumSchema,TimelineItemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TimelineItemFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TimelineItemFindFirstOrThrowArgs> = z.object({
  select: TimelineItemSelectSchema.optional(),
  include: TimelineItemIncludeSchema.optional(),
  where: TimelineItemWhereInputSchema.optional(),
  orderBy: z.union([ TimelineItemOrderByWithRelationInputSchema.array(),TimelineItemOrderByWithRelationInputSchema ]).optional(),
  cursor: TimelineItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TimelineItemScalarFieldEnumSchema,TimelineItemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TimelineItemFindManyArgsSchema: z.ZodType<Prisma.TimelineItemFindManyArgs> = z.object({
  select: TimelineItemSelectSchema.optional(),
  include: TimelineItemIncludeSchema.optional(),
  where: TimelineItemWhereInputSchema.optional(),
  orderBy: z.union([ TimelineItemOrderByWithRelationInputSchema.array(),TimelineItemOrderByWithRelationInputSchema ]).optional(),
  cursor: TimelineItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TimelineItemScalarFieldEnumSchema,TimelineItemScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TimelineItemAggregateArgsSchema: z.ZodType<Prisma.TimelineItemAggregateArgs> = z.object({
  where: TimelineItemWhereInputSchema.optional(),
  orderBy: z.union([ TimelineItemOrderByWithRelationInputSchema.array(),TimelineItemOrderByWithRelationInputSchema ]).optional(),
  cursor: TimelineItemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TimelineItemGroupByArgsSchema: z.ZodType<Prisma.TimelineItemGroupByArgs> = z.object({
  where: TimelineItemWhereInputSchema.optional(),
  orderBy: z.union([ TimelineItemOrderByWithAggregationInputSchema.array(),TimelineItemOrderByWithAggregationInputSchema ]).optional(),
  by: TimelineItemScalarFieldEnumSchema.array(),
  having: TimelineItemScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TimelineItemFindUniqueArgsSchema: z.ZodType<Prisma.TimelineItemFindUniqueArgs> = z.object({
  select: TimelineItemSelectSchema.optional(),
  include: TimelineItemIncludeSchema.optional(),
  where: TimelineItemWhereUniqueInputSchema,
}).strict() ;

export const TimelineItemFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TimelineItemFindUniqueOrThrowArgs> = z.object({
  select: TimelineItemSelectSchema.optional(),
  include: TimelineItemIncludeSchema.optional(),
  where: TimelineItemWhereUniqueInputSchema,
}).strict() ;

export const ReservationFindFirstArgsSchema: z.ZodType<Prisma.ReservationFindFirstArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  where: ReservationWhereInputSchema.optional(),
  orderBy: z.union([ ReservationOrderByWithRelationInputSchema.array(),ReservationOrderByWithRelationInputSchema ]).optional(),
  cursor: ReservationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReservationScalarFieldEnumSchema,ReservationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReservationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ReservationFindFirstOrThrowArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  where: ReservationWhereInputSchema.optional(),
  orderBy: z.union([ ReservationOrderByWithRelationInputSchema.array(),ReservationOrderByWithRelationInputSchema ]).optional(),
  cursor: ReservationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReservationScalarFieldEnumSchema,ReservationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReservationFindManyArgsSchema: z.ZodType<Prisma.ReservationFindManyArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  where: ReservationWhereInputSchema.optional(),
  orderBy: z.union([ ReservationOrderByWithRelationInputSchema.array(),ReservationOrderByWithRelationInputSchema ]).optional(),
  cursor: ReservationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReservationScalarFieldEnumSchema,ReservationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReservationAggregateArgsSchema: z.ZodType<Prisma.ReservationAggregateArgs> = z.object({
  where: ReservationWhereInputSchema.optional(),
  orderBy: z.union([ ReservationOrderByWithRelationInputSchema.array(),ReservationOrderByWithRelationInputSchema ]).optional(),
  cursor: ReservationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ReservationGroupByArgsSchema: z.ZodType<Prisma.ReservationGroupByArgs> = z.object({
  where: ReservationWhereInputSchema.optional(),
  orderBy: z.union([ ReservationOrderByWithAggregationInputSchema.array(),ReservationOrderByWithAggregationInputSchema ]).optional(),
  by: ReservationScalarFieldEnumSchema.array(),
  having: ReservationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ReservationFindUniqueArgsSchema: z.ZodType<Prisma.ReservationFindUniqueArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  where: ReservationWhereUniqueInputSchema,
}).strict() ;

export const ReservationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ReservationFindUniqueOrThrowArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  where: ReservationWhereUniqueInputSchema,
}).strict() ;

export const SubjectFindFirstArgsSchema: z.ZodType<Prisma.SubjectFindFirstArgs> = z.object({
  select: SubjectSelectSchema.optional(),
  include: SubjectIncludeSchema.optional(),
  where: SubjectWhereInputSchema.optional(),
  orderBy: z.union([ SubjectOrderByWithRelationInputSchema.array(),SubjectOrderByWithRelationInputSchema ]).optional(),
  cursor: SubjectWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SubjectScalarFieldEnumSchema,SubjectScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SubjectFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SubjectFindFirstOrThrowArgs> = z.object({
  select: SubjectSelectSchema.optional(),
  include: SubjectIncludeSchema.optional(),
  where: SubjectWhereInputSchema.optional(),
  orderBy: z.union([ SubjectOrderByWithRelationInputSchema.array(),SubjectOrderByWithRelationInputSchema ]).optional(),
  cursor: SubjectWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SubjectScalarFieldEnumSchema,SubjectScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SubjectFindManyArgsSchema: z.ZodType<Prisma.SubjectFindManyArgs> = z.object({
  select: SubjectSelectSchema.optional(),
  include: SubjectIncludeSchema.optional(),
  where: SubjectWhereInputSchema.optional(),
  orderBy: z.union([ SubjectOrderByWithRelationInputSchema.array(),SubjectOrderByWithRelationInputSchema ]).optional(),
  cursor: SubjectWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SubjectScalarFieldEnumSchema,SubjectScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SubjectAggregateArgsSchema: z.ZodType<Prisma.SubjectAggregateArgs> = z.object({
  where: SubjectWhereInputSchema.optional(),
  orderBy: z.union([ SubjectOrderByWithRelationInputSchema.array(),SubjectOrderByWithRelationInputSchema ]).optional(),
  cursor: SubjectWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SubjectGroupByArgsSchema: z.ZodType<Prisma.SubjectGroupByArgs> = z.object({
  where: SubjectWhereInputSchema.optional(),
  orderBy: z.union([ SubjectOrderByWithAggregationInputSchema.array(),SubjectOrderByWithAggregationInputSchema ]).optional(),
  by: SubjectScalarFieldEnumSchema.array(),
  having: SubjectScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SubjectFindUniqueArgsSchema: z.ZodType<Prisma.SubjectFindUniqueArgs> = z.object({
  select: SubjectSelectSchema.optional(),
  include: SubjectIncludeSchema.optional(),
  where: SubjectWhereUniqueInputSchema,
}).strict() ;

export const SubjectFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SubjectFindUniqueOrThrowArgs> = z.object({
  select: SubjectSelectSchema.optional(),
  include: SubjectIncludeSchema.optional(),
  where: SubjectWhereUniqueInputSchema,
}).strict() ;

export const AbilityFindFirstArgsSchema: z.ZodType<Prisma.AbilityFindFirstArgs> = z.object({
  select: AbilitySelectSchema.optional(),
  include: AbilityIncludeSchema.optional(),
  where: AbilityWhereInputSchema.optional(),
  orderBy: z.union([ AbilityOrderByWithRelationInputSchema.array(),AbilityOrderByWithRelationInputSchema ]).optional(),
  cursor: AbilityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AbilityScalarFieldEnumSchema,AbilityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AbilityFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AbilityFindFirstOrThrowArgs> = z.object({
  select: AbilitySelectSchema.optional(),
  include: AbilityIncludeSchema.optional(),
  where: AbilityWhereInputSchema.optional(),
  orderBy: z.union([ AbilityOrderByWithRelationInputSchema.array(),AbilityOrderByWithRelationInputSchema ]).optional(),
  cursor: AbilityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AbilityScalarFieldEnumSchema,AbilityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AbilityFindManyArgsSchema: z.ZodType<Prisma.AbilityFindManyArgs> = z.object({
  select: AbilitySelectSchema.optional(),
  include: AbilityIncludeSchema.optional(),
  where: AbilityWhereInputSchema.optional(),
  orderBy: z.union([ AbilityOrderByWithRelationInputSchema.array(),AbilityOrderByWithRelationInputSchema ]).optional(),
  cursor: AbilityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AbilityScalarFieldEnumSchema,AbilityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AbilityAggregateArgsSchema: z.ZodType<Prisma.AbilityAggregateArgs> = z.object({
  where: AbilityWhereInputSchema.optional(),
  orderBy: z.union([ AbilityOrderByWithRelationInputSchema.array(),AbilityOrderByWithRelationInputSchema ]).optional(),
  cursor: AbilityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AbilityGroupByArgsSchema: z.ZodType<Prisma.AbilityGroupByArgs> = z.object({
  where: AbilityWhereInputSchema.optional(),
  orderBy: z.union([ AbilityOrderByWithAggregationInputSchema.array(),AbilityOrderByWithAggregationInputSchema ]).optional(),
  by: AbilityScalarFieldEnumSchema.array(),
  having: AbilityScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AbilityFindUniqueArgsSchema: z.ZodType<Prisma.AbilityFindUniqueArgs> = z.object({
  select: AbilitySelectSchema.optional(),
  include: AbilityIncludeSchema.optional(),
  where: AbilityWhereUniqueInputSchema,
}).strict() ;

export const AbilityFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AbilityFindUniqueOrThrowArgs> = z.object({
  select: AbilitySelectSchema.optional(),
  include: AbilityIncludeSchema.optional(),
  where: AbilityWhereUniqueInputSchema,
}).strict() ;

export const PageFindFirstArgsSchema: z.ZodType<Prisma.PageFindFirstArgs> = z.object({
  select: PageSelectSchema.optional(),
  where: PageWhereInputSchema.optional(),
  orderBy: z.union([ PageOrderByWithRelationInputSchema.array(),PageOrderByWithRelationInputSchema ]).optional(),
  cursor: PageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PageScalarFieldEnumSchema,PageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PageFindFirstOrThrowArgs> = z.object({
  select: PageSelectSchema.optional(),
  where: PageWhereInputSchema.optional(),
  orderBy: z.union([ PageOrderByWithRelationInputSchema.array(),PageOrderByWithRelationInputSchema ]).optional(),
  cursor: PageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PageScalarFieldEnumSchema,PageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PageFindManyArgsSchema: z.ZodType<Prisma.PageFindManyArgs> = z.object({
  select: PageSelectSchema.optional(),
  where: PageWhereInputSchema.optional(),
  orderBy: z.union([ PageOrderByWithRelationInputSchema.array(),PageOrderByWithRelationInputSchema ]).optional(),
  cursor: PageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PageScalarFieldEnumSchema,PageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PageAggregateArgsSchema: z.ZodType<Prisma.PageAggregateArgs> = z.object({
  where: PageWhereInputSchema.optional(),
  orderBy: z.union([ PageOrderByWithRelationInputSchema.array(),PageOrderByWithRelationInputSchema ]).optional(),
  cursor: PageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PageGroupByArgsSchema: z.ZodType<Prisma.PageGroupByArgs> = z.object({
  where: PageWhereInputSchema.optional(),
  orderBy: z.union([ PageOrderByWithAggregationInputSchema.array(),PageOrderByWithAggregationInputSchema ]).optional(),
  by: PageScalarFieldEnumSchema.array(),
  having: PageScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PageFindUniqueArgsSchema: z.ZodType<Prisma.PageFindUniqueArgs> = z.object({
  select: PageSelectSchema.optional(),
  where: PageWhereUniqueInputSchema,
}).strict() ;

export const PageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PageFindUniqueOrThrowArgs> = z.object({
  select: PageSelectSchema.optional(),
  where: PageWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const ProfileCreateArgsSchema: z.ZodType<Prisma.ProfileCreateArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  data: z.union([ ProfileCreateInputSchema,ProfileUncheckedCreateInputSchema ]),
}).strict() ;

export const ProfileUpsertArgsSchema: z.ZodType<Prisma.ProfileUpsertArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereUniqueInputSchema,
  create: z.union([ ProfileCreateInputSchema,ProfileUncheckedCreateInputSchema ]),
  update: z.union([ ProfileUpdateInputSchema,ProfileUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProfileCreateManyArgsSchema: z.ZodType<Prisma.ProfileCreateManyArgs> = z.object({
  data: z.union([ ProfileCreateManyInputSchema,ProfileCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProfileDeleteArgsSchema: z.ZodType<Prisma.ProfileDeleteArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereUniqueInputSchema,
}).strict() ;

export const ProfileUpdateArgsSchema: z.ZodType<Prisma.ProfileUpdateArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  data: z.union([ ProfileUpdateInputSchema,ProfileUncheckedUpdateInputSchema ]),
  where: ProfileWhereUniqueInputSchema,
}).strict() ;

export const ProfileUpdateManyArgsSchema: z.ZodType<Prisma.ProfileUpdateManyArgs> = z.object({
  data: z.union([ ProfileUpdateManyMutationInputSchema,ProfileUncheckedUpdateManyInputSchema ]),
  where: ProfileWhereInputSchema.optional(),
}).strict() ;

export const ProfileDeleteManyArgsSchema: z.ZodType<Prisma.ProfileDeleteManyArgs> = z.object({
  where: ProfileWhereInputSchema.optional(),
}).strict() ;

export const CategoryCreateArgsSchema: z.ZodType<Prisma.CategoryCreateArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryCreateInputSchema,CategoryUncheckedCreateInputSchema ]),
}).strict() ;

export const CategoryUpsertArgsSchema: z.ZodType<Prisma.CategoryUpsertArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
  create: z.union([ CategoryCreateInputSchema,CategoryUncheckedCreateInputSchema ]),
  update: z.union([ CategoryUpdateInputSchema,CategoryUncheckedUpdateInputSchema ]),
}).strict() ;

export const CategoryCreateManyArgsSchema: z.ZodType<Prisma.CategoryCreateManyArgs> = z.object({
  data: z.union([ CategoryCreateManyInputSchema,CategoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CategoryDeleteArgsSchema: z.ZodType<Prisma.CategoryDeleteArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const CategoryUpdateArgsSchema: z.ZodType<Prisma.CategoryUpdateArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryUpdateInputSchema,CategoryUncheckedUpdateInputSchema ]),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const CategoryUpdateManyArgsSchema: z.ZodType<Prisma.CategoryUpdateManyArgs> = z.object({
  data: z.union([ CategoryUpdateManyMutationInputSchema,CategoryUncheckedUpdateManyInputSchema ]),
  where: CategoryWhereInputSchema.optional(),
}).strict() ;

export const CategoryDeleteManyArgsSchema: z.ZodType<Prisma.CategoryDeleteManyArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
}).strict() ;

export const GroupCreateArgsSchema: z.ZodType<Prisma.GroupCreateArgs> = z.object({
  select: GroupSelectSchema.optional(),
  include: GroupIncludeSchema.optional(),
  data: z.union([ GroupCreateInputSchema,GroupUncheckedCreateInputSchema ]),
}).strict() ;

export const GroupUpsertArgsSchema: z.ZodType<Prisma.GroupUpsertArgs> = z.object({
  select: GroupSelectSchema.optional(),
  include: GroupIncludeSchema.optional(),
  where: GroupWhereUniqueInputSchema,
  create: z.union([ GroupCreateInputSchema,GroupUncheckedCreateInputSchema ]),
  update: z.union([ GroupUpdateInputSchema,GroupUncheckedUpdateInputSchema ]),
}).strict() ;

export const GroupCreateManyArgsSchema: z.ZodType<Prisma.GroupCreateManyArgs> = z.object({
  data: z.union([ GroupCreateManyInputSchema,GroupCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const GroupDeleteArgsSchema: z.ZodType<Prisma.GroupDeleteArgs> = z.object({
  select: GroupSelectSchema.optional(),
  include: GroupIncludeSchema.optional(),
  where: GroupWhereUniqueInputSchema,
}).strict() ;

export const GroupUpdateArgsSchema: z.ZodType<Prisma.GroupUpdateArgs> = z.object({
  select: GroupSelectSchema.optional(),
  include: GroupIncludeSchema.optional(),
  data: z.union([ GroupUpdateInputSchema,GroupUncheckedUpdateInputSchema ]),
  where: GroupWhereUniqueInputSchema,
}).strict() ;

export const GroupUpdateManyArgsSchema: z.ZodType<Prisma.GroupUpdateManyArgs> = z.object({
  data: z.union([ GroupUpdateManyMutationInputSchema,GroupUncheckedUpdateManyInputSchema ]),
  where: GroupWhereInputSchema.optional(),
}).strict() ;

export const GroupDeleteManyArgsSchema: z.ZodType<Prisma.GroupDeleteManyArgs> = z.object({
  where: GroupWhereInputSchema.optional(),
}).strict() ;

export const ServiceCreateArgsSchema: z.ZodType<Prisma.ServiceCreateArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  data: z.union([ ServiceCreateInputSchema,ServiceUncheckedCreateInputSchema ]),
}).strict() ;

export const ServiceUpsertArgsSchema: z.ZodType<Prisma.ServiceUpsertArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  where: ServiceWhereUniqueInputSchema,
  create: z.union([ ServiceCreateInputSchema,ServiceUncheckedCreateInputSchema ]),
  update: z.union([ ServiceUpdateInputSchema,ServiceUncheckedUpdateInputSchema ]),
}).strict() ;

export const ServiceCreateManyArgsSchema: z.ZodType<Prisma.ServiceCreateManyArgs> = z.object({
  data: z.union([ ServiceCreateManyInputSchema,ServiceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ServiceDeleteArgsSchema: z.ZodType<Prisma.ServiceDeleteArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  where: ServiceWhereUniqueInputSchema,
}).strict() ;

export const ServiceUpdateArgsSchema: z.ZodType<Prisma.ServiceUpdateArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  data: z.union([ ServiceUpdateInputSchema,ServiceUncheckedUpdateInputSchema ]),
  where: ServiceWhereUniqueInputSchema,
}).strict() ;

export const ServiceUpdateManyArgsSchema: z.ZodType<Prisma.ServiceUpdateManyArgs> = z.object({
  data: z.union([ ServiceUpdateManyMutationInputSchema,ServiceUncheckedUpdateManyInputSchema ]),
  where: ServiceWhereInputSchema.optional(),
}).strict() ;

export const ServiceDeleteManyArgsSchema: z.ZodType<Prisma.ServiceDeleteManyArgs> = z.object({
  where: ServiceWhereInputSchema.optional(),
}).strict() ;

export const AssignmentCreateArgsSchema: z.ZodType<Prisma.AssignmentCreateArgs> = z.object({
  select: AssignmentSelectSchema.optional(),
  include: AssignmentIncludeSchema.optional(),
  data: z.union([ AssignmentCreateInputSchema,AssignmentUncheckedCreateInputSchema ]),
}).strict() ;

export const AssignmentUpsertArgsSchema: z.ZodType<Prisma.AssignmentUpsertArgs> = z.object({
  select: AssignmentSelectSchema.optional(),
  include: AssignmentIncludeSchema.optional(),
  where: AssignmentWhereUniqueInputSchema,
  create: z.union([ AssignmentCreateInputSchema,AssignmentUncheckedCreateInputSchema ]),
  update: z.union([ AssignmentUpdateInputSchema,AssignmentUncheckedUpdateInputSchema ]),
}).strict() ;

export const AssignmentCreateManyArgsSchema: z.ZodType<Prisma.AssignmentCreateManyArgs> = z.object({
  data: z.union([ AssignmentCreateManyInputSchema,AssignmentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AssignmentDeleteArgsSchema: z.ZodType<Prisma.AssignmentDeleteArgs> = z.object({
  select: AssignmentSelectSchema.optional(),
  include: AssignmentIncludeSchema.optional(),
  where: AssignmentWhereUniqueInputSchema,
}).strict() ;

export const AssignmentUpdateArgsSchema: z.ZodType<Prisma.AssignmentUpdateArgs> = z.object({
  select: AssignmentSelectSchema.optional(),
  include: AssignmentIncludeSchema.optional(),
  data: z.union([ AssignmentUpdateInputSchema,AssignmentUncheckedUpdateInputSchema ]),
  where: AssignmentWhereUniqueInputSchema,
}).strict() ;

export const AssignmentUpdateManyArgsSchema: z.ZodType<Prisma.AssignmentUpdateManyArgs> = z.object({
  data: z.union([ AssignmentUpdateManyMutationInputSchema,AssignmentUncheckedUpdateManyInputSchema ]),
  where: AssignmentWhereInputSchema.optional(),
}).strict() ;

export const AssignmentDeleteManyArgsSchema: z.ZodType<Prisma.AssignmentDeleteManyArgs> = z.object({
  where: AssignmentWhereInputSchema.optional(),
}).strict() ;

export const RoleCreateArgsSchema: z.ZodType<Prisma.RoleCreateArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  data: z.union([ RoleCreateInputSchema,RoleUncheckedCreateInputSchema ]).optional(),
}).strict() ;

export const RoleUpsertArgsSchema: z.ZodType<Prisma.RoleUpsertArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereUniqueInputSchema,
  create: z.union([ RoleCreateInputSchema,RoleUncheckedCreateInputSchema ]),
  update: z.union([ RoleUpdateInputSchema,RoleUncheckedUpdateInputSchema ]),
}).strict() ;

export const RoleCreateManyArgsSchema: z.ZodType<Prisma.RoleCreateManyArgs> = z.object({
  data: z.union([ RoleCreateManyInputSchema,RoleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RoleDeleteArgsSchema: z.ZodType<Prisma.RoleDeleteArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereUniqueInputSchema,
}).strict() ;

export const RoleUpdateArgsSchema: z.ZodType<Prisma.RoleUpdateArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  data: z.union([ RoleUpdateInputSchema,RoleUncheckedUpdateInputSchema ]),
  where: RoleWhereUniqueInputSchema,
}).strict() ;

export const RoleUpdateManyArgsSchema: z.ZodType<Prisma.RoleUpdateManyArgs> = z.object({
  data: z.union([ RoleUpdateManyMutationInputSchema,RoleUncheckedUpdateManyInputSchema ]),
  where: RoleWhereInputSchema.optional(),
}).strict() ;

export const RoleDeleteManyArgsSchema: z.ZodType<Prisma.RoleDeleteManyArgs> = z.object({
  where: RoleWhereInputSchema.optional(),
}).strict() ;

export const TenantCreateArgsSchema: z.ZodType<Prisma.TenantCreateArgs> = z.object({
  select: TenantSelectSchema.optional(),
  include: TenantIncludeSchema.optional(),
  data: z.union([ TenantCreateInputSchema,TenantUncheckedCreateInputSchema ]),
}).strict() ;

export const TenantUpsertArgsSchema: z.ZodType<Prisma.TenantUpsertArgs> = z.object({
  select: TenantSelectSchema.optional(),
  include: TenantIncludeSchema.optional(),
  where: TenantWhereUniqueInputSchema,
  create: z.union([ TenantCreateInputSchema,TenantUncheckedCreateInputSchema ]),
  update: z.union([ TenantUpdateInputSchema,TenantUncheckedUpdateInputSchema ]),
}).strict() ;

export const TenantCreateManyArgsSchema: z.ZodType<Prisma.TenantCreateManyArgs> = z.object({
  data: z.union([ TenantCreateManyInputSchema,TenantCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TenantDeleteArgsSchema: z.ZodType<Prisma.TenantDeleteArgs> = z.object({
  select: TenantSelectSchema.optional(),
  include: TenantIncludeSchema.optional(),
  where: TenantWhereUniqueInputSchema,
}).strict() ;

export const TenantUpdateArgsSchema: z.ZodType<Prisma.TenantUpdateArgs> = z.object({
  select: TenantSelectSchema.optional(),
  include: TenantIncludeSchema.optional(),
  data: z.union([ TenantUpdateInputSchema,TenantUncheckedUpdateInputSchema ]),
  where: TenantWhereUniqueInputSchema,
}).strict() ;

export const TenantUpdateManyArgsSchema: z.ZodType<Prisma.TenantUpdateManyArgs> = z.object({
  data: z.union([ TenantUpdateManyMutationInputSchema,TenantUncheckedUpdateManyInputSchema ]),
  where: TenantWhereInputSchema.optional(),
}).strict() ;

export const TenantDeleteManyArgsSchema: z.ZodType<Prisma.TenantDeleteManyArgs> = z.object({
  where: TenantWhereInputSchema.optional(),
}).strict() ;

export const ClassificationCreateArgsSchema: z.ZodType<Prisma.ClassificationCreateArgs> = z.object({
  select: ClassificationSelectSchema.optional(),
  include: ClassificationIncludeSchema.optional(),
  data: z.union([ ClassificationCreateInputSchema,ClassificationUncheckedCreateInputSchema ]),
}).strict() ;

export const ClassificationUpsertArgsSchema: z.ZodType<Prisma.ClassificationUpsertArgs> = z.object({
  select: ClassificationSelectSchema.optional(),
  include: ClassificationIncludeSchema.optional(),
  where: ClassificationWhereUniqueInputSchema,
  create: z.union([ ClassificationCreateInputSchema,ClassificationUncheckedCreateInputSchema ]),
  update: z.union([ ClassificationUpdateInputSchema,ClassificationUncheckedUpdateInputSchema ]),
}).strict() ;

export const ClassificationCreateManyArgsSchema: z.ZodType<Prisma.ClassificationCreateManyArgs> = z.object({
  data: z.union([ ClassificationCreateManyInputSchema,ClassificationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ClassificationDeleteArgsSchema: z.ZodType<Prisma.ClassificationDeleteArgs> = z.object({
  select: ClassificationSelectSchema.optional(),
  include: ClassificationIncludeSchema.optional(),
  where: ClassificationWhereUniqueInputSchema,
}).strict() ;

export const ClassificationUpdateArgsSchema: z.ZodType<Prisma.ClassificationUpdateArgs> = z.object({
  select: ClassificationSelectSchema.optional(),
  include: ClassificationIncludeSchema.optional(),
  data: z.union([ ClassificationUpdateInputSchema,ClassificationUncheckedUpdateInputSchema ]),
  where: ClassificationWhereUniqueInputSchema,
}).strict() ;

export const ClassificationUpdateManyArgsSchema: z.ZodType<Prisma.ClassificationUpdateManyArgs> = z.object({
  data: z.union([ ClassificationUpdateManyMutationInputSchema,ClassificationUncheckedUpdateManyInputSchema ]),
  where: ClassificationWhereInputSchema.optional(),
}).strict() ;

export const ClassificationDeleteManyArgsSchema: z.ZodType<Prisma.ClassificationDeleteManyArgs> = z.object({
  where: ClassificationWhereInputSchema.optional(),
}).strict() ;

export const SpaceCreateArgsSchema: z.ZodType<Prisma.SpaceCreateArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  data: z.union([ SpaceCreateInputSchema,SpaceUncheckedCreateInputSchema ]),
}).strict() ;

export const SpaceUpsertArgsSchema: z.ZodType<Prisma.SpaceUpsertArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  where: SpaceWhereUniqueInputSchema,
  create: z.union([ SpaceCreateInputSchema,SpaceUncheckedCreateInputSchema ]),
  update: z.union([ SpaceUpdateInputSchema,SpaceUncheckedUpdateInputSchema ]),
}).strict() ;

export const SpaceCreateManyArgsSchema: z.ZodType<Prisma.SpaceCreateManyArgs> = z.object({
  data: z.union([ SpaceCreateManyInputSchema,SpaceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SpaceDeleteArgsSchema: z.ZodType<Prisma.SpaceDeleteArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  where: SpaceWhereUniqueInputSchema,
}).strict() ;

export const SpaceUpdateArgsSchema: z.ZodType<Prisma.SpaceUpdateArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  data: z.union([ SpaceUpdateInputSchema,SpaceUncheckedUpdateInputSchema ]),
  where: SpaceWhereUniqueInputSchema,
}).strict() ;

export const SpaceUpdateManyArgsSchema: z.ZodType<Prisma.SpaceUpdateManyArgs> = z.object({
  data: z.union([ SpaceUpdateManyMutationInputSchema,SpaceUncheckedUpdateManyInputSchema ]),
  where: SpaceWhereInputSchema.optional(),
}).strict() ;

export const SpaceDeleteManyArgsSchema: z.ZodType<Prisma.SpaceDeleteManyArgs> = z.object({
  where: SpaceWhereInputSchema.optional(),
}).strict() ;

export const EmailTemplateCreateArgsSchema: z.ZodType<Prisma.EmailTemplateCreateArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  data: z.union([ EmailTemplateCreateInputSchema,EmailTemplateUncheckedCreateInputSchema ]),
}).strict() ;

export const EmailTemplateUpsertArgsSchema: z.ZodType<Prisma.EmailTemplateUpsertArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  where: EmailTemplateWhereUniqueInputSchema,
  create: z.union([ EmailTemplateCreateInputSchema,EmailTemplateUncheckedCreateInputSchema ]),
  update: z.union([ EmailTemplateUpdateInputSchema,EmailTemplateUncheckedUpdateInputSchema ]),
}).strict() ;

export const EmailTemplateCreateManyArgsSchema: z.ZodType<Prisma.EmailTemplateCreateManyArgs> = z.object({
  data: z.union([ EmailTemplateCreateManyInputSchema,EmailTemplateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EmailTemplateDeleteArgsSchema: z.ZodType<Prisma.EmailTemplateDeleteArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  where: EmailTemplateWhereUniqueInputSchema,
}).strict() ;

export const EmailTemplateUpdateArgsSchema: z.ZodType<Prisma.EmailTemplateUpdateArgs> = z.object({
  select: EmailTemplateSelectSchema.optional(),
  data: z.union([ EmailTemplateUpdateInputSchema,EmailTemplateUncheckedUpdateInputSchema ]),
  where: EmailTemplateWhereUniqueInputSchema,
}).strict() ;

export const EmailTemplateUpdateManyArgsSchema: z.ZodType<Prisma.EmailTemplateUpdateManyArgs> = z.object({
  data: z.union([ EmailTemplateUpdateManyMutationInputSchema,EmailTemplateUncheckedUpdateManyInputSchema ]),
  where: EmailTemplateWhereInputSchema.optional(),
}).strict() ;

export const EmailTemplateDeleteManyArgsSchema: z.ZodType<Prisma.EmailTemplateDeleteManyArgs> = z.object({
  where: EmailTemplateWhereInputSchema.optional(),
}).strict() ;

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
}).strict() ;

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
  create: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
  update: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
}).strict() ;

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema,SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema,SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(),
}).strict() ;

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
}).strict() ;

export const TimelineCreateArgsSchema: z.ZodType<Prisma.TimelineCreateArgs> = z.object({
  select: TimelineSelectSchema.optional(),
  include: TimelineIncludeSchema.optional(),
  data: z.union([ TimelineCreateInputSchema,TimelineUncheckedCreateInputSchema ]),
}).strict() ;

export const TimelineUpsertArgsSchema: z.ZodType<Prisma.TimelineUpsertArgs> = z.object({
  select: TimelineSelectSchema.optional(),
  include: TimelineIncludeSchema.optional(),
  where: TimelineWhereUniqueInputSchema,
  create: z.union([ TimelineCreateInputSchema,TimelineUncheckedCreateInputSchema ]),
  update: z.union([ TimelineUpdateInputSchema,TimelineUncheckedUpdateInputSchema ]),
}).strict() ;

export const TimelineCreateManyArgsSchema: z.ZodType<Prisma.TimelineCreateManyArgs> = z.object({
  data: z.union([ TimelineCreateManyInputSchema,TimelineCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TimelineDeleteArgsSchema: z.ZodType<Prisma.TimelineDeleteArgs> = z.object({
  select: TimelineSelectSchema.optional(),
  include: TimelineIncludeSchema.optional(),
  where: TimelineWhereUniqueInputSchema,
}).strict() ;

export const TimelineUpdateArgsSchema: z.ZodType<Prisma.TimelineUpdateArgs> = z.object({
  select: TimelineSelectSchema.optional(),
  include: TimelineIncludeSchema.optional(),
  data: z.union([ TimelineUpdateInputSchema,TimelineUncheckedUpdateInputSchema ]),
  where: TimelineWhereUniqueInputSchema,
}).strict() ;

export const TimelineUpdateManyArgsSchema: z.ZodType<Prisma.TimelineUpdateManyArgs> = z.object({
  data: z.union([ TimelineUpdateManyMutationInputSchema,TimelineUncheckedUpdateManyInputSchema ]),
  where: TimelineWhereInputSchema.optional(),
}).strict() ;

export const TimelineDeleteManyArgsSchema: z.ZodType<Prisma.TimelineDeleteManyArgs> = z.object({
  where: TimelineWhereInputSchema.optional(),
}).strict() ;

export const TimelineItemCreateArgsSchema: z.ZodType<Prisma.TimelineItemCreateArgs> = z.object({
  select: TimelineItemSelectSchema.optional(),
  include: TimelineItemIncludeSchema.optional(),
  data: z.union([ TimelineItemCreateInputSchema,TimelineItemUncheckedCreateInputSchema ]),
}).strict() ;

export const TimelineItemUpsertArgsSchema: z.ZodType<Prisma.TimelineItemUpsertArgs> = z.object({
  select: TimelineItemSelectSchema.optional(),
  include: TimelineItemIncludeSchema.optional(),
  where: TimelineItemWhereUniqueInputSchema,
  create: z.union([ TimelineItemCreateInputSchema,TimelineItemUncheckedCreateInputSchema ]),
  update: z.union([ TimelineItemUpdateInputSchema,TimelineItemUncheckedUpdateInputSchema ]),
}).strict() ;

export const TimelineItemCreateManyArgsSchema: z.ZodType<Prisma.TimelineItemCreateManyArgs> = z.object({
  data: z.union([ TimelineItemCreateManyInputSchema,TimelineItemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TimelineItemDeleteArgsSchema: z.ZodType<Prisma.TimelineItemDeleteArgs> = z.object({
  select: TimelineItemSelectSchema.optional(),
  include: TimelineItemIncludeSchema.optional(),
  where: TimelineItemWhereUniqueInputSchema,
}).strict() ;

export const TimelineItemUpdateArgsSchema: z.ZodType<Prisma.TimelineItemUpdateArgs> = z.object({
  select: TimelineItemSelectSchema.optional(),
  include: TimelineItemIncludeSchema.optional(),
  data: z.union([ TimelineItemUpdateInputSchema,TimelineItemUncheckedUpdateInputSchema ]),
  where: TimelineItemWhereUniqueInputSchema,
}).strict() ;

export const TimelineItemUpdateManyArgsSchema: z.ZodType<Prisma.TimelineItemUpdateManyArgs> = z.object({
  data: z.union([ TimelineItemUpdateManyMutationInputSchema,TimelineItemUncheckedUpdateManyInputSchema ]),
  where: TimelineItemWhereInputSchema.optional(),
}).strict() ;

export const TimelineItemDeleteManyArgsSchema: z.ZodType<Prisma.TimelineItemDeleteManyArgs> = z.object({
  where: TimelineItemWhereInputSchema.optional(),
}).strict() ;

export const ReservationCreateArgsSchema: z.ZodType<Prisma.ReservationCreateArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  data: z.union([ ReservationCreateInputSchema,ReservationUncheckedCreateInputSchema ]),
}).strict() ;

export const ReservationUpsertArgsSchema: z.ZodType<Prisma.ReservationUpsertArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  where: ReservationWhereUniqueInputSchema,
  create: z.union([ ReservationCreateInputSchema,ReservationUncheckedCreateInputSchema ]),
  update: z.union([ ReservationUpdateInputSchema,ReservationUncheckedUpdateInputSchema ]),
}).strict() ;

export const ReservationCreateManyArgsSchema: z.ZodType<Prisma.ReservationCreateManyArgs> = z.object({
  data: z.union([ ReservationCreateManyInputSchema,ReservationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ReservationDeleteArgsSchema: z.ZodType<Prisma.ReservationDeleteArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  where: ReservationWhereUniqueInputSchema,
}).strict() ;

export const ReservationUpdateArgsSchema: z.ZodType<Prisma.ReservationUpdateArgs> = z.object({
  select: ReservationSelectSchema.optional(),
  include: ReservationIncludeSchema.optional(),
  data: z.union([ ReservationUpdateInputSchema,ReservationUncheckedUpdateInputSchema ]),
  where: ReservationWhereUniqueInputSchema,
}).strict() ;

export const ReservationUpdateManyArgsSchema: z.ZodType<Prisma.ReservationUpdateManyArgs> = z.object({
  data: z.union([ ReservationUpdateManyMutationInputSchema,ReservationUncheckedUpdateManyInputSchema ]),
  where: ReservationWhereInputSchema.optional(),
}).strict() ;

export const ReservationDeleteManyArgsSchema: z.ZodType<Prisma.ReservationDeleteManyArgs> = z.object({
  where: ReservationWhereInputSchema.optional(),
}).strict() ;

export const SubjectCreateArgsSchema: z.ZodType<Prisma.SubjectCreateArgs> = z.object({
  select: SubjectSelectSchema.optional(),
  include: SubjectIncludeSchema.optional(),
  data: z.union([ SubjectCreateInputSchema,SubjectUncheckedCreateInputSchema ]),
}).strict() ;

export const SubjectUpsertArgsSchema: z.ZodType<Prisma.SubjectUpsertArgs> = z.object({
  select: SubjectSelectSchema.optional(),
  include: SubjectIncludeSchema.optional(),
  where: SubjectWhereUniqueInputSchema,
  create: z.union([ SubjectCreateInputSchema,SubjectUncheckedCreateInputSchema ]),
  update: z.union([ SubjectUpdateInputSchema,SubjectUncheckedUpdateInputSchema ]),
}).strict() ;

export const SubjectCreateManyArgsSchema: z.ZodType<Prisma.SubjectCreateManyArgs> = z.object({
  data: z.union([ SubjectCreateManyInputSchema,SubjectCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SubjectDeleteArgsSchema: z.ZodType<Prisma.SubjectDeleteArgs> = z.object({
  select: SubjectSelectSchema.optional(),
  include: SubjectIncludeSchema.optional(),
  where: SubjectWhereUniqueInputSchema,
}).strict() ;

export const SubjectUpdateArgsSchema: z.ZodType<Prisma.SubjectUpdateArgs> = z.object({
  select: SubjectSelectSchema.optional(),
  include: SubjectIncludeSchema.optional(),
  data: z.union([ SubjectUpdateInputSchema,SubjectUncheckedUpdateInputSchema ]),
  where: SubjectWhereUniqueInputSchema,
}).strict() ;

export const SubjectUpdateManyArgsSchema: z.ZodType<Prisma.SubjectUpdateManyArgs> = z.object({
  data: z.union([ SubjectUpdateManyMutationInputSchema,SubjectUncheckedUpdateManyInputSchema ]),
  where: SubjectWhereInputSchema.optional(),
}).strict() ;

export const SubjectDeleteManyArgsSchema: z.ZodType<Prisma.SubjectDeleteManyArgs> = z.object({
  where: SubjectWhereInputSchema.optional(),
}).strict() ;

export const AbilityCreateArgsSchema: z.ZodType<Prisma.AbilityCreateArgs> = z.object({
  select: AbilitySelectSchema.optional(),
  include: AbilityIncludeSchema.optional(),
  data: z.union([ AbilityCreateInputSchema,AbilityUncheckedCreateInputSchema ]),
}).strict() ;

export const AbilityUpsertArgsSchema: z.ZodType<Prisma.AbilityUpsertArgs> = z.object({
  select: AbilitySelectSchema.optional(),
  include: AbilityIncludeSchema.optional(),
  where: AbilityWhereUniqueInputSchema,
  create: z.union([ AbilityCreateInputSchema,AbilityUncheckedCreateInputSchema ]),
  update: z.union([ AbilityUpdateInputSchema,AbilityUncheckedUpdateInputSchema ]),
}).strict() ;

export const AbilityCreateManyArgsSchema: z.ZodType<Prisma.AbilityCreateManyArgs> = z.object({
  data: z.union([ AbilityCreateManyInputSchema,AbilityCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AbilityDeleteArgsSchema: z.ZodType<Prisma.AbilityDeleteArgs> = z.object({
  select: AbilitySelectSchema.optional(),
  include: AbilityIncludeSchema.optional(),
  where: AbilityWhereUniqueInputSchema,
}).strict() ;

export const AbilityUpdateArgsSchema: z.ZodType<Prisma.AbilityUpdateArgs> = z.object({
  select: AbilitySelectSchema.optional(),
  include: AbilityIncludeSchema.optional(),
  data: z.union([ AbilityUpdateInputSchema,AbilityUncheckedUpdateInputSchema ]),
  where: AbilityWhereUniqueInputSchema,
}).strict() ;

export const AbilityUpdateManyArgsSchema: z.ZodType<Prisma.AbilityUpdateManyArgs> = z.object({
  data: z.union([ AbilityUpdateManyMutationInputSchema,AbilityUncheckedUpdateManyInputSchema ]),
  where: AbilityWhereInputSchema.optional(),
}).strict() ;

export const AbilityDeleteManyArgsSchema: z.ZodType<Prisma.AbilityDeleteManyArgs> = z.object({
  where: AbilityWhereInputSchema.optional(),
}).strict() ;

export const PageCreateArgsSchema: z.ZodType<Prisma.PageCreateArgs> = z.object({
  select: PageSelectSchema.optional(),
  data: z.union([ PageCreateInputSchema,PageUncheckedCreateInputSchema ]),
}).strict() ;

export const PageUpsertArgsSchema: z.ZodType<Prisma.PageUpsertArgs> = z.object({
  select: PageSelectSchema.optional(),
  where: PageWhereUniqueInputSchema,
  create: z.union([ PageCreateInputSchema,PageUncheckedCreateInputSchema ]),
  update: z.union([ PageUpdateInputSchema,PageUncheckedUpdateInputSchema ]),
}).strict() ;

export const PageCreateManyArgsSchema: z.ZodType<Prisma.PageCreateManyArgs> = z.object({
  data: z.union([ PageCreateManyInputSchema,PageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PageDeleteArgsSchema: z.ZodType<Prisma.PageDeleteArgs> = z.object({
  select: PageSelectSchema.optional(),
  where: PageWhereUniqueInputSchema,
}).strict() ;

export const PageUpdateArgsSchema: z.ZodType<Prisma.PageUpdateArgs> = z.object({
  select: PageSelectSchema.optional(),
  data: z.union([ PageUpdateInputSchema,PageUncheckedUpdateInputSchema ]),
  where: PageWhereUniqueInputSchema,
}).strict() ;

export const PageUpdateManyArgsSchema: z.ZodType<Prisma.PageUpdateManyArgs> = z.object({
  data: z.union([ PageUpdateManyMutationInputSchema,PageUncheckedUpdateManyInputSchema ]),
  where: PageWhereInputSchema.optional(),
}).strict() ;

export const PageDeleteManyArgsSchema: z.ZodType<Prisma.PageDeleteManyArgs> = z.object({
  where: PageWhereInputSchema.optional(),
}).strict() ;