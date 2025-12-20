"use client";

import { useEffect, useState } from "react";
import { ConfigCard } from "./ConfigCard";
import { MarkdownViewer } from "./MarkdownViewer";

interface WikiItem {
  name: string;
  type: "file" | "folder";
  children?: WikiItem[];
}

interface AgentConfig {
  claudeMd: {
    personal: string | null;
    project: string | null;
  };
  commands: string[];
  hooks: Record<string, unknown> | null;
  agents: string[];
  skills: string[];
  mcp: Record<string, unknown> | null;
  qoder: {
    wiki: WikiItem[];
    quests: string[];
    commands: string[];
    memoryNote: string;
  };
}

export function Dashboard() {
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [selectedFile, setSelectedFile] = useState<{
    type: string;
    name: string;
    content: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      setLoading(true);
      const res = await fetch("/api/config");
      if (!res.ok) throw new Error("설정을 불러오는데 실패했습니다");
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }

  async function handleFileClick(type: string, name: string) {
    try {
      const res = await fetch(
        `/api/config/file?type=${encodeURIComponent(type)}&name=${encodeURIComponent(name)}`
      );
      if (!res.ok) throw new Error("파일을 불러오는데 실패했습니다");
      const data = await res.json();
      setSelectedFile({ type, name, content: data.content });
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchConfig}
          className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900 rounded-lg transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="space-y-8">
      {/* CLAUDE.md 섹션 */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-3xl">📝</span> CLAUDE.md
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConfigCard
            title="개인 설정"
            subtitle="~/.claude/CLAUDE.md"
            icon="👤"
            status={config.claudeMd.personal ? "active" : "inactive"}
            onClick={() =>
              config.claudeMd.personal &&
              handleFileClick("claude-md", "personal")
            }
          />
          <ConfigCard
            title="프로젝트 설정"
            subtitle=".claude/CLAUDE.md"
            icon="📁"
            status={config.claudeMd.project ? "active" : "inactive"}
            onClick={() =>
              config.claudeMd.project && handleFileClick("claude-md", "project")
            }
          />
        </div>
      </section>

      {/* Commands 섹션 */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-3xl">⚡</span> Slash Commands
          <span className="text-sm font-normal text-gray-500">
            ({config.commands.length}개)
          </span>
        </h2>
        {config.commands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.commands.map((cmd) => (
              <ConfigCard
                key={cmd}
                title={`/${cmd.replace(".md", "")}`}
                subtitle=".claude/commands/"
                icon="📌"
                status="active"
                onClick={() => handleFileClick("command", cmd)}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="정의된 명령어가 없습니다" />
        )}
      </section>

      {/* Hooks 섹션 */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-3xl">🪝</span> Hooks
        </h2>
        <ConfigCard
          title="Hooks 설정"
          subtitle=".claude/settings.json"
          icon="⚙️"
          status={config.hooks ? "active" : "inactive"}
          onClick={() => config.hooks && handleFileClick("hooks", "settings")}
        />
      </section>

      {/* Agents 섹션 */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-3xl">🤖</span> Agents
          <span className="text-sm font-normal text-gray-500">
            ({config.agents.length}개)
          </span>
        </h2>
        {config.agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.agents.map((agent) => (
              <ConfigCard
                key={agent}
                title={agent.replace(".md", "")}
                subtitle=".claude/agents/"
                icon="🧠"
                status="active"
                onClick={() => handleFileClick("agent", agent)}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="정의된 에이전트가 없습니다" />
        )}
      </section>

      {/* Skills 섹션 */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-3xl">✨</span> Skills
          <span className="text-sm font-normal text-gray-500">
            ({config.skills.length}개)
          </span>
        </h2>
        {config.skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.skills.map((skill) => (
              <ConfigCard
                key={skill}
                title={skill.replace(".md", "")}
                subtitle=".claude/skills/"
                icon="💡"
                status="active"
                onClick={() => handleFileClick("skill", skill)}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="정의된 스킬이 없습니다" />
        )}
      </section>

      {/* MCP 섹션 */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-3xl">🔌</span> MCP (Model Context Protocol)
        </h2>
        <ConfigCard
          title="MCP 설정"
          subtitle=".claude/mcp.json"
          icon="🌐"
          status={config.mcp ? "active" : "inactive"}
          onClick={() => config.mcp && handleFileClick("mcp", "config")}
        />
      </section>

      {/* === Qoder 섹션 === */}
      <div className="border-t-4 border-green-500 pt-8 mt-12">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
            Q
          </span>
          Qoder
        </h2>

        {/* Memory 섹션 */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-3xl">🧠</span> Memory
            <span className="text-sm font-normal text-gray-500">(66개)</span>
          </h3>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💾</div>
              <div>
                <h4 className="font-semibold text-lg mb-2">
                  Qoder Memory System
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {config.qoder.memoryNote}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <MemoryBadge category="user_communication" count={4} />
                  <MemoryBadge category="project_config" count={7} />
                  <MemoryBadge category="environment" count={16} />
                  <MemoryBadge category="code_spec" count={5} />
                  <MemoryBadge category="practice" count={10} />
                  <MemoryBadge category="pitfalls" count={4} />
                  <MemoryBadge category="tech_stack" count={7} />
                  <MemoryBadge category="history" count={5} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wiki 섹션 */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-3xl">📚</span> Project Wiki
          </h3>
          {config.qoder.wiki.length > 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <WikiTree
                items={config.qoder.wiki}
                onFileClick={handleFileClick}
              />
            </div>
          ) : (
            <EmptyState message="Wiki 콘텐츠가 없습니다" />
          )}
        </section>

        {/* Quests 섹션 */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-3xl">🎯</span> Quests
            <span className="text-sm font-normal text-gray-500">
              ({config.qoder.quests.length}개)
            </span>
          </h3>
          {config.qoder.quests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.qoder.quests.map((quest) => (
                <ConfigCard
                  key={quest}
                  title={quest.replace(".md", "")}
                  subtitle=".qoder/quests/"
                  icon="📝"
                  status="active"
                  onClick={() => handleFileClick("qoder-quest", quest)}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="진행 중인 퀸스트가 없습니다" />
          )}
        </section>
      </div>

      {/* 파일 뷰어 모달 */}
      {selectedFile && (
        <MarkdownViewer
          title={selectedFile.name}
          type={selectedFile.type}
          content={selectedFile.content}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center">
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}

function MemoryBadge({ category, count }: { category: string; count: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
      <div className="text-xs text-gray-500 dark:text-gray-400">{category}</div>
      <div className="font-semibold">{count}개</div>
    </div>
  );
}

function WikiTree({
  items,
  onFileClick,
  depth = 0,
}: {
  items: WikiItem[];
  onFileClick: (type: string, name: string) => void;
  depth?: number;
}) {
  return (
    <ul
      className={
        depth > 0
          ? "ml-4 border-l border-gray-200 dark:border-gray-700 pl-4"
          : ""
      }
    >
      {items.map((item) => (
        <li key={item.name} className="py-1">
          {item.type === "folder" ? (
            <div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <span>📁</span>
                {item.name}
              </div>
              {item.children && (
                <WikiTree
                  items={item.children}
                  onFileClick={onFileClick}
                  depth={depth + 1}
                />
              )}
            </div>
          ) : (
            <button
              onClick={() => onFileClick("qoder-wiki", item.name)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <span>📄</span>
              {item.name.replace(".md", "")}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
