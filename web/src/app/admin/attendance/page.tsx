"use client";

import { useState } from "react";
import {
  PlusIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type EventStatus = "all" | "upcoming" | "open" | "closed";

interface MockEvent {
  id: string;
  title: string;
  status: "upcoming" | "open" | "closed";
  expectedClubs: number;
  checkedIn: number;
  date: string;
  opensAt: string;
  closesAt: string;
}

const mockEvents: MockEvent[] = [
  { id: "1", title: "113-2 第一次社長大會", status: "open", expectedClubs: 127, checkedIn: 104, date: "2026-03-24", opensAt: "18:00", closesAt: "20:00" },
  { id: "2", title: "113-2 第二次社長大會", status: "upcoming", expectedClubs: 127, checkedIn: 0, date: "2026-04-14", opensAt: "18:00", closesAt: "20:00" },
  { id: "3", title: "社團博覽會場地說明會", status: "upcoming", expectedClubs: 90, checkedIn: 0, date: "2026-04-20", opensAt: "14:00", closesAt: "16:00" },
  { id: "4", title: "113-1 第四次社長大會", status: "closed", expectedClubs: 125, checkedIn: 108, date: "2026-01-06", opensAt: "18:00", closesAt: "20:00" },
  { id: "5", title: "113-1 第三次社長大會", status: "closed", expectedClubs: 125, checkedIn: 100, date: "2025-12-02", opensAt: "18:00", closesAt: "20:00" },
  { id: "6", title: "113-1 第二次社長大會", status: "closed", expectedClubs: 125, checkedIn: 95, date: "2025-11-04", opensAt: "18:00", closesAt: "20:00" },
];

const tabs: { key: EventStatus; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "open", label: "進行中" },
  { key: "upcoming", label: "即將開始" },
  { key: "closed", label: "已結束" },
];

const statusConfig: Record<string, { variant: "success" | "neutral" | "primary"; label: string }> = {
  open: { variant: "success", label: "進行中" },
  upcoming: { variant: "primary", label: "即將開始" },
  closed: { variant: "neutral", label: "已結束" },
};

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<EventStatus>("all");

  const filtered = mockEvents.filter((e) => {
    if (activeTab !== "all" && e.status !== activeTab) return false;
    return true;
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
          點名管理
        </h1>
        <Button>
          <PlusIcon className="h-4 w-4" />
          建立點名活動
        </Button>
      </div>

      <div className="mt-6 flex gap-1">
        {tabs.map((t) => (
          <Button
            key={t.key}
            variant="pill"
            size="sm"
            active={activeTab === t.key}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((event) => {
          const badge = statusConfig[event.status];
          const rate =
            event.expectedClubs > 0
              ? Math.round((event.checkedIn / event.expectedClubs) * 100)
              : 0;
          return (
            <Card key={event.id} hoverable className="p-5">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-neutral-950">
                  {event.title}
                </h3>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>

              <div className="mt-4 space-y-2.5 text-[13px]">
                <div className="flex items-center gap-2 text-neutral-600">
                  <CalendarDaysIcon className="h-4 w-4 text-neutral-400" />
                  {event.date} {event.opensAt}–{event.closesAt}
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <UserGroupIcon className="h-4 w-4 text-neutral-400" />
                  預計 {event.expectedClubs} 社團
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <CheckCircleIcon className="h-4 w-4 text-neutral-400" />
                  已簽到 {event.checkedIn} / {event.expectedClubs}
                </div>
              </div>

              {event.status !== "upcoming" && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-neutral-500">出席率</span>
                    <span className="font-semibold text-neutral-950">
                      {rate}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              )}

              {event.status === "upcoming" && (
                <div className="mt-4 flex items-center gap-1.5 text-[12px] text-neutral-400">
                  <ClockIcon className="h-3.5 w-3.5" />
                  尚未開始
                </div>
              )}
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-sm text-neutral-400">
            沒有符合條件的點名活動
          </div>
        )}
      </div>
    </>
  );
}
