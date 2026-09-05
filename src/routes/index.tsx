import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Hammer,
  MapPin,
  MessageSquareWarning,
  Paintbrush,
  Receipt,
  Refrigerator,
  Search,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from "lucide-react";

import { BookingFlow, ReviewDialog } from "@/components/dashboard/BookingFlow";
import { ComplaintDialog } from "@/components/dashboard/ComplaintDialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  currency,
  initialBookings,
  services,
  workers,
  type Booking,
  type Worker,
} from "@/lib/dashboard-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Customer Dashboard | HomeHands Services" },
      {
        name: "description",
        content:
          "Browse home services, compare verified workers by rating, price and distance, book a time slot, pay securely and manage your bookings.",
      },
      { property: "og:title", content: "Customer Dashboard | HomeHands Services" },
      {
        property: "og:description",
        content:
          "Book verified home-service professionals near you, pay securely and track every booking in one dashboard.",
      },
    ],
  }),
  component: CustomerDashboard,
});

const icons = { Sparkles, Wrench, Zap, Paintbrush, Hammer, Refrigerator };

function CustomerDashboard() {
  const [location, setLocation] = useState("Koramangala, Bengaluru");
  const [serviceId, setServiceId] = useState("cleaning");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("rating");
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [bookingWorker, setBookingWorker] = useState<Worker | null>(null);
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [complaintTarget, setComplaintTarget] = useState<Booking | null>(null);

  const activeService = services.find((s) => s.id === serviceId)!;

  const visibleWorkers = useMemo(() => {
    const list = workers.filter(
      (w) =>
        w.serviceId === serviceId &&
        (query.trim() === "" ||
          w.name.toLowerCase().includes(query.toLowerCase()) ||
          w.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()))),
    );
    return [...list].sort((a, b) => {
      if (sort === "price") return a.pricePerHour - b.pricePerHour;
      if (sort === "distance") return a.distanceKm - b.distanceKm;
      return b.rating - a.rating;
    });
  }, [serviceId, query, sort]);

  const upcoming = bookings.filter((b) => b.status === "Upcoming");
  const spent = bookings.reduce((sum, b) => sum + (b.paid ? b.amount : 0), 0);

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
                <p className="text-xs text-navy-foreground/60">Customer dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/worker"
                className="text-xs uppercase tracking-widest text-navy-foreground/70 hover:text-primary"
              >
                Worker view
              </Link>
              <Link
                to="/coop"
                className="text-xs uppercase tracking-widest text-navy-foreground/70 hover:text-primary"
              >
                Co-op view
              </Link>
              <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
                <BadgeCheck className="mr-1 size-3.5" /> Verified workers only
              </Badge>
            </div>
          </div>

          <h1 className="mt-10 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
            Good evening, Dyllan. <span className="text-primary">What needs fixing?</span>
          </h1>

          <div className="mt-8 grid gap-3 sm:grid-cols-[1.2fr_1fr_auto]">
            <div className="space-y-1.5">
              <Label htmlFor="loc" className="text-xs uppercase tracking-widest text-navy-foreground/60">
                Your location
              </Label>
              <div className="relative">
                <MapPin className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-primary" />
                <Input
                  id="loc"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your address or area"
                  className="border-navy-foreground/15 bg-navy-foreground/5 pl-9 text-navy-foreground placeholder:text-navy-foreground/40"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q" className="text-xs uppercase tracking-widest text-navy-foreground/60">
                Search worker or skill
              </Label>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-primary" />
                <Input
                  id="q"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. deep clean"
                  className="border-navy-foreground/15 bg-navy-foreground/5 pl-9 text-navy-foreground placeholder:text-navy-foreground/40"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button className="w-full shadow-gold sm:w-auto">Find workers</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto -mt-16 max-w-6xl px-5 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={<CalendarDays className="size-5" />} label="Upcoming bookings" value={String(upcoming.length)} />
          <StatCard icon={<Receipt className="size-5" />} label="Total spent" value={currency(spent)} />
          <StatCard icon={<Star className="size-5" />} label="Reviews given" value={String(bookings.filter((b) => b.rating).length)} />
        </div>

        <Tabs defaultValue="browse" className="mt-10">
          <TabsList>
            <TabsTrigger value="browse">Browse & book</TabsTrigger>
            <TabsTrigger value="history">Booking history</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6 space-y-8">
            <section>
              <h2 className="text-xl font-bold">Available services</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((s) => {
                  const Icon = icons[s.icon as keyof typeof icons];
                  const active = s.id === serviceId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setServiceId(s.id)}
                      className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                        active
                          ? "border-primary bg-accent shadow-gold"
                          : "border-border bg-card hover:border-primary/50 hover:shadow-elevated"
                      }`}
                    >
                      <span
                        className={`grid size-11 shrink-0 place-items-center rounded-lg ${
                          active ? "bg-gradient-gold text-primary-foreground" : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        <Icon className="size-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display font-semibold">{s.name}</span>
                        <span className="block truncate text-sm text-muted-foreground">
                          {s.blurb} · from {currency(s.from)}/hr
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">
                    {activeService.name} near {location.split(",")[0] || "you"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {visibleWorkers.length} verified worker
                    {visibleWorkers.length === 1 ? "" : "s"} available
                  </p>
                </div>
                <div className="w-44">
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Top rated</SelectItem>
                      <SelectItem value="price">Lowest price</SelectItem>
                      <SelectItem value="distance">Nearest first</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {visibleWorkers.map((w) => (
                  <Card key={w.id} className="border-border transition-shadow hover:shadow-elevated">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="grid size-12 place-items-center rounded-full bg-secondary font-display text-lg font-bold text-secondary-foreground">
                            {w.name.charAt(0)}
                          </span>
                          <div>
                            <p className="flex items-center gap-1.5 font-display font-semibold">
                              {w.name}
                              {w.verified && <BadgeCheck className="size-4 text-primary" />}
                            </p>
                            <p className="text-xs text-muted-foreground">{w.jobs} jobs completed</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-xl font-bold">{currency(w.pricePerHour)}</p>
                          <p className="text-xs text-muted-foreground">per hour</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                        <span className="flex items-center gap-1 font-medium">
                          <Star className="size-4 fill-primary text-primary" />
                          {w.rating.toFixed(1)}
                          <span className="text-muted-foreground">({w.reviews})</span>
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="size-4 text-primary" />
                          {w.distanceKm} km away
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {w.skills.map((s) => (
                          <Badge key={s} variant="secondary" className="font-normal">
                            {s}
                          </Badge>
                        ))}
                      </div>

                      <Button className="mt-5 w-full" onClick={() => setBookingWorker(w)}>
                        Select date & book
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {visibleWorkers.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No workers match that search for {activeService.name}.
                  </p>
                )}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <h2 className="text-xl font-bold">Your bookings</h2>
            <div className="mt-4 space-y-4">
              {[...bookings].reverse().map((b) => (
                <Card key={b.id}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div className="min-w-52">
                      <div className="flex items-center gap-2">
                        <p className="font-display font-semibold">{b.serviceName}</p>
                        <Badge
                          variant={b.status === "Upcoming" ? "default" : "secondary"}
                          className="font-normal"
                        >
                          {b.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {b.workerName} · {b.date} · {b.slot} · {b.hours} hr
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {b.id} · {b.paid ? "Paid" : "Payment pending"} {currency(b.amount)}
                      </p>
                      {b.rating && (
                        <p className="mt-2 flex items-center gap-1 text-sm">
                          <Star className="size-4 fill-primary text-primary" />
                          {b.rating}/5 {b.review && <span className="text-muted-foreground">— {b.review}</span>}
                        </p>
                      )}
                      {b.complaint && (
                        <p className="mt-2 text-sm text-destructive">Complaint: {b.complaint}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => setReviewTarget(b)}>
                        <Star className="mr-1 size-4" /> {b.rating ? "Edit review" : "Rate & review"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setComplaintTarget(b)}>
                        <MessageSquareWarning className="mr-1 size-4" /> Raise complaint
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BookingFlow
        worker={bookingWorker}
        serviceName={activeService.name}
        location={location}
        onClose={() => setBookingWorker(null)}
        onConfirm={(b) => setBookings((prev) => [...prev, b])}
      />
      <ReviewDialog
        booking={reviewTarget}
        onClose={() => setReviewTarget(null)}
        onSubmit={(id, rating, review) =>
          setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, rating, review } : b)))
        }
      />
      <ComplaintDialog
        booking={complaintTarget}
        onClose={() => setComplaintTarget(null)}
        onSubmit={(id, complaint) =>
          setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, complaint } : b)))
        }
      />
    </main>
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
