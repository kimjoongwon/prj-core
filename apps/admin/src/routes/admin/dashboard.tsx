import { Outlet, createFileRoute } from "@tanstack/react-router";

const DashboardRouteComponent = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Layout */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
      </nav>
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              <a href="/admin/dashboard/user-service/users" className="text-gray-600 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                사용자 관리
              </a>
              <a href="/admin/dashboard/space-service/grounds" className="text-gray-600 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                그라운드 관리
              </a>
              <a href="/admin/dashboard/space-service/categories" className="text-gray-600 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                카테고리 관리
              </a>
            </div>
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/admin/dashboard")({
  component: DashboardRouteComponent,
});