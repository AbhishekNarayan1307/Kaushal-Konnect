import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  BadgeCheck,
  Ban,
  Check,
  FileCheck2,
  HeartHandshake,
  MessageSquareWarning,
  ShieldCheck,
  Star,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
  Wrench,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currency } from "@/lib/dashboard-data";
import {
  coopBookings,
  coopWorkers,
  initialCoopComplaints,
  initialCoopServices,
  initialVerificationRequests,
  platformStats,
  type CoopComplaint,
  type CoopService,
  type CoopWorker,
  type VerificationRequest,
} from "@/lib/coop-data";

export const Route = createFileRoute("/coop")({
  head: () => ({
    meta: [
      { title: "Cooperative Dashboard | HomeHands Services" },
      {
        name: "description",
        content:
          "Register and verify workers, manage services and fair-wage ranges, monitor bookings, complaints, welfare cover, payouts and platform statistics.",
      },
      { property: "og:title", content: "Cooperative Dashboard | HomeHands Services" },
      {
        property: "og:description",
        content:
          "One control room for the cooperative: worker verification, fair pricing, booking oversight, complaint handling and platform analytics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoopDashboard,
});

function CoopDashboard() {
  const [workers, setWorkers] = useState<CoopWorker[]>(coopWorkers);
  const [requests, setRequests] = useState<VerificationRequest[]>(initialVerificationRequests);
  const [servicesList, setServicesList] = useState<CoopService[]>(initialCoopServices);
  const [complaints, setComplaints] = useState<CoopComplaint[]>(initialCoopComplaints);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [newWorker, setNewWorker] = useState({ name: "", service: "Home Cleaning", city: "" });
  const [skillDraft, setSkillDraft] = useState<Record<string, string>>({});

  const activeWorkers = workers.filter((w) => w.status === "Active").length;
  const totalPayouts = workers.reduce((s, w) => s + w.earnings, 0);
  const openComplaints = complaints.filter((c) => c.status !== "Resolved").length;
  const insuranceGaps = workers.filter((w) => w.insurance !== "Active").length;

  const filtered = useMemo(
    () =>
      workers.filter(
        (w) =>
          (statusFilter === "All" || w.status === statusFilter) &&
          (w.name.toLowerCase().includes(search.toLowerCase()) ||
            w.service.toLowerCase().includes(search.toLowerCase())),
      ),
    [workers, search, statusFilter],
  );

  const registerWorker = () => {
    if (!newWorker.name.trim()) {
      toast.error("Add a worker name first");
      return;
    }
    const id = `w${Date.now()}`;
    setWorkers((prev) => [
      {
        id,
        name: newWorker.name.trim(),
        service: newWorker.service,
        city: newWorker.city.trim() || "Bengaluru",
        rating: 0,
        jobs: 0,
        hourlyRate:
          servicesList.find((s) => s.name === newWorker.service)?.suggestedRate ?? 20,
        status: "Pending",
        verified: false,
        skills: [],
        certifications: [],
        insurance: "Not enrolled",
        earnings: 0,
      },
      ...prev,
    ]);
    setRequests((prev) => [
      {
        id: `VR-${Math.floor(900 + Math.random() * 90)}`,
        workerName: newWorker.name.trim(),
        service: newWorker.service,
        document: "Government ID + address proof",
        submitted: "2026-08-31",
        note: "New registration — awaiting document review.",
      },
      ...prev,
    ]);
    setNewWorker({ name: "", service: newWorker.service, city: "" });
    toast.success("Worker registered", { description: "Verification request created." });
  };

  const decideVerification = (req: VerificationRequest, approve: boolean) => {
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    setWorkers((prev) =>
      prev.map((w) =>
        w.name === req.workerName
          ? { ...w, verified: approve, status: approve ? "Active" : w.status }
          : w,
      ),
    );
    toast[approve ? "success" : "info"](approve ? "Verification approved" : "Verification rejected", {
      description: `${req.workerName} · ${req.document}`,
    });
  };

  const setWorkerStatus = (id: string, status: CoopWorker["status"]) => {
    setWorkers((prev) => prev.map((w) => (w.id === id ? { ...w, status } : w)));
    toast.success(`Worker ${status.toLowerCase()}`);
  };

  const addSkill = (id: string) => {
    const value = (skillDraft[id] ?? "").trim();
    if (!value) return;
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === id && !w.skills.includes(value) ? { ...w, skills: [...w.skills, value] } : w,
      ),
    );
    setSkillDraft((prev) => ({ ...prev, [id]: "" }));
    toast.success("Skill added");
  };

  const removeSkill = (id: string, skill: string) =>
    setWorkers((prev) =>
      prev.map((w) => (w.id === id ? { ...w, skills: w.skills.filter((s) => s !== skill) } : w)),
    );

  const updateService = (id: string, patch: Partial<CoopService>) =>
    setServicesList((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const advanceComplaint = (c: CoopComplaint) => {
    const next: CoopComplaint["status"] =
      c.status === "Open" ? "Investigating" : "Resolved";
    setComplaints((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: next } : x)));
    toast.success(`Complaint ${c.id} → ${next}`);
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-navy text-navy-foreground">
        <div className="mx-auto max-w-6xl px-5 pt-10 pb-24 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-gradient-gold font-display text-lg font-bold text-primary-foreground">
                H
              </span>
              <div>
                <p className="font-display text-lg font-bold leading-none">HomeHands</p>
                <p className="text-xs text-navy-foreground/60">Cooperative dashboard</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-widest text-navy-foreground/70">
              <Link to="/" className="hover:text-primary">
                Customer view
              </Link>
              <Link to="/worker" className="hover:text-primary">
                Worker view
              </Link>
            </div>
          </div>

          <h1 className="mt-10 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Cooperative control room.{" "}
            <span className="text-primary">
              {requests.length} verification{requests.length === 1 ? "" : "s"} waiting.
            </span>
          </h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-navy-foreground/70">
            <span className="flex items-center gap-1.5">
              <Users className="size-4 text-primary" /> {workers.length} registered workers
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquareWarning className="size-4 text-primary" /> {openComplaints} open complaints
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-primary text-primary" /> 4.72 platform rating
            </span>
          </p>
        </div>
      </header>

      <div className="mx-auto -mt-16 max-w-6xl px-5 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<BadgeCheck className="size-5" />} label="Active workers" value={String(activeWorkers)} />
          <StatCard icon={<FileCheck2 className="size-5" />} label="Pending verifications" value={String(requests.length)} />
          <StatCard icon={<Wallet className="size-5" />} label="Total payouts" value={currency(totalPayouts)} />
          <StatCard icon={<ShieldCheck className="size-5" />} label="Insurance gaps" value={String(insuranceGaps)} />
        </div>

        <Tabs defaultValue="workers" className="mt-10">
          <TabsList className="flex-wrap">
            <TabsTrigger value="workers">Workers</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="services">Services & pricing</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="welfare">Welfare & payments</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          {/* WORKERS */}
          <TabsContent value="workers" className="mt-6 space-y-8">
            <section>
              <h2 className="text-xl font-bold">Register a worker</h2>
              <Card className="mt-4">
                <CardContent className="grid gap-4 p-5 sm:grid-cols-4 sm:items-end">
                  <div className="space-y-2">
                    <Label>Full name</Label>
                    <Input
                      value={newWorker.name}
                      placeholder="e.g. Priya Nair"
                      onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Service</Label>
                    <Select
                      value={newWorker.service}
                      onValueChange={(v) => setNewWorker({ ...newWorker, service: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {servicesList.map((s) => (
                          <SelectItem key={s.id} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Locality</Label>
                    <Input
                      value={newWorker.city}
                      placeholder="e.g. Koramangala"
                      onChange={(e) => setNewWorker({ ...newWorker, city: e.target.value })}
                    />
                  </div>
                  <Button onClick={registerWorker} className="gap-2">
                    <UserPlus className="size-4" /> Register
                  </Button>
                </CardContent>
              </Card>
            </section>

            <section>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="text-xl font-bold">Worker roster</h2>
                <div className="flex flex-wrap items-end gap-3">
                  <Input
                    className="w-48"
                    placeholder="Search name or service"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["All", "Active", "Pending", "Suspended"].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {filtered.map((w) => (
                  <Card key={w.id} className="shadow-elevated">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-display font-semibold">{w.name}</p>
                            {w.verified ? (
                              <Badge className="gap-1 font-normal">
                                <BadgeCheck className="size-3" /> Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="font-normal">
                                Unverified
                              </Badge>
                            )}
                            <Badge
                              variant={w.status === "Suspended" ? "destructive" : "secondary"}
                              className="font-normal"
                            >
                              {w.status}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {w.service} · {w.city}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {w.jobs} jobs · {w.rating ? `${w.rating.toFixed(1)}★` : "no ratings"} ·{" "}
                            {currency(w.hourlyRate)}/hr · insurance {w.insurance.toLowerCase()}
                          </p>
                        </div>
                        <p className="font-display text-lg font-bold">{currency(w.earnings)}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {w.skills.map((s) => (
                          <button
                            key={s}
                            onClick={() => removeSkill(w.id, s)}
                            className="group inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
                            title="Remove skill"
                          >
                            {s}
                            <X className="size-3 opacity-50 group-hover:opacity-100" />
                          </button>
                        ))}
                        {w.certifications.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center gap-1 rounded-full border border-primary/50 px-3 py-1 text-xs text-muted-foreground"
                          >
                            <FileCheck2 className="size-3 text-primary" /> {c}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Input
                          className="h-9 w-40"
                          placeholder="Add skill"
                          value={skillDraft[w.id] ?? ""}
                          onChange={(e) =>
                            setSkillDraft((prev) => ({ ...prev, [w.id]: e.target.value }))
                          }
                          onKeyDown={(e) => e.key === "Enter" && addSkill(w.id)}
                        />
                        <Button size="sm" variant="secondary" onClick={() => addSkill(w.id)}>
                          Add
                        </Button>
                        {w.status === "Suspended" ? (
                          <Button size="sm" onClick={() => setWorkerStatus(w.id, "Active")}>
                            Reinstate
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => setWorkerStatus(w.id, "Suspended")}
                          >
                            <Ban className="size-3.5" /> Suspend
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-muted-foreground">No workers match this filter.</p>
                )}
              </div>
            </section>
          </TabsContent>

          {/* VERIFICATION */}
          <TabsContent value="verification" className="mt-6">
            <h2 className="text-xl font-bold">Verification requests</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {requests.map((r) => (
                <Card key={r.id} className="border-primary/40 shadow-gold">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display font-semibold">{r.workerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {r.service} · submitted {r.submitted}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {r.id} · {r.document}
                        </p>
                        {r.note && <p className="mt-2 text-sm">{r.note}</p>}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="gap-1" onClick={() => decideVerification(r, true)}>
                        <Check className="size-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => decideVerification(r, false)}
                      >
                        <X className="size-4" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {requests.length === 0 && (
                <p className="text-sm text-muted-foreground">All verifications are cleared.</p>
              )}
            </div>
          </TabsContent>

          {/* SERVICES */}
          <TabsContent value="services" className="mt-6">
            <h2 className="text-xl font-bold">Services & fair-wage ranges</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Suggested rates guide worker pricing and keep wages above the cooperative floor.
            </p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {servicesList.map((s) => (
                <Card key={s.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="flex items-center gap-2 font-display font-semibold">
                          <Wrench className="size-4 text-primary" /> {s.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{s.workers} workers listed</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`svc-${s.id}`} className="text-xs">
                          {s.active ? "Live" : "Paused"}
                        </Label>
                        <Switch
                          id={`svc-${s.id}`}
                          checked={s.active}
                          onCheckedChange={(v) => {
                            updateService(s.id, { active: v });
                            toast.success(`${s.name} ${v ? "is live" : "paused"}`);
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <RateInput
                        label="Floor"
                        value={s.minRate}
                        onChange={(v) => updateService(s.id, { minRate: v })}
                      />
                      <RateInput
                        label="Suggested"
                        value={s.suggestedRate}
                        onChange={(v) => updateService(s.id, { suggestedRate: v })}
                      />
                      <RateInput
                        label="Ceiling"
                        value={s.maxRate}
                        onChange={(v) => updateService(s.id, { maxRate: v })}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* BOOKINGS */}
          <TabsContent value="bookings" className="mt-6">
            <h2 className="text-xl font-bold">Bookings & service status</h2>
            <div className="mt-4 space-y-3">
              {coopBookings.map((b) => (
                <Card key={b.id}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div>
                      <p className="font-display font-semibold">
                        {b.service} · {b.customer}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {b.worker} · {b.date} · {b.slot}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{b.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          b.status === "Cancelled"
                            ? "destructive"
                            : b.status === "Completed"
                              ? "secondary"
                              : "default"
                        }
                        className="font-normal"
                      >
                        {b.status}
                      </Badge>
                      <Badge variant="outline" className="font-normal">
                        {b.payment}
                      </Badge>
                      <p className="font-display text-lg font-bold">{currency(b.amount)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* COMPLAINTS */}
          <TabsContent value="complaints" className="mt-6">
            <h2 className="text-xl font-bold">Customer & worker complaints</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {complaints.map((c) => (
                <Card key={c.id} className={c.status === "Resolved" ? "" : "border-primary/40"}>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="font-normal">
                        {c.from} complaint
                      </Badge>
                      <Badge
                        variant={c.status === "Resolved" ? "outline" : "default"}
                        className="font-normal"
                      >
                        {c.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {c.id} · {c.opened}
                      </span>
                    </div>
                    <p className="mt-3 font-display font-semibold">
                      {c.raisedBy} → {c.against}
                    </p>
                    <p className="text-xs text-muted-foreground">Booking {c.bookingId}</p>
                    <p className="mt-2 text-sm">{c.reason}</p>
                    {c.status !== "Resolved" && (
                      <Button size="sm" className="mt-4" onClick={() => advanceComplaint(c)}>
                        {c.status === "Open" ? "Start investigation" : "Mark resolved"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* WELFARE & PAYMENTS */}
          <TabsContent value="welfare" className="mt-6 space-y-8">
            <section>
              <h2 className="text-xl font-bold">Insurance & welfare status</h2>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {workers.map((w) => (
                  <Card key={w.id}>
                    <CardContent className="flex items-start gap-4 p-5">
                      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                        <HeartHandshake className="size-5" />
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-display font-semibold">{w.name}</p>
                          <Badge
                            variant={w.insurance === "Active" ? "secondary" : "destructive"}
                            className="font-normal"
                          >
                            {w.insurance}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {w.service} · pension {w.insurance === "Active" ? "matched 2%" : "not matched"}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {w.insurance === "Active"
                            ? "Accident cover $10,000 · health top-up active"
                            : "Needs enrolment before next payout cycle."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold">Payments & worker earnings</h2>
              <div className="mt-4 space-y-3">
                {workers.map((w) => (
                  <Card key={w.id}>
                    <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                      <div>
                        <p className="font-display font-semibold">{w.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {w.jobs} jobs · {currency(w.hourlyRate)}/hr · {w.service}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-bold">{currency(w.earnings)}</p>
                        <p className="text-xs text-muted-foreground">
                          co-op fee {currency(w.earnings * 0.08)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* STATS */}
          <TabsContent value="stats" className="mt-6">
            <h2 className="text-xl font-bold">Platform statistics</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {platformStats.map((s) => (
                <Card key={s.id} className="shadow-elevated">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {s.label}
                    </p>
                    <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="size-3.5 text-primary" /> {s.delta} vs last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <StatCard icon={<Users className="size-5" />} label="Registered workers" value={String(workers.length)} />
              <StatCard icon={<Activity className="size-5" />} label="Live services" value={String(servicesList.filter((s) => s.active).length)} />
              <StatCard icon={<MessageSquareWarning className="size-5" />} label="Open complaints" value={String(openComplaints)} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function RateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="shadow-elevated">
      <CardContent className="flex items-center gap-4 p-5">
        <span className="grid size-11 place-items-center rounded-lg bg-accent text-accent-foreground">
          {icon}
        </span>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
