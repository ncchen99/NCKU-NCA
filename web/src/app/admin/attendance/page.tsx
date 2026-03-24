"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PlusIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  AdminPageHeader,
  FormModal,
  FormField,
  ConfirmDialog,
  AdminEmptyState,
  AdminErrorState,
} from "@/components/admin/shared";
import { formatTimestamp, formatTime, adminFetch } from "@/lib/admin-utils";

type FilterStatus = "all" | "upcoming" | "open" | "closed";

interface AttendanceEvent {
  id: string;
  title: string;
  description?: string;
  status: "upcoming" | "open" | "closed";
  expected_clubs: string[];
  opens_at: { _seconds: number } | string;
  closes_at: { _seconds: number } | string;
  created_by: string;
}

interface EventWithStats extends AttendanceEvent {
  checkedIn: number;
}

interface EventFormData {
  title: string;
  description: string;
  status: string;
  opens_at: string;
  closes_at: string;
  expected_clubs: string;
}

const initialForm: EventFormData = {
  title: "",
  description: "",
  status: "upcoming",
  opens_at: "",
  closes_at: "",
  expected_clubs: "",
};

const tabs: { key: FilterStatus; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "open", label: "進行中" },
  { key: "upcoming", label: "即將開始" },
  { key: "closed", label: "已結束" },
];

const statusConfig: Record<
  string,
  { variant: "success" | "neutral" | "primary"; label: string }
> = {
  open: { variant: "success", label: "進行中" },
  upcoming: { variant: "primary", label: "即將開始" },
  closed: { variant: "neutral", label: "已結束" },
};

const nextStatusAction: Record<
  string,
  { next: string; label: string; confirmTitle: string; confirmDesc: string }
> = {
  upcoming: {
    next: "open",
    label: "開始點名",
    confirmTitle: "開始點名",
    confirmDesc: "確定要開放此點名活動？開放後社團即可進行簽到。",
  },
  open: {
    next: "closed",
    label: "結束點名",
    confirmTitle: "結束點名",
    confirmDesc: "確定要關閉此點名活動？關閉後社團將無法繼續簽到。",
  },
};

function tsToDatetimeLocal(
  ts: { _seconds: number } | string | undefined,
): string {
  if (!ts) return "";
  const date =
    typeof ts === "string" ? new Date(ts) : new Date(ts._seconds * 1000);
  if (isNaN(date.getTime())) return "";
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<FilterStatus>("all");
  const [events, setEvents] = useState<EventWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AttendanceEvent | null>(
    null,
  );
  const [form, setForm] = useState<EventFormData>(initialForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [statusConfirm, setStatusConfirm] = useState<{
    event: EventWithStats;
    action: (typeof nextStatusAction)[string];
  } | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { events: data } = await adminFetch<{
        events: AttendanceEvent[];
      }>("/api/admin/attendance");

      const withStats: EventWithStats[] = data.map((e) => ({
        ...e,
        checkedIn: 0,
      }));

      const needStats = data.filter((e) => e.status !== "upcoming");
      const results = await Promise.allSettled(
        needStats.map((e) =>
          adminFetch<{ stats: { total: number; checkedIn: number } }>(
            `/api/admin/attendance/${e.id}`,
          ),
        ),
      );

      const statsMap = new Map<string, number>();
      needStats.forEach((e, i) => {
        const r = results[i];
        if (r.status === "fulfilled") {
          statsMap.set(e.id, r.value.stats.checkedIn);
        }
      });

      setEvents(
        withStats.map((e) => ({
          ...e,
          checkedIn: statsMap.get(e.id) ?? 0,
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "載入點名活動失敗");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filtered = events.filter(
    (e) => activeTab === "all" || e.status === activeTab,
  );

  function openCreateModal() {
    setEditingEvent(null);
    setForm(initialForm);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(event: EventWithStats) {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description ?? "",
      status: event.status,
      opens_at: tsToDatetimeLocal(event.opens_at),
      closes_at: tsToDatetimeLocal(event.closes_at),
      expected_clubs: event.expected_clubs.join("\n"),
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit() {
    setFormError(null);

    if (!form.title.trim()) {
      setFormError("請輸入活動名稱");
      return;
    }
    if (!form.opens_at || !form.closes_at) {
      setFormError("請設定開始與結束時間");
      return;
    }

    const clubs = form.expected_clubs
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const body = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      status: form.status,
      expected_clubs: clubs,
      opens_at: new Date(form.opens_at).toISOString(),
      closes_at: new Date(form.closes_at).toISOString(),
    };

    setFormLoading(true);
    try {
      if (editingEvent) {
        await adminFetch(`/api/admin/attendance/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await adminFetch<{ id: string }>("/api/admin/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setModalOpen(false);
      await fetchEvents();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "操作失敗");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleStatusToggle() {
    if (!statusConfirm) return;
    setStatusLoading(true);
    try {
      await adminFetch(`/api/admin/attendance/${statusConfirm.event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusConfirm.action.next }),
      });
      setStatusConfirm(null);
      await fetchEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : "狀態變更失敗");
      setStatusConfirm(null);
    } finally {
      setStatusLoading(false);
    }
  }

  function updateForm(field: keyof EventFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <>
      <AdminPageHeader
        title="點名管理"
        count={events.length}
        action={
          <Button onClick={openCreateModal}>
            <PlusIcon className="h-4 w-4" />
            建立點名活動
          </Button>
        }
      />

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

      {loading ? (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-5">
              <div className="animate-pulse space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-40 rounded bg-neutral-200" />
                  <div className="h-5 w-16 rounded-full bg-neutral-200" />
                </div>
                <div className="mt-4 space-y-2.5">
                  <div className="h-3.5 w-48 rounded bg-neutral-100" />
                  <div className="h-3.5 w-32 rounded bg-neutral-100" />
                  <div className="h-3.5 w-36 rounded bg-neutral-100" />
                </div>
                <div className="mt-4 h-1.5 rounded-full bg-neutral-100" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="mt-4">
          <AdminErrorState message={error} onRetry={fetchEvents} />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => {
            const badge = statusConfig[event.status];
            const total = event.expected_clubs.length;
            const rate =
              total > 0 ? Math.round((event.checkedIn / total) * 100) : 0;
            const action = nextStatusAction[event.status];

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
                    {formatTimestamp(event.opens_at)}{" "}
                    {formatTime(event.opens_at)}–{formatTime(event.closes_at)}
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <UserGroupIcon className="h-4 w-4 text-neutral-400" />
                    預計 {total} 社團
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <CheckCircleIcon className="h-4 w-4 text-neutral-400" />
                    已簽到 {event.checkedIn} / {total}
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

                <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                  <button
                    type="button"
                    onClick={() => openEditModal(event)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <PencilSquareIcon className="h-3.5 w-3.5" />
                    編輯
                  </button>
                  {action && (
                    <button
                      type="button"
                      onClick={() => setStatusConfirm({ event, action })}
                      className="ml-auto text-xs font-medium text-amber-600 hover:underline"
                    >
                      {action.label}
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full">
              <AdminEmptyState message="沒有符合條件的點名活動" />
            </div>
          )}
        </div>
      )}

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingEvent ? "編輯點名活動" : "建立點名活動"}
        submitLabel={editingEvent ? "儲存變更" : "建立"}
        loading={formLoading}
      >
        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {formError}
          </div>
        )}
        <FormField
          label="活動名稱"
          required
          value={form.title}
          onChange={(e) => updateForm("title", e.target.value)}
          placeholder="例：第一次社長大會出席點名"
        />
        <FormField
          label="說明"
          as="textarea"
          value={form.description}
          onChange={(e) => updateForm("description", e.target.value)}
          placeholder="活動說明（選填）"
        />
        <FormField
          label="狀態"
          as="select"
          value={form.status}
          onChange={(e) => updateForm("status", e.target.value)}
          options={[
            { value: "upcoming", label: "即將開始" },
            { value: "open", label: "進行中" },
            { value: "closed", label: "已結束" },
          ]}
        />
        <FormField
          label="開始時間"
          required
          type="datetime-local"
          value={form.opens_at}
          onChange={(e) => updateForm("opens_at", e.target.value)}
        />
        <FormField
          label="結束時間"
          required
          type="datetime-local"
          value={form.closes_at}
          onChange={(e) => updateForm("closes_at", e.target.value)}
        />
        <FormField
          label="預計參加社團"
          as="textarea"
          value={form.expected_clubs}
          onChange={(e) => updateForm("expected_clubs", e.target.value)}
          hint="輸入社團 ID，每行一個"
          placeholder={"club_001\nclub_002\nclub_003"}
        />
      </FormModal>

      <ConfirmDialog
        open={!!statusConfirm}
        onClose={() => setStatusConfirm(null)}
        onConfirm={handleStatusToggle}
        title={statusConfirm?.action.confirmTitle ?? ""}
        description={statusConfirm?.action.confirmDesc}
        confirmLabel="確認"
        loading={statusLoading}
      />
    </>
  );
}
