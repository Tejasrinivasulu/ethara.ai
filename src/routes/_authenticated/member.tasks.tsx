import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Task } from "@/lib/mock-data";
import { useWorkspaceData } from "@/lib/workspace-store";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/member/tasks")({
  component: MyTasks,
});

function MyTasks() {
  const { user } = useAuth();
  const { tasks, updateTaskStatus } = useWorkspaceData();
  const [verified, setVerified] = useState<boolean | null>(null);
  const [exists, setExists] = useState<boolean | null>(null);
  const apiBase = useMemo(() => import.meta.env.VITE_BACKEND_URL ?? "", []);

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${apiBase}/api/member/status?email=${encodeURIComponent(user.email)}`);
        const json = (await res.json()) as { exists?: boolean; verified?: boolean };
        if (!cancelled) {
          setExists(Boolean(json.exists));
          setVerified(Boolean(json.verified));
        }
      } catch {
        if (!cancelled) {
          setExists(null);
          setVerified(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiBase, user?.email]);

  if (exists !== true || verified !== true) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground mt-1">
            {exists === true ? "Verify your account to view assigned tasks." : "Ask Admin to add you as a team member first."}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-border/70">
          <div className="font-display font-semibold text-lg">{exists === true ? "Verification Pending" : "Access Restricted"}</div>
          <p className="text-sm text-muted-foreground mt-1">
            {exists === true
              ? "Your account was added by Admin. Please verify on the dashboard to start receiving tasks and projects."
              : "Your member account is not mapped in Team Members yet. After Admin adds your email, verify and continue."}
          </p>
          <Link to="/member" className="text-primary font-medium hover:underline inline-block mt-3">
            Go to Dashboard to Verify
          </Link>
        </div>
      </div>
    );
  }

  const list = tasks.filter((t) => t.assignee.toLowerCase() === (user?.email ?? "").toLowerCase());
  const update = async (id: string, status: Task["status"]) => {
    const updated = await updateTaskStatus(id, status);
    if (!updated) {
      toast.error("Unable to update status. Please try again.");
      return;
    }
    toast.success("Status updated");
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">My Tasks</h1>
        <p className="text-muted-foreground mt-1">Update your task status (Not Completed, In Progress, Completed) and stay on top of deadlines.</p>
      </div>
      {list.length === 0 ? (
        <div className="glass-card rounded-2xl p-5 text-sm text-muted-foreground">
          No tasks assigned to you yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((t) => (
          <div key={t.id} className="glass-card rounded-2xl p-5 hover:shadow-glow transition-all">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-semibold">{t.title}</h3>
              <Badge variant={t.priority === "high" ? "destructive" : t.priority === "medium" ? "default" : "secondary"} className="capitalize shrink-0">{t.priority}</Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-1">{t.project}</div>
            <div className="text-xs text-muted-foreground mt-2">Due {t.dueDate}</div>
            <div className="mt-4">
              <Select value={t.status} onValueChange={(v) => update(t.id, v as Task["status"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Not Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}
