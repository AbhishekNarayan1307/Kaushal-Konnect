import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  Clock,
  FileCheck2,
  HeartHandshake,
  Inbox,
  ShieldCheck,
  Star,
  Upload,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { currency } from "@/lib/dashboard-data";
import {
  initialDocs,
  initialRequests,
  initialWorkerBookings,
  weekDays,
  welfare,
  workerProfile,
  workerSlots,
  type JobRequest,
  type VerificationDoc,
  type WorkerBooking,
} from "@/lib/worker-data";

export const Route = createFileRoute("/worker")({
  head: () => ({
    meta: [
      { title: "Worker Dashboard | HomeHands Services" },
      {
        name: "description",
        content:
          "Manage your worker profile, skills and certifications, verification documents, working hours, booking requests, earnings and welfare status.",
      },
      { property: "og:title", content: "Worker Dashboard | HomeHands Services" },
      {
        property: "og:description",
        content:
          "Accept jobs, set your availability, track earnings and payouts, and check insurance and welfare benefits in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkerDashboard,
});

function WorkerDashboard() {
  const [profile, setProfile] = useState(workerProfile);
  const [skillInput, setSkillInput] = useState("");
  const [docs, setDocs] = useState<VerificationDoc[]>(initialDocs);
  const [requests, setRequests] = useState<JobRequest[]>(initialRequests);
  const [bookings, setBookings] = useState<WorkerBooking[]>(initialWorkerBookings);
  const [availableOnline, setAvailableOnline] = useState(true);
  const [days, setDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  const [slots, setSlots] = useState<string[]>(workerSlots.slice(0, 4));

  const verifiedCount = docs.filter((d) => d.status === "Verified").length;
  const earnings = bookings
    .filter((b) => b.payout === "Paid")
    .reduce((s, b) => s + b.amount, 0);
  const pending = bookings
    .filter((b) => b.payout === "Pending" && b.status !== "Rejected")
    .reduce((s, b) => s + b.amount, 0);
  const upcoming = bookings.filter((b) => b.status === "Upcoming");
  const avgRating = useMemo(() => {
    const rated = bookings.filter((b) => b.rating);
    if (rated.length === 0) return "—";
    return (rated.reduce((s, b) => s + (b.rating ?? 0), 0) / rated.length).toFixed(1);
  }, [bookings]);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const decide = (req: JobRequest, accept: boolean) => {
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    setBookings((prev) => [
      ...prev,
      {
        id: req.id.replace("RQ", "BK"),
        customer: req.customer,
        service: req.service,
        date: req.date,
        slot: req.slot,
        hours: req.hours,
        amount: req.amount,
        status: accept ? "Upcoming" : "Rejected",
        payout: accept ? "Pending" : "Pending",
      },
    ]);
    toast[accept ? "success" : "info"](accept ? "Booking accepted" : "Booking rejected", {
      description: `${req.customer} · ${req.date} · ${req.slot}`,
    });
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
                <p className="text-xs text-navy-foreground/60">Worker dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-xs uppercase tracking-widest text-navy-foreground/70 hover:text-primary"
              >
                Customer view
              </Link>
              <Link
                to="/coop"
                className="text-xs uppercase tracking-widest text-navy-foreground/70 hover:text-primary"
              >
                Co-op view
              </Link>
              <div className="flex items-center gap-2 rounded-full border border-navy-foreground/15 bg-navy-foreground/5 px-3 py-1.5">
                <Switch
                  id="online"
                  checked={availableOnline}
                  onCheckedChange={(v) => {
                    setAvailableOnline(v);
                    toast.success(v ? "You're accepting jobs" : "You're offline");
                  }}
                />
                <Label htmlFor="online" className="text-xs">
                  {availableOnline ? "Available" : "Offline"}
                </Label>
              </div>
            </div>
          </div>

          <h1 className="mt-10 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
            Welcome back, {profile.name.split(" ")[0]}.{" "}
            <span className="text-primary">{requests.length} new request{requests.length === 1 ? "" : "s"}.</span>
          </h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-navy-foreground/70">
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="size-4 text-primary" /> {profile.service} · {profile.city}
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-primary text-primary" /> {avgRating} average rating
            </span>
          </p>
        </div>
      </header>

      <div className="mx-auto -mt-16 max-w-6xl px-5 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Inbox className="size-5" />} label="Job requests" value={String(requests.length)} />
          <StatCard icon={<CalendarDays className="size-5" />} label="Upcoming jobs" value={String(upcoming.length)} />
          <StatCard icon={<Wallet className="size-5" />} label="Earnings paid" value={currency(earnings)} />
          <StatCard icon={<ShieldCheck className="size-5" />} label="Docs verified" value={`${verifiedCount}/${docs.length}`} />
        </div>

        <Tabs defaultValue="jobs" className="mt-10">
          <TabsList className="flex-wrap">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="profile">Profile & skills</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="welfare">Welfare</TabsTrigger>
          </TabsList>

          {/* JOBS */}
          <TabsContent value="jobs" className="mt-6 space-y-8">
            <section>
              <h2 className="text-xl font-bold">Incoming booking requests</h2>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {requests.map((r) => (
                  <Card key={r.id} className="border-primary/40 shadow-gold">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-display font-semibold">{r.customer}</p>
                          <p className="text-sm text-muted-foreground">
                            {r.service} · {r.date} · {r.slot}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {r.id} · {r.address} · {r.hours} hr
                          </p>
                          {r.note && <p className="mt-2 text-sm">{r.note}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-display text-xl font-bold">{currency(r.amount)}</p>
                          <p className="text-xs text-muted-foreground">payout</p>
                        </div>
                      </div>
                      <div className="mt-5 flex gap-2">
                        <Button className="flex-1" onClick={() => decide(r, true)}>
                          <Check className="mr-1 size-4" /> Accept
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => decide(r, false)}>
                          <X className="mr-1 size-4" /> Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {requests.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No pending requests. New jobs appear here while you're available.
                  </p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold">Upcoming & completed bookings</h2>
              <div className="mt-4 space-y-4">
                {[...bookings].reverse().map((b) => (
                  <Card key={b.id}>
                    <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                      <div className="min-w-52">
                        <div className="flex items-center gap-2">
                          <p className="font-display font-semibold">{b.customer}</p>
                          <Badge
                            variant={b.status === "Upcoming" ? "default" : "secondary"}
                            className="font-normal"
                          >
                            {b.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {b.service} · {b.date} · {b.slot} · {b.hours} hr
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {b.id} · payout {b.payout} · {currency(b.amount)}
                        </p>
                        {b.rating && (
                          <p className="mt-2 flex items-center gap-1 text-sm">
                            <Star className="size-4 fill-primary text-primary" /> {b.rating}/5 from customer
                          </p>
                        )}
                      </div>
                      {b.status === "Upcoming" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setBookings((prev) =>
                              prev.map((x) =>
                                x.id === b.id ? { ...x, status: "Completed", payout: "Paid" } : x,
                              ),
                            );
                            toast.success("Job marked complete", { description: "Payout released to your wallet." });
                          }}
                        >
                          <Check className="mr-1 size-4" /> Mark complete
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* AVAILABILITY */}
          <TabsContent value="availability" className="mt-6 space-y-6">
            <Card>
              <CardContent className="space-y-6 p-6">
                <div>
                  <h2 className="text-xl font-bold">Working days</h2>
                  <p className="text-sm text-muted-foreground">Pick the days you take jobs on.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {weekDays.map((d) => {
                      const on = days.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggle(days, setDays, d)}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                            on
                              ? "border-primary bg-gradient-gold text-primary-foreground shadow-gold"
                              : "border-border bg-card hover:border-primary/50"
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold">Available slots</h2>
                  <p className="text-sm text-muted-foreground">Customers can only book these windows.</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {workerSlots.map((s) => {
                      const on = slots.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggle(slots, setSlots, s)}
                          className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm transition-all ${
                            on
                              ? "border-primary bg-accent text-accent-foreground"
                              : "border-border bg-card text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          <Clock className="size-4 text-primary" /> {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  className="shadow-gold"
                  onClick={() =>
                    toast.success("Availability saved", {
                      description: `${days.length} days · ${slots.length} slots per day`,
                    })
                  }
                >
                  Save availability
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROFILE */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            <Card>
              <CardContent className="space-y-5 p-6">
                <h2 className="text-xl font-bold">Profile details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
                  <Field label="Headline" value={profile.headline} onChange={(v) => setProfile({ ...profile, headline: v })} />
                  <Field label="Service category" value={profile.service} onChange={(v) => setProfile({ ...profile, service: v })} />
                  <Field label="Service area" value={profile.city} onChange={(v) => setProfile({ ...profile, city: v })} />
                  <Field label="Phone" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Rate / hour"
                      value={String(profile.hourlyRate)}
                      onChange={(v) => setProfile({ ...profile, hourlyRate: Number(v) || 0 })}
                    />
                    <Field
                      label="Experience (yrs)"
                      value={String(profile.experienceYears)}
                      onChange={(v) => setProfile({ ...profile, experienceYears: Number(v) || 0 })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">About you</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>
                <Button className="shadow-gold" onClick={() => toast.success("Profile updated")}>
                  Save profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-6">
                <h2 className="text-xl font-bold">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="gap-1 font-normal">
                      {s}
                      <button
                        type="button"
                        aria-label={`Remove ${s}`}
                        onClick={() =>
                          setProfile({ ...profile, skills: profile.skills.filter((x) => x !== s) })
                        }
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill, e.g. Carpet shampoo"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const v = skillInput.trim();
                      if (!v || profile.skills.includes(v)) return;
                      setProfile({ ...profile, skills: [...profile.skills, v] });
                      setSkillInput("");
                    }}
                  >
                    Add
                  </Button>
                </div>

                <h2 className="pt-2 text-xl font-bold">Certifications</h2>
                <div className="space-y-3">
                  {profile.certifications.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                          <FileCheck2 className="size-5" />
                        </span>
                        <div>
                          <p className="font-display font-semibold">{c.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {c.issuer} · {c.year}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-normal">
                        Verified
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    const id = `c${profile.certifications.length + 1}`;
                    setProfile({
                      ...profile,
                      certifications: [
                        ...profile.certifications,
                        { id, name: "New certification", issuer: "Pending issuer", year: 2026 },
                      ],
                    });
                    toast.success("Certification added", { description: "Upload the document to verify it." });
                  }}
                >
                  <Upload className="mr-1 size-4" /> Add certification
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VERIFICATION */}
          <TabsContent value="verification" className="mt-6">
            <Card>
              <CardContent className="space-y-4 p-6">
                <div>
                  <h2 className="text-xl font-bold">Verification documents</h2>
                  <p className="text-sm text-muted-foreground">
                    {verifiedCount} of {docs.length} documents verified. Full verification unlocks premium jobs.
                  </p>
                </div>
                <div className="space-y-3">
                  {docs.map((d) => (
                    <div
                      key={d.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-4"
                    >
                      <div>
                        <p className="font-display font-semibold">{d.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {d.fileName ?? "No file uploaded yet"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={d.status === "Verified" ? "default" : "secondary"}
                          className="font-normal"
                        >
                          {d.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDocs((prev) =>
                              prev.map((x) =>
                                x.id === d.id
                                  ? {
                                      ...x,
                                      status: "Under review",
                                      fileName: `${d.label.toLowerCase().replace(/\s+/g, "-")}.pdf`,
                                    }
                                  : x,
                              ),
                            );
                            toast.success("Document uploaded", {
                              description: "Our team reviews documents within 48 hours.",
                            });
                          }}
                        >
                          <Upload className="mr-1 size-4" /> {d.fileName ? "Replace" : "Upload"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EARNINGS */}
          <TabsContent value="earnings" className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard icon={<Wallet className="size-5" />} label="Paid out" value={currency(earnings)} />
              <StatCard icon={<Clock className="size-5" />} label="Pending payout" value={currency(pending)} />
              <StatCard
                icon={<CalendarDays className="size-5" />}
                label="Jobs completed"
                value={String(bookings.filter((b) => b.status === "Completed").length)}
              />
            </div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold">Payment history</h2>
                <div className="mt-4 divide-y divide-border">
                  {[...bookings]
                    .filter((b) => b.status !== "Rejected")
                    .reverse()
                    .map((b) => (
                      <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <div>
                          <p className="font-medium">
                            {b.customer} · {b.service}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {b.id} · {b.date} · {b.hours} hr
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={b.payout === "Paid" ? "default" : "secondary"} className="font-normal">
                            {b.payout}
                          </Badge>
                          <p className="font-display text-lg font-bold">{currency(b.amount)}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WELFARE */}
          <TabsContent value="welfare" className="mt-6">
            <h2 className="text-xl font-bold">Insurance & welfare</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {welfare.map((w) => (
                <Card key={w.id}>
                  <CardContent className="flex items-start gap-4 p-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                      <HeartHandshake className="size-5" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display font-semibold">{w.label}</p>
                        <Badge variant="secondary" className="font-normal">
                          {w.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{w.provider}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{w.detail}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
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
