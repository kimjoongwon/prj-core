#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

export const PUBLIC_PACKAGE_NAMES = Object.freeze([
	"@cocrepo/type",
	"@cocrepo/constant",
	"@cocrepo/enum",
	"@cocrepo/schema",
	"@cocrepo/toolkit",
	"@cocrepo/api",
	"@cocrepo/hook",
	"@cocrepo/store",
	"@cocrepo/ui",
	"@cocrepo/mo-ui",
]);

const PUBLIC_PACKAGE_NAME_SET = new Set(PUBLIC_PACKAGE_NAMES);
const REPOSITORY_URL = "git+https://github.com/kimjoongwon/prj-core.git";
const FORBIDDEN_TARBALL_PATHS = [
	/(?:^|\/)test(?:s)?\//,
	/(?:^|\/)seed(?:s)?\//,
	/(?:^|\/)internal(?:\/|\.)/,
	/\.map$/,
	/\.tsbuildinfo$/,
	/(?:^|\/)\.env(?:\.|$)/,
];

const repositoryRoot = resolve(import.meta.dirname, "..");
const packagesRoot = join(repositoryRoot, "packages");

function packageManifests() {
	return readdirSync(packagesRoot, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => {
			const directory = join(packagesRoot, entry.name);
			const manifestPath = join(directory, "package.json");
			if (!existsSync(manifestPath)) return undefined;
			return {
				directory,
				manifest: JSON.parse(readFileSync(manifestPath, "utf8")),
			};
		})
		.filter(Boolean);
}

function validateManifest(packageRecord) {
	const { directory, manifest } = packageRecord;
	const expectedPublic = PUBLIC_PACKAGE_NAME_SET.has(manifest.name);
	const errors = [];

	if (expectedPublic && manifest.private === true)
		errors.push("공개 패키지가 private입니다.");
	if (!expectedPublic && manifest.private !== true)
		errors.push("allowlist 외 패키지는 private: true여야 합니다.");
	if (expectedPublic && manifest.license !== "ISC")
		errors.push("license가 ISC가 아닙니다.");
	if (expectedPublic && manifest.repository?.url !== REPOSITORY_URL)
		errors.push("repository URL이 canonical URL이 아닙니다.");
	if (
		expectedPublic &&
		manifest.repository?.directory !== relative(repositoryRoot, directory)
	) {
		errors.push("repository.directory가 패키지 경로와 다릅니다.");
	}
	if (expectedPublic && !existsSync(join(directory, "LICENSE")))
		errors.push("LICENSE가 없습니다.");

	return errors.map((message) => `${manifest.name}: ${message}`);
}

function packDryRun(packageRecord) {
	const output = execFileSync(
		"npm",
		["pack", "--dry-run", "--json", "--ignore-scripts"],
		{
			cwd: packageRecord.directory,
			encoding: "utf8",
		},
	);
	const packResult = JSON.parse(output)[0];
	const packedPaths = packResult.files.map((file) => file.path);
	const errors = [];
	if (!packedPaths.includes("LICENSE"))
		errors.push("tarball에 LICENSE가 없습니다.");
	for (const packedPath of packedPaths) {
		if (FORBIDDEN_TARBALL_PATHS.some((pattern) => pattern.test(packedPath))) {
			errors.push(`금지된 tarball 파일: ${packedPath}`);
		}
	}
	return errors.map((message) => `${packageRecord.manifest.name}: ${message}`);
}

function assertPublicBoundary({ inspectTarballs }) {
	const records = packageManifests();
	const errors = records.flatMap(validateManifest);
	const trackedBuildInfoFiles = execFileSync(
		"git",
		["ls-files", "*.tsbuildinfo"],
		{ cwd: repositoryRoot, encoding: "utf8" },
	)
		.trim()
		.split(/\r?\n/)
		.filter(Boolean);
	if (trackedBuildInfoFiles.length > 0) {
		errors.push(
			`생성 캐시가 Git에 추적되고 있습니다: ${trackedBuildInfoFiles.join(", ")}`,
		);
	}
	const privatePackageNames = new Set(
		records
			.filter(({ manifest }) => manifest.private === true)
			.map(({ manifest }) => manifest.name),
	);
	for (const { manifest } of records.filter(({ manifest }) =>
		PUBLIC_PACKAGE_NAME_SET.has(manifest.name),
	)) {
		const publishedDependencies = {
			...manifest.dependencies,
			...manifest.optionalDependencies,
			...manifest.peerDependencies,
		};
		for (const dependencyName of Object.keys(publishedDependencies)) {
			if (privatePackageNames.has(dependencyName)) {
				errors.push(
					`${manifest.name}: 공개 dependency가 private 패키지를 참조합니다: ${dependencyName}`,
				);
			}
		}
	}
	const discoveredPublicNames = records
		.filter(({ manifest }) => manifest.private !== true)
		.map(({ manifest }) => manifest.name)
		.sort();
	const expectedPublicNames = [...PUBLIC_PACKAGE_NAMES].sort();
	if (
		JSON.stringify(discoveredPublicNames) !==
		JSON.stringify(expectedPublicNames)
	) {
		errors.push(`공개 패키지 집합 불일치: ${discoveredPublicNames.join(", ")}`);
	}
	if (inspectTarballs) {
		errors.push(
			...records
				.filter(({ manifest }) => PUBLIC_PACKAGE_NAME_SET.has(manifest.name))
				.flatMap(packDryRun),
		);
	}
	const deploymentJenkinsfiles = [
		"core-api",
		"admin-web",
		"proposal-web",
		"tool-storybook",
	].map((serviceName) =>
		join(repositoryRoot, "devops", `Jenkinsfile.${serviceName}`),
	);
	for (const jenkinsfilePath of deploymentJenkinsfiles) {
		const pipelineSource = readFileSync(jenkinsfilePath, "utf8");
		const guardIndex = pipelineSource.indexOf("TRUSTED_DEPLOYMENT");
		const privilegedPodIndex = pipelineSource.indexOf("podTemplate(");
		if (
			guardIndex < 0 ||
			privilegedPodIndex < 0 ||
			guardIndex > privilegedPodIndex
		) {
			errors.push(
				`${relative(repositoryRoot, jenkinsfilePath)}: privileged Pod 생성 전 배포 신뢰 경계가 없습니다.`,
			);
		}
	}
	const publicCiSource = readFileSync(
		join(repositoryRoot, "devops", "Jenkinsfile.public-ci"),
		"utf8",
	);
	for (const forbiddenText of [
		"privileged: true",
		"withCredentials",
		"podman push",
		"docker push",
		"build(job:",
	]) {
		if (publicCiSource.includes(forbiddenText))
			errors.push(
				`Jenkinsfile.public-ci: 금지된 권한/배포 동작: ${forbiddenText}`,
			);
	}
	if (errors.length > 0) {
		console.error(errors.map((error) => `- ${error}`).join("\n"));
		process.exit(1);
	}
	console.log(`공개 패키지 경계 검증 완료 (${PUBLIC_PACKAGE_NAMES.length}개)`);
}

function runForPublicPackages(commandFactory) {
	for (const packageName of PUBLIC_PACKAGE_NAMES) {
		const [command, commandArguments] = commandFactory(packageName);
		execFileSync(command, commandArguments, {
			cwd: repositoryRoot,
			stdio: "inherit",
		});
	}
}

const [command = "check", argument] = process.argv.slice(2);
if (command === "check") {
	assertPublicBoundary({ inspectTarballs: true });
} else if (command === "publish") {
	assertPublicBoundary({ inspectTarballs: true });
	const publishArguments = ["--access", "public", "--no-git-checks"];
	if (argument === "--dry-run") publishArguments.push("--dry-run");
	runForPublicPackages((packageName) => [
		"pnpm",
		["--filter", packageName, "publish", ...publishArguments],
	]);
} else if (command === "version") {
	const versionType = argument ?? "patch";
	if (!["patch", "minor", "major"].includes(versionType))
		throw new Error(`지원하지 않는 version type: ${versionType}`);
	runForPublicPackages((packageName) => [
		"pnpm",
		[
			"--filter",
			packageName,
			"exec",
			"npm",
			"version",
			versionType,
			"--no-git-tag-version",
		],
	]);
} else if (command === "assert-name") {
	if (!PUBLIC_PACKAGE_NAME_SET.has(argument)) {
		console.error(
			`allowlist 외 패키지는 공개 릴리즈할 수 없습니다: ${argument ?? "(없음)"}`,
		);
		process.exit(1);
	}
} else {
	throw new Error(`지원하지 않는 명령: ${command}`);
}
