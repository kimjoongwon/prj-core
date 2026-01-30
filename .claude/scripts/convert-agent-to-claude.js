#!/usr/bin/env node

/**
 * Agent Converter - OpenCode 에이전트를 Claude Code 형식으로 변환
 *
 * Usage: node convert-agent-to-claude.js <agent-file-path>
 *
 * 이 스크립트는 OpenCode 형식의 에이전트를 Claude Code 형식으로 변환합니다.
 * 변환된 파일은 원본과 호환되도록 최적화됩니다.
 */

const fs = require('fs');
const path = require('path');

// 변환할 에이전트 파일 경로
const agentFilePath = process.argv[2];

if (!agentFilePath) {
  console.error('에러: 에이전트 파일 경로가 필요합니다.');
  process.exit(1);
}

if (!fs.existsSync(agentFilePath)) {
  console.error(`에러: 파일을 찾을 수 없습니다: ${agentFilePath}`);
  process.exit(1);
}

// 에이전트 파일 읽기
const content = fs.readFileSync(agentFilePath, 'utf-8');

// YAML 프론트매터 파싱
function parseFrontmatter(markdown) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: null, body: markdown };
  }

  const frontmatterStr = match[1];
  const body = match[2];

  const frontmatter = {};
  const lines = frontmatterStr.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body };
}

// 본문에서 섹션 추출 헬퍼 함수
function extractSection(body, sectionTitle) {
  const regex = new RegExp(`## ${sectionTitle}\\s*\\n([\\s\\S]*?)(?=## |$)`);
  const match = body.match(regex);
  return match ? match[1].trim() : '';
}

// OpenCode 에이전트를 Claude Code 호환 형식으로 변환
function convertToClaudeCompatible(content) {
  const { frontmatter, body } = parseFrontmatter(content);

  if (!frontmatter) {
    console.warn('경고: 프론트매터를 찾을 수 없습니다. 원본 형식 유지.');
    return content;
  }

  // 에이전트 이름 및 설명
  const agentName = frontmatter.name || 'Unnamed Agent';
  const description = frontmatter.description || '';
  const tools = frontmatter.tools || 'All standard tools';

  // 본문에서 주요 섹션 추출
  const whenToUse = extractSection(body, '언제 사용하는가\\?');
  const inputOutput = extractSection(body, '입력\\/출력');
  const coreRules = extractSection(body, '핵심 규칙');
  const process = extractSection(body, '프로세스');
  const checklist = extractSection(body, '체크리스트');

  // Claude Code 호환 형식 생성
  let claudeContent = `---\n`;
  claudeContent += `name: ${agentName}\n`;
  claudeContent += `description: ${description}\n`;
  claudeContent += `tools: ${tools}\n`;
  claudeContent += `---\n\n`;

  // 메인 제목
  claudeContent += `# ${agentName}\n\n`;
  claudeContent += `${description}\n\n`;

  // When to use 섹션 (추출한 내용 변환)
  claudeContent += `## When to use\n\n`;
  if (whenToUse) {
    // 테이블 형식을 일반 텍스트로 변환
    const plainText = convertTableToPlain(whenToUse);
    claudeContent += `${plainText}\n\n`;
  } else {
    claudeContent += `Use this agent when you need to ${description.toLowerCase()}.\n\n`;
  }

  // What you need 섹션 (입력 정보)
  claudeContent += `## What you need\n\n`;
  if (inputOutput) {
    const inputMatch = inputOutput.match(/\*\*입력\*\*([\s\S]*?)(?=\*\*|\n\n|$)/);
    if (inputMatch) {
      claudeContent += `${inputMatch[1].trim()}\n\n`;
    }
  }

  // What you produce 섹션 (출력 정보)
  claudeContent += `## What you produce\n\n`;
  if (inputOutput) {
    const outputMatch = inputOutput.match(/\*\*출력\*\*([\s\S]*?)(?=$|\n\n)/);
    if (outputMatch) {
      claudeContent += `${outputMatch[1].trim()}\n\n`;
    }
  }

  // How to use 섹션 (프로세스 및 핵심 규칙)
  claudeContent += `## How to use\n\n`;
  if (coreRules) {
    claudeContent += `### Core Rules\n\n${coreRules}\n\n`;
  }
  if (process) {
    claudeContent += `### Process\n\n${process}\n\n`;
  }

  // Guidelines 섹션 (체크리스트)
  if (checklist) {
    claudeContent += `## Guidelines\n\n${checklist}\n\n`;
  }

  return claudeContent;
}

// 테이블 형식을 일반 텍스트로 변환
function convertTableToPlain(tableText) {
  // 마크다운 테이블 형식을 일반 텍스트로 변환
  const lines = tableText.split('\n').filter(line => line.trim());
  const plainLines = lines.filter(line => !line.startsWith('|--'));

  let result = '';
  for (let i = 0; i < plainLines.length; i++) {
    const line = plainLines[i];
    if (line.startsWith('|')) {
      // 테이블 셀 추출
      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      if (cells.length > 0) {
        result += `- ${cells.join(': ')}\n`;
      }
    } else {
      result += `${line}\n`;
    }
  }

  return result.trim();
}

// 변환 실행
try {
  const convertedContent = convertToClaudeCompatible(content);

  // 변환된 내용을 원본 파일에 덮어쓰기
  fs.writeFileSync(agentFilePath, convertedContent, 'utf-8');

  console.log(`✅ 변환 완료: ${path.basename(agentFilePath)}`);
  process.exit(0);
} catch (error) {
  console.error(`❌ 변환 실패: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
}
