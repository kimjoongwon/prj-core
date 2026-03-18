/**
 * 접근 제어 기준 데이터를 묶는 집계 진입점입니다.
 *
 * 역할, 액션, subject, ability는 서로 참조 관계가 강해서 runtime sync가
 * 이 묶음을 한 번에 읽도록 구성되어 있습니다.
 */

export * from "./abilities";
export * from "./actions-subjects";
export * from "./roles";
