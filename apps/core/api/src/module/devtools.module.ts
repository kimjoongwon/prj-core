import type { DynamicModule } from "@nestjs/common";

export function isNestDevtoolsEnabled(): boolean {
	return (
		process.env.ENABLE_NEST_DEVTOOLS === "true" &&
		process.env.NODE_ENV !== "production" &&
		process.env.NODE_ENV !== "test"
	);
}

export async function loadNestDevtoolsModule(): Promise<DynamicModule> {
	const { DevtoolsModule } = await import("@nestjs/devtools-integration");

	return DevtoolsModule.register({
		http: true,
		port:
			Number.parseInt(process.env.CORE_API_NEST_DEVTOOLS_PORT ?? "8000", 10) ||
			8000,
	});
}
