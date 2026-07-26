/**
 * useFormField 공통 base 옵션
 */
interface UseFormFieldBaseOptions<
	TState extends object = Record<string, unknown>,
	TValue = unknown,
> {
	value: TValue;
	state: TState;
}

/**
 * useFormField 단일 경로 옵션
 */
export interface UseFormFieldSingleOptions<
	TState extends object = Record<string, unknown>,
	TValue = unknown,
	TPath extends string = string,
> extends UseFormFieldBaseOptions<TState, TValue> {
	path: TPath;
	paths?: never;
	valueSplitter?: never;
	valueAggregator?: never;
}

/**
 * useFormField 다중 경로 옵션
 */
export interface UseFormFieldMultiOptions<
	TState extends object = Record<string, unknown>,
	TValue = unknown,
	TPaths extends readonly string[] = readonly [string, string, ...string[]],
> extends UseFormFieldBaseOptions<TState, TValue> {
	path?: never;
	paths: TPaths;
	valueSplitter: (value: TValue, paths: TPaths) => Record<string, unknown>;
	valueAggregator?: (values: Record<string, unknown>, paths: TPaths) => TValue;
}

/**
 * useFormField 반환 타입
 */
export interface UseFormFieldReturn<TValue> {
	state: { value: TValue };
	setValue: (value: TValue) => void;
}

/**
 * useAbilities 입력 옵션 계약
 */
export interface UseAbilitiesOptions<TAbility = unknown> {
	abilities?: TAbility[] | null;
	isLoading?: boolean;
	isError?: boolean;
	isDisabled?: boolean;
}

/**
 * useAbilities 반환 계약
 */
export interface UseAbilitiesReturn<TAbility = unknown> {
	abilities: TAbility[];
	isLoading: boolean;
	isError: boolean;
	isDisabled: boolean;
}

/**
 * Account bootstrap이 참조하는 Space API 응답 최소 계약
 */
export interface AccountBootstrapSpaceLike {
  id?: string | null;
  tenantId?: string | null;
  contentLanguageCode?: string | null;
  fitnessCenter?: {
    name?: string | null;
    company?: {
      name?: string | null;
    } | null;
  } | null;
}

/**
 * Persist 계층에 저장할 account tenant 선택 항목 계약
 */
export interface AccountTenantSelection {
  tenantId: string;
  spaceId: string;
  fitnessCenterName: string;
  contentLanguageCode?: string | null;
}

/**
 * useTenantBootstrap이 값을 반영할 account 최소 계약
 */
export interface AccountBootstrapLike {
	isSelectionResolved?: boolean;
  setAvailableSpaces: (spaces: AccountTenantSelection[]) => void;
  setCurrentTenant: (
    tenantId: string,
    fitnessCenterName: string,
    contentLanguageCode?: string | null,
    spaceId?: string | null,
  ) => void;
	clearCurrentTenant: () => void;
	setSelectionResolved: (resolved: boolean) => void;
}

/**
 * useTenantBootstrap 입력 옵션 계약
 */
export interface UseAccountBootstrapOptions<
	TSpace extends AccountBootstrapSpaceLike = AccountBootstrapSpaceLike,
> {
	account: AccountBootstrapLike;
	isHydrated: boolean;
	spaces?: TSpace[] | null;
	currentSpace?: TSpace | null;
	isCurrentSpaceFetched: boolean;
}

/**
 * useTenantBootstrap 반환 계약
 */
export interface UseAccountBootstrapReturn<
	TSpace extends AccountBootstrapSpaceLike = AccountBootstrapSpaceLike,
> {
	spaces: TSpace[];
	currentSpace: TSpace | null;
	isCurrentSpaceFetched: boolean;
	isAccountBootstrapReady: boolean;
}
