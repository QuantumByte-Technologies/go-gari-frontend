// app/dashboard/page.tsx

import UserDashboard from "./UserDashboard";

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const tabParam =
    typeof searchParams?.tab === "string" ? searchParams?.tab : undefined;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <UserDashboard initialTab={tabParam} />
    </div>
  );
}
