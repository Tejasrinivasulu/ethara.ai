import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { LayoutDashboard, ListTodo, FolderKanban, User, Settings, FileText } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/DashboardShell";
import { getStoredUser } from "@/lib/auth";

const items: NavItem[] = [
  { title: "Dashboard", url: "/member", icon: LayoutDashboard },
  { title: "My Tasks", url: "/member/tasks", icon: ListTodo },
  { title: "Projects", url: "/member/projects", icon: FolderKanban },
  { title: "Reports", url: "/member/reports", icon: FileText },
  { title: "Profile", url: "/member/profile", icon: User },
  { title: "Settings", url: "/member/settings", icon: Settings },
];

export const Route = createFileRoute("/_authenticated/member")({
  beforeLoad: () => {
    const u = getStoredUser();
    if (u && u.role !== "member") throw redirect({ to: "/admin" });
  },
  component: () => (
    <DashboardShell items={items} brandHref="/member">
      <Outlet />
    </DashboardShell>
  ),
});
