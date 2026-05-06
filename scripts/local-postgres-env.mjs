#!/usr/bin/env node

import net from "node:net";
import process from "node:process";
import { fileURLToPath } from "node:url";
import pg from "pg";

const DEFAULT_POSTGRES_HOST = "localhost";
const DEFAULT_POSTGRES_PORT = "5432";
const DEFAULT_POSTGRES_DATABASE = "plate";
const DEFAULT_TIMEOUT_MS = 1000;
const LOCAL_POSTGRES_CANDIDATE_PORTS = [5432];

export async function applyLocalPostgresEnvDefaults(env) {
  setDefault(env, "POSTGRES_HOST", DEFAULT_POSTGRES_HOST);
  setDefault(env, "POSTGRES_DATABASE", DEFAULT_POSTGRES_DATABASE);

  if (!env.POSTGRES_PORT) {
    env.POSTGRES_PORT = String(await resolvePostgresPort(env.POSTGRES_HOST));
  }

  const resolution = await resolvePostgresConnection(env);
  const parsed = parsePostgresUrl(resolution.databaseUrl);

  env.DATABASE_URL = resolution.databaseUrl;
  env.DIRECT_URL = await resolveDirectUrl(env, resolution.databaseUrl);
  env.POSTGRES_HOST = parsed.host;
  env.POSTGRES_PORT = String(parsed.port);
  env.POSTGRES_DATABASE = parsed.database;
  env.POSTGRES_USER = parsed.user;
  env.POSTGRES_PASSWORD = parsed.password ?? "";

  return {
    ...resolution,
    directUrl: env.DIRECT_URL,
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    database: env.POSTGRES_DATABASE,
    user: env.POSTGRES_USER,
  };
}

export function buildPostgresUrl({ host, port, user, password, database }) {
  const username = user ? encodeURIComponent(user) : "";
  const credentials = username
    ? `${username}${password ? `:${encodeURIComponent(password)}` : ""}@`
    : "";

  return `postgresql://${credentials}${host}:${port}/${database}?schema=public`;
}

export function parsePostgresUrl(databaseUrl) {
  const parsed = new URL(databaseUrl);

  return {
    host: parsed.hostname || DEFAULT_POSTGRES_HOST,
    port: Number(parsed.port || DEFAULT_POSTGRES_PORT),
    database: parsed.pathname.replace(/^\//, "") || DEFAULT_POSTGRES_DATABASE,
    user: decodeURIComponent(parsed.username || ""),
    password: parsed.password ? decodeURIComponent(parsed.password) : "",
  };
}

export async function probePostgresUrl(databaseUrl) {
  const pool = new pg.Pool({
    connectionString: databaseUrl,
    connectionTimeoutMillis: DEFAULT_TIMEOUT_MS,
    max: 1,
  });

  try {
    await pool.query("select 1");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error,
      message: error instanceof Error ? error.message : String(error),
      code: error?.code,
    };
  } finally {
    await pool.end().catch(() => undefined);
  }
}

export async function resolvePostgresPort(host) {
  for (const port of LOCAL_POSTGRES_CANDIDATE_PORTS) {
    if (await canConnect(host, port)) {
      return port;
    }
  }

  return Number(DEFAULT_POSTGRES_PORT);
}

export function maskPostgresUrl(databaseUrl) {
  return databaseUrl.replace(/:[^:@/]+@/, ":***@");
}

async function resolvePostgresConnection(env) {
  const candidates = buildPostgresCandidates(env);
  const failures = [];

  for (const candidate of candidates) {
    const result = await probePostgresUrl(candidate.url);

    if (result.ok) {
      return {
        databaseUrl: candidate.url,
        source: candidate.source,
        failures,
      };
    }

    failures.push({
      source: candidate.source,
      url: maskPostgresUrl(candidate.url),
      code: result.code,
      message: result.message,
    });
  }

  const fallback = candidates[0];
  return {
    databaseUrl: fallback.url,
    source: fallback.source,
    failures,
  };
}

function buildPostgresCandidates(env) {
  const host = env.POSTGRES_HOST || DEFAULT_POSTGRES_HOST;
  const port = env.POSTGRES_PORT || DEFAULT_POSTGRES_PORT;
  const database = env.POSTGRES_DATABASE || DEFAULT_POSTGRES_DATABASE;
  const localUser = process.env.USER || process.env.LOGNAME;
  const candidates = [];

  if (env.DATABASE_URL) {
    candidates.push({
      source: "DATABASE_URL",
      url: env.DATABASE_URL,
    });
  }

  if (env.POSTGRES_USER) {
    candidates.push({
      source: "POSTGRES_*",
      url: buildPostgresUrl({
        host,
        port,
        user: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database,
      }),
    });
  }

  if (localUser) {
    candidates.push({
      source: "local OS role",
      url: buildPostgresUrl({
        host,
        port,
        user: localUser,
        password: "",
        database,
      }),
    });
  }

  candidates.push(
    {
      source: "cocrepo default",
      url: buildPostgresUrl({
        host,
        port,
        user: "cocrepo",
        password: "devpassword",
        database,
      }),
    },
    {
      source: "postgres default",
      url: buildPostgresUrl({
        host,
        port,
        user: "postgres",
        password: "postgres",
        database,
      }),
    },
  );

  return dedupeCandidates(candidates);
}

async function resolveDirectUrl(env, databaseUrl) {
  if (!env.DIRECT_URL) {
    return databaseUrl;
  }

  const result = await probePostgresUrl(env.DIRECT_URL);
  return result.ok ? env.DIRECT_URL : databaseUrl;
}

function dedupeCandidates(candidates) {
  const seen = new Set();
  const deduped = [];

  for (const candidate of candidates) {
    if (seen.has(candidate.url)) {
      continue;
    }

    seen.add(candidate.url);
    deduped.push(candidate);
  }

  return deduped;
}

function setDefault(env, key, value) {
  if (env[key] === undefined || env[key] === "") {
    env[key] = String(value);
  }
}

function canConnect(host, port) {
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

    socket.setTimeout(250);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

function printShellExports(env) {
  for (const key of [
    "POSTGRES_HOST",
    "POSTGRES_PORT",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_DATABASE",
    "DATABASE_URL",
    "DIRECT_URL",
  ]) {
    console.log(`export ${key}=${shellQuote(env[key] ?? "")}`);
  }
}

async function main() {
  const env = { ...process.env };
  const result = await applyLocalPostgresEnvDefaults(env);

  if (process.argv.includes("--shell")) {
    printShellExports(env);
    return;
  }

  console.log(
    JSON.stringify(
      {
        ...result,
        databaseUrl: maskPostgresUrl(result.databaseUrl),
        directUrl: maskPostgresUrl(result.directUrl),
      },
      null,
      2,
    ),
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
