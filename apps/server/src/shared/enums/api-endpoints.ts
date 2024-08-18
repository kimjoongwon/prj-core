export enum ApiVersions {
  V1 = 'v1',
}

export enum ApiEndpoints {
  VERSION = ApiVersions.V1,
  PREFIX = `/api/${ApiVersions.V1}`,
  ADMIN = 'admin',
  ADMIN_ABILITIES = `${ApiEndpoints.PREFIX}/${ApiEndpoints.ADMIN}/abilities`,
  ADMIN_CATEGORIES = `${ApiEndpoints.PREFIX}/${ApiEndpoints.ADMIN}/categories`,
  ADMIN_SERVICES = `${ApiEndpoints.PREFIX}/${ApiEndpoints.ADMIN}/services`,
  ADMIN_SPACES = `${ApiEndpoints.PREFIX}/${ApiEndpoints.ADMIN}/spaces`,
  ADMIN_GROUPS = `${ApiEndpoints.PREFIX}/${ApiEndpoints.ADMIN}/groups`,
  ADMIN_SUBJECTS = `${ApiEndpoints.PREFIX}/${ApiEndpoints.ADMIN}/subjects`,
  AUTH = `${ApiEndpoints.PREFIX}/auth`,
}
