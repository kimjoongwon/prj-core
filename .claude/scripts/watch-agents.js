#!/usr/bin/env node

/**
 * Agent File Watcher - 에이전트 파일 감시 및 자동 변환
 *
 * Usage: node watch-agents.js
 *
 * 이 스크립트는 .claude/agents/ 디렉토리의 파일을 감시하고,
 * 수정될 때마다 자동으로 Claude Code 형식으로 변환합니다.
 */

const chokidar = require('chokidar');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// 색상 정의
const colors = {
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

const log = (color, message) => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// 감시할 에이전트 디렉토리
const AGENTS_DIR = path.join(process.cwd(), '.claude', 'agents');

// 변환 스크립트 경로
const CONVERT_SCRIPT = path.join(process.cwd(), '.claude', 'scripts', 'convert-agent-to-claude.js');

// 감시 대상 파일 패턴 (템플릿 파일 제외)
const WATCH_PATTERN = path.join(AGENTS_DIR, '*.md');
const IGNORE_PATTERN = /_TEMPLATE\.md$/;

// 변환 함수
async function convertAgent(filePath) {
  const filename = path.basename(filePath);

  // 템플릿 파일은 무시
  if (IGNORE_PATTERN.test(filename)) {
    return;
  }

  log('cyan', `\n🔄 감지된 파일: ${filename}`);
  log('yellow', '   변환 중...');

  try {
    // 변환 스크립트 실행
    await new Promise((resolve, reject) => {
      const process = spawn('node', [CONVERT_SCRIPT, filePath], {
        stdio: 'inherit'
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`변환 실패: exit code ${code}`));
        }
      });
    });

    log('green', '   ✅ 변환 완료\n');
  } catch (error) {
    log('red', `   ❌ 변환 실패: ${error.message}\n`);
  }
}

// 디렉토리 존재 확인
if (!fs.existsSync(AGENTS_DIR)) {
  log('red', `에러: 에이전트 디렉토리를 찾을 수 없습니다: ${AGENTS_DIR}`);
  process.exit(1);
}

// 감지 시 약간 지연 (연속 변경 방지)
let debounceTimeout;
function debouncedConvert(filePath) {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = setTimeout(() => {
    convertAgent(filePath);
  }, 1000); // 1초 지연
}

// 파일 감시 시작
log('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
log('yellow', '👀 에이전트 파일 감시 시작');
log('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

log('yellow', `감시 대상: ${AGENTS_DIR}`);
log('yellow', `중지: Ctrl+C\n`);

const watcher = chokidar.watch(WATCH_PATTERN, {
  ignored: IGNORE_PATTERN,
  persistent: true,
  ignoreInitial: true, // 시작 시 감지 안 함
  awaitWriteFinish: {
    stabilityThreshold: 500,
    pollInterval: 100
  }
});

// 파일 수정 감지
watcher.on('change', (filePath) => {
  log('yellow', `📝 파일 수정 감지: ${path.basename(filePath)}`);
  debouncedConvert(filePath);
});

// 파일 추가 감지
watcher.on('add', (filePath) => {
  log('yellow', `➕ 파일 추가 감지: ${path.basename(filePath)}`);
  debouncedConvert(filePath);
});

// 감시 시작 알림
watcher.on('ready', () => {
  log('green', '✅ 파일 감지 준비 완료\n');
});

// 에러 처리
watcher.on('error', (error) => {
  log('red', `❌ 감시 에러: ${error.message}`);
});

// 종료 핸들러
process.on('SIGINT', () => {
  log('yellow', '\n\n⏹️  감시 중지...');
  watcher.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('yellow', '\n\n⏹️  감지 중지...');
  watcher.close();
  process.exit(0);
});
