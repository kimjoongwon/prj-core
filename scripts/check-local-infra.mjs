#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import net from "node:net";
import { resolve } from "node:path";
import {
  applyLocalPostgresEnvDefaults,
  maskPostgresUrl,
  parsePostgresUrl,
  probePostgresUrl,
} from "./local-postgres-env.mjs";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const DEFAULT_TIMEOUT_MS = 1500;
const DEFAULT_REDIS_PORT = 6379;

const SERVICE_CONFIG = {
  "core-api": {
    label: "core-api",
    envPath: "apps/core/api/.env",
  },
  "idp-api": {
    label: "idp-api",
    envPath: "apps/idp/api/.env",
  },
};

function isTruthy(value) {
  if (!value) {
    return false;
  }

  return /^(?:y|yes|true|1|on)$/i.test(String(value).trim());
}

function normalizeValue(rawValue) {
  const trimmed = rawValue.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  const values = {};
  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      continue;
    }

    const rawValue = line.slice(separatorIndex + 1);
    values[key] = normalizeValue(rawValue);
  }

  return values;
}

function firstDefined(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }

  return undefined;
}

function isLocalHost(hostname) {
  return LOCAL_HOSTS.has((hostname || "").trim().toLowerCase());
}

function parsePort(value, fallbackPort, variableName) {
  const resolved = firstDefined(value);

  if (!resolved) {
    return fallbackPort;
  }

  const port = Number(resolved);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`${variableName} 값이 올바른 포트가 아닙니다: ${resolved}`);
  }

  return port;
}

function probeTcp(host, port, timeoutMs = DEFAULT_TIMEOUT_MS) {
  return new Promise((resolvePromise) => {
    const socket = net.createConnection({ host, port });
    let settled = false;

    const finish = (result) => {
      if (settled) {
        return;
      }

      settled = true;
      socket.destroy();
      resolvePromise(result);
    };

    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish({ ok: true }));
    socket.once("timeout", () =>
      finish({ ok: false, error: `timeout after ${timeoutMs}ms` }),
    );
    socket.once("error", (error) =>
      finish({ ok: false, error: error.message }),
    );
  });
}

function printUsageAndExit() {
  console.error(
    "Usage: node scripts/check-local-infra.mjs [core-api] [idp-api]",
  );
  process.exit(1);
}

async function main() {
  if (isTruthy(process.env.START_SKIP_INFRA_CHECK)) {
    console.log(
      "[infra-check] START_SKIP_INFRA_CHECK is enabled. Skipping local infrastructure preflight.",
    );
    return;
  }

  const requestedServices = [...new Set(process.argv.slice(2).filter(Boolean))];
  if (requestedServices.length === 0) {
    return;
  }

  const invalidServices = requestedServices.filter(
    (serviceName) => !SERVICE_CONFIG[serviceName],
  );
  if (invalidServices.length > 0) {
    console.error(
      `[infra-check] Unsupported services: ${invalidServices.join(", ")}`,
    );
    printUsageAndExit();
  }

  const checks = new Map();

  for (const serviceName of requestedServices) {
    const service = SERVICE_CONFIG[serviceName];
    const worktreeEnvValues = parseEnvFile(resolve(".env.worktree"));
    const envFileValues = parseEnvFile(resolve(service.envPath));
    const mergedEnvValues = {
      ...envFileValues,
      ...worktreeEnvValues,
      ...process.env,
    };
    const postgresEnv = { ...mergedEnvValues };
    const postgresResolution =
      await applyLocalPostgresEnvDefaults(postgresEnv);

    const redisHost = firstDefined(
      process.env.REDIS_HOST,
      worktreeEnvValues.REDIS_HOST,
      envFileValues.REDIS_HOST,
      "localhost",
    );
    const redisPort = parsePort(
      firstDefined(
        process.env.REDIS_PORT,
        worktreeEnvValues.REDIS_PORT,
        envFileValues.REDIS_PORT,
      ),
      DEFAULT_REDIS_PORT,
      "REDIS_PORT",
    );
    const postgresTarget = parsePostgresUrl(postgresResolution.databaseUrl);

    const targets = [
      {
        kind: "PostgreSQL",
        host: postgresTarget.host,
        port: postgresTarget.port,
        databaseUrl: postgresResolution.databaseUrl,
        source: postgresResolution.source,
      },
      {
        kind: "Redis",
        host: redisHost,
        port: redisPort,
      },
    ];

    for (const target of targets) {
      const key =
        target.kind === "PostgreSQL"
          ? `${target.kind}:${target.databaseUrl}`
          : `${target.kind}:${target.host}:${target.port}`;
      const current = checks.get(key) ?? {
        ...target,
        services: [],
      };

      current.services.push(service.label);
      checks.set(key, current);
    }
  }

  console.log("[infra-check] Checking local PostgreSQL/Redis prerequisites...");

  let hasFailure = false;

  for (const check of checks.values()) {
    const serviceList = [...new Set(check.services)].join(", ");

    if (!isLocalHost(check.host)) {
      console.log(
        `[infra-check] Skipping ${check.kind} check for remote host ${check.host}:${check.port} (${serviceList}).`,
      );
      continue;
    }

    const result =
      check.kind === "PostgreSQL"
        ? await probePostgresUrl(check.databaseUrl)
        : await probeTcp(check.host, check.port);

    if (result.ok) {
      const detail =
        check.kind === "PostgreSQL"
          ? `${check.host}:${check.port} using ${check.source}`
          : `${check.host}:${check.port}`;
      console.log(
        `[infra-check] ${check.kind} reachable at ${detail} (${serviceList}).`,
      );
      continue;
    }

    hasFailure = true;
    console.error(
      `[infra-check] ${check.kind} is not reachable at ${check.host}:${check.port} (${serviceList}).`,
    );
    if (check.kind === "PostgreSQL") {
      console.error(
        `[infra-check] Tried ${maskPostgresUrl(check.databaseUrl)}: ${result.message}`,
      );
    }
    console.error(
      `[infra-check] Start the local ${check.kind} service first, or bypass this guard with START_SKIP_INFRA_CHECK=1 if the target is intentionally unavailable.`,
    );
  }

  if (hasFailure) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(
    `[infra-check] ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});
