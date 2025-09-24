import { __export, __name } from './chunk-AZFFBQKZ.mjs';
export { AbilityActions, AbilityTypes, CategoryTypes, GroupTypes, Order, RecurringDayOfWeek, RepeatCycleTypes, ResponseEntityHttpStatus, Roles, SessionTypes, SortOrder } from './chunk-AZFFBQKZ.mjs';
import { useMutation, useQuery, useSuspenseQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import Axios from 'axios';

// src/apis.ts
var apis_exports = {};
__export(apis_exports, {
  createCategory: () => createCategory,
  createExercise: () => createExercise,
  createFile: () => createFile,
  createGround: () => createGround,
  createGroup: () => createGroup,
  createProgram: () => createProgram,
  createRole: () => createRole,
  createRoleClassification: () => createRoleClassification,
  createRoutine: () => createRoutine,
  createSession: () => createSession,
  createSpace: () => createSpace,
  createSubject: () => createSubject,
  createTenant: () => createTenant,
  createTimeline: () => createTimeline,
  createUser: () => createUser,
  deleteCategoryById: () => deleteCategoryById,
  deleteExercise: () => deleteExercise,
  deleteGroundById: () => deleteGroundById,
  deleteGroup: () => deleteGroup,
  deleteProgramById: () => deleteProgramById,
  deleteRole: () => deleteRole,
  deleteRoleClassificationById: () => deleteRoleClassificationById,
  deleteRoutine: () => deleteRoutine,
  deleteSession: () => deleteSession,
  deleteSpace: () => deleteSpace,
  deleteSubject: () => deleteSubject,
  deleteTenant: () => deleteTenant,
  deleteTimeline: () => deleteTimeline,
  deleteUser: () => deleteUser,
  getAppBuilder: () => getAppBuilder,
  getCategoriesByQuery: () => getCategoriesByQuery,
  getCategoryById: () => getCategoryById,
  getCreateCategoryMutationOptions: () => getCreateCategoryMutationOptions,
  getCreateExerciseMutationOptions: () => getCreateExerciseMutationOptions,
  getCreateFileMutationOptions: () => getCreateFileMutationOptions,
  getCreateGroundMutationOptions: () => getCreateGroundMutationOptions,
  getCreateGroupMutationOptions: () => getCreateGroupMutationOptions,
  getCreateProgramMutationOptions: () => getCreateProgramMutationOptions,
  getCreateRoleClassificationMutationOptions: () => getCreateRoleClassificationMutationOptions,
  getCreateRoleMutationOptions: () => getCreateRoleMutationOptions,
  getCreateRoutineMutationOptions: () => getCreateRoutineMutationOptions,
  getCreateSessionMutationOptions: () => getCreateSessionMutationOptions,
  getCreateSpaceMutationOptions: () => getCreateSpaceMutationOptions,
  getCreateSubjectMutationOptions: () => getCreateSubjectMutationOptions,
  getCreateTenantMutationOptions: () => getCreateTenantMutationOptions,
  getCreateTimelineMutationOptions: () => getCreateTimelineMutationOptions,
  getCreateUserMutationOptions: () => getCreateUserMutationOptions,
  getCurrentSpace: () => getCurrentSpace,
  getDeleteCategoryByIdMutationOptions: () => getDeleteCategoryByIdMutationOptions,
  getDeleteExerciseMutationOptions: () => getDeleteExerciseMutationOptions,
  getDeleteGroundByIdMutationOptions: () => getDeleteGroundByIdMutationOptions,
  getDeleteGroupMutationOptions: () => getDeleteGroupMutationOptions,
  getDeleteProgramByIdMutationOptions: () => getDeleteProgramByIdMutationOptions,
  getDeleteRoleClassificationByIdMutationOptions: () => getDeleteRoleClassificationByIdMutationOptions,
  getDeleteRoleMutationOptions: () => getDeleteRoleMutationOptions,
  getDeleteRoutineMutationOptions: () => getDeleteRoutineMutationOptions,
  getDeleteSessionMutationOptions: () => getDeleteSessionMutationOptions,
  getDeleteSpaceMutationOptions: () => getDeleteSpaceMutationOptions,
  getDeleteSubjectMutationOptions: () => getDeleteSubjectMutationOptions,
  getDeleteTenantMutationOptions: () => getDeleteTenantMutationOptions,
  getDeleteTimelineMutationOptions: () => getDeleteTimelineMutationOptions,
  getDeleteUserMutationOptions: () => getDeleteUserMutationOptions,
  getExercise: () => getExercise,
  getExercisesByQuery: () => getExercisesByQuery,
  getFileById: () => getFileById,
  getGetAppBuilderQueryKey: () => getGetAppBuilderQueryKey,
  getGetAppBuilderQueryOptions: () => getGetAppBuilderQueryOptions,
  getGetAppBuilderSuspenseInfiniteQueryOptions: () => getGetAppBuilderSuspenseInfiniteQueryOptions,
  getGetAppBuilderSuspenseQueryOptions: () => getGetAppBuilderSuspenseQueryOptions,
  getGetCategoriesByQueryQueryKey: () => getGetCategoriesByQueryQueryKey,
  getGetCategoriesByQueryQueryOptions: () => getGetCategoriesByQueryQueryOptions,
  getGetCategoriesByQuerySuspenseInfiniteQueryOptions: () => getGetCategoriesByQuerySuspenseInfiniteQueryOptions,
  getGetCategoriesByQuerySuspenseQueryOptions: () => getGetCategoriesByQuerySuspenseQueryOptions,
  getGetCategoryByIdQueryKey: () => getGetCategoryByIdQueryKey,
  getGetCategoryByIdQueryOptions: () => getGetCategoryByIdQueryOptions,
  getGetCategoryByIdSuspenseInfiniteQueryOptions: () => getGetCategoryByIdSuspenseInfiniteQueryOptions,
  getGetCategoryByIdSuspenseQueryOptions: () => getGetCategoryByIdSuspenseQueryOptions,
  getGetCurrentSpaceQueryKey: () => getGetCurrentSpaceQueryKey,
  getGetCurrentSpaceQueryOptions: () => getGetCurrentSpaceQueryOptions,
  getGetCurrentSpaceSuspenseInfiniteQueryOptions: () => getGetCurrentSpaceSuspenseInfiniteQueryOptions,
  getGetCurrentSpaceSuspenseQueryOptions: () => getGetCurrentSpaceSuspenseQueryOptions,
  getGetExerciseQueryKey: () => getGetExerciseQueryKey,
  getGetExerciseQueryOptions: () => getGetExerciseQueryOptions,
  getGetExerciseSuspenseInfiniteQueryOptions: () => getGetExerciseSuspenseInfiniteQueryOptions,
  getGetExerciseSuspenseQueryOptions: () => getGetExerciseSuspenseQueryOptions,
  getGetExercisesByQueryQueryKey: () => getGetExercisesByQueryQueryKey,
  getGetExercisesByQueryQueryOptions: () => getGetExercisesByQueryQueryOptions,
  getGetExercisesByQuerySuspenseInfiniteQueryOptions: () => getGetExercisesByQuerySuspenseInfiniteQueryOptions,
  getGetExercisesByQuerySuspenseQueryOptions: () => getGetExercisesByQuerySuspenseQueryOptions,
  getGetFileByIdQueryKey: () => getGetFileByIdQueryKey,
  getGetFileByIdQueryOptions: () => getGetFileByIdQueryOptions,
  getGetFileByIdSuspenseInfiniteQueryOptions: () => getGetFileByIdSuspenseInfiniteQueryOptions,
  getGetFileByIdSuspenseQueryOptions: () => getGetFileByIdSuspenseQueryOptions,
  getGetGroundByIdQueryKey: () => getGetGroundByIdQueryKey,
  getGetGroundByIdQueryOptions: () => getGetGroundByIdQueryOptions,
  getGetGroundByIdSuspenseInfiniteQueryOptions: () => getGetGroundByIdSuspenseInfiniteQueryOptions,
  getGetGroundByIdSuspenseQueryOptions: () => getGetGroundByIdSuspenseQueryOptions,
  getGetGroundsByQueryQueryKey: () => getGetGroundsByQueryQueryKey,
  getGetGroundsByQueryQueryOptions: () => getGetGroundsByQueryQueryOptions,
  getGetGroundsByQuerySuspenseInfiniteQueryOptions: () => getGetGroundsByQuerySuspenseInfiniteQueryOptions,
  getGetGroundsByQuerySuspenseQueryOptions: () => getGetGroundsByQuerySuspenseQueryOptions,
  getGetGroupByIdQueryKey: () => getGetGroupByIdQueryKey,
  getGetGroupByIdQueryOptions: () => getGetGroupByIdQueryOptions,
  getGetGroupByIdSuspenseInfiniteQueryOptions: () => getGetGroupByIdSuspenseInfiniteQueryOptions,
  getGetGroupByIdSuspenseQueryOptions: () => getGetGroupByIdSuspenseQueryOptions,
  getGetGroupsByQueryQueryKey: () => getGetGroupsByQueryQueryKey,
  getGetGroupsByQueryQueryOptions: () => getGetGroupsByQueryQueryOptions,
  getGetGroupsByQuerySuspenseInfiniteQueryOptions: () => getGetGroupsByQuerySuspenseInfiniteQueryOptions,
  getGetGroupsByQuerySuspenseQueryOptions: () => getGetGroupsByQuerySuspenseQueryOptions,
  getGetMyTenantsQueryKey: () => getGetMyTenantsQueryKey,
  getGetMyTenantsQueryOptions: () => getGetMyTenantsQueryOptions,
  getGetMyTenantsSuspenseInfiniteQueryOptions: () => getGetMyTenantsSuspenseInfiniteQueryOptions,
  getGetMyTenantsSuspenseQueryOptions: () => getGetMyTenantsSuspenseQueryOptions,
  getGetNewTokenQueryKey: () => getGetNewTokenQueryKey,
  getGetNewTokenQueryOptions: () => getGetNewTokenQueryOptions,
  getGetNewTokenSuspenseInfiniteQueryOptions: () => getGetNewTokenSuspenseInfiniteQueryOptions,
  getGetNewTokenSuspenseQueryOptions: () => getGetNewTokenSuspenseQueryOptions,
  getGetProgramByIdQueryKey: () => getGetProgramByIdQueryKey,
  getGetProgramByIdQueryOptions: () => getGetProgramByIdQueryOptions,
  getGetProgramByIdSuspenseInfiniteQueryOptions: () => getGetProgramByIdSuspenseInfiniteQueryOptions,
  getGetProgramByIdSuspenseQueryOptions: () => getGetProgramByIdSuspenseQueryOptions,
  getGetProgramsByQueryQueryKey: () => getGetProgramsByQueryQueryKey,
  getGetProgramsByQueryQueryOptions: () => getGetProgramsByQueryQueryOptions,
  getGetProgramsByQuerySuspenseInfiniteQueryOptions: () => getGetProgramsByQuerySuspenseInfiniteQueryOptions,
  getGetProgramsByQuerySuspenseQueryOptions: () => getGetProgramsByQuerySuspenseQueryOptions,
  getGetRoleClassificationByIdQueryKey: () => getGetRoleClassificationByIdQueryKey,
  getGetRoleClassificationByIdQueryOptions: () => getGetRoleClassificationByIdQueryOptions,
  getGetRoleClassificationByIdSuspenseInfiniteQueryOptions: () => getGetRoleClassificationByIdSuspenseInfiniteQueryOptions,
  getGetRoleClassificationByIdSuspenseQueryOptions: () => getGetRoleClassificationByIdSuspenseQueryOptions,
  getGetRoleClassificationsByQueryQueryKey: () => getGetRoleClassificationsByQueryQueryKey,
  getGetRoleClassificationsByQueryQueryOptions: () => getGetRoleClassificationsByQueryQueryOptions,
  getGetRoleClassificationsByQuerySuspenseInfiniteQueryOptions: () => getGetRoleClassificationsByQuerySuspenseInfiniteQueryOptions,
  getGetRoleClassificationsByQuerySuspenseQueryOptions: () => getGetRoleClassificationsByQuerySuspenseQueryOptions,
  getGetRoleQueryKey: () => getGetRoleQueryKey,
  getGetRoleQueryOptions: () => getGetRoleQueryOptions,
  getGetRoleSuspenseInfiniteQueryOptions: () => getGetRoleSuspenseInfiniteQueryOptions,
  getGetRoleSuspenseQueryOptions: () => getGetRoleSuspenseQueryOptions,
  getGetRolesByQueryQueryKey: () => getGetRolesByQueryQueryKey,
  getGetRolesByQueryQueryOptions: () => getGetRolesByQueryQueryOptions,
  getGetRolesByQuerySuspenseInfiniteQueryOptions: () => getGetRolesByQuerySuspenseInfiniteQueryOptions,
  getGetRolesByQuerySuspenseQueryOptions: () => getGetRolesByQuerySuspenseQueryOptions,
  getGetRoutineQueryKey: () => getGetRoutineQueryKey,
  getGetRoutineQueryOptions: () => getGetRoutineQueryOptions,
  getGetRoutineSuspenseInfiniteQueryOptions: () => getGetRoutineSuspenseInfiniteQueryOptions,
  getGetRoutineSuspenseQueryOptions: () => getGetRoutineSuspenseQueryOptions,
  getGetRoutinesByQueryQueryKey: () => getGetRoutinesByQueryQueryKey,
  getGetRoutinesByQueryQueryOptions: () => getGetRoutinesByQueryQueryOptions,
  getGetRoutinesByQuerySuspenseInfiniteQueryOptions: () => getGetRoutinesByQuerySuspenseInfiniteQueryOptions,
  getGetRoutinesByQuerySuspenseQueryOptions: () => getGetRoutinesByQuerySuspenseQueryOptions,
  getGetSessionQueryKey: () => getGetSessionQueryKey,
  getGetSessionQueryOptions: () => getGetSessionQueryOptions,
  getGetSessionSuspenseInfiniteQueryOptions: () => getGetSessionSuspenseInfiniteQueryOptions,
  getGetSessionSuspenseQueryOptions: () => getGetSessionSuspenseQueryOptions,
  getGetSessionsByQueryQueryKey: () => getGetSessionsByQueryQueryKey,
  getGetSessionsByQueryQueryOptions: () => getGetSessionsByQueryQueryOptions,
  getGetSessionsByQuerySuspenseInfiniteQueryOptions: () => getGetSessionsByQuerySuspenseInfiniteQueryOptions,
  getGetSessionsByQuerySuspenseQueryOptions: () => getGetSessionsByQuerySuspenseQueryOptions,
  getGetSpaceQueryKey: () => getGetSpaceQueryKey,
  getGetSpaceQueryOptions: () => getGetSpaceQueryOptions,
  getGetSpaceSuspenseInfiniteQueryOptions: () => getGetSpaceSuspenseInfiniteQueryOptions,
  getGetSpaceSuspenseQueryOptions: () => getGetSpaceSuspenseQueryOptions,
  getGetSpacesByQueryQueryKey: () => getGetSpacesByQueryQueryKey,
  getGetSpacesByQueryQueryOptions: () => getGetSpacesByQueryQueryOptions,
  getGetSpacesByQuerySuspenseInfiniteQueryOptions: () => getGetSpacesByQuerySuspenseInfiniteQueryOptions,
  getGetSpacesByQuerySuspenseQueryOptions: () => getGetSpacesByQuerySuspenseQueryOptions,
  getGetSubjectQueryKey: () => getGetSubjectQueryKey,
  getGetSubjectQueryOptions: () => getGetSubjectQueryOptions,
  getGetSubjectSuspenseInfiniteQueryOptions: () => getGetSubjectSuspenseInfiniteQueryOptions,
  getGetSubjectSuspenseQueryOptions: () => getGetSubjectSuspenseQueryOptions,
  getGetSubjectsByQueryQueryKey: () => getGetSubjectsByQueryQueryKey,
  getGetSubjectsByQueryQueryOptions: () => getGetSubjectsByQueryQueryOptions,
  getGetSubjectsByQuerySuspenseInfiniteQueryOptions: () => getGetSubjectsByQuerySuspenseInfiniteQueryOptions,
  getGetSubjectsByQuerySuspenseQueryOptions: () => getGetSubjectsByQuerySuspenseQueryOptions,
  getGetTenantByIdQueryKey: () => getGetTenantByIdQueryKey,
  getGetTenantByIdQueryOptions: () => getGetTenantByIdQueryOptions,
  getGetTenantByIdSuspenseInfiniteQueryOptions: () => getGetTenantByIdSuspenseInfiniteQueryOptions,
  getGetTenantByIdSuspenseQueryOptions: () => getGetTenantByIdSuspenseQueryOptions,
  getGetTenantsByQueryQueryKey: () => getGetTenantsByQueryQueryKey,
  getGetTenantsByQueryQueryOptions: () => getGetTenantsByQueryQueryOptions,
  getGetTenantsByQuerySuspenseInfiniteQueryOptions: () => getGetTenantsByQuerySuspenseInfiniteQueryOptions,
  getGetTenantsByQuerySuspenseQueryOptions: () => getGetTenantsByQuerySuspenseQueryOptions,
  getGetTimelineQueryKey: () => getGetTimelineQueryKey,
  getGetTimelineQueryOptions: () => getGetTimelineQueryOptions,
  getGetTimelineSuspenseInfiniteQueryOptions: () => getGetTimelineSuspenseInfiniteQueryOptions,
  getGetTimelineSuspenseQueryOptions: () => getGetTimelineSuspenseQueryOptions,
  getGetTimelinesByQueryQueryKey: () => getGetTimelinesByQueryQueryKey,
  getGetTimelinesByQueryQueryOptions: () => getGetTimelinesByQueryQueryOptions,
  getGetTimelinesByQuerySuspenseInfiniteQueryOptions: () => getGetTimelinesByQuerySuspenseInfiniteQueryOptions,
  getGetTimelinesByQuerySuspenseQueryOptions: () => getGetTimelinesByQuerySuspenseQueryOptions,
  getGetUserQueryKey: () => getGetUserQueryKey,
  getGetUserQueryOptions: () => getGetUserQueryOptions,
  getGetUserSuspenseInfiniteQueryOptions: () => getGetUserSuspenseInfiniteQueryOptions,
  getGetUserSuspenseQueryOptions: () => getGetUserSuspenseQueryOptions,
  getGetUsersByQueryQueryKey: () => getGetUsersByQueryQueryKey,
  getGetUsersByQueryQueryOptions: () => getGetUsersByQueryQueryOptions,
  getGetUsersByQuerySuspenseInfiniteQueryOptions: () => getGetUsersByQuerySuspenseInfiniteQueryOptions,
  getGetUsersByQuerySuspenseQueryOptions: () => getGetUsersByQuerySuspenseQueryOptions,
  getGroundById: () => getGroundById,
  getGroundsByQuery: () => getGroundsByQuery,
  getGroupById: () => getGroupById,
  getGroupsByQuery: () => getGroupsByQuery,
  getLoginMutationOptions: () => getLoginMutationOptions,
  getLogoutMutationOptions: () => getLogoutMutationOptions,
  getMyTenants: () => getMyTenants,
  getNewToken: () => getNewToken,
  getProgramById: () => getProgramById,
  getProgramsByQuery: () => getProgramsByQuery,
  getRefreshTokenMutationOptions: () => getRefreshTokenMutationOptions,
  getRemoveExerciseMutationOptions: () => getRemoveExerciseMutationOptions,
  getRemoveFileByIdMutationOptions: () => getRemoveFileByIdMutationOptions,
  getRemoveGroundByIdMutationOptions: () => getRemoveGroundByIdMutationOptions,
  getRemoveGroupsMutationOptions: () => getRemoveGroupsMutationOptions,
  getRemoveProgramByIdMutationOptions: () => getRemoveProgramByIdMutationOptions,
  getRemoveRoleClassificationByIdMutationOptions: () => getRemoveRoleClassificationByIdMutationOptions,
  getRemoveRoleMutationOptions: () => getRemoveRoleMutationOptions,
  getRemoveRoutineMutationOptions: () => getRemoveRoutineMutationOptions,
  getRemoveSessionMutationOptions: () => getRemoveSessionMutationOptions,
  getRemoveSessionsMutationOptions: () => getRemoveSessionsMutationOptions,
  getRemoveSpaceMutationOptions: () => getRemoveSpaceMutationOptions,
  getRemoveSubjectMutationOptions: () => getRemoveSubjectMutationOptions,
  getRemoveSubjectsMutationOptions: () => getRemoveSubjectsMutationOptions,
  getRemoveTenantByIdMutationOptions: () => getRemoveTenantByIdMutationOptions,
  getRemoveTimelineMutationOptions: () => getRemoveTimelineMutationOptions,
  getRemoveTimelinesMutationOptions: () => getRemoveTimelinesMutationOptions,
  getRemoveUserMutationOptions: () => getRemoveUserMutationOptions,
  getRemoveUsersMutationOptions: () => getRemoveUsersMutationOptions,
  getRole: () => getRole,
  getRoleClassificationById: () => getRoleClassificationById,
  getRoleClassificationsByQuery: () => getRoleClassificationsByQuery,
  getRolesByQuery: () => getRolesByQuery,
  getRoutine: () => getRoutine,
  getRoutinesByQuery: () => getRoutinesByQuery,
  getSession: () => getSession,
  getSessionsByQuery: () => getSessionsByQuery,
  getSignUpUserMutationOptions: () => getSignUpUserMutationOptions,
  getSpace: () => getSpace,
  getSpacesByQuery: () => getSpacesByQuery,
  getSubject: () => getSubject,
  getSubjectsByQuery: () => getSubjectsByQuery,
  getTenantById: () => getTenantById,
  getTenantsByQuery: () => getTenantsByQuery,
  getTimeline: () => getTimeline,
  getTimelinesByQuery: () => getTimelinesByQuery,
  getUpdateCategoryByIdMutationOptions: () => getUpdateCategoryByIdMutationOptions,
  getUpdateExerciseMutationOptions: () => getUpdateExerciseMutationOptions,
  getUpdateFileByIdMutationOptions: () => getUpdateFileByIdMutationOptions,
  getUpdateGroundByIdMutationOptions: () => getUpdateGroundByIdMutationOptions,
  getUpdateGroupByIdMutationOptions: () => getUpdateGroupByIdMutationOptions,
  getUpdateProgramByIdMutationOptions: () => getUpdateProgramByIdMutationOptions,
  getUpdateRoleClassificationByIdMutationOptions: () => getUpdateRoleClassificationByIdMutationOptions,
  getUpdateRoleMutationOptions: () => getUpdateRoleMutationOptions,
  getUpdateRoutineMutationOptions: () => getUpdateRoutineMutationOptions,
  getUpdateSessionMutationOptions: () => getUpdateSessionMutationOptions,
  getUpdateSpaceMutationOptions: () => getUpdateSpaceMutationOptions,
  getUpdateSubjectMutationOptions: () => getUpdateSubjectMutationOptions,
  getUpdateTenantByIdMutationOptions: () => getUpdateTenantByIdMutationOptions,
  getUpdateTimelineMutationOptions: () => getUpdateTimelineMutationOptions,
  getUpdateUserMutationOptions: () => getUpdateUserMutationOptions,
  getUser: () => getUser,
  getUsersByQuery: () => getUsersByQuery,
  getVerifyTokenQueryKey: () => getVerifyTokenQueryKey,
  getVerifyTokenQueryOptions: () => getVerifyTokenQueryOptions,
  getVerifyTokenSuspenseInfiniteQueryOptions: () => getVerifyTokenSuspenseInfiniteQueryOptions,
  getVerifyTokenSuspenseQueryOptions: () => getVerifyTokenSuspenseQueryOptions,
  login: () => login,
  logout: () => logout,
  refreshToken: () => refreshToken,
  removeExercise: () => removeExercise,
  removeFileById: () => removeFileById,
  removeGroundById: () => removeGroundById,
  removeGroups: () => removeGroups,
  removeProgramById: () => removeProgramById,
  removeRole: () => removeRole,
  removeRoleClassificationById: () => removeRoleClassificationById,
  removeRoutine: () => removeRoutine,
  removeSession: () => removeSession,
  removeSessions: () => removeSessions,
  removeSpace: () => removeSpace,
  removeSubject: () => removeSubject,
  removeSubjects: () => removeSubjects,
  removeTenantById: () => removeTenantById,
  removeTimeline: () => removeTimeline,
  removeTimelines: () => removeTimelines,
  removeUser: () => removeUser,
  removeUsers: () => removeUsers,
  signUpUser: () => signUpUser,
  updateCategoryById: () => updateCategoryById,
  updateExercise: () => updateExercise,
  updateFileById: () => updateFileById,
  updateGroundById: () => updateGroundById,
  updateGroupById: () => updateGroupById,
  updateProgramById: () => updateProgramById,
  updateRole: () => updateRole,
  updateRoleClassificationById: () => updateRoleClassificationById,
  updateRoutine: () => updateRoutine,
  updateSession: () => updateSession,
  updateSpace: () => updateSpace,
  updateSubject: () => updateSubject,
  updateTenantById: () => updateTenantById,
  updateTimeline: () => updateTimeline,
  updateUser: () => updateUser,
  useCreateCategory: () => useCreateCategory,
  useCreateExercise: () => useCreateExercise,
  useCreateFile: () => useCreateFile,
  useCreateGround: () => useCreateGround,
  useCreateGroup: () => useCreateGroup,
  useCreateProgram: () => useCreateProgram,
  useCreateRole: () => useCreateRole,
  useCreateRoleClassification: () => useCreateRoleClassification,
  useCreateRoutine: () => useCreateRoutine,
  useCreateSession: () => useCreateSession,
  useCreateSpace: () => useCreateSpace,
  useCreateSubject: () => useCreateSubject,
  useCreateTenant: () => useCreateTenant,
  useCreateTimeline: () => useCreateTimeline,
  useCreateUser: () => useCreateUser,
  useDeleteCategoryById: () => useDeleteCategoryById,
  useDeleteExercise: () => useDeleteExercise,
  useDeleteGroundById: () => useDeleteGroundById,
  useDeleteGroup: () => useDeleteGroup,
  useDeleteProgramById: () => useDeleteProgramById,
  useDeleteRole: () => useDeleteRole,
  useDeleteRoleClassificationById: () => useDeleteRoleClassificationById,
  useDeleteRoutine: () => useDeleteRoutine,
  useDeleteSession: () => useDeleteSession,
  useDeleteSpace: () => useDeleteSpace,
  useDeleteSubject: () => useDeleteSubject,
  useDeleteTenant: () => useDeleteTenant,
  useDeleteTimeline: () => useDeleteTimeline,
  useDeleteUser: () => useDeleteUser,
  useGetAppBuilder: () => useGetAppBuilder,
  useGetAppBuilderSuspense: () => useGetAppBuilderSuspense,
  useGetAppBuilderSuspenseInfinite: () => useGetAppBuilderSuspenseInfinite,
  useGetCategoriesByQuery: () => useGetCategoriesByQuery,
  useGetCategoriesByQuerySuspense: () => useGetCategoriesByQuerySuspense,
  useGetCategoriesByQuerySuspenseInfinite: () => useGetCategoriesByQuerySuspenseInfinite,
  useGetCategoryById: () => useGetCategoryById,
  useGetCategoryByIdSuspense: () => useGetCategoryByIdSuspense,
  useGetCategoryByIdSuspenseInfinite: () => useGetCategoryByIdSuspenseInfinite,
  useGetCurrentSpace: () => useGetCurrentSpace,
  useGetCurrentSpaceSuspense: () => useGetCurrentSpaceSuspense,
  useGetCurrentSpaceSuspenseInfinite: () => useGetCurrentSpaceSuspenseInfinite,
  useGetExercise: () => useGetExercise,
  useGetExerciseSuspense: () => useGetExerciseSuspense,
  useGetExerciseSuspenseInfinite: () => useGetExerciseSuspenseInfinite,
  useGetExercisesByQuery: () => useGetExercisesByQuery,
  useGetExercisesByQuerySuspense: () => useGetExercisesByQuerySuspense,
  useGetExercisesByQuerySuspenseInfinite: () => useGetExercisesByQuerySuspenseInfinite,
  useGetFileById: () => useGetFileById,
  useGetFileByIdSuspense: () => useGetFileByIdSuspense,
  useGetFileByIdSuspenseInfinite: () => useGetFileByIdSuspenseInfinite,
  useGetGroundById: () => useGetGroundById,
  useGetGroundByIdSuspense: () => useGetGroundByIdSuspense,
  useGetGroundByIdSuspenseInfinite: () => useGetGroundByIdSuspenseInfinite,
  useGetGroundsByQuery: () => useGetGroundsByQuery,
  useGetGroundsByQuerySuspense: () => useGetGroundsByQuerySuspense,
  useGetGroundsByQuerySuspenseInfinite: () => useGetGroundsByQuerySuspenseInfinite,
  useGetGroupById: () => useGetGroupById,
  useGetGroupByIdSuspense: () => useGetGroupByIdSuspense,
  useGetGroupByIdSuspenseInfinite: () => useGetGroupByIdSuspenseInfinite,
  useGetGroupsByQuery: () => useGetGroupsByQuery,
  useGetGroupsByQuerySuspense: () => useGetGroupsByQuerySuspense,
  useGetGroupsByQuerySuspenseInfinite: () => useGetGroupsByQuerySuspenseInfinite,
  useGetMyTenants: () => useGetMyTenants,
  useGetMyTenantsSuspense: () => useGetMyTenantsSuspense,
  useGetMyTenantsSuspenseInfinite: () => useGetMyTenantsSuspenseInfinite,
  useGetNewToken: () => useGetNewToken,
  useGetNewTokenSuspense: () => useGetNewTokenSuspense,
  useGetNewTokenSuspenseInfinite: () => useGetNewTokenSuspenseInfinite,
  useGetProgramById: () => useGetProgramById,
  useGetProgramByIdSuspense: () => useGetProgramByIdSuspense,
  useGetProgramByIdSuspenseInfinite: () => useGetProgramByIdSuspenseInfinite,
  useGetProgramsByQuery: () => useGetProgramsByQuery,
  useGetProgramsByQuerySuspense: () => useGetProgramsByQuerySuspense,
  useGetProgramsByQuerySuspenseInfinite: () => useGetProgramsByQuerySuspenseInfinite,
  useGetRole: () => useGetRole,
  useGetRoleClassificationById: () => useGetRoleClassificationById,
  useGetRoleClassificationByIdSuspense: () => useGetRoleClassificationByIdSuspense,
  useGetRoleClassificationByIdSuspenseInfinite: () => useGetRoleClassificationByIdSuspenseInfinite,
  useGetRoleClassificationsByQuery: () => useGetRoleClassificationsByQuery,
  useGetRoleClassificationsByQuerySuspense: () => useGetRoleClassificationsByQuerySuspense,
  useGetRoleClassificationsByQuerySuspenseInfinite: () => useGetRoleClassificationsByQuerySuspenseInfinite,
  useGetRoleSuspense: () => useGetRoleSuspense,
  useGetRoleSuspenseInfinite: () => useGetRoleSuspenseInfinite,
  useGetRolesByQuery: () => useGetRolesByQuery,
  useGetRolesByQuerySuspense: () => useGetRolesByQuerySuspense,
  useGetRolesByQuerySuspenseInfinite: () => useGetRolesByQuerySuspenseInfinite,
  useGetRoutine: () => useGetRoutine,
  useGetRoutineSuspense: () => useGetRoutineSuspense,
  useGetRoutineSuspenseInfinite: () => useGetRoutineSuspenseInfinite,
  useGetRoutinesByQuery: () => useGetRoutinesByQuery,
  useGetRoutinesByQuerySuspense: () => useGetRoutinesByQuerySuspense,
  useGetRoutinesByQuerySuspenseInfinite: () => useGetRoutinesByQuerySuspenseInfinite,
  useGetSession: () => useGetSession,
  useGetSessionSuspense: () => useGetSessionSuspense,
  useGetSessionSuspenseInfinite: () => useGetSessionSuspenseInfinite,
  useGetSessionsByQuery: () => useGetSessionsByQuery,
  useGetSessionsByQuerySuspense: () => useGetSessionsByQuerySuspense,
  useGetSessionsByQuerySuspenseInfinite: () => useGetSessionsByQuerySuspenseInfinite,
  useGetSpace: () => useGetSpace,
  useGetSpaceSuspense: () => useGetSpaceSuspense,
  useGetSpaceSuspenseInfinite: () => useGetSpaceSuspenseInfinite,
  useGetSpacesByQuery: () => useGetSpacesByQuery,
  useGetSpacesByQuerySuspense: () => useGetSpacesByQuerySuspense,
  useGetSpacesByQuerySuspenseInfinite: () => useGetSpacesByQuerySuspenseInfinite,
  useGetSubject: () => useGetSubject,
  useGetSubjectSuspense: () => useGetSubjectSuspense,
  useGetSubjectSuspenseInfinite: () => useGetSubjectSuspenseInfinite,
  useGetSubjectsByQuery: () => useGetSubjectsByQuery,
  useGetSubjectsByQuerySuspense: () => useGetSubjectsByQuerySuspense,
  useGetSubjectsByQuerySuspenseInfinite: () => useGetSubjectsByQuerySuspenseInfinite,
  useGetTenantById: () => useGetTenantById,
  useGetTenantByIdSuspense: () => useGetTenantByIdSuspense,
  useGetTenantByIdSuspenseInfinite: () => useGetTenantByIdSuspenseInfinite,
  useGetTenantsByQuery: () => useGetTenantsByQuery,
  useGetTenantsByQuerySuspense: () => useGetTenantsByQuerySuspense,
  useGetTenantsByQuerySuspenseInfinite: () => useGetTenantsByQuerySuspenseInfinite,
  useGetTimeline: () => useGetTimeline,
  useGetTimelineSuspense: () => useGetTimelineSuspense,
  useGetTimelineSuspenseInfinite: () => useGetTimelineSuspenseInfinite,
  useGetTimelinesByQuery: () => useGetTimelinesByQuery,
  useGetTimelinesByQuerySuspense: () => useGetTimelinesByQuerySuspense,
  useGetTimelinesByQuerySuspenseInfinite: () => useGetTimelinesByQuerySuspenseInfinite,
  useGetUser: () => useGetUser,
  useGetUserSuspense: () => useGetUserSuspense,
  useGetUserSuspenseInfinite: () => useGetUserSuspenseInfinite,
  useGetUsersByQuery: () => useGetUsersByQuery,
  useGetUsersByQuerySuspense: () => useGetUsersByQuerySuspense,
  useGetUsersByQuerySuspenseInfinite: () => useGetUsersByQuerySuspenseInfinite,
  useLogin: () => useLogin,
  useLogout: () => useLogout,
  useRefreshToken: () => useRefreshToken,
  useRemoveExercise: () => useRemoveExercise,
  useRemoveFileById: () => useRemoveFileById,
  useRemoveGroundById: () => useRemoveGroundById,
  useRemoveGroups: () => useRemoveGroups,
  useRemoveProgramById: () => useRemoveProgramById,
  useRemoveRole: () => useRemoveRole,
  useRemoveRoleClassificationById: () => useRemoveRoleClassificationById,
  useRemoveRoutine: () => useRemoveRoutine,
  useRemoveSession: () => useRemoveSession,
  useRemoveSessions: () => useRemoveSessions,
  useRemoveSpace: () => useRemoveSpace,
  useRemoveSubject: () => useRemoveSubject,
  useRemoveSubjects: () => useRemoveSubjects,
  useRemoveTenantById: () => useRemoveTenantById,
  useRemoveTimeline: () => useRemoveTimeline,
  useRemoveTimelines: () => useRemoveTimelines,
  useRemoveUser: () => useRemoveUser,
  useRemoveUsers: () => useRemoveUsers,
  useSignUpUser: () => useSignUpUser,
  useUpdateCategoryById: () => useUpdateCategoryById,
  useUpdateExercise: () => useUpdateExercise,
  useUpdateFileById: () => useUpdateFileById,
  useUpdateGroundById: () => useUpdateGroundById,
  useUpdateGroupById: () => useUpdateGroupById,
  useUpdateProgramById: () => useUpdateProgramById,
  useUpdateRole: () => useUpdateRole,
  useUpdateRoleClassificationById: () => useUpdateRoleClassificationById,
  useUpdateRoutine: () => useUpdateRoutine,
  useUpdateSession: () => useUpdateSession,
  useUpdateSpace: () => useUpdateSpace,
  useUpdateSubject: () => useUpdateSubject,
  useUpdateTenantById: () => useUpdateTenantById,
  useUpdateTimeline: () => useUpdateTimeline,
  useUpdateUser: () => useUpdateUser,
  useVerifyToken: () => useVerifyToken,
  useVerifyTokenSuspense: () => useVerifyTokenSuspense,
  useVerifyTokenSuspenseInfinite: () => useVerifyTokenSuspenseInfinite,
  verifyToken: () => verifyToken
});
var AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NODE_ENV === "production" ? "https://wallyops.com" : "http://localhost:3005"
});
AXIOS_INSTANCE.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 409) {
    const responseData = error.response.data;
    const errorMessage = responseData?.message || "\uCDA9\uB3CC\uC774 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.";
    console.error("409 Conflict Error:", errorMessage);
    error.message = errorMessage;
  }
  return Promise.reject(error);
});
var customInstance = /* @__PURE__ */ __name((config, options) => {
  const source = Axios.CancelToken.source();
  const headers = {
    ...config.headers,
    ...options?.headers
  };
  const promise = AXIOS_INSTANCE({
    withCredentials: true,
    ...config,
    ...options,
    headers,
    cancelToken: source.token
  }).then(({ data }) => data);
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };
  return promise;
}, "customInstance");

// src/apis.ts
var createGround = /* @__PURE__ */ __name((createGroundDto, options, signal) => {
  return customInstance({
    url: `/api/v1/grounds`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: createGroundDto,
    signal
  }, options);
}, "createGround");
var getCreateGroundMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "createGround"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return createGround(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getCreateGroundMutationOptions");
var useCreateGround = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getCreateGroundMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useCreateGround");
var getGroundsByQuery = /* @__PURE__ */ __name((params, options, signal) => {
  return customInstance({
    url: `/api/v1/grounds`,
    method: "GET",
    params,
    signal
  }, options);
}, "getGroundsByQuery");
var getGetGroundsByQueryQueryKey = /* @__PURE__ */ __name((params) => {
  return [
    `/api/v1/grounds`,
    ...params ? [
      params
    ] : []
  ];
}, "getGetGroundsByQueryQueryKey");
var getGetGroundsByQueryQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetGroundsByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getGroundsByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetGroundsByQueryQueryOptions");
function useGetGroundsByQuery(params, options, queryClient) {
  const queryOptions = getGetGroundsByQueryQueryOptions(params, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetGroundsByQuery, "useGetGroundsByQuery");
var getGetGroundsByQuerySuspenseQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetGroundsByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getGroundsByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetGroundsByQuerySuspenseQueryOptions");
function useGetGroundsByQuerySuspense(params, options, queryClient) {
  const queryOptions = getGetGroundsByQuerySuspenseQueryOptions(params, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetGroundsByQuerySuspense, "useGetGroundsByQuerySuspense");
var getGetGroundsByQuerySuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetGroundsByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getGroundsByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetGroundsByQuerySuspenseInfiniteQueryOptions");
function useGetGroundsByQuerySuspenseInfinite(params, options, queryClient) {
  const queryOptions = getGetGroundsByQuerySuspenseInfiniteQueryOptions(params, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetGroundsByQuerySuspenseInfinite, "useGetGroundsByQuerySuspenseInfinite");
var getGroundById = /* @__PURE__ */ __name((groundId, options, signal) => {
  return customInstance({
    url: `/api/v1/grounds/${groundId}`,
    method: "GET",
    signal
  }, options);
}, "getGroundById");
var getGetGroundByIdQueryKey = /* @__PURE__ */ __name((groundId) => {
  return [
    `/api/v1/grounds/${groundId}`
  ];
}, "getGetGroundByIdQueryKey");
var getGetGroundByIdQueryOptions = /* @__PURE__ */ __name((groundId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetGroundByIdQueryKey(groundId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getGroundById(groundId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    enabled: !!groundId,
    ...queryOptions
  };
}, "getGetGroundByIdQueryOptions");
function useGetGroundById(groundId, options, queryClient) {
  const queryOptions = getGetGroundByIdQueryOptions(groundId, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetGroundById, "useGetGroundById");
var getGetGroundByIdSuspenseQueryOptions = /* @__PURE__ */ __name((groundId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetGroundByIdQueryKey(groundId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getGroundById(groundId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetGroundByIdSuspenseQueryOptions");
function useGetGroundByIdSuspense(groundId, options, queryClient) {
  const queryOptions = getGetGroundByIdSuspenseQueryOptions(groundId, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetGroundByIdSuspense, "useGetGroundByIdSuspense");
var getGetGroundByIdSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((groundId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetGroundByIdQueryKey(groundId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getGroundById(groundId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetGroundByIdSuspenseInfiniteQueryOptions");
function useGetGroundByIdSuspenseInfinite(groundId, options, queryClient) {
  const queryOptions = getGetGroundByIdSuspenseInfiniteQueryOptions(groundId, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetGroundByIdSuspenseInfinite, "useGetGroundByIdSuspenseInfinite");
var updateGroundById = /* @__PURE__ */ __name((groundId, updateGroundDto, options) => {
  return customInstance({
    url: `/api/v1/grounds/${groundId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: updateGroundDto
  }, options);
}, "updateGroundById");
var getUpdateGroundByIdMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "updateGroundById"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { groundId, data } = props ?? {};
    return updateGroundById(groundId, data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getUpdateGroundByIdMutationOptions");
var useUpdateGroundById = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getUpdateGroundByIdMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useUpdateGroundById");
var deleteGroundById = /* @__PURE__ */ __name((groundId, options) => {
  return customInstance({
    url: `/api/v1/grounds/${groundId}`,
    method: "DELETE"
  }, options);
}, "deleteGroundById");
var getDeleteGroundByIdMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "deleteGroundById"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { groundId } = props ?? {};
    return deleteGroundById(groundId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getDeleteGroundByIdMutationOptions");
var useDeleteGroundById = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getDeleteGroundByIdMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useDeleteGroundById");
var removeGroundById = /* @__PURE__ */ __name((groundId, options) => {
  return customInstance({
    url: `/api/v1/grounds/${groundId}/removedAt`,
    method: "PATCH"
  }, options);
}, "removeGroundById");
var getRemoveGroundByIdMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeGroundById"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { groundId } = props ?? {};
    return removeGroundById(groundId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveGroundByIdMutationOptions");
var useRemoveGroundById = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveGroundByIdMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveGroundById");
var createRoleClassification = /* @__PURE__ */ __name((createRoleClassificationBody, options, signal) => {
  return customInstance({
    url: `/api/v1/roles/classifications`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: createRoleClassificationBody,
    signal
  }, options);
}, "createRoleClassification");
var getCreateRoleClassificationMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "createRoleClassification"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return createRoleClassification(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getCreateRoleClassificationMutationOptions");
var useCreateRoleClassification = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getCreateRoleClassificationMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useCreateRoleClassification");
var getRoleClassificationsByQuery = /* @__PURE__ */ __name((params, options, signal) => {
  return customInstance({
    url: `/api/v1/roles/classifications`,
    method: "GET",
    params,
    signal
  }, options);
}, "getRoleClassificationsByQuery");
var getGetRoleClassificationsByQueryQueryKey = /* @__PURE__ */ __name((params) => {
  return [
    `/api/v1/roles/classifications`,
    ...params ? [
      params
    ] : []
  ];
}, "getGetRoleClassificationsByQueryQueryKey");
var getGetRoleClassificationsByQueryQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRoleClassificationsByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRoleClassificationsByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetRoleClassificationsByQueryQueryOptions");
function useGetRoleClassificationsByQuery(params, options, queryClient) {
  const queryOptions = getGetRoleClassificationsByQueryQueryOptions(params, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRoleClassificationsByQuery, "useGetRoleClassificationsByQuery");
var getGetRoleClassificationsByQuerySuspenseQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRoleClassificationsByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRoleClassificationsByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetRoleClassificationsByQuerySuspenseQueryOptions");
function useGetRoleClassificationsByQuerySuspense(params, options, queryClient) {
  const queryOptions = getGetRoleClassificationsByQuerySuspenseQueryOptions(params, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRoleClassificationsByQuerySuspense, "useGetRoleClassificationsByQuerySuspense");
var getGetRoleClassificationsByQuerySuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRoleClassificationsByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRoleClassificationsByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetRoleClassificationsByQuerySuspenseInfiniteQueryOptions");
function useGetRoleClassificationsByQuerySuspenseInfinite(params, options, queryClient) {
  const queryOptions = getGetRoleClassificationsByQuerySuspenseInfiniteQueryOptions(params, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRoleClassificationsByQuerySuspenseInfinite, "useGetRoleClassificationsByQuerySuspenseInfinite");
var getRoleClassificationById = /* @__PURE__ */ __name((id, options, signal) => {
  return customInstance({
    url: `/api/v1/roles/classifications/${id}`,
    method: "GET",
    signal
  }, options);
}, "getRoleClassificationById");
var getGetRoleClassificationByIdQueryKey = /* @__PURE__ */ __name((id) => {
  return [
    `/api/v1/roles/classifications/${id}`
  ];
}, "getGetRoleClassificationByIdQueryKey");
var getGetRoleClassificationByIdQueryOptions = /* @__PURE__ */ __name((id, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRoleClassificationByIdQueryKey(id);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRoleClassificationById(id, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions
  };
}, "getGetRoleClassificationByIdQueryOptions");
function useGetRoleClassificationById(id, options, queryClient) {
  const queryOptions = getGetRoleClassificationByIdQueryOptions(id, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRoleClassificationById, "useGetRoleClassificationById");
var getGetRoleClassificationByIdSuspenseQueryOptions = /* @__PURE__ */ __name((id, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRoleClassificationByIdQueryKey(id);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRoleClassificationById(id, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetRoleClassificationByIdSuspenseQueryOptions");
function useGetRoleClassificationByIdSuspense(id, options, queryClient) {
  const queryOptions = getGetRoleClassificationByIdSuspenseQueryOptions(id, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRoleClassificationByIdSuspense, "useGetRoleClassificationByIdSuspense");
var getGetRoleClassificationByIdSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((id, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRoleClassificationByIdQueryKey(id);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRoleClassificationById(id, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetRoleClassificationByIdSuspenseInfiniteQueryOptions");
function useGetRoleClassificationByIdSuspenseInfinite(id, options, queryClient) {
  const queryOptions = getGetRoleClassificationByIdSuspenseInfiniteQueryOptions(id, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRoleClassificationByIdSuspenseInfinite, "useGetRoleClassificationByIdSuspenseInfinite");
var updateRoleClassificationById = /* @__PURE__ */ __name((id, updateRoleClassificationByIdBody, options) => {
  return customInstance({
    url: `/api/v1/roles/classifications/${id}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: updateRoleClassificationByIdBody
  }, options);
}, "updateRoleClassificationById");
var getUpdateRoleClassificationByIdMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "updateRoleClassificationById"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { id, data } = props ?? {};
    return updateRoleClassificationById(id, data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getUpdateRoleClassificationByIdMutationOptions");
var useUpdateRoleClassificationById = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getUpdateRoleClassificationByIdMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useUpdateRoleClassificationById");
var deleteRoleClassificationById = /* @__PURE__ */ __name((id, options) => {
  return customInstance({
    url: `/api/v1/roles/classifications/${id}`,
    method: "DELETE"
  }, options);
}, "deleteRoleClassificationById");
var getDeleteRoleClassificationByIdMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "deleteRoleClassificationById"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { id } = props ?? {};
    return deleteRoleClassificationById(id, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getDeleteRoleClassificationByIdMutationOptions");
var useDeleteRoleClassificationById = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getDeleteRoleClassificationByIdMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useDeleteRoleClassificationById");
var removeRoleClassificationById = /* @__PURE__ */ __name((id, options) => {
  return customInstance({
    url: `/api/v1/roles/classifications/${id}/removedAt`,
    method: "PATCH"
  }, options);
}, "removeRoleClassificationById");
var getRemoveRoleClassificationByIdMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeRoleClassificationById"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { id } = props ?? {};
    return removeRoleClassificationById(id, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveRoleClassificationByIdMutationOptions");
var useRemoveRoleClassificationById = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveRoleClassificationByIdMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveRoleClassificationById");
var getAppBuilder = /* @__PURE__ */ __name((options, signal) => {
  return customInstance({
    url: `/api/v1/appBuilder`,
    method: "GET",
    signal
  }, options);
}, "getAppBuilder");
var getGetAppBuilderQueryKey = /* @__PURE__ */ __name(() => {
  return [
    `/api/v1/appBuilder`
  ];
}, "getGetAppBuilderQueryKey");
var getGetAppBuilderQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetAppBuilderQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getAppBuilder(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetAppBuilderQueryOptions");
function useGetAppBuilder(options, queryClient) {
  const queryOptions = getGetAppBuilderQueryOptions(options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetAppBuilder, "useGetAppBuilder");
var getGetAppBuilderSuspenseQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetAppBuilderQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getAppBuilder(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetAppBuilderSuspenseQueryOptions");
function useGetAppBuilderSuspense(options, queryClient) {
  const queryOptions = getGetAppBuilderSuspenseQueryOptions(options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetAppBuilderSuspense, "useGetAppBuilderSuspense");
var getGetAppBuilderSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetAppBuilderQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getAppBuilder(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetAppBuilderSuspenseInfiniteQueryOptions");
function useGetAppBuilderSuspenseInfinite(options, queryClient) {
  const queryOptions = getGetAppBuilderSuspenseInfiniteQueryOptions(options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetAppBuilderSuspenseInfinite, "useGetAppBuilderSuspenseInfinite");
var login = /* @__PURE__ */ __name((loginPayloadDto, options, signal) => {
  return customInstance({
    url: `/api/v1/auth/login`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: loginPayloadDto,
    signal
  }, options);
}, "login");
var getLoginMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "login"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return login(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getLoginMutationOptions");
var useLogin = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getLoginMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useLogin");
var refreshToken = /* @__PURE__ */ __name((options, signal) => {
  return customInstance({
    url: `/api/v1/auth/token/refresh`,
    method: "POST",
    signal
  }, options);
}, "refreshToken");
var getRefreshTokenMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "refreshToken"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name(() => {
    return refreshToken(requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRefreshTokenMutationOptions");
var useRefreshToken = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRefreshTokenMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRefreshToken");
var getNewToken = /* @__PURE__ */ __name((options, signal) => {
  return customInstance({
    url: `/api/v1/auth/new-token`,
    method: "GET",
    signal
  }, options);
}, "getNewToken");
var getGetNewTokenQueryKey = /* @__PURE__ */ __name(() => {
  return [
    `/api/v1/auth/new-token`
  ];
}, "getGetNewTokenQueryKey");
var getGetNewTokenQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetNewTokenQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getNewToken(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetNewTokenQueryOptions");
function useGetNewToken(options, queryClient) {
  const queryOptions = getGetNewTokenQueryOptions(options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetNewToken, "useGetNewToken");
var getGetNewTokenSuspenseQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetNewTokenQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getNewToken(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetNewTokenSuspenseQueryOptions");
function useGetNewTokenSuspense(options, queryClient) {
  const queryOptions = getGetNewTokenSuspenseQueryOptions(options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetNewTokenSuspense, "useGetNewTokenSuspense");
var getGetNewTokenSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetNewTokenQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getNewToken(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetNewTokenSuspenseInfiniteQueryOptions");
function useGetNewTokenSuspenseInfinite(options, queryClient) {
  const queryOptions = getGetNewTokenSuspenseInfiniteQueryOptions(options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetNewTokenSuspenseInfinite, "useGetNewTokenSuspenseInfinite");
var signUpUser = /* @__PURE__ */ __name((signUpPayloadDto, options, signal) => {
  return customInstance({
    url: `/api/v1/auth/sign-up`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: signUpPayloadDto,
    signal
  }, options);
}, "signUpUser");
var getSignUpUserMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "signUpUser"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return signUpUser(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getSignUpUserMutationOptions");
var useSignUpUser = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getSignUpUserMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useSignUpUser");
var verifyToken = /* @__PURE__ */ __name((options, signal) => {
  return customInstance({
    url: `/api/v1/auth/verify-token`,
    method: "GET",
    signal
  }, options);
}, "verifyToken");
var getVerifyTokenQueryKey = /* @__PURE__ */ __name(() => {
  return [
    `/api/v1/auth/verify-token`
  ];
}, "getVerifyTokenQueryKey");
var getVerifyTokenQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getVerifyTokenQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => verifyToken(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getVerifyTokenQueryOptions");
function useVerifyToken(options, queryClient) {
  const queryOptions = getVerifyTokenQueryOptions(options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useVerifyToken, "useVerifyToken");
var getVerifyTokenSuspenseQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getVerifyTokenQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => verifyToken(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getVerifyTokenSuspenseQueryOptions");
function useVerifyTokenSuspense(options, queryClient) {
  const queryOptions = getVerifyTokenSuspenseQueryOptions(options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useVerifyTokenSuspense, "useVerifyTokenSuspense");
var getVerifyTokenSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getVerifyTokenQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => verifyToken(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getVerifyTokenSuspenseInfiniteQueryOptions");
function useVerifyTokenSuspenseInfinite(options, queryClient) {
  const queryOptions = getVerifyTokenSuspenseInfiniteQueryOptions(options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useVerifyTokenSuspenseInfinite, "useVerifyTokenSuspenseInfinite");
var logout = /* @__PURE__ */ __name((options, signal) => {
  return customInstance({
    url: `/api/v1/auth/logout`,
    method: "POST",
    signal
  }, options);
}, "logout");
var getLogoutMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "logout"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name(() => {
    return logout(requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getLogoutMutationOptions");
var useLogout = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getLogoutMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useLogout");
var getCategoriesByQuery = /* @__PURE__ */ __name((params, options, signal) => {
  return customInstance({
    url: `/api/v1/categories`,
    method: "GET",
    params,
    signal
  }, options);
}, "getCategoriesByQuery");
var getGetCategoriesByQueryQueryKey = /* @__PURE__ */ __name((params) => {
  return [
    `/api/v1/categories`,
    ...params ? [
      params
    ] : []
  ];
}, "getGetCategoriesByQueryQueryKey");
var getGetCategoriesByQueryQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetCategoriesByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getCategoriesByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetCategoriesByQueryQueryOptions");
function useGetCategoriesByQuery(params, options, queryClient) {
  const queryOptions = getGetCategoriesByQueryQueryOptions(params, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetCategoriesByQuery, "useGetCategoriesByQuery");
var getGetCategoriesByQuerySuspenseQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetCategoriesByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getCategoriesByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetCategoriesByQuerySuspenseQueryOptions");
function useGetCategoriesByQuerySuspense(params, options, queryClient) {
  const queryOptions = getGetCategoriesByQuerySuspenseQueryOptions(params, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetCategoriesByQuerySuspense, "useGetCategoriesByQuerySuspense");
var getGetCategoriesByQuerySuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetCategoriesByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getCategoriesByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetCategoriesByQuerySuspenseInfiniteQueryOptions");
function useGetCategoriesByQuerySuspenseInfinite(params, options, queryClient) {
  const queryOptions = getGetCategoriesByQuerySuspenseInfiniteQueryOptions(params, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetCategoriesByQuerySuspenseInfinite, "useGetCategoriesByQuerySuspenseInfinite");
var createCategory = /* @__PURE__ */ __name((createCategoryDto, options, signal) => {
  return customInstance({
    url: `/api/v1/categories`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: createCategoryDto,
    signal
  }, options);
}, "createCategory");
var getCreateCategoryMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "createCategory"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return createCategory(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getCreateCategoryMutationOptions");
var useCreateCategory = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getCreateCategoryMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useCreateCategory");
var getCategoryById = /* @__PURE__ */ __name((categoryId, options, signal) => {
  return customInstance({
    url: `/api/v1/categories/${categoryId}`,
    method: "GET",
    signal
  }, options);
}, "getCategoryById");
var getGetCategoryByIdQueryKey = /* @__PURE__ */ __name((categoryId) => {
  return [
    `/api/v1/categories/${categoryId}`
  ];
}, "getGetCategoryByIdQueryKey");
var getGetCategoryByIdQueryOptions = /* @__PURE__ */ __name((categoryId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetCategoryByIdQueryKey(categoryId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getCategoryById(categoryId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    enabled: !!categoryId,
    ...queryOptions
  };
}, "getGetCategoryByIdQueryOptions");
function useGetCategoryById(categoryId, options, queryClient) {
  const queryOptions = getGetCategoryByIdQueryOptions(categoryId, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetCategoryById, "useGetCategoryById");
var getGetCategoryByIdSuspenseQueryOptions = /* @__PURE__ */ __name((categoryId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetCategoryByIdQueryKey(categoryId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getCategoryById(categoryId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetCategoryByIdSuspenseQueryOptions");
function useGetCategoryByIdSuspense(categoryId, options, queryClient) {
  const queryOptions = getGetCategoryByIdSuspenseQueryOptions(categoryId, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetCategoryByIdSuspense, "useGetCategoryByIdSuspense");
var getGetCategoryByIdSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((categoryId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetCategoryByIdQueryKey(categoryId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getCategoryById(categoryId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetCategoryByIdSuspenseInfiniteQueryOptions");
function useGetCategoryByIdSuspenseInfinite(categoryId, options, queryClient) {
  const queryOptions = getGetCategoryByIdSuspenseInfiniteQueryOptions(categoryId, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetCategoryByIdSuspenseInfinite, "useGetCategoryByIdSuspenseInfinite");
var updateCategoryById = /* @__PURE__ */ __name((categoryId, updateCategoryDto, options) => {
  return customInstance({
    url: `/api/v1/categories/${categoryId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: updateCategoryDto
  }, options);
}, "updateCategoryById");
var getUpdateCategoryByIdMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "updateCategoryById"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { categoryId, data } = props ?? {};
    return updateCategoryById(categoryId, data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getUpdateCategoryByIdMutationOptions");
var useUpdateCategoryById = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getUpdateCategoryByIdMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useUpdateCategoryById");
var deleteCategoryById = /* @__PURE__ */ __name((categoryId, options) => {
  return customInstance({
    url: `/api/v1/categories/${categoryId}`,
    method: "DELETE"
  }, options);
}, "deleteCategoryById");
var getDeleteCategoryByIdMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "deleteCategoryById"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { categoryId } = props ?? {};
    return deleteCategoryById(categoryId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getDeleteCategoryByIdMutationOptions");
var useDeleteCategoryById = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getDeleteCategoryByIdMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useDeleteCategoryById");
var createGroup = /* @__PURE__ */ __name((_function, options, signal) => {
  return customInstance({
    url: `/api/v1/groups`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: _function,
    signal
  }, options);
}, "createGroup");
var getCreateGroupMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "createGroup"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return createGroup(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getCreateGroupMutationOptions");
var useCreateGroup = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getCreateGroupMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useCreateGroup");
var getGroupsByQuery = /* @__PURE__ */ __name((options, signal) => {
  return customInstance({
    url: `/api/v1/groups`,
    method: "GET",
    signal
  }, options);
}, "getGroupsByQuery");
var getGetGroupsByQueryQueryKey = /* @__PURE__ */ __name(() => {
  return [
    `/api/v1/groups`
  ];
}, "getGetGroupsByQueryQueryKey");
var getGetGroupsByQueryQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetGroupsByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getGroupsByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetGroupsByQueryQueryOptions");
function useGetGroupsByQuery(options, queryClient) {
  const queryOptions = getGetGroupsByQueryQueryOptions(options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetGroupsByQuery, "useGetGroupsByQuery");
var getGetGroupsByQuerySuspenseQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetGroupsByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getGroupsByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetGroupsByQuerySuspenseQueryOptions");
function useGetGroupsByQuerySuspense(options, queryClient) {
  const queryOptions = getGetGroupsByQuerySuspenseQueryOptions(options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetGroupsByQuerySuspense, "useGetGroupsByQuerySuspense");
var getGetGroupsByQuerySuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetGroupsByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getGroupsByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetGroupsByQuerySuspenseInfiniteQueryOptions");
function useGetGroupsByQuerySuspenseInfinite(options, queryClient) {
  const queryOptions = getGetGroupsByQuerySuspenseInfiniteQueryOptions(options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetGroupsByQuerySuspenseInfinite, "useGetGroupsByQuerySuspenseInfinite");
var getGroupById = /* @__PURE__ */ __name((groupId, options, signal) => {
  return customInstance({
    url: `/api/v1/groups/${groupId}`,
    method: "GET",
    signal
  }, options);
}, "getGroupById");
var getGetGroupByIdQueryKey = /* @__PURE__ */ __name((groupId) => {
  return [
    `/api/v1/groups/${groupId}`
  ];
}, "getGetGroupByIdQueryKey");
var getGetGroupByIdQueryOptions = /* @__PURE__ */ __name((groupId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetGroupByIdQueryKey(groupId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getGroupById(groupId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    enabled: !!groupId,
    ...queryOptions
  };
}, "getGetGroupByIdQueryOptions");
function useGetGroupById(groupId, options, queryClient) {
  const queryOptions = getGetGroupByIdQueryOptions(groupId, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetGroupById, "useGetGroupById");
var getGetGroupByIdSuspenseQueryOptions = /* @__PURE__ */ __name((groupId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetGroupByIdQueryKey(groupId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getGroupById(groupId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetGroupByIdSuspenseQueryOptions");
function useGetGroupByIdSuspense(groupId, options, queryClient) {
  const queryOptions = getGetGroupByIdSuspenseQueryOptions(groupId, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetGroupByIdSuspense, "useGetGroupByIdSuspense");
var getGetGroupByIdSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((groupId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetGroupByIdQueryKey(groupId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getGroupById(groupId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetGroupByIdSuspenseInfiniteQueryOptions");
function useGetGroupByIdSuspenseInfinite(groupId, options, queryClient) {
  const queryOptions = getGetGroupByIdSuspenseInfiniteQueryOptions(groupId, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetGroupByIdSuspenseInfinite, "useGetGroupByIdSuspenseInfinite");
var updateGroupById = /* @__PURE__ */ __name((groupId, _function, options) => {
  return customInstance({
    url: `/api/v1/groups/${groupId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: _function
  }, options);
}, "updateGroupById");
var getUpdateGroupByIdMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "updateGroupById"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { groupId, data } = props ?? {};
    return updateGroupById(groupId, data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getUpdateGroupByIdMutationOptions");
var useUpdateGroupById = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getUpdateGroupByIdMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useUpdateGroupById");
var deleteGroup = /* @__PURE__ */ __name((groupId, options) => {
  return customInstance({
    url: `/api/v1/groups/${groupId}`,
    method: "DELETE"
  }, options);
}, "deleteGroup");
var getDeleteGroupMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "deleteGroup"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { groupId } = props ?? {};
    return deleteGroup(groupId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getDeleteGroupMutationOptions");
var useDeleteGroup = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getDeleteGroupMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useDeleteGroup");
var removeGroups = /* @__PURE__ */ __name((groupIds, options) => {
  return customInstance({
    url: `/api/v1/groups/${groupIds}`,
    method: "PATCH"
  }, options);
}, "removeGroups");
var getRemoveGroupsMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeGroups"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { groupIds } = props ?? {};
    return removeGroups(groupIds, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveGroupsMutationOptions");
var useRemoveGroups = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveGroupsMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveGroups");
var getCurrentSpace = /* @__PURE__ */ __name((options, signal) => {
  return customInstance({
    url: `/api/v1/spaces/current`,
    method: "GET",
    signal
  }, options);
}, "getCurrentSpace");
var getGetCurrentSpaceQueryKey = /* @__PURE__ */ __name(() => {
  return [
    `/api/v1/spaces/current`
  ];
}, "getGetCurrentSpaceQueryKey");
var getGetCurrentSpaceQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetCurrentSpaceQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getCurrentSpace(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetCurrentSpaceQueryOptions");
function useGetCurrentSpace(options, queryClient) {
  const queryOptions = getGetCurrentSpaceQueryOptions(options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetCurrentSpace, "useGetCurrentSpace");
var getGetCurrentSpaceSuspenseQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetCurrentSpaceQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getCurrentSpace(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetCurrentSpaceSuspenseQueryOptions");
function useGetCurrentSpaceSuspense(options, queryClient) {
  const queryOptions = getGetCurrentSpaceSuspenseQueryOptions(options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetCurrentSpaceSuspense, "useGetCurrentSpaceSuspense");
var getGetCurrentSpaceSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetCurrentSpaceQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getCurrentSpace(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetCurrentSpaceSuspenseInfiniteQueryOptions");
function useGetCurrentSpaceSuspenseInfinite(options, queryClient) {
  const queryOptions = getGetCurrentSpaceSuspenseInfiniteQueryOptions(options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetCurrentSpaceSuspenseInfinite, "useGetCurrentSpaceSuspenseInfinite");
var createSpace = /* @__PURE__ */ __name((createSpaceDto, options, signal) => {
  return customInstance({
    url: `/api/v1/spaces`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: createSpaceDto,
    signal
  }, options);
}, "createSpace");
var getCreateSpaceMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "createSpace"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return createSpace(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getCreateSpaceMutationOptions");
var useCreateSpace = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getCreateSpaceMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useCreateSpace");
var getSpacesByQuery = /* @__PURE__ */ __name((params, options, signal) => {
  return customInstance({
    url: `/api/v1/spaces`,
    method: "GET",
    params,
    signal
  }, options);
}, "getSpacesByQuery");
var getGetSpacesByQueryQueryKey = /* @__PURE__ */ __name((params) => {
  return [
    `/api/v1/spaces`,
    ...params ? [
      params
    ] : []
  ];
}, "getGetSpacesByQueryQueryKey");
var getGetSpacesByQueryQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSpacesByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSpacesByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetSpacesByQueryQueryOptions");
function useGetSpacesByQuery(params, options, queryClient) {
  const queryOptions = getGetSpacesByQueryQueryOptions(params, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSpacesByQuery, "useGetSpacesByQuery");
var getGetSpacesByQuerySuspenseQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSpacesByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSpacesByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetSpacesByQuerySuspenseQueryOptions");
function useGetSpacesByQuerySuspense(params, options, queryClient) {
  const queryOptions = getGetSpacesByQuerySuspenseQueryOptions(params, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSpacesByQuerySuspense, "useGetSpacesByQuerySuspense");
var getGetSpacesByQuerySuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSpacesByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSpacesByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetSpacesByQuerySuspenseInfiniteQueryOptions");
function useGetSpacesByQuerySuspenseInfinite(params, options, queryClient) {
  const queryOptions = getGetSpacesByQuerySuspenseInfiniteQueryOptions(params, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSpacesByQuerySuspenseInfinite, "useGetSpacesByQuerySuspenseInfinite");
var getSpace = /* @__PURE__ */ __name((spaceId, options, signal) => {
  return customInstance({
    url: `/api/v1/spaces/${spaceId}`,
    method: "GET",
    signal
  }, options);
}, "getSpace");
var getGetSpaceQueryKey = /* @__PURE__ */ __name((spaceId) => {
  return [
    `/api/v1/spaces/${spaceId}`
  ];
}, "getGetSpaceQueryKey");
var getGetSpaceQueryOptions = /* @__PURE__ */ __name((spaceId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSpaceQueryKey(spaceId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSpace(spaceId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    enabled: !!spaceId,
    ...queryOptions
  };
}, "getGetSpaceQueryOptions");
function useGetSpace(spaceId, options, queryClient) {
  const queryOptions = getGetSpaceQueryOptions(spaceId, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSpace, "useGetSpace");
var getGetSpaceSuspenseQueryOptions = /* @__PURE__ */ __name((spaceId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSpaceQueryKey(spaceId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSpace(spaceId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetSpaceSuspenseQueryOptions");
function useGetSpaceSuspense(spaceId, options, queryClient) {
  const queryOptions = getGetSpaceSuspenseQueryOptions(spaceId, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSpaceSuspense, "useGetSpaceSuspense");
var getGetSpaceSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((spaceId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSpaceQueryKey(spaceId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSpace(spaceId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetSpaceSuspenseInfiniteQueryOptions");
function useGetSpaceSuspenseInfinite(spaceId, options, queryClient) {
  const queryOptions = getGetSpaceSuspenseInfiniteQueryOptions(spaceId, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSpaceSuspenseInfinite, "useGetSpaceSuspenseInfinite");
var updateSpace = /* @__PURE__ */ __name((spaceId, updateSpaceDto, options) => {
  return customInstance({
    url: `/api/v1/spaces/${spaceId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: updateSpaceDto
  }, options);
}, "updateSpace");
var getUpdateSpaceMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "updateSpace"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { spaceId, data } = props ?? {};
    return updateSpace(spaceId, data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getUpdateSpaceMutationOptions");
var useUpdateSpace = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getUpdateSpaceMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useUpdateSpace");
var deleteSpace = /* @__PURE__ */ __name((spaceId, options) => {
  return customInstance({
    url: `/api/v1/spaces/${spaceId}`,
    method: "DELETE"
  }, options);
}, "deleteSpace");
var getDeleteSpaceMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "deleteSpace"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { spaceId } = props ?? {};
    return deleteSpace(spaceId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getDeleteSpaceMutationOptions");
var useDeleteSpace = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getDeleteSpaceMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useDeleteSpace");
var removeSpace = /* @__PURE__ */ __name((spaceId, options) => {
  return customInstance({
    url: `/api/v1/spaces/${spaceId}/removedAt`,
    method: "PATCH"
  }, options);
}, "removeSpace");
var getRemoveSpaceMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeSpace"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { spaceId } = props ?? {};
    return removeSpace(spaceId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveSpaceMutationOptions");
var useRemoveSpace = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveSpaceMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveSpace");
var createUser = /* @__PURE__ */ __name((createUserDto, options, signal) => {
  return customInstance({
    url: `/api/v1/users`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: createUserDto,
    signal
  }, options);
}, "createUser");
var getCreateUserMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "createUser"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return createUser(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getCreateUserMutationOptions");
var useCreateUser = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getCreateUserMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useCreateUser");
var getUsersByQuery = /* @__PURE__ */ __name((params, options, signal) => {
  return customInstance({
    url: `/api/v1/users`,
    method: "GET",
    params,
    signal
  }, options);
}, "getUsersByQuery");
var getGetUsersByQueryQueryKey = /* @__PURE__ */ __name((params) => {
  return [
    `/api/v1/users`,
    ...params ? [
      params
    ] : []
  ];
}, "getGetUsersByQueryQueryKey");
var getGetUsersByQueryQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetUsersByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getUsersByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetUsersByQueryQueryOptions");
function useGetUsersByQuery(params, options, queryClient) {
  const queryOptions = getGetUsersByQueryQueryOptions(params, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetUsersByQuery, "useGetUsersByQuery");
var getGetUsersByQuerySuspenseQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetUsersByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getUsersByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetUsersByQuerySuspenseQueryOptions");
function useGetUsersByQuerySuspense(params, options, queryClient) {
  const queryOptions = getGetUsersByQuerySuspenseQueryOptions(params, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetUsersByQuerySuspense, "useGetUsersByQuerySuspense");
var getGetUsersByQuerySuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetUsersByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getUsersByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetUsersByQuerySuspenseInfiniteQueryOptions");
function useGetUsersByQuerySuspenseInfinite(params, options, queryClient) {
  const queryOptions = getGetUsersByQuerySuspenseInfiniteQueryOptions(params, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetUsersByQuerySuspenseInfinite, "useGetUsersByQuerySuspenseInfinite");
var getUser = /* @__PURE__ */ __name((userId, options, signal) => {
  return customInstance({
    url: `/api/v1/users/${userId}`,
    method: "GET",
    signal
  }, options);
}, "getUser");
var getGetUserQueryKey = /* @__PURE__ */ __name((userId) => {
  return [
    `/api/v1/users/${userId}`
  ];
}, "getGetUserQueryKey");
var getGetUserQueryOptions = /* @__PURE__ */ __name((userId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetUserQueryKey(userId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getUser(userId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    enabled: !!userId,
    ...queryOptions
  };
}, "getGetUserQueryOptions");
function useGetUser(userId, options, queryClient) {
  const queryOptions = getGetUserQueryOptions(userId, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetUser, "useGetUser");
var getGetUserSuspenseQueryOptions = /* @__PURE__ */ __name((userId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetUserQueryKey(userId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getUser(userId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetUserSuspenseQueryOptions");
function useGetUserSuspense(userId, options, queryClient) {
  const queryOptions = getGetUserSuspenseQueryOptions(userId, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetUserSuspense, "useGetUserSuspense");
var getGetUserSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((userId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetUserQueryKey(userId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getUser(userId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetUserSuspenseInfiniteQueryOptions");
function useGetUserSuspenseInfinite(userId, options, queryClient) {
  const queryOptions = getGetUserSuspenseInfiniteQueryOptions(userId, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetUserSuspenseInfinite, "useGetUserSuspenseInfinite");
var updateUser = /* @__PURE__ */ __name((userId, updateUserDto, options) => {
  return customInstance({
    url: `/api/v1/users/${userId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: updateUserDto
  }, options);
}, "updateUser");
var getUpdateUserMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "updateUser"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { userId, data } = props ?? {};
    return updateUser(userId, data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getUpdateUserMutationOptions");
var useUpdateUser = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getUpdateUserMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useUpdateUser");
var deleteUser = /* @__PURE__ */ __name((userId, options) => {
  return customInstance({
    url: `/api/v1/users/${userId}`,
    method: "DELETE"
  }, options);
}, "deleteUser");
var getDeleteUserMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "deleteUser"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { userId } = props ?? {};
    return deleteUser(userId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getDeleteUserMutationOptions");
var useDeleteUser = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getDeleteUserMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useDeleteUser");
var removeUsers = /* @__PURE__ */ __name((removeUsersBody, options) => {
  return customInstance({
    url: `/api/v1/users/removedAt`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: removeUsersBody
  }, options);
}, "removeUsers");
var getRemoveUsersMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeUsers"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return removeUsers(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveUsersMutationOptions");
var useRemoveUsers = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveUsersMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveUsers");
var removeUser = /* @__PURE__ */ __name((userId, options) => {
  return customInstance({
    url: `/api/v1/users/${userId}/removedAt`,
    method: "PATCH"
  }, options);
}, "removeUser");
var getRemoveUserMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeUser"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { userId } = props ?? {};
    return removeUser(userId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveUserMutationOptions");
var useRemoveUser = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveUserMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveUser");
var createRole = /* @__PURE__ */ __name((createRoleDto, options, signal) => {
  return customInstance({
    url: `/api/v1/roles`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: createRoleDto,
    signal
  }, options);
}, "createRole");
var getCreateRoleMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "createRole"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return createRole(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getCreateRoleMutationOptions");
var useCreateRole = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getCreateRoleMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useCreateRole");
var getRolesByQuery = /* @__PURE__ */ __name((params, options, signal) => {
  return customInstance({
    url: `/api/v1/roles`,
    method: "GET",
    params,
    signal
  }, options);
}, "getRolesByQuery");
var getGetRolesByQueryQueryKey = /* @__PURE__ */ __name((params) => {
  return [
    `/api/v1/roles`,
    ...params ? [
      params
    ] : []
  ];
}, "getGetRolesByQueryQueryKey");
var getGetRolesByQueryQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRolesByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRolesByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetRolesByQueryQueryOptions");
function useGetRolesByQuery(params, options, queryClient) {
  const queryOptions = getGetRolesByQueryQueryOptions(params, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRolesByQuery, "useGetRolesByQuery");
var getGetRolesByQuerySuspenseQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRolesByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRolesByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetRolesByQuerySuspenseQueryOptions");
function useGetRolesByQuerySuspense(params, options, queryClient) {
  const queryOptions = getGetRolesByQuerySuspenseQueryOptions(params, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRolesByQuerySuspense, "useGetRolesByQuerySuspense");
var getGetRolesByQuerySuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRolesByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRolesByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetRolesByQuerySuspenseInfiniteQueryOptions");
function useGetRolesByQuerySuspenseInfinite(params, options, queryClient) {
  const queryOptions = getGetRolesByQuerySuspenseInfiniteQueryOptions(params, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRolesByQuerySuspenseInfinite, "useGetRolesByQuerySuspenseInfinite");
var getRole = /* @__PURE__ */ __name((roleId, options, signal) => {
  return customInstance({
    url: `/api/v1/roles/${roleId}`,
    method: "GET",
    signal
  }, options);
}, "getRole");
var getGetRoleQueryKey = /* @__PURE__ */ __name((roleId) => {
  return [
    `/api/v1/roles/${roleId}`
  ];
}, "getGetRoleQueryKey");
var getGetRoleQueryOptions = /* @__PURE__ */ __name((roleId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRoleQueryKey(roleId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRole(roleId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    enabled: !!roleId,
    ...queryOptions
  };
}, "getGetRoleQueryOptions");
function useGetRole(roleId, options, queryClient) {
  const queryOptions = getGetRoleQueryOptions(roleId, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRole, "useGetRole");
var getGetRoleSuspenseQueryOptions = /* @__PURE__ */ __name((roleId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRoleQueryKey(roleId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRole(roleId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetRoleSuspenseQueryOptions");
function useGetRoleSuspense(roleId, options, queryClient) {
  const queryOptions = getGetRoleSuspenseQueryOptions(roleId, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRoleSuspense, "useGetRoleSuspense");
var getGetRoleSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((roleId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRoleQueryKey(roleId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRole(roleId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetRoleSuspenseInfiniteQueryOptions");
function useGetRoleSuspenseInfinite(roleId, options, queryClient) {
  const queryOptions = getGetRoleSuspenseInfiniteQueryOptions(roleId, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRoleSuspenseInfinite, "useGetRoleSuspenseInfinite");
var updateRole = /* @__PURE__ */ __name((roleId, updateRoleDto, options) => {
  return customInstance({
    url: `/api/v1/roles/${roleId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: updateRoleDto
  }, options);
}, "updateRole");
var getUpdateRoleMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "updateRole"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { roleId, data } = props ?? {};
    return updateRole(roleId, data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getUpdateRoleMutationOptions");
var useUpdateRole = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getUpdateRoleMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useUpdateRole");
var deleteRole = /* @__PURE__ */ __name((roleId, options) => {
  return customInstance({
    url: `/api/v1/roles/${roleId}`,
    method: "DELETE"
  }, options);
}, "deleteRole");
var getDeleteRoleMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "deleteRole"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { roleId } = props ?? {};
    return deleteRole(roleId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getDeleteRoleMutationOptions");
var useDeleteRole = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getDeleteRoleMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useDeleteRole");
var removeRole = /* @__PURE__ */ __name((roleId, options) => {
  return customInstance({
    url: `/api/v1/roles/${roleId}/removedAt`,
    method: "PATCH"
  }, options);
}, "removeRole");
var getRemoveRoleMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeRole"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { roleId } = props ?? {};
    return removeRole(roleId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveRoleMutationOptions");
var useRemoveRole = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveRoleMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveRole");
var createSubject = /* @__PURE__ */ __name((_function, options, signal) => {
  return customInstance({
    url: `/api/v1/subjects`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: _function,
    signal
  }, options);
}, "createSubject");
var getCreateSubjectMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "createSubject"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return createSubject(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getCreateSubjectMutationOptions");
var useCreateSubject = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getCreateSubjectMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useCreateSubject");
var getSubjectsByQuery = /* @__PURE__ */ __name((options, signal) => {
  return customInstance({
    url: `/api/v1/subjects`,
    method: "GET",
    signal
  }, options);
}, "getSubjectsByQuery");
var getGetSubjectsByQueryQueryKey = /* @__PURE__ */ __name(() => {
  return [
    `/api/v1/subjects`
  ];
}, "getGetSubjectsByQueryQueryKey");
var getGetSubjectsByQueryQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSubjectsByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSubjectsByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetSubjectsByQueryQueryOptions");
function useGetSubjectsByQuery(options, queryClient) {
  const queryOptions = getGetSubjectsByQueryQueryOptions(options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSubjectsByQuery, "useGetSubjectsByQuery");
var getGetSubjectsByQuerySuspenseQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSubjectsByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSubjectsByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetSubjectsByQuerySuspenseQueryOptions");
function useGetSubjectsByQuerySuspense(options, queryClient) {
  const queryOptions = getGetSubjectsByQuerySuspenseQueryOptions(options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSubjectsByQuerySuspense, "useGetSubjectsByQuerySuspense");
var getGetSubjectsByQuerySuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSubjectsByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSubjectsByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetSubjectsByQuerySuspenseInfiniteQueryOptions");
function useGetSubjectsByQuerySuspenseInfinite(options, queryClient) {
  const queryOptions = getGetSubjectsByQuerySuspenseInfiniteQueryOptions(options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSubjectsByQuerySuspenseInfinite, "useGetSubjectsByQuerySuspenseInfinite");
var getSubject = /* @__PURE__ */ __name((subjectId, options, signal) => {
  return customInstance({
    url: `/api/v1/subjects/${subjectId}`,
    method: "GET",
    signal
  }, options);
}, "getSubject");
var getGetSubjectQueryKey = /* @__PURE__ */ __name((subjectId) => {
  return [
    `/api/v1/subjects/${subjectId}`
  ];
}, "getGetSubjectQueryKey");
var getGetSubjectQueryOptions = /* @__PURE__ */ __name((subjectId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSubjectQueryKey(subjectId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSubject(subjectId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    enabled: !!subjectId,
    ...queryOptions
  };
}, "getGetSubjectQueryOptions");
function useGetSubject(subjectId, options, queryClient) {
  const queryOptions = getGetSubjectQueryOptions(subjectId, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSubject, "useGetSubject");
var getGetSubjectSuspenseQueryOptions = /* @__PURE__ */ __name((subjectId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSubjectQueryKey(subjectId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSubject(subjectId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetSubjectSuspenseQueryOptions");
function useGetSubjectSuspense(subjectId, options, queryClient) {
  const queryOptions = getGetSubjectSuspenseQueryOptions(subjectId, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSubjectSuspense, "useGetSubjectSuspense");
var getGetSubjectSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((subjectId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSubjectQueryKey(subjectId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSubject(subjectId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetSubjectSuspenseInfiniteQueryOptions");
function useGetSubjectSuspenseInfinite(subjectId, options, queryClient) {
  const queryOptions = getGetSubjectSuspenseInfiniteQueryOptions(subjectId, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSubjectSuspenseInfinite, "useGetSubjectSuspenseInfinite");
var updateSubject = /* @__PURE__ */ __name((subjectId, _function, options) => {
  return customInstance({
    url: `/api/v1/subjects/${subjectId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: _function
  }, options);
}, "updateSubject");
var getUpdateSubjectMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "updateSubject"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { subjectId, data } = props ?? {};
    return updateSubject(subjectId, data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getUpdateSubjectMutationOptions");
var useUpdateSubject = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getUpdateSubjectMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useUpdateSubject");
var deleteSubject = /* @__PURE__ */ __name((subjectId, options) => {
  return customInstance({
    url: `/api/v1/subjects/${subjectId}`,
    method: "DELETE"
  }, options);
}, "deleteSubject");
var getDeleteSubjectMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "deleteSubject"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { subjectId } = props ?? {};
    return deleteSubject(subjectId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getDeleteSubjectMutationOptions");
var useDeleteSubject = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getDeleteSubjectMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useDeleteSubject");
var removeSubjects = /* @__PURE__ */ __name((removeSubjectsBody, options) => {
  return customInstance({
    url: `/api/v1/subjects/removedAt`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: removeSubjectsBody
  }, options);
}, "removeSubjects");
var getRemoveSubjectsMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeSubjects"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return removeSubjects(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveSubjectsMutationOptions");
var useRemoveSubjects = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveSubjectsMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveSubjects");
var removeSubject = /* @__PURE__ */ __name((subjectId, options) => {
  return customInstance({
    url: `/api/v1/subjects/${subjectId}/removedAt`,
    method: "PATCH"
  }, options);
}, "removeSubject");
var getRemoveSubjectMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeSubject"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { subjectId } = props ?? {};
    return removeSubject(subjectId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveSubjectMutationOptions");
var useRemoveSubject = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveSubjectMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveSubject");
var createTimeline = /* @__PURE__ */ __name((_function, options, signal) => {
  return customInstance({
    url: `/api/v1/timelines`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: _function,
    signal
  }, options);
}, "createTimeline");
var getCreateTimelineMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "createTimeline"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return createTimeline(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getCreateTimelineMutationOptions");
var useCreateTimeline = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getCreateTimelineMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useCreateTimeline");
var getTimelinesByQuery = /* @__PURE__ */ __name((options, signal) => {
  return customInstance({
    url: `/api/v1/timelines`,
    method: "GET",
    signal
  }, options);
}, "getTimelinesByQuery");
var getGetTimelinesByQueryQueryKey = /* @__PURE__ */ __name(() => {
  return [
    `/api/v1/timelines`
  ];
}, "getGetTimelinesByQueryQueryKey");
var getGetTimelinesByQueryQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetTimelinesByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getTimelinesByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetTimelinesByQueryQueryOptions");
function useGetTimelinesByQuery(options, queryClient) {
  const queryOptions = getGetTimelinesByQueryQueryOptions(options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetTimelinesByQuery, "useGetTimelinesByQuery");
var getGetTimelinesByQuerySuspenseQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetTimelinesByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getTimelinesByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetTimelinesByQuerySuspenseQueryOptions");
function useGetTimelinesByQuerySuspense(options, queryClient) {
  const queryOptions = getGetTimelinesByQuerySuspenseQueryOptions(options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetTimelinesByQuerySuspense, "useGetTimelinesByQuerySuspense");
var getGetTimelinesByQuerySuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetTimelinesByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getTimelinesByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetTimelinesByQuerySuspenseInfiniteQueryOptions");
function useGetTimelinesByQuerySuspenseInfinite(options, queryClient) {
  const queryOptions = getGetTimelinesByQuerySuspenseInfiniteQueryOptions(options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetTimelinesByQuerySuspenseInfinite, "useGetTimelinesByQuerySuspenseInfinite");
var getTimeline = /* @__PURE__ */ __name((timelineId, options, signal) => {
  return customInstance({
    url: `/api/v1/timelines/${timelineId}`,
    method: "GET",
    signal
  }, options);
}, "getTimeline");
var getGetTimelineQueryKey = /* @__PURE__ */ __name((timelineId) => {
  return [
    `/api/v1/timelines/${timelineId}`
  ];
}, "getGetTimelineQueryKey");
var getGetTimelineQueryOptions = /* @__PURE__ */ __name((timelineId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetTimelineQueryKey(timelineId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getTimeline(timelineId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    enabled: !!timelineId,
    ...queryOptions
  };
}, "getGetTimelineQueryOptions");
function useGetTimeline(timelineId, options, queryClient) {
  const queryOptions = getGetTimelineQueryOptions(timelineId, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetTimeline, "useGetTimeline");
var getGetTimelineSuspenseQueryOptions = /* @__PURE__ */ __name((timelineId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetTimelineQueryKey(timelineId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getTimeline(timelineId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetTimelineSuspenseQueryOptions");
function useGetTimelineSuspense(timelineId, options, queryClient) {
  const queryOptions = getGetTimelineSuspenseQueryOptions(timelineId, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetTimelineSuspense, "useGetTimelineSuspense");
var getGetTimelineSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((timelineId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetTimelineQueryKey(timelineId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getTimeline(timelineId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetTimelineSuspenseInfiniteQueryOptions");
function useGetTimelineSuspenseInfinite(timelineId, options, queryClient) {
  const queryOptions = getGetTimelineSuspenseInfiniteQueryOptions(timelineId, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetTimelineSuspenseInfinite, "useGetTimelineSuspenseInfinite");
var updateTimeline = /* @__PURE__ */ __name((timelineId, _function, options) => {
  return customInstance({
    url: `/api/v1/timelines/${timelineId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: _function
  }, options);
}, "updateTimeline");
var getUpdateTimelineMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "updateTimeline"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { timelineId, data } = props ?? {};
    return updateTimeline(timelineId, data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getUpdateTimelineMutationOptions");
var useUpdateTimeline = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getUpdateTimelineMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useUpdateTimeline");
var deleteTimeline = /* @__PURE__ */ __name((timelineId, options) => {
  return customInstance({
    url: `/api/v1/timelines/${timelineId}`,
    method: "DELETE"
  }, options);
}, "deleteTimeline");
var getDeleteTimelineMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "deleteTimeline"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { timelineId } = props ?? {};
    return deleteTimeline(timelineId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getDeleteTimelineMutationOptions");
var useDeleteTimeline = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getDeleteTimelineMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useDeleteTimeline");
var removeTimelines = /* @__PURE__ */ __name((removeTimelinesBody, options) => {
  return customInstance({
    url: `/api/v1/timelines/removedAt`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: removeTimelinesBody
  }, options);
}, "removeTimelines");
var getRemoveTimelinesMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeTimelines"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return removeTimelines(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveTimelinesMutationOptions");
var useRemoveTimelines = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveTimelinesMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveTimelines");
var removeTimeline = /* @__PURE__ */ __name((timelineId, options) => {
  return customInstance({
    url: `/api/v1/timelines/${timelineId}/removedAt`,
    method: "PATCH"
  }, options);
}, "removeTimeline");
var getRemoveTimelineMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeTimeline"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { timelineId } = props ?? {};
    return removeTimeline(timelineId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveTimelineMutationOptions");
var useRemoveTimeline = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveTimelineMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveTimeline");
var createSession = /* @__PURE__ */ __name((_function, options, signal) => {
  return customInstance({
    url: `/api/v1/sessions`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: _function,
    signal
  }, options);
}, "createSession");
var getCreateSessionMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "createSession"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return createSession(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getCreateSessionMutationOptions");
var useCreateSession = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getCreateSessionMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useCreateSession");
var getSessionsByQuery = /* @__PURE__ */ __name((options, signal) => {
  return customInstance({
    url: `/api/v1/sessions`,
    method: "GET",
    signal
  }, options);
}, "getSessionsByQuery");
var getGetSessionsByQueryQueryKey = /* @__PURE__ */ __name(() => {
  return [
    `/api/v1/sessions`
  ];
}, "getGetSessionsByQueryQueryKey");
var getGetSessionsByQueryQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSessionsByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSessionsByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetSessionsByQueryQueryOptions");
function useGetSessionsByQuery(options, queryClient) {
  const queryOptions = getGetSessionsByQueryQueryOptions(options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSessionsByQuery, "useGetSessionsByQuery");
var getGetSessionsByQuerySuspenseQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSessionsByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSessionsByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetSessionsByQuerySuspenseQueryOptions");
function useGetSessionsByQuerySuspense(options, queryClient) {
  const queryOptions = getGetSessionsByQuerySuspenseQueryOptions(options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSessionsByQuerySuspense, "useGetSessionsByQuerySuspense");
var getGetSessionsByQuerySuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSessionsByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSessionsByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetSessionsByQuerySuspenseInfiniteQueryOptions");
function useGetSessionsByQuerySuspenseInfinite(options, queryClient) {
  const queryOptions = getGetSessionsByQuerySuspenseInfiniteQueryOptions(options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSessionsByQuerySuspenseInfinite, "useGetSessionsByQuerySuspenseInfinite");
var getSession = /* @__PURE__ */ __name((sessionId, options, signal) => {
  return customInstance({
    url: `/api/v1/sessions/${sessionId}`,
    method: "GET",
    signal
  }, options);
}, "getSession");
var getGetSessionQueryKey = /* @__PURE__ */ __name((sessionId) => {
  return [
    `/api/v1/sessions/${sessionId}`
  ];
}, "getGetSessionQueryKey");
var getGetSessionQueryOptions = /* @__PURE__ */ __name((sessionId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSessionQueryKey(sessionId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSession(sessionId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    enabled: !!sessionId,
    ...queryOptions
  };
}, "getGetSessionQueryOptions");
function useGetSession(sessionId, options, queryClient) {
  const queryOptions = getGetSessionQueryOptions(sessionId, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSession, "useGetSession");
var getGetSessionSuspenseQueryOptions = /* @__PURE__ */ __name((sessionId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSessionQueryKey(sessionId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSession(sessionId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetSessionSuspenseQueryOptions");
function useGetSessionSuspense(sessionId, options, queryClient) {
  const queryOptions = getGetSessionSuspenseQueryOptions(sessionId, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSessionSuspense, "useGetSessionSuspense");
var getGetSessionSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((sessionId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSessionQueryKey(sessionId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getSession(sessionId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetSessionSuspenseInfiniteQueryOptions");
function useGetSessionSuspenseInfinite(sessionId, options, queryClient) {
  const queryOptions = getGetSessionSuspenseInfiniteQueryOptions(sessionId, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetSessionSuspenseInfinite, "useGetSessionSuspenseInfinite");
var updateSession = /* @__PURE__ */ __name((sessionId, _function, options) => {
  return customInstance({
    url: `/api/v1/sessions/${sessionId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: _function
  }, options);
}, "updateSession");
var getUpdateSessionMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "updateSession"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { sessionId, data } = props ?? {};
    return updateSession(sessionId, data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getUpdateSessionMutationOptions");
var useUpdateSession = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getUpdateSessionMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useUpdateSession");
var deleteSession = /* @__PURE__ */ __name((sessionId, options) => {
  return customInstance({
    url: `/api/v1/sessions/${sessionId}`,
    method: "DELETE"
  }, options);
}, "deleteSession");
var getDeleteSessionMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "deleteSession"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { sessionId } = props ?? {};
    return deleteSession(sessionId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getDeleteSessionMutationOptions");
var useDeleteSession = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getDeleteSessionMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useDeleteSession");
var removeSessions = /* @__PURE__ */ __name((removeSessionsBody, options) => {
  return customInstance({
    url: `/api/v1/sessions/removedAt`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: removeSessionsBody
  }, options);
}, "removeSessions");
var getRemoveSessionsMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeSessions"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return removeSessions(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveSessionsMutationOptions");
var useRemoveSessions = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveSessionsMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveSessions");
var removeSession = /* @__PURE__ */ __name((sessionId, options) => {
  return customInstance({
    url: `/api/v1/sessions/${sessionId}/removedAt`,
    method: "PATCH"
  }, options);
}, "removeSession");
var getRemoveSessionMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeSession"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { sessionId } = props ?? {};
    return removeSession(sessionId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveSessionMutationOptions");
var useRemoveSession = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveSessionMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveSession");
var createProgram = /* @__PURE__ */ __name((_function, options, signal) => {
  return customInstance({
    url: `/api/v1/programs`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: _function,
    signal
  }, options);
}, "createProgram");
var getCreateProgramMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "createProgram"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return createProgram(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getCreateProgramMutationOptions");
var useCreateProgram = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getCreateProgramMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useCreateProgram");
var getProgramsByQuery = /* @__PURE__ */ __name((options, signal) => {
  return customInstance({
    url: `/api/v1/programs`,
    method: "GET",
    signal
  }, options);
}, "getProgramsByQuery");
var getGetProgramsByQueryQueryKey = /* @__PURE__ */ __name(() => {
  return [
    `/api/v1/programs`
  ];
}, "getGetProgramsByQueryQueryKey");
var getGetProgramsByQueryQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetProgramsByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getProgramsByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetProgramsByQueryQueryOptions");
function useGetProgramsByQuery(options, queryClient) {
  const queryOptions = getGetProgramsByQueryQueryOptions(options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetProgramsByQuery, "useGetProgramsByQuery");
var getGetProgramsByQuerySuspenseQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetProgramsByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getProgramsByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetProgramsByQuerySuspenseQueryOptions");
function useGetProgramsByQuerySuspense(options, queryClient) {
  const queryOptions = getGetProgramsByQuerySuspenseQueryOptions(options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetProgramsByQuerySuspense, "useGetProgramsByQuerySuspense");
var getGetProgramsByQuerySuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetProgramsByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getProgramsByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetProgramsByQuerySuspenseInfiniteQueryOptions");
function useGetProgramsByQuerySuspenseInfinite(options, queryClient) {
  const queryOptions = getGetProgramsByQuerySuspenseInfiniteQueryOptions(options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetProgramsByQuerySuspenseInfinite, "useGetProgramsByQuerySuspenseInfinite");
var getProgramById = /* @__PURE__ */ __name((programId, options, signal) => {
  return customInstance({
    url: `/api/v1/programs/${programId}`,
    method: "GET",
    signal
  }, options);
}, "getProgramById");
var getGetProgramByIdQueryKey = /* @__PURE__ */ __name((programId) => {
  return [
    `/api/v1/programs/${programId}`
  ];
}, "getGetProgramByIdQueryKey");
var getGetProgramByIdQueryOptions = /* @__PURE__ */ __name((programId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetProgramByIdQueryKey(programId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getProgramById(programId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    enabled: !!programId,
    ...queryOptions
  };
}, "getGetProgramByIdQueryOptions");
function useGetProgramById(programId, options, queryClient) {
  const queryOptions = getGetProgramByIdQueryOptions(programId, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetProgramById, "useGetProgramById");
var getGetProgramByIdSuspenseQueryOptions = /* @__PURE__ */ __name((programId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetProgramByIdQueryKey(programId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getProgramById(programId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetProgramByIdSuspenseQueryOptions");
function useGetProgramByIdSuspense(programId, options, queryClient) {
  const queryOptions = getGetProgramByIdSuspenseQueryOptions(programId, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetProgramByIdSuspense, "useGetProgramByIdSuspense");
var getGetProgramByIdSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((programId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetProgramByIdQueryKey(programId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getProgramById(programId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetProgramByIdSuspenseInfiniteQueryOptions");
function useGetProgramByIdSuspenseInfinite(programId, options, queryClient) {
  const queryOptions = getGetProgramByIdSuspenseInfiniteQueryOptions(programId, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetProgramByIdSuspenseInfinite, "useGetProgramByIdSuspenseInfinite");
var updateProgramById = /* @__PURE__ */ __name((programId, _function, options) => {
  return customInstance({
    url: `/api/v1/programs/${programId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: _function
  }, options);
}, "updateProgramById");
var getUpdateProgramByIdMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "updateProgramById"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { programId, data } = props ?? {};
    return updateProgramById(programId, data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getUpdateProgramByIdMutationOptions");
var useUpdateProgramById = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getUpdateProgramByIdMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useUpdateProgramById");
var deleteProgramById = /* @__PURE__ */ __name((programId, options) => {
  return customInstance({
    url: `/api/v1/programs/${programId}`,
    method: "DELETE"
  }, options);
}, "deleteProgramById");
var getDeleteProgramByIdMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "deleteProgramById"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { programId } = props ?? {};
    return deleteProgramById(programId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getDeleteProgramByIdMutationOptions");
var useDeleteProgramById = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getDeleteProgramByIdMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useDeleteProgramById");
var removeProgramById = /* @__PURE__ */ __name((programId, options) => {
  return customInstance({
    url: `/api/v1/programs/${programId}/removedAt`,
    method: "PATCH"
  }, options);
}, "removeProgramById");
var getRemoveProgramByIdMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeProgramById"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { programId } = props ?? {};
    return removeProgramById(programId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveProgramByIdMutationOptions");
var useRemoveProgramById = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveProgramByIdMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveProgramById");
var createRoutine = /* @__PURE__ */ __name((_function, options, signal) => {
  return customInstance({
    url: `/api/v1/routines`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: _function,
    signal
  }, options);
}, "createRoutine");
var getCreateRoutineMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "createRoutine"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return createRoutine(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getCreateRoutineMutationOptions");
var useCreateRoutine = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getCreateRoutineMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useCreateRoutine");
var getRoutinesByQuery = /* @__PURE__ */ __name((options, signal) => {
  return customInstance({
    url: `/api/v1/routines`,
    method: "GET",
    signal
  }, options);
}, "getRoutinesByQuery");
var getGetRoutinesByQueryQueryKey = /* @__PURE__ */ __name(() => {
  return [
    `/api/v1/routines`
  ];
}, "getGetRoutinesByQueryQueryKey");
var getGetRoutinesByQueryQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRoutinesByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRoutinesByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetRoutinesByQueryQueryOptions");
function useGetRoutinesByQuery(options, queryClient) {
  const queryOptions = getGetRoutinesByQueryQueryOptions(options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRoutinesByQuery, "useGetRoutinesByQuery");
var getGetRoutinesByQuerySuspenseQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRoutinesByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRoutinesByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetRoutinesByQuerySuspenseQueryOptions");
function useGetRoutinesByQuerySuspense(options, queryClient) {
  const queryOptions = getGetRoutinesByQuerySuspenseQueryOptions(options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRoutinesByQuerySuspense, "useGetRoutinesByQuerySuspense");
var getGetRoutinesByQuerySuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRoutinesByQueryQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRoutinesByQuery(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetRoutinesByQuerySuspenseInfiniteQueryOptions");
function useGetRoutinesByQuerySuspenseInfinite(options, queryClient) {
  const queryOptions = getGetRoutinesByQuerySuspenseInfiniteQueryOptions(options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRoutinesByQuerySuspenseInfinite, "useGetRoutinesByQuerySuspenseInfinite");
var getRoutine = /* @__PURE__ */ __name((routineId, options, signal) => {
  return customInstance({
    url: `/api/v1/routines/${routineId}`,
    method: "GET",
    signal
  }, options);
}, "getRoutine");
var getGetRoutineQueryKey = /* @__PURE__ */ __name((routineId) => {
  return [
    `/api/v1/routines/${routineId}`
  ];
}, "getGetRoutineQueryKey");
var getGetRoutineQueryOptions = /* @__PURE__ */ __name((routineId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRoutineQueryKey(routineId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRoutine(routineId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    enabled: !!routineId,
    ...queryOptions
  };
}, "getGetRoutineQueryOptions");
function useGetRoutine(routineId, options, queryClient) {
  const queryOptions = getGetRoutineQueryOptions(routineId, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRoutine, "useGetRoutine");
var getGetRoutineSuspenseQueryOptions = /* @__PURE__ */ __name((routineId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRoutineQueryKey(routineId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRoutine(routineId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetRoutineSuspenseQueryOptions");
function useGetRoutineSuspense(routineId, options, queryClient) {
  const queryOptions = getGetRoutineSuspenseQueryOptions(routineId, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRoutineSuspense, "useGetRoutineSuspense");
var getGetRoutineSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((routineId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetRoutineQueryKey(routineId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getRoutine(routineId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetRoutineSuspenseInfiniteQueryOptions");
function useGetRoutineSuspenseInfinite(routineId, options, queryClient) {
  const queryOptions = getGetRoutineSuspenseInfiniteQueryOptions(routineId, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetRoutineSuspenseInfinite, "useGetRoutineSuspenseInfinite");
var updateRoutine = /* @__PURE__ */ __name((routineId, _function, options) => {
  return customInstance({
    url: `/api/v1/routines/${routineId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: _function
  }, options);
}, "updateRoutine");
var getUpdateRoutineMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "updateRoutine"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { routineId, data } = props ?? {};
    return updateRoutine(routineId, data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getUpdateRoutineMutationOptions");
var useUpdateRoutine = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getUpdateRoutineMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useUpdateRoutine");
var deleteRoutine = /* @__PURE__ */ __name((routineId, options) => {
  return customInstance({
    url: `/api/v1/routines/${routineId}`,
    method: "DELETE"
  }, options);
}, "deleteRoutine");
var getDeleteRoutineMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "deleteRoutine"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { routineId } = props ?? {};
    return deleteRoutine(routineId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getDeleteRoutineMutationOptions");
var useDeleteRoutine = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getDeleteRoutineMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useDeleteRoutine");
var removeRoutine = /* @__PURE__ */ __name((routineId, options) => {
  return customInstance({
    url: `/api/v1/routines/${routineId}/removedAt`,
    method: "PATCH"
  }, options);
}, "removeRoutine");
var getRemoveRoutineMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeRoutine"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { routineId } = props ?? {};
    return removeRoutine(routineId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveRoutineMutationOptions");
var useRemoveRoutine = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveRoutineMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveRoutine");
var getExercisesByQuery = /* @__PURE__ */ __name((params, options, signal) => {
  return customInstance({
    url: `/api/v1/exercises`,
    method: "GET",
    params,
    signal
  }, options);
}, "getExercisesByQuery");
var getGetExercisesByQueryQueryKey = /* @__PURE__ */ __name((params) => {
  return [
    `/api/v1/exercises`,
    ...params ? [
      params
    ] : []
  ];
}, "getGetExercisesByQueryQueryKey");
var getGetExercisesByQueryQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetExercisesByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getExercisesByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetExercisesByQueryQueryOptions");
function useGetExercisesByQuery(params, options, queryClient) {
  const queryOptions = getGetExercisesByQueryQueryOptions(params, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetExercisesByQuery, "useGetExercisesByQuery");
var getGetExercisesByQuerySuspenseQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetExercisesByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getExercisesByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetExercisesByQuerySuspenseQueryOptions");
function useGetExercisesByQuerySuspense(params, options, queryClient) {
  const queryOptions = getGetExercisesByQuerySuspenseQueryOptions(params, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetExercisesByQuerySuspense, "useGetExercisesByQuerySuspense");
var getGetExercisesByQuerySuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetExercisesByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getExercisesByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetExercisesByQuerySuspenseInfiniteQueryOptions");
function useGetExercisesByQuerySuspenseInfinite(params, options, queryClient) {
  const queryOptions = getGetExercisesByQuerySuspenseInfiniteQueryOptions(params, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetExercisesByQuerySuspenseInfinite, "useGetExercisesByQuerySuspenseInfinite");
var createExercise = /* @__PURE__ */ __name((createExerciseDto, options, signal) => {
  return customInstance({
    url: `/api/v1/exercises`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: createExerciseDto,
    signal
  }, options);
}, "createExercise");
var getCreateExerciseMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "createExercise"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return createExercise(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getCreateExerciseMutationOptions");
var useCreateExercise = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getCreateExerciseMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useCreateExercise");
var getExercise = /* @__PURE__ */ __name((exerciseId, options, signal) => {
  return customInstance({
    url: `/api/v1/exercises/${exerciseId}`,
    method: "GET",
    signal
  }, options);
}, "getExercise");
var getGetExerciseQueryKey = /* @__PURE__ */ __name((exerciseId) => {
  return [
    `/api/v1/exercises/${exerciseId}`
  ];
}, "getGetExerciseQueryKey");
var getGetExerciseQueryOptions = /* @__PURE__ */ __name((exerciseId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetExerciseQueryKey(exerciseId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getExercise(exerciseId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    enabled: !!exerciseId,
    ...queryOptions
  };
}, "getGetExerciseQueryOptions");
function useGetExercise(exerciseId, options, queryClient) {
  const queryOptions = getGetExerciseQueryOptions(exerciseId, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetExercise, "useGetExercise");
var getGetExerciseSuspenseQueryOptions = /* @__PURE__ */ __name((exerciseId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetExerciseQueryKey(exerciseId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getExercise(exerciseId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetExerciseSuspenseQueryOptions");
function useGetExerciseSuspense(exerciseId, options, queryClient) {
  const queryOptions = getGetExerciseSuspenseQueryOptions(exerciseId, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetExerciseSuspense, "useGetExerciseSuspense");
var getGetExerciseSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((exerciseId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetExerciseQueryKey(exerciseId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getExercise(exerciseId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetExerciseSuspenseInfiniteQueryOptions");
function useGetExerciseSuspenseInfinite(exerciseId, options, queryClient) {
  const queryOptions = getGetExerciseSuspenseInfiniteQueryOptions(exerciseId, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetExerciseSuspenseInfinite, "useGetExerciseSuspenseInfinite");
var updateExercise = /* @__PURE__ */ __name((exerciseId, updateExerciseDto, options) => {
  return customInstance({
    url: `/api/v1/exercises/${exerciseId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: updateExerciseDto
  }, options);
}, "updateExercise");
var getUpdateExerciseMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "updateExercise"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { exerciseId, data } = props ?? {};
    return updateExercise(exerciseId, data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getUpdateExerciseMutationOptions");
var useUpdateExercise = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getUpdateExerciseMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useUpdateExercise");
var deleteExercise = /* @__PURE__ */ __name((exerciseId, options) => {
  return customInstance({
    url: `/api/v1/exercises/${exerciseId}`,
    method: "DELETE"
  }, options);
}, "deleteExercise");
var getDeleteExerciseMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "deleteExercise"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { exerciseId } = props ?? {};
    return deleteExercise(exerciseId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getDeleteExerciseMutationOptions");
var useDeleteExercise = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getDeleteExerciseMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useDeleteExercise");
var removeExercise = /* @__PURE__ */ __name((exerciseId, options) => {
  return customInstance({
    url: `/api/v1/exercises/${exerciseId}/removedAt`,
    method: "PATCH"
  }, options);
}, "removeExercise");
var getRemoveExerciseMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeExercise"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { exerciseId } = props ?? {};
    return removeExercise(exerciseId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveExerciseMutationOptions");
var useRemoveExercise = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveExerciseMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveExercise");
var getFileById = /* @__PURE__ */ __name((fileId, options, signal) => {
  return customInstance({
    url: `/api/v1/files/${fileId}`,
    method: "GET",
    signal
  }, options);
}, "getFileById");
var getGetFileByIdQueryKey = /* @__PURE__ */ __name((fileId) => {
  return [
    `/api/v1/files/${fileId}`
  ];
}, "getGetFileByIdQueryKey");
var getGetFileByIdQueryOptions = /* @__PURE__ */ __name((fileId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetFileByIdQueryKey(fileId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getFileById(fileId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    enabled: !!fileId,
    ...queryOptions
  };
}, "getGetFileByIdQueryOptions");
function useGetFileById(fileId, options, queryClient) {
  const queryOptions = getGetFileByIdQueryOptions(fileId, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetFileById, "useGetFileById");
var getGetFileByIdSuspenseQueryOptions = /* @__PURE__ */ __name((fileId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetFileByIdQueryKey(fileId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getFileById(fileId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetFileByIdSuspenseQueryOptions");
function useGetFileByIdSuspense(fileId, options, queryClient) {
  const queryOptions = getGetFileByIdSuspenseQueryOptions(fileId, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetFileByIdSuspense, "useGetFileByIdSuspense");
var getGetFileByIdSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((fileId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetFileByIdQueryKey(fileId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getFileById(fileId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetFileByIdSuspenseInfiniteQueryOptions");
function useGetFileByIdSuspenseInfinite(fileId, options, queryClient) {
  const queryOptions = getGetFileByIdSuspenseInfiniteQueryOptions(fileId, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetFileByIdSuspenseInfinite, "useGetFileByIdSuspenseInfinite");
var updateFileById = /* @__PURE__ */ __name((fileId, updateFileByIdBody, options) => {
  const formData = new FormData();
  if (updateFileByIdBody?.files !== void 0) {
    formData.append("files", updateFileByIdBody.files);
  }
  return customInstance({
    url: `/api/v1/files/${fileId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: formData
  }, options);
}, "updateFileById");
var getUpdateFileByIdMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "updateFileById"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { fileId, data } = props ?? {};
    return updateFileById(fileId, data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getUpdateFileByIdMutationOptions");
var useUpdateFileById = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getUpdateFileByIdMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useUpdateFileById");
var createFile = /* @__PURE__ */ __name((createFileDto, options, signal) => {
  return customInstance({
    url: `/api/v1/files`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: createFileDto,
    signal
  }, options);
}, "createFile");
var getCreateFileMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "createFile"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return createFile(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getCreateFileMutationOptions");
var useCreateFile = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getCreateFileMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useCreateFile");
var removeFileById = /* @__PURE__ */ __name((fileId, options) => {
  return customInstance({
    url: `/api/v1/files/${fileId}/removedAt`,
    method: "PATCH"
  }, options);
}, "removeFileById");
var getRemoveFileByIdMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeFileById"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { fileId } = props ?? {};
    return removeFileById(fileId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveFileByIdMutationOptions");
var useRemoveFileById = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveFileByIdMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveFileById");
var getMyTenants = /* @__PURE__ */ __name((options, signal) => {
  return customInstance({
    url: `/api/v1/tenants/my`,
    method: "GET",
    signal
  }, options);
}, "getMyTenants");
var getGetMyTenantsQueryKey = /* @__PURE__ */ __name(() => {
  return [
    `/api/v1/tenants/my`
  ];
}, "getGetMyTenantsQueryKey");
var getGetMyTenantsQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetMyTenantsQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getMyTenants(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetMyTenantsQueryOptions");
function useGetMyTenants(options, queryClient) {
  const queryOptions = getGetMyTenantsQueryOptions(options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetMyTenants, "useGetMyTenants");
var getGetMyTenantsSuspenseQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetMyTenantsQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getMyTenants(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetMyTenantsSuspenseQueryOptions");
function useGetMyTenantsSuspense(options, queryClient) {
  const queryOptions = getGetMyTenantsSuspenseQueryOptions(options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetMyTenantsSuspense, "useGetMyTenantsSuspense");
var getGetMyTenantsSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetMyTenantsQueryKey();
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getMyTenants(requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetMyTenantsSuspenseInfiniteQueryOptions");
function useGetMyTenantsSuspenseInfinite(options, queryClient) {
  const queryOptions = getGetMyTenantsSuspenseInfiniteQueryOptions(options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetMyTenantsSuspenseInfinite, "useGetMyTenantsSuspenseInfinite");
var createTenant = /* @__PURE__ */ __name((createTenantDto, options, signal) => {
  return customInstance({
    url: `/api/v1/tenants`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: createTenantDto,
    signal
  }, options);
}, "createTenant");
var getCreateTenantMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "createTenant"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { data } = props ?? {};
    return createTenant(data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getCreateTenantMutationOptions");
var useCreateTenant = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getCreateTenantMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useCreateTenant");
var getTenantsByQuery = /* @__PURE__ */ __name((params, options, signal) => {
  return customInstance({
    url: `/api/v1/tenants`,
    method: "GET",
    params,
    signal
  }, options);
}, "getTenantsByQuery");
var getGetTenantsByQueryQueryKey = /* @__PURE__ */ __name((params) => {
  return [
    `/api/v1/tenants`,
    ...params ? [
      params
    ] : []
  ];
}, "getGetTenantsByQueryQueryKey");
var getGetTenantsByQueryQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetTenantsByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getTenantsByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetTenantsByQueryQueryOptions");
function useGetTenantsByQuery(params, options, queryClient) {
  const queryOptions = getGetTenantsByQueryQueryOptions(params, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetTenantsByQuery, "useGetTenantsByQuery");
var getGetTenantsByQuerySuspenseQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetTenantsByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getTenantsByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetTenantsByQuerySuspenseQueryOptions");
function useGetTenantsByQuerySuspense(params, options, queryClient) {
  const queryOptions = getGetTenantsByQuerySuspenseQueryOptions(params, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetTenantsByQuerySuspense, "useGetTenantsByQuerySuspense");
var getGetTenantsByQuerySuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetTenantsByQueryQueryKey(params);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getTenantsByQuery(params, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetTenantsByQuerySuspenseInfiniteQueryOptions");
function useGetTenantsByQuerySuspenseInfinite(params, options, queryClient) {
  const queryOptions = getGetTenantsByQuerySuspenseInfiniteQueryOptions(params, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetTenantsByQuerySuspenseInfinite, "useGetTenantsByQuerySuspenseInfinite");
var getTenantById = /* @__PURE__ */ __name((tenantId, options, signal) => {
  return customInstance({
    url: `/api/v1/tenants/${tenantId}`,
    method: "GET",
    signal
  }, options);
}, "getTenantById");
var getGetTenantByIdQueryKey = /* @__PURE__ */ __name((tenantId) => {
  return [
    `/api/v1/tenants/${tenantId}`
  ];
}, "getGetTenantByIdQueryKey");
var getGetTenantByIdQueryOptions = /* @__PURE__ */ __name((tenantId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetTenantByIdQueryKey(tenantId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getTenantById(tenantId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    enabled: !!tenantId,
    ...queryOptions
  };
}, "getGetTenantByIdQueryOptions");
function useGetTenantById(tenantId, options, queryClient) {
  const queryOptions = getGetTenantByIdQueryOptions(tenantId, options);
  const query = useQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetTenantById, "useGetTenantById");
var getGetTenantByIdSuspenseQueryOptions = /* @__PURE__ */ __name((tenantId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetTenantByIdQueryKey(tenantId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getTenantById(tenantId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetTenantByIdSuspenseQueryOptions");
function useGetTenantByIdSuspense(tenantId, options, queryClient) {
  const queryOptions = getGetTenantByIdSuspenseQueryOptions(tenantId, options);
  const query = useSuspenseQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetTenantByIdSuspense, "useGetTenantByIdSuspense");
var getGetTenantByIdSuspenseInfiniteQueryOptions = /* @__PURE__ */ __name((tenantId, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetTenantByIdQueryKey(tenantId);
  const queryFn = /* @__PURE__ */ __name(({ signal }) => getTenantById(tenantId, requestOptions, signal), "queryFn");
  return {
    queryKey,
    queryFn,
    ...queryOptions
  };
}, "getGetTenantByIdSuspenseInfiniteQueryOptions");
function useGetTenantByIdSuspenseInfinite(tenantId, options, queryClient) {
  const queryOptions = getGetTenantByIdSuspenseInfiniteQueryOptions(tenantId, options);
  const query = useSuspenseInfiniteQuery(queryOptions, queryClient);
  query.queryKey = queryOptions.queryKey;
  return query;
}
__name(useGetTenantByIdSuspenseInfinite, "useGetTenantByIdSuspenseInfinite");
var updateTenantById = /* @__PURE__ */ __name((tenantId, updateTenantDto, options) => {
  return customInstance({
    url: `/api/v1/tenants/${tenantId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    data: updateTenantDto
  }, options);
}, "updateTenantById");
var getUpdateTenantByIdMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "updateTenantById"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { tenantId, data } = props ?? {};
    return updateTenantById(tenantId, data, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getUpdateTenantByIdMutationOptions");
var useUpdateTenantById = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getUpdateTenantByIdMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useUpdateTenantById");
var deleteTenant = /* @__PURE__ */ __name((tenantId, options) => {
  return customInstance({
    url: `/api/v1/tenants/${tenantId}`,
    method: "DELETE"
  }, options);
}, "deleteTenant");
var getDeleteTenantMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "deleteTenant"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { tenantId } = props ?? {};
    return deleteTenant(tenantId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getDeleteTenantMutationOptions");
var useDeleteTenant = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getDeleteTenantMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useDeleteTenant");
var removeTenantById = /* @__PURE__ */ __name((tenantId, options) => {
  return customInstance({
    url: `/api/v1/tenants/${tenantId}/removedAt`,
    method: "PATCH"
  }, options);
}, "removeTenantById");
var getRemoveTenantByIdMutationOptions = /* @__PURE__ */ __name((options) => {
  const mutationKey = [
    "removeTenantById"
  ];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : {
    ...options,
    mutation: {
      ...options.mutation,
      mutationKey
    }
  } : {
    mutation: {
      mutationKey
    },
    request: void 0
  };
  const mutationFn = /* @__PURE__ */ __name((props) => {
    const { tenantId } = props ?? {};
    return removeTenantById(tenantId, requestOptions);
  }, "mutationFn");
  return {
    mutationFn,
    ...mutationOptions
  };
}, "getRemoveTenantByIdMutationOptions");
var useRemoveTenantById = /* @__PURE__ */ __name((options, queryClient) => {
  const mutationOptions = getRemoveTenantByIdMutationOptions(options);
  return useMutation(mutationOptions, queryClient);
}, "useRemoveTenantById");

export { apis_exports as APIManager, AXIOS_INSTANCE, createCategory, createExercise, createFile, createGround, createGroup, createProgram, createRole, createRoleClassification, createRoutine, createSession, createSpace, createSubject, createTenant, createTimeline, createUser, customInstance, deleteCategoryById, deleteExercise, deleteGroundById, deleteGroup, deleteProgramById, deleteRole, deleteRoleClassificationById, deleteRoutine, deleteSession, deleteSpace, deleteSubject, deleteTenant, deleteTimeline, deleteUser, getAppBuilder, getCategoriesByQuery, getCategoryById, getCreateCategoryMutationOptions, getCreateExerciseMutationOptions, getCreateFileMutationOptions, getCreateGroundMutationOptions, getCreateGroupMutationOptions, getCreateProgramMutationOptions, getCreateRoleClassificationMutationOptions, getCreateRoleMutationOptions, getCreateRoutineMutationOptions, getCreateSessionMutationOptions, getCreateSpaceMutationOptions, getCreateSubjectMutationOptions, getCreateTenantMutationOptions, getCreateTimelineMutationOptions, getCreateUserMutationOptions, getCurrentSpace, getDeleteCategoryByIdMutationOptions, getDeleteExerciseMutationOptions, getDeleteGroundByIdMutationOptions, getDeleteGroupMutationOptions, getDeleteProgramByIdMutationOptions, getDeleteRoleClassificationByIdMutationOptions, getDeleteRoleMutationOptions, getDeleteRoutineMutationOptions, getDeleteSessionMutationOptions, getDeleteSpaceMutationOptions, getDeleteSubjectMutationOptions, getDeleteTenantMutationOptions, getDeleteTimelineMutationOptions, getDeleteUserMutationOptions, getExercise, getExercisesByQuery, getFileById, getGetAppBuilderQueryKey, getGetAppBuilderQueryOptions, getGetAppBuilderSuspenseInfiniteQueryOptions, getGetAppBuilderSuspenseQueryOptions, getGetCategoriesByQueryQueryKey, getGetCategoriesByQueryQueryOptions, getGetCategoriesByQuerySuspenseInfiniteQueryOptions, getGetCategoriesByQuerySuspenseQueryOptions, getGetCategoryByIdQueryKey, getGetCategoryByIdQueryOptions, getGetCategoryByIdSuspenseInfiniteQueryOptions, getGetCategoryByIdSuspenseQueryOptions, getGetCurrentSpaceQueryKey, getGetCurrentSpaceQueryOptions, getGetCurrentSpaceSuspenseInfiniteQueryOptions, getGetCurrentSpaceSuspenseQueryOptions, getGetExerciseQueryKey, getGetExerciseQueryOptions, getGetExerciseSuspenseInfiniteQueryOptions, getGetExerciseSuspenseQueryOptions, getGetExercisesByQueryQueryKey, getGetExercisesByQueryQueryOptions, getGetExercisesByQuerySuspenseInfiniteQueryOptions, getGetExercisesByQuerySuspenseQueryOptions, getGetFileByIdQueryKey, getGetFileByIdQueryOptions, getGetFileByIdSuspenseInfiniteQueryOptions, getGetFileByIdSuspenseQueryOptions, getGetGroundByIdQueryKey, getGetGroundByIdQueryOptions, getGetGroundByIdSuspenseInfiniteQueryOptions, getGetGroundByIdSuspenseQueryOptions, getGetGroundsByQueryQueryKey, getGetGroundsByQueryQueryOptions, getGetGroundsByQuerySuspenseInfiniteQueryOptions, getGetGroundsByQuerySuspenseQueryOptions, getGetGroupByIdQueryKey, getGetGroupByIdQueryOptions, getGetGroupByIdSuspenseInfiniteQueryOptions, getGetGroupByIdSuspenseQueryOptions, getGetGroupsByQueryQueryKey, getGetGroupsByQueryQueryOptions, getGetGroupsByQuerySuspenseInfiniteQueryOptions, getGetGroupsByQuerySuspenseQueryOptions, getGetMyTenantsQueryKey, getGetMyTenantsQueryOptions, getGetMyTenantsSuspenseInfiniteQueryOptions, getGetMyTenantsSuspenseQueryOptions, getGetNewTokenQueryKey, getGetNewTokenQueryOptions, getGetNewTokenSuspenseInfiniteQueryOptions, getGetNewTokenSuspenseQueryOptions, getGetProgramByIdQueryKey, getGetProgramByIdQueryOptions, getGetProgramByIdSuspenseInfiniteQueryOptions, getGetProgramByIdSuspenseQueryOptions, getGetProgramsByQueryQueryKey, getGetProgramsByQueryQueryOptions, getGetProgramsByQuerySuspenseInfiniteQueryOptions, getGetProgramsByQuerySuspenseQueryOptions, getGetRoleClassificationByIdQueryKey, getGetRoleClassificationByIdQueryOptions, getGetRoleClassificationByIdSuspenseInfiniteQueryOptions, getGetRoleClassificationByIdSuspenseQueryOptions, getGetRoleClassificationsByQueryQueryKey, getGetRoleClassificationsByQueryQueryOptions, getGetRoleClassificationsByQuerySuspenseInfiniteQueryOptions, getGetRoleClassificationsByQuerySuspenseQueryOptions, getGetRoleQueryKey, getGetRoleQueryOptions, getGetRoleSuspenseInfiniteQueryOptions, getGetRoleSuspenseQueryOptions, getGetRolesByQueryQueryKey, getGetRolesByQueryQueryOptions, getGetRolesByQuerySuspenseInfiniteQueryOptions, getGetRolesByQuerySuspenseQueryOptions, getGetRoutineQueryKey, getGetRoutineQueryOptions, getGetRoutineSuspenseInfiniteQueryOptions, getGetRoutineSuspenseQueryOptions, getGetRoutinesByQueryQueryKey, getGetRoutinesByQueryQueryOptions, getGetRoutinesByQuerySuspenseInfiniteQueryOptions, getGetRoutinesByQuerySuspenseQueryOptions, getGetSessionQueryKey, getGetSessionQueryOptions, getGetSessionSuspenseInfiniteQueryOptions, getGetSessionSuspenseQueryOptions, getGetSessionsByQueryQueryKey, getGetSessionsByQueryQueryOptions, getGetSessionsByQuerySuspenseInfiniteQueryOptions, getGetSessionsByQuerySuspenseQueryOptions, getGetSpaceQueryKey, getGetSpaceQueryOptions, getGetSpaceSuspenseInfiniteQueryOptions, getGetSpaceSuspenseQueryOptions, getGetSpacesByQueryQueryKey, getGetSpacesByQueryQueryOptions, getGetSpacesByQuerySuspenseInfiniteQueryOptions, getGetSpacesByQuerySuspenseQueryOptions, getGetSubjectQueryKey, getGetSubjectQueryOptions, getGetSubjectSuspenseInfiniteQueryOptions, getGetSubjectSuspenseQueryOptions, getGetSubjectsByQueryQueryKey, getGetSubjectsByQueryQueryOptions, getGetSubjectsByQuerySuspenseInfiniteQueryOptions, getGetSubjectsByQuerySuspenseQueryOptions, getGetTenantByIdQueryKey, getGetTenantByIdQueryOptions, getGetTenantByIdSuspenseInfiniteQueryOptions, getGetTenantByIdSuspenseQueryOptions, getGetTenantsByQueryQueryKey, getGetTenantsByQueryQueryOptions, getGetTenantsByQuerySuspenseInfiniteQueryOptions, getGetTenantsByQuerySuspenseQueryOptions, getGetTimelineQueryKey, getGetTimelineQueryOptions, getGetTimelineSuspenseInfiniteQueryOptions, getGetTimelineSuspenseQueryOptions, getGetTimelinesByQueryQueryKey, getGetTimelinesByQueryQueryOptions, getGetTimelinesByQuerySuspenseInfiniteQueryOptions, getGetTimelinesByQuerySuspenseQueryOptions, getGetUserQueryKey, getGetUserQueryOptions, getGetUserSuspenseInfiniteQueryOptions, getGetUserSuspenseQueryOptions, getGetUsersByQueryQueryKey, getGetUsersByQueryQueryOptions, getGetUsersByQuerySuspenseInfiniteQueryOptions, getGetUsersByQuerySuspenseQueryOptions, getGroundById, getGroundsByQuery, getGroupById, getGroupsByQuery, getLoginMutationOptions, getLogoutMutationOptions, getMyTenants, getNewToken, getProgramById, getProgramsByQuery, getRefreshTokenMutationOptions, getRemoveExerciseMutationOptions, getRemoveFileByIdMutationOptions, getRemoveGroundByIdMutationOptions, getRemoveGroupsMutationOptions, getRemoveProgramByIdMutationOptions, getRemoveRoleClassificationByIdMutationOptions, getRemoveRoleMutationOptions, getRemoveRoutineMutationOptions, getRemoveSessionMutationOptions, getRemoveSessionsMutationOptions, getRemoveSpaceMutationOptions, getRemoveSubjectMutationOptions, getRemoveSubjectsMutationOptions, getRemoveTenantByIdMutationOptions, getRemoveTimelineMutationOptions, getRemoveTimelinesMutationOptions, getRemoveUserMutationOptions, getRemoveUsersMutationOptions, getRole, getRoleClassificationById, getRoleClassificationsByQuery, getRolesByQuery, getRoutine, getRoutinesByQuery, getSession, getSessionsByQuery, getSignUpUserMutationOptions, getSpace, getSpacesByQuery, getSubject, getSubjectsByQuery, getTenantById, getTenantsByQuery, getTimeline, getTimelinesByQuery, getUpdateCategoryByIdMutationOptions, getUpdateExerciseMutationOptions, getUpdateFileByIdMutationOptions, getUpdateGroundByIdMutationOptions, getUpdateGroupByIdMutationOptions, getUpdateProgramByIdMutationOptions, getUpdateRoleClassificationByIdMutationOptions, getUpdateRoleMutationOptions, getUpdateRoutineMutationOptions, getUpdateSessionMutationOptions, getUpdateSpaceMutationOptions, getUpdateSubjectMutationOptions, getUpdateTenantByIdMutationOptions, getUpdateTimelineMutationOptions, getUpdateUserMutationOptions, getUser, getUsersByQuery, getVerifyTokenQueryKey, getVerifyTokenQueryOptions, getVerifyTokenSuspenseInfiniteQueryOptions, getVerifyTokenSuspenseQueryOptions, login, logout, refreshToken, removeExercise, removeFileById, removeGroundById, removeGroups, removeProgramById, removeRole, removeRoleClassificationById, removeRoutine, removeSession, removeSessions, removeSpace, removeSubject, removeSubjects, removeTenantById, removeTimeline, removeTimelines, removeUser, removeUsers, signUpUser, updateCategoryById, updateExercise, updateFileById, updateGroundById, updateGroupById, updateProgramById, updateRole, updateRoleClassificationById, updateRoutine, updateSession, updateSpace, updateSubject, updateTenantById, updateTimeline, updateUser, useCreateCategory, useCreateExercise, useCreateFile, useCreateGround, useCreateGroup, useCreateProgram, useCreateRole, useCreateRoleClassification, useCreateRoutine, useCreateSession, useCreateSpace, useCreateSubject, useCreateTenant, useCreateTimeline, useCreateUser, useDeleteCategoryById, useDeleteExercise, useDeleteGroundById, useDeleteGroup, useDeleteProgramById, useDeleteRole, useDeleteRoleClassificationById, useDeleteRoutine, useDeleteSession, useDeleteSpace, useDeleteSubject, useDeleteTenant, useDeleteTimeline, useDeleteUser, useGetAppBuilder, useGetAppBuilderSuspense, useGetAppBuilderSuspenseInfinite, useGetCategoriesByQuery, useGetCategoriesByQuerySuspense, useGetCategoriesByQuerySuspenseInfinite, useGetCategoryById, useGetCategoryByIdSuspense, useGetCategoryByIdSuspenseInfinite, useGetCurrentSpace, useGetCurrentSpaceSuspense, useGetCurrentSpaceSuspenseInfinite, useGetExercise, useGetExerciseSuspense, useGetExerciseSuspenseInfinite, useGetExercisesByQuery, useGetExercisesByQuerySuspense, useGetExercisesByQuerySuspenseInfinite, useGetFileById, useGetFileByIdSuspense, useGetFileByIdSuspenseInfinite, useGetGroundById, useGetGroundByIdSuspense, useGetGroundByIdSuspenseInfinite, useGetGroundsByQuery, useGetGroundsByQuerySuspense, useGetGroundsByQuerySuspenseInfinite, useGetGroupById, useGetGroupByIdSuspense, useGetGroupByIdSuspenseInfinite, useGetGroupsByQuery, useGetGroupsByQuerySuspense, useGetGroupsByQuerySuspenseInfinite, useGetMyTenants, useGetMyTenantsSuspense, useGetMyTenantsSuspenseInfinite, useGetNewToken, useGetNewTokenSuspense, useGetNewTokenSuspenseInfinite, useGetProgramById, useGetProgramByIdSuspense, useGetProgramByIdSuspenseInfinite, useGetProgramsByQuery, useGetProgramsByQuerySuspense, useGetProgramsByQuerySuspenseInfinite, useGetRole, useGetRoleClassificationById, useGetRoleClassificationByIdSuspense, useGetRoleClassificationByIdSuspenseInfinite, useGetRoleClassificationsByQuery, useGetRoleClassificationsByQuerySuspense, useGetRoleClassificationsByQuerySuspenseInfinite, useGetRoleSuspense, useGetRoleSuspenseInfinite, useGetRolesByQuery, useGetRolesByQuerySuspense, useGetRolesByQuerySuspenseInfinite, useGetRoutine, useGetRoutineSuspense, useGetRoutineSuspenseInfinite, useGetRoutinesByQuery, useGetRoutinesByQuerySuspense, useGetRoutinesByQuerySuspenseInfinite, useGetSession, useGetSessionSuspense, useGetSessionSuspenseInfinite, useGetSessionsByQuery, useGetSessionsByQuerySuspense, useGetSessionsByQuerySuspenseInfinite, useGetSpace, useGetSpaceSuspense, useGetSpaceSuspenseInfinite, useGetSpacesByQuery, useGetSpacesByQuerySuspense, useGetSpacesByQuerySuspenseInfinite, useGetSubject, useGetSubjectSuspense, useGetSubjectSuspenseInfinite, useGetSubjectsByQuery, useGetSubjectsByQuerySuspense, useGetSubjectsByQuerySuspenseInfinite, useGetTenantById, useGetTenantByIdSuspense, useGetTenantByIdSuspenseInfinite, useGetTenantsByQuery, useGetTenantsByQuerySuspense, useGetTenantsByQuerySuspenseInfinite, useGetTimeline, useGetTimelineSuspense, useGetTimelineSuspenseInfinite, useGetTimelinesByQuery, useGetTimelinesByQuerySuspense, useGetTimelinesByQuerySuspenseInfinite, useGetUser, useGetUserSuspense, useGetUserSuspenseInfinite, useGetUsersByQuery, useGetUsersByQuerySuspense, useGetUsersByQuerySuspenseInfinite, useLogin, useLogout, useRefreshToken, useRemoveExercise, useRemoveFileById, useRemoveGroundById, useRemoveGroups, useRemoveProgramById, useRemoveRole, useRemoveRoleClassificationById, useRemoveRoutine, useRemoveSession, useRemoveSessions, useRemoveSpace, useRemoveSubject, useRemoveSubjects, useRemoveTenantById, useRemoveTimeline, useRemoveTimelines, useRemoveUser, useRemoveUsers, useSignUpUser, useUpdateCategoryById, useUpdateExercise, useUpdateFileById, useUpdateGroundById, useUpdateGroupById, useUpdateProgramById, useUpdateRole, useUpdateRoleClassificationById, useUpdateRoutine, useUpdateSession, useUpdateSpace, useUpdateSubject, useUpdateTenantById, useUpdateTimeline, useUpdateUser, useVerifyToken, useVerifyTokenSuspense, useVerifyTokenSuspenseInfinite, verifyToken };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map