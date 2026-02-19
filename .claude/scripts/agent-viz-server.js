#!/usr/bin/env node
/**
 * 🐾 Agent Viz Server
 * Claude Code 서브에이전트를 실시간으로 시각화하는 로컬 HTTP 서버
 *
 * 엔드포인트:
 *   POST /event  → 에이전트 이벤트 수신 + SSE 브로드캐스트
 *   GET  /stream → SSE 실시간 스트림
 *   GET  /history → 이벤트 히스토리 JSON
 *   GET  /       → 카와이 대시보드 HTML
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 9333;
const MAX_HISTORY = 50;

// 현재 실행 중인 에이전트 Map (id -> agent info)
const activeAgents = new Map();
// 완료된 에이전트 히스토리 (최근 MAX_HISTORY 개)
const history = [];
// SSE 클라이언트 Set
const sseClients = new Set();

// 에이전트 ID 카운터
let idCounter = 0;
function newId() {
  return `agent_${Date.now()}_${++idCounter}`;
}

// SSE 전체 브로드캐스트
function broadcast(data) {
  const msg = `data: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(msg);
    } catch {
      sseClients.delete(client);
    }
  }
}

// 이벤트 처리
function handleEvent(event) {
  const { type, agent, desc } = event;

  if (type === 'start') {
    const id = newId();
    const info = { id, agent: agent || 'unknown', desc: desc || '', startedAt: Date.now() };
    activeAgents.set(id, info);
    broadcast({ type: 'start', ...info });
    console.log(`  ▶ 시작: ${info.agent} (${id})`);
    return { ok: true, id };
  }

  if (type === 'done') {
    // 같은 에이전트 타입 중 가장 오래된 것 찾기
    let matchedId = null;
    for (const [id, info] of activeAgents) {
      if (info.agent === (agent || 'unknown')) {
        matchedId = id;
        break;
      }
    }

    const finishedAt = Date.now();
    const id = matchedId || newId();
    const info = matchedId
      ? activeAgents.get(matchedId)
      : { id, agent: agent || 'unknown', desc: desc || '', startedAt: finishedAt };

    if (matchedId) activeAgents.delete(matchedId);

    const duration = finishedAt - info.startedAt;
    const histItem = { ...info, desc: desc || info.desc, finishedAt, duration };
    history.unshift(histItem);
    if (history.length > MAX_HISTORY) history.pop();

    broadcast({ type: 'done', ...histItem });
    console.log(`  ✓ 완료: ${histItem.agent} (${Math.round(duration / 1000)}s)`);
    return { ok: true };
  }

  return { ok: false, error: `Unknown event type: ${type}` };
}

// HTML 대시보드 로드
const HTML_PATH = path.join(__dirname, 'agent-viz-dashboard.html');
function getDashboardHtml() {
  try {
    return fs.readFileSync(HTML_PATH, 'utf-8');
  } catch {
    return '<h1>대시보드 파일을 찾을 수 없습니다: agent-viz-dashboard.html</h1>';
  }
}

// HTTP 서버
const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // POST /event → 이벤트 수신
  if (req.method === 'POST' && urlPath === '/event') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const event = JSON.parse(body);
        const result = handleEvent(event);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  // GET /stream → SSE 실시간 스트림
  if (req.method === 'GET' && urlPath === '/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    sseClients.add(res);

    // 현재 상태 스냅샷 전송
    const snapshot = {
      type: 'snapshot',
      active: Array.from(activeAgents.values()),
      history: history.slice(0, 30),
    };
    res.write(`data: ${JSON.stringify(snapshot)}\n\n`);

    // 연결 유지용 heartbeat
    const heartbeat = setInterval(() => {
      try { res.write(': heartbeat\n\n'); } catch { clearInterval(heartbeat); }
    }, 15000);

    req.on('close', () => {
      sseClients.delete(res);
      clearInterval(heartbeat);
    });
    return;
  }

  // GET /history → JSON 히스토리
  if (req.method === 'GET' && urlPath === '/history') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      active: Array.from(activeAgents.values()),
      history,
    }));
    return;
  }

  // GET / → HTML 대시보드
  if (req.method === 'GET' && (urlPath === '/' || urlPath === '/index.html')) {
    const html = getDashboardHtml();
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log('');
  console.log('  🐾 Agent Viz Server 시작!');
  console.log(`  🌐 http://localhost:${PORT}`);
  console.log('');
  console.log('  에이전트가 실행되면 브라우저에서 실시간으로 확인할 수 있습니다.');
  console.log('  종료: Ctrl+C');
  console.log('');

  // macOS 브라우저 자동 오픈
  exec(`open http://localhost:${PORT}`, (err) => {
    if (err) {
      // macOS 아닌 경우 시도
      exec(`xdg-open http://localhost:${PORT}`);
    }
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`  ❌ 포트 ${PORT}가 이미 사용 중입니다.`);
    console.error(`  기존 서버가 실행 중이라면 http://localhost:${PORT} 를 브라우저에서 확인하세요.`);
  } else {
    console.error('  ❌ 서버 오류:', err.message);
  }
  process.exit(1);
});
