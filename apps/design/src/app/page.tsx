import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Pure UI Components
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Stateless, Event-driven Design System
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="http://localhost:3100"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Agent Dashboard
              </a>
              <a
                href="http://localhost:6006"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
              >
                Storybook
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Info Section */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🎨</div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">
                  Pure Component 원칙
                </h2>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    내부 상태 없음 (useState, useReducer 금지)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    이벤트는 콜백(onClick, onChange)으로만 처리
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Side Effect 없음 (API 호출, 로컬 스토리지 금지)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Tailwind CSS만 사용 (inline style 금지)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Components Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <span>📦</span>
            Components
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              (0개)
            </span>
          </h2>

          {/* Empty State */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 border border-dashed border-gray-300 dark:border-gray-700 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">
              컴포넌트를 생성해보세요
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              component-builder agent가 생성한 Pure UI 컴포넌트가 여기에
              표시됩니다
            </p>
            <div className="inline-block bg-gray-100 dark:bg-gray-900 rounded-lg p-4 text-left">
              <code className="text-sm">
                <div className="text-purple-600 dark:text-purple-400">
                  &gt; component-builder agent를 사용해줘
                </div>
                <div className="text-gray-500 mt-1">
                  // Card 컴포넌트 생성 요청
                </div>
              </code>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="container mx-auto px-6 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Pure UI Component Showcase · Built with Next.js & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
