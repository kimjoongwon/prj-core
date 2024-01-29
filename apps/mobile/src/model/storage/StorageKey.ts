export type StorageKey =
  | 'language'
  | 'access_token'
  | 'refresh_token'
  | 'username'
  | 'password'
  | 'multi_factor'
  | 'MANDATORY_CONFIRM'
  | 'already_mobile_user'
  | 'fcmToken'
  | 'iosSetting'
  | 'checked_mobile_permission'
  | 'loggedInUsername'
  | 'loggedInPassword'
  | 'communityRecentSearchWords'
  | 'language'
  | 'recent_search'
  | 'version'
  | 'platform'
  // | 'i18nResources_Korean' -> 대외 사용하지 않음.
  // | 'i18nResources_English'
  // | 'i18nResources_Chinese'
  | 'i18nResourceTime'
  | 'email'
  | 'nara.jti'
  | '_mysuni_auth'
  | '_mysuni_pv_init'
  | '_mysuni_field'
  | 'prev_pv'
  | 'fcmUrl'
  | 'nara.token'
  | 'nara.email'
  | 'nara.refreshToken'
  | 'nara.workspaces'
  | 'nara.cineroomId'
  | 'nara.audienceId'
  | 'nara.pavilionId'
  | 'dashBoardSentenceIndex';

export const storageKeys = [
  'language',
  'access_token',
  'refresh_token',
  'username',
  'password',
  'multi_factor',
  'MANDATORY_CONFIRM',
  'already_mobile_user',
  'fcmToken',
  'iosSetting',
  'checked_mobile_permission',
  'loggedInUsername',
  'loggedInPassword',
  'communityRecentSearchWords',
  'language',
  'recent_search',
  'version',
  'platform',
  'i18nResources_Korean',
  'i18nResources_English',
  'i18nResources_Chinese',
  'i18nResourceTime',
  'email',
  'nara.jti',
  '_mysuni_auth',
  '_mysuni_pv_init',
  '_mysuni_field',
  'prev_pv',
  'fcmUrl',
  'nara.token',
  'nara.email',
  'nara.refreshToken',
  'nara.workspaces',
  'nara.cineroomId',
  'nara.audienceId',
  'nara.pavilionId',
  'dashBoardSentenceIndex',
];
