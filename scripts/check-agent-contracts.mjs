import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const read = (path) => readFileSync(path, 'utf8');
const rel = (path) => relative(root, path);

function walk(dir, predicate) {
  if (!existsSync(dir)) return [];
  const result = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) result.push(...walk(path, predicate));
    else if (predicate(path)) result.push(path);
  }
  return result;
}

function field(source, name) {
  return source.match(new RegExp(`^${name}\\s*=\\s*"([^"]+)"`, 'm'))?.[1];
}

function splitRow(line) {
  let value = line.trim();
  if (value.startsWith('|')) value = value.slice(1);
  if (value.endsWith('|')) value = value.slice(0, -1);
  const cells = [];
  let current = '';
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === '\\' && value[index + 1] === '|') {
      current += '|';
      index += 1;
    } else if (value[index] === '|') {
      cells.push(current.trim());
      current = '';
    } else current += value[index];
  }
  cells.push(current.trim());
  return cells;
}

function checkLedger(path, source, agentNames) {
  const lines = source.split(/\r?\n/);
  const headings = lines.map((line, index) => line.trim() === '## 실행 원장' ? index : -1).filter((index) => index >= 0);
  if (headings.length !== 1) {
    errors.push(`${rel(path)}: "## 실행 원장"은 정확히 하나여야 합니다.`);
    return;
  }
  const headerIndex = lines.findIndex((line, index) => index > headings[0] && line.trim().startsWith('|'));
  const expected = ['단계', 'owner', '목표', '입력과 근거', '수정 범위', '산출물', '선행 단계', '완료 기준', '작업 상태', '검증 근거'];
  if (headerIndex < 0 || !lines[headerIndex + 1]?.trim().startsWith('|')) {
    errors.push(`${rel(path)}: 실행 원장 표를 찾을 수 없습니다.`);
    return;
  }
  const headers = splitRow(lines[headerIndex]);
  if (headers.length !== expected.length || headers.some((value, index) => value !== expected[index])) {
    errors.push(`${rel(path)}: 실행 원장 열은 "${expected.join(' | ')}" 순서여야 합니다.`);
    return;
  }
  const rows = [];
  for (let index = headerIndex + 2; index < lines.length && lines[index].trim().startsWith('|'); index += 1) {
    const cells = splitRow(lines[index]);
    if (cells.length === expected.length) rows.push(Object.fromEntries(expected.map((name, cell) => [name, cells[cell]])));
  }
  if (rows.length === 0) {
    errors.push(`${rel(path)}: 실행 원장에 단계가 없습니다.`);
    return;
  }

  const ids = new Set();
  const statuses = new Set(['대기', '실행 중', '완료', '입력 필요', '검증 실패', '실행 오류']);
  for (const row of rows) {
    if (!row['단계'] || ids.has(row['단계'])) errors.push(`${rel(path)}: 단계 ID가 비어 있거나 중복됩니다: ${row['단계'] || '<empty>'}`);
    ids.add(row['단계']);
    if (row.owner !== '기본 Codex' && !agentNames.has(row.owner)) errors.push(`${rel(path)}: 알 수 없는 owner "${row.owner}"입니다.`);
    if (!statuses.has(row['작업 상태'])) errors.push(`${rel(path)}: "${row['단계']}"의 작업 상태가 유효하지 않습니다.`);
    if (row['작업 상태'] === '완료' && (!row['검증 근거'] || row['검증 근거'] === '-')) errors.push(`${rel(path)}: 완료 단계 "${row['단계']}"에 검증 근거가 없습니다.`);
    for (const name of ['목표', '입력과 근거', '수정 범위', '산출물', '완료 기준']) {
      if (!row[name] || row[name] === '-') errors.push(`${rel(path)}: "${row['단계']}"의 "${name}"가 비어 있습니다.`);
    }
  }

  const graph = new Map(rows.map((row) => [row['단계'], []]));
  for (const row of rows) {
    if (!row['선행 단계'] || row['선행 단계'] === '-') continue;
    for (const dependency of row['선행 단계'].split(',').map((value) => value.trim()).filter(Boolean)) {
      if (!ids.has(dependency)) errors.push(`${rel(path)}: "${row['단계']}"가 존재하지 않는 단계 "${dependency}"에 의존합니다.`);
      else graph.get(row['단계']).push(dependency);
    }
  }
  const visiting = new Set();
  const visited = new Set();
  function visit(id) {
    if (visiting.has(id)) {
      errors.push(`${rel(path)}: 실행 원장에 순환 의존성이 있습니다: ${id}`);
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependency of graph.get(id) ?? []) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of ids) visit(id);
}

const agentFiles = walk(join(root, '.codex', 'agents'), (path) => path.endsWith('.toml'));
const agentNames = new Set();
for (const path of agentFiles) {
  const source = read(path);
  const name = field(source, 'name');
  if (/^\d{2}-/.test(basename(path))) errors.push(`${rel(path)}: 숫자 접두사를 사용할 수 없습니다.`);
  if (!name) errors.push(`${rel(path)}: name 필드가 없습니다.`);
  if (!field(source, 'description')) errors.push(`${rel(path)}: description 필드가 없습니다.`);
  if (!/^developer_instructions\s*=\s*(?:"""|''')/m.test(source)) errors.push(`${rel(path)}: developer_instructions 필드가 없습니다.`);
  if (name === 'orch-delivery') errors.push(`${rel(path)}: orch-delivery는 custom agent가 될 수 없습니다.`);
  if (name && basename(path, '.toml') !== name) errors.push(`${rel(path)}: 파일명은 name 필드 "${name}"와 일치해야 합니다.`);
  if (name && agentNames.has(name)) errors.push(`${rel(path)}: 중복 agent name "${name}"입니다.`);
  if (name) agentNames.add(name);
  const refs = [...source.matchAll(/\.agents\/skills\/[a-z0-9-]+\/SKILL\.md/g)].map((match) => match[0]);
  if (refs.length === 0) errors.push(`${rel(path)}: 적용할 repository skill 경로가 없습니다.`);
  for (const ref of refs) if (!existsSync(join(root, ref))) errors.push(`${rel(path)}: skill 경로가 존재하지 않습니다: ${ref}`);
}

const config = read(join(root, '.codex', 'config.toml'));
if (!/^max_concurrent_threads_per_session\s*=\s*8\s*$/m.test(config)) errors.push('.codex/config.toml: agents.max_concurrent_threads_per_session = 8 설정이 필요합니다.');
if (/^max_threads\s*=/m.test(config)) errors.push('.codex/config.toml: legacy agents.max_threads를 사용할 수 없습니다.');
if (/COMMON\.md/.test(read(join(root, 'AGENTS.md')))) errors.push('AGENTS.md: 존재하지 않는 COMMON.md를 참조할 수 없습니다.');

const forbidden = [/next\s+subagent/i, /handoff\s+key/i, /none-final/i, /none-blocked/i];
const skillFiles = walk(join(root, '.agents', 'skills'), (path) => path.endsWith('SKILL.md'));
for (const path of skillFiles) {
  const source = read(path);
  const isOrchestrator = basename(dirname(path)) === 'orch-delivery';
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) {
    errors.push(`${rel(path)}: YAML frontmatter가 없습니다.`);
  } else {
    const entries = frontmatter[1]
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map((line) => {
        const separator = line.indexOf(':');
        return separator < 0 ? [line.trim(), ''] : [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      });
    const metadata = new Map(entries);
    const skillName = metadata.get('name')?.replace(/^["']|["']$/g, '');
    if (!skillName) errors.push(`${rel(path)}: skill name이 없습니다.`);
    if (!metadata.get('description')) errors.push(`${rel(path)}: skill description이 없습니다.`);
    for (const [key] of entries) {
      if (!['name', 'description'].includes(key)) errors.push(`${rel(path)}: 허용되지 않은 frontmatter 필드 "${key}"입니다.`);
    }
    if (skillName && skillName !== basename(dirname(path))) errors.push(`${rel(path)}: skill name은 폴더명과 일치해야 합니다.`);
  }
  if (!isOrchestrator && !source.includes('## 단독 실행 계약')) errors.push(`${rel(path)}: 단독 실행 계약이 없습니다.`);
  for (const pattern of forbidden) if (pattern.test(source)) errors.push(`${rel(path)}: 이전 orchestration 표현 "${pattern.source}"이 남아 있습니다.`);
  if (!isOrchestrator) {
    for (const line of source.split(/\r?\n/)) {
      const mentionsAgent = [...agentNames].some((name) => line.includes(name));
      if (mentionsAgent && /(호출|복귀|인계)/.test(line)) errors.push(`${rel(path)}: worker 간 실행 지시가 남아 있습니다: ${line.trim()}`);
    }
  }
}

const pageSpecs = walk(join(root, 'apps', 'admin', 'web', 'src', 'app'), (path) => path.endsWith('page.spec.md'));
for (const path of pageSpecs) {
  const source = read(path);
  for (const pattern of forbidden) if (pattern.test(source)) errors.push(`${rel(path)}: 이전 orchestration 표현 "${pattern.source}"이 남아 있습니다.`);
  checkLedger(path, source, agentNames);
}

if (errors.length) {
  console.error('Agent contract check failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Agent contract check passed: ${agentFiles.length} agents, ${skillFiles.length} skills, ${pageSpecs.length} route/page specs.`);
