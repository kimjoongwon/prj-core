export enum SERVICE_NAME {
  userService = "userService",
  settingService = "settingService"
}

export enum SubjectConditions {
  Equal = "Equal",
  GreaterThan = "GreaterThan",
  GreaterThanOrEqual = "GreaterThanOrEqual",
  LessThan = "LessThan",
  LessThanOrEqual = "LessThanOrEqual",
  In = "In"
}

export enum AbilityActions {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  ACCESS = "ACCESS"
}

export enum AbilityTypes {
  CAN = "CAN",
  CAN_NOT = "CAN_NOT"
}

export enum EmailTemplates {
  REGISTER = "REGISTER",
  FORGET_PASSWORD = "FORGET_PASSWORD"
}

export enum Roles {
  USER = "USER",
  SUPER_ADMIN = "SUPER_ADMIN"
}
