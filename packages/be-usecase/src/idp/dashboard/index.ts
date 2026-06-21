import { GetIdpDashboardStatsUseCase } from "./get-idp-dashboard-stats.usecase";
import { GetIdpLoginTrendUseCase } from "./get-idp-login-trend.usecase";

export const IdpDashboardQueryHandlers = [
	GetIdpDashboardStatsUseCase,
	GetIdpLoginTrendUseCase,
];

export const IdpDashboardCommandHandlers = [];

export const IdpDashboardUseCaseProviders = [
	...IdpDashboardCommandHandlers,
	...IdpDashboardQueryHandlers,
];

export * from "./get-idp-dashboard-stats.usecase";
export * from "./get-idp-login-trend.usecase";
