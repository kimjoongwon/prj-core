#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const { Client } = require('pg')

const REQUIRED_TEMPLATES = [
  { code: 'AUTH_PASSWORD_RESET', type: 'EMAIL' },
  { code: 'AUTH_TEMPORARY_PASSWORD', type: 'EMAIL' },
]

const TARGETS = new Set(['local', 'stg', 'prod'])

function parseArgs(argv) {
  const targetArg = argv.find((arg) => arg.startsWith('--target='))
  const envFileArg = argv.find((arg) => arg.startsWith('--env-file='))
  const target = targetArg ? targetArg.split('=')[1] : 'local'
  const envFile = envFileArg
    ? envFileArg.slice('--env-file='.length)
    : 'packages/be-prisma/.env.local'

  if (!TARGETS.has(target)) {
    console.error(`Invalid --target value: ${target}. Allowed: local, stg, prod`)
    process.exit(1)
  }

  return { target, envFile }
}

function resolveEnvFile(rootDir, envFile) {
  const absPath = path.resolve(rootDir, envFile)
  if (!fs.existsSync(absPath)) {
    console.error(`ENV file not found: ${absPath}`)
    process.exit(1)
  }
  return absPath
}

function loadEnv(envFilePath) {
  return dotenv.parse(fs.readFileSync(envFilePath, 'utf8'))
}

function getConnectionString(parsedEnv, target) {
  const candidates =
    target === 'prod'
      ? ['DATABASE_URL_PROD', 'DIRECT_URL_PROD']
      : target === 'stg'
        ? ['DATABASE_URL_STG', 'DIRECT_URL_STG']
        : ['DATABASE_URL', 'DIRECT_URL']

  for (const key of candidates) {
    if (parsedEnv[key]) {
      return { key, value: parsedEnv[key] }
    }
  }

  console.error(`Connection string not found for target=${target}`)
  process.exit(1)
}

function redactConnectionString(connectionString) {
  try {
    const url = new URL(connectionString)
    return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}${url.pathname}`
  } catch {
    return 'unparseable-connection-string'
  }
}

function buildResultMap(rows) {
  const map = new Map()
  for (const row of rows) {
    map.set(row.code, row)
  }
  return map
}

function evaluateRows(rows) {
  const rowMap = buildResultMap(rows)
  const missing = []
  const inactive = []
  const removed = []
  const typeMismatch = []

  for (const required of REQUIRED_TEMPLATES) {
    const row = rowMap.get(required.code)
    if (!row) {
      missing.push(required.code)
      continue
    }
    if (row.type !== required.type) {
      typeMismatch.push(`${required.code}(${row.type})`)
    }
    if (!row.isActive) {
      inactive.push(required.code)
    }
    if (row.removedAt) {
      removed.push(required.code)
    }
  }

  return { missing, inactive, removed, typeMismatch }
}

async function main() {
  const rootDir = process.cwd()
  const options = parseArgs(process.argv.slice(2))
  const envFilePath = resolveEnvFile(rootDir, options.envFile)
  const parsedEnv = loadEnv(envFilePath)
  const connection = getConnectionString(parsedEnv, options.target)
  const redactedConnection = redactConnectionString(connection.value)

  console.log(`TARGET=${options.target}`)
  console.log(`ENV_FILE=${envFilePath}`)
  console.log(`CONNECTION=${redactedConnection}`)
  console.log(
    `REQUIRED_CODES=${REQUIRED_TEMPLATES.map((item) => item.code).join(',')}`,
  )

  const client = new Client({
    connectionString: connection.value,
    statement_timeout: 10000,
    query_timeout: 10000,
  })

  try {
    await client.connect()
    const result = await client.query(
      `
        select
          code,
          type,
          is_active as "isActive",
          removed_at as "removedAt"
        from templates
        where code = any($1::text[])
        order by code asc
      `,
      [REQUIRED_TEMPLATES.map((item) => item.code)],
    )

    const evaluation = evaluateRows(result.rows)

    console.log(`FOUND=${result.rowCount}`)
    for (const row of result.rows) {
      console.log(
        `${row.code}\ttype=${row.type}\tisActive=${row.isActive}\tremovedAt=${row.removedAt ?? 'null'}`,
      )
    }

    if (
      evaluation.missing.length === 0 &&
      evaluation.inactive.length === 0 &&
      evaluation.removed.length === 0 &&
      evaluation.typeMismatch.length === 0
    ) {
      console.log('STATUS=OK')
      return
    }

    console.log('STATUS=FAILED')
    if (evaluation.missing.length > 0) {
      console.log(`MISSING=${evaluation.missing.join(',')}`)
    }
    if (evaluation.inactive.length > 0) {
      console.log(`INACTIVE=${evaluation.inactive.join(',')}`)
    }
    if (evaluation.removed.length > 0) {
      console.log(`REMOVED=${evaluation.removed.join(',')}`)
    }
    if (evaluation.typeMismatch.length > 0) {
      console.log(`TYPE_MISMATCH=${evaluation.typeMismatch.join(',')}`)
    }
    process.exitCode = 1
  } catch (error) {
    console.error(`STATUS=ERROR`)
    console.error(
      `MESSAGE=${error instanceof Error ? error.message : String(error)}`,
    )
    process.exitCode = 2
  } finally {
    await client.end().catch(() => {})
  }
}

main()
