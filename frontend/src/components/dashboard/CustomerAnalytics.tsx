import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Booking } from "@/lib/dashboard-data";
import { type User } from "@/hooks/use-auth";
import { Mail, Phone, MapPin, Wallet, ClipboardList } from "lucide-react";
import { currency } from "@/lib/dashboard-data";

interface CustomerAnalyticsProps {
  bookings: Booking[];
  user: User | null;
}

export function CustomerAnalytics({ bookings, user }: CustomerAnalyticsProps) {
  // 1. Aggregate Spend per Service
  const spendData = useMemo(() => {
    const map: Record<string, number> = {};
    bookings.forEach((b) => {
      map[b.serviceName] = (map[b.serviceName] || 0) + b.amount;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [bookings]);

  // 2. Aggregate Status Distribution
  const statusData = useMemo(() => {
    const map: Record<string, number> = {};
    bookings.forEach((b) => {
      map[b.status] = (map[b.status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [bookings]);

  return (
    <div className="space-y-6">
      {/* User Details Section */}
      {user && (
        <Card className="overflow-hidden border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid size-16 place-items-center rounded-full bg-gradient-gold text-2xl font-bold text-primary-foreground shadow-gold">
                  {user.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold leading-none">
                    {user.full_name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Verified Customer
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-primary" />
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-primary" />
                  <span className="text-muted-foreground">{user.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 text-primary" />
                  <span className="text-muted-foreground">{user.zone || "Not provided"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Spend per Service - Numeric/Text Form */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Wallet className="size-5 text-primary" />
            <CardTitle className="font-display text-lg font-bold">
              Spending Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {spendData.length > 0 ? (
              <div className="space-y-3">
                {spendData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="font-mono font-bold text-sm">{currency(item.value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No spending data available.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Booking Status - Numeric/Text Form */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <ClipboardList className="size-5 text-primary" />
            <CardTitle className="font-display text-lg font-bold">
              Booking Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <div className="space-y-3">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="font-mono font-bold text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No booking data available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
