/**
 * 운영 기준 데이터를 한 곳에서 모으는 집계 진입점입니다.
 *
 * `syncReferenceData()`는 이 index를 통해 space/role/oidc/translation 정의를
 * 한 번에 읽어오므로, reference 성격의 새 정의를 추가할 때도 이 파일에 연결합니다.
 */
export * from "./access-control";
export * from "./identity";
export * from "./oidc";
export * from "./translation";
