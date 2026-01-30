#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const agentsDir = '.claude/agents';
const outputDir = '.opencode/agents';

// 이미 처리된 파일들 (추가 처리되지 않도록)
const processedFiles = new Set(['fe-api-integrator.md', 'qa-type-checker.md']);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md') && f !== '_TEMPLATE.md');

files.forEach(file => {
  if (processedFiles.has(file)) {
    console.log(`⏭️  Skip: ${file} (already processed)`);
    return;
  }

  const inputPath = path.join(agentsDir, file);
  const outputPath = path.join(outputDir, file);

  const content = fs.readFileSync(inputPath, 'utf-8');

  // YAML frontmatter 추출
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  const oldFrontmatter = frontmatterMatch ? frontmatterMatch[1] : '';

  // 에이전트명 추출
  const nameMatch = oldFrontmatter.match(/name:\s*(.+)/);
  const name = nameMatch ? nameMatch[1].trim() : '';

  // 설명 추출
  const descMatch = oldFrontmatter.match(/description:\s*(.+)/);
  const description = descMatch ? descMatch[1].trim() : '';

  // 마크다운 본문 추출
  const bodyContent = frontmatterMatch ? content.slice(frontmatterMatch[0].length) : content;

  // 새 opencode 포맷으로 변환
  const newFrontmatter = `---
description: ${description}
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---

${bodyContent}`;

  fs.writeFileSync(outputPath, newFrontmatter, 'utf-8');
  console.log(`✅ Converted: ${file}`);
});

console.log(`\n🎉 Done! Converted ${files.length - processedFiles.size} agents to .opencode/agents/`);
