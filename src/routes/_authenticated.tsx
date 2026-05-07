import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getStoredUser } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ location }) => {
    const u = getStoredUser();
    if (!u) {
      throw redirect({ to: "/login", search: { redirect: location.href } as never });
    }
  },
  component: () => <Outlet />,
});
