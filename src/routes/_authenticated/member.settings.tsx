import { createFileRoute } from "@tanstack/react-router";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/member/settings")({
  component: () => (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your preferences.</p>
      </div>
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between"><div><div className="font-medium">Email notifications</div><div className="text-xs text-muted-foreground">Get notified about task updates.</div></div><Switch defaultChecked /></div>
        <div className="flex items-center justify-between"><div><div className="font-medium">Deadline reminders</div><div className="text-xs text-muted-foreground">Reminders 24h before due.</div></div><Switch defaultChecked /></div>
        <div className="flex items-center justify-between"><div><div className="font-medium">AI suggestions</div><div className="text-xs text-muted-foreground">Smart task tips.</div></div><Switch /></div>
      </div>
      <Button onClick={() => toast.success("Saved")} className="bg-aurora text-primary-foreground shadow-glow">Save changes</Button>
    </div>
  ),
});
