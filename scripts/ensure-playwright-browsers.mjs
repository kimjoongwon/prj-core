#!/usr/bin/env node

import fs from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";

function buildInstallEnv() {
  const installEnv = { ...process.env };
  const browsersPath = installEnv.PLAYWRIGHT_BROWSERS_PATH;

  if (
    browsersPath &&
    browsersPath !== "0" &&
    !path.isAbsolute(browsersPath)
  ) {
    installEnv.PLAYWRIGHT_BROWSERS_PATH = path.resolve(process.cwd(), browsersPath);
  }

  return installEnv;
}

function resolveBrowsersLocation(env) {
  if (env.PLAYWRIGHT_BROWSERS_PATH === "0") {
    return "package-local browser bundle (PLAYWRIGHT_BROWSERS_PATH=0)";
  }

  if (env.PLAYWRIGHT_BROWSERS_PATH) {
    return env.PLAYWRIGHT_BROWSERS_PATH;
  }

  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Caches", "ms-playwright");
  }

  if (process.platform === "win32") {
    const localAppData =
      process.env.LOCALAPPDATA ??
      path.join(os.homedir(), "AppData", "Local");

    return path.join(localAppData, "ms-playwright");
  }

  return path.join(
    process.env.XDG_CACHE_HOME ?? path.join(os.homedir(), ".cache"),
    "ms-playwright",
  );
}

function runPlaywrightInstall(args, options = {}) {
  return spawnSync("pnpm", ["exec", "playwright", "install", ...args], {
    cwd: process.cwd(),
    env: options.env,
    shell: process.platform === "win32",
    stdio: options.capture ? "pipe" : "inherit",
    encoding: options.capture ? "utf8" : undefined,
  });
}

function extractInstallLocations(output) {
  const matches = output.matchAll(/Install location:\s+(.+)/g);

  return [...new Set([...matches].map((match) => match[1].trim()))];
}

function hasInstalledBrowser(location) {
  try {
    const stat = fs.statSync(location);

    if (!stat.isDirectory()) {
      return false;
    }

    return fs.readdirSync(location).length > 0;
  } catch {
    return false;
  }
}

const browsers = process.argv.slice(2);
const installTargets = browsers.length > 0 ? browsers : ["chromium"];
const installEnv = buildInstallEnv();
const browsersLocation = resolveBrowsersLocation(installEnv);

const dryRunResult = runPlaywrightInstall(["--dry-run", ...installTargets], {
  capture: true,
  env: installEnv,
});

if (dryRunResult.status !== 0) {
  process.stdout.write(dryRunResult.stdout ?? "");
  process.stderr.write(dryRunResult.stderr ?? "");
  process.exit(dryRunResult.status ?? 1);
}

const installLocations = extractInstallLocations(dryRunResult.stdout ?? "");
const alreadyInstalled =
  installLocations.length > 0 &&
  installLocations.every((location) => hasInstalledBrowser(location));

if (alreadyInstalled) {
  console.log(
    `[ensure-playwright-browsers] already installed for ${installTargets.join(", ")} in ${installLocations.join(", ")}`,
  );
  process.exit(0);
}

console.log(
  `[ensure-playwright-browsers] installing ${installTargets.join(", ")} in ${browsersLocation}`,
);

const result = runPlaywrightInstall(installTargets, {
  env: installEnv,
});

process.exit(result.status ?? 1);
