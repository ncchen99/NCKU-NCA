"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  AdminPageHeader,
  AdminFilterBar,
  AdminTableSkeleton,
  AdminErrorState,
  AdminEmptyState,
  ConfirmDialog,
  FormModal,
  FormField,
  type TabItem,
} from "@/components/admin/shared";
import { formatTimestamp, adminFetch } from "@/lib/admin-utils";

type DepositStatus = "all" | "pending_payment" | "paid" | "returned";

interface DepositRecord {
  id: string;
  club_id: string;
  form_response_id?: string;
  status: "pending_payment" | "paid" | "returned";
  amount: number;
  paid_at?: unknown;
  returned_at?: unknown;
  notes?: string;
  updated_by: string;
}

const tabs: TabItem<DepositStatus>[] = [
  { key: "all", label: "全部" },
  { key: "pending_payment", label: "待繳" },
  { key: "paid", label: "已繳" },
  { key: "returned", label: "已退還" },
];

const statusConfig: Record<
  string,
  { variant: "warning" | "success" | "neutral"; label: string }
> = {
  pending_payment: { variant: "warning", label: "待繳" },
  paid: { variant: "success", label: "已繳" },
  returned: { variant: "neutral", label: "已退還" },
};

export default function DepositPage() {
  const [activeTab, setActiveTab] = useState<DepositStatus>("all");
  const [search, setSearch] = useState("");
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // single status change
  const [confirmTarget, setConfirmTarget] = useState<{
    id: string;
    newStatus: "paid" | "returned";
    clubId: string;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // batch
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [batchConfirm, setBatchConfirm] = useState<{
    status: "paid" | "returned";
  } | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);

  // notes editing
  const [notesTarget, setNotesTarget] = useState<{
    id: string;
    notes: string;
  } | null>(null);
  const [notesLoading, setNotesLoading] = useState(false);

  const fetchDeposits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetch<DepositRecord[]>("/api/admin/deposits");
      setDeposits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "載入資料時發生錯誤");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  // --- single update ---
  const handleConfirmStatus = async () => {
    if (!confirmTarget) return;
    setConfirmLoading(true);
    try {
      await adminFetch("/api/admin/deposits", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: confirmTarget.id,
          status: confirmTarget.newStatus,
        }),
      });
      setConfirmTarget(null);
      await fetchDeposits();
    } catch (err) {
      alert(err instanceof Error ? err.message : "操作失敗，請稍後再試");
    } finally {
      setConfirmLoading(false);
    }
  };

  // --- batch update ---
  const handleBatchConfirm = async () => {
    if (!batchConfirm || selected.size === 0) return;
    setBatchLoading(true);
    try {
      await adminFetch("/api/admin/deposits/batch", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: Array.from(selected),
          status: batchConfirm.status,
        }),
      });
      setBatchConfirm(null);
      setSelected(new Set());
      await fetchDeposits();
    } catch (err) {
      alert(err instanceof Error ? err.message : "批次操作失敗");
    } finally {
      setBatchLoading(false);
    }
  };

  // --- notes save ---
  const handleNotesSave = async () => {
    if (!notesTarget) return;
    setNotesLoading(true);
    try {
      await adminFetch("/api/admin/deposits", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: notesTarget.id,
          notes: notesTarget.notes,
        }),
      });
      setNotesTarget(null);
      await fetchDeposits();
    } catch (err) {
      alert(err instanceof Error ? err.message : "備註更新失敗");
    } finally {
      setNotesLoading(false);
    }
  };

  const filtered = deposits.filter((d) => {
    if (activeTab !== "all" && d.status !== activeTab) return false;
    if (search && !d.club_id.includes(search)) return false;
    return true;
  });

  const pendingTotal = deposits
    .filter((d) => d.status === "pending_payment")
    .reduce((sum, d) => sum + d.amount, 0);

  // checkbox helpers
  const allFilteredSelected =
    filtered.length > 0 && filtered.every((d) => selected.has(d.id));

  const toggleAll = () => {
    if (allFilteredSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((d) => d.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedPendingCount = filtered.filter(
    (d) => selected.has(d.id) && d.status === "pending_payment",
  ).length;
  const selectedPaidCount = filtered.filter(
    (d) => selected.has(d.id) && d.status === "paid",
  ).length;

  return (
    <>
      <AdminPageHeader
        title="保證金管理"
        subtitle={
          !loading && !error
            ? `待繳總額 $${pendingTotal.toLocaleString()}`
            : undefined
        }
      />

      <Card className="mt-6">
        <AdminFilterBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(t) => {
            setActiveTab(t);
            setSelected(new Set());
          }}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="搜尋社團 ID..."
        />

        {/* batch action toolbar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 border-b border-border bg-primary/5 px-5 py-2.5">
            <span className="text-sm font-medium text-neutral-700">
              已選取 {selected.size} 筆
            </span>
            {selectedPendingCount > 0 && (
              <button
                className="rounded-full border border-primary/20 bg-white px-3 py-1 text-[12px] font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                onClick={() => setBatchConfirm({ status: "paid" })}
              >
                批次標記已繳 ({selectedPendingCount})
              </button>
            )}
            {selectedPaidCount > 0 && (
              <button
                className="rounded-full border border-primary/20 bg-white px-3 py-1 text-[12px] font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                onClick={() => setBatchConfirm({ status: "returned" })}
              >
                批次退還 ({selectedPaidCount})
              </button>
            )}
            <button
              className="ml-auto text-xs text-neutral-400 hover:text-neutral-600"
              onClick={() => setSelected(new Set())}
            >
              取消選取
            </button>
          </div>
        )}

        {loading ? (
          <AdminTableSkeleton rows={6} columns={[24, 120, 80, 64, 56, 80, 80]} />
        ) : error ? (
          <AdminErrorState message={error} onRetry={fetchDeposits} />
        ) : (
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="bg-neutral-100 text-neutral-500">
                <th className="h-10 w-10 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleAll}
                    className="h-3.5 w-3.5 rounded border-neutral-300 accent-primary"
                  />
                </th>
                <th className="h-10 px-3 font-medium">社團 ID</th>
                <th className="h-10 px-3 font-medium">金額</th>
                <th className="h-10 px-3 font-medium">狀態</th>
                <th className="h-10 px-3 font-medium">繳費日期</th>
                <th className="h-10 px-3 font-medium">退還日期</th>
                <th className="h-10 px-3 font-medium">備註</th>
                <th className="h-10 px-5 text-right font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((dep) => {
                const badge = statusConfig[dep.status];
                return (
                  <tr
                    key={dep.id}
                    className="border-b border-border/50 last:border-0 hover:bg-primary/5"
                  >
                    <td className="h-12 w-10 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selected.has(dep.id)}
                        onChange={() => toggleOne(dep.id)}
                        className="h-3.5 w-3.5 rounded border-neutral-300 accent-primary"
                      />
                    </td>
                    <td className="h-12 px-3 font-medium text-neutral-950">
                      {dep.club_id}
                    </td>
                    <td className="h-12 px-3 font-mono text-sm font-semibold text-neutral-950">
                      ${dep.amount.toLocaleString()}
                    </td>
                    <td className="h-12 px-3">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="h-12 px-3 text-neutral-400">
                      {formatTimestamp(dep.paid_at as Parameters<typeof formatTimestamp>[0])}
                    </td>
                    <td className="h-12 px-3 text-neutral-400">
                      {formatTimestamp(dep.returned_at as Parameters<typeof formatTimestamp>[0])}
                    </td>
                    <td className="h-12 px-3">
                      <button
                        className="max-w-[120px] truncate text-[12px] text-neutral-500 underline decoration-dashed underline-offset-2 hover:text-neutral-700"
                        title={dep.notes || "點擊新增備註"}
                        onClick={() =>
                          setNotesTarget({
                            id: dep.id,
                            notes: dep.notes ?? "",
                          })
                        }
                      >
                        {dep.notes || "—"}
                      </button>
                    </td>
                    <td className="h-12 px-5 text-right">
                      {dep.status === "pending_payment" && (
                        <button
                          className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                          onClick={() =>
                            setConfirmTarget({
                              id: dep.id,
                              newStatus: "paid",
                              clubId: dep.club_id,
                            })
                          }
                        >
                          標記已繳
                        </button>
                      )}
                      {dep.status === "paid" && (
                        <button
                          className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                          onClick={() =>
                            setConfirmTarget({
                              id: dep.id,
                              newStatus: "returned",
                              clubId: dep.club_id,
                            })
                          }
                        >
                          退還保證金
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <AdminEmptyState
                  message="沒有找到符合條件的保證金紀錄"
                  colSpan={8}
                />
              )}
            </tbody>
          </table>
        )}
      </Card>

      {/* single status confirm */}
      <ConfirmDialog
        open={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleConfirmStatus}
        loading={confirmLoading}
        title={
          confirmTarget?.newStatus === "paid"
            ? "確認標記已繳？"
            : "確認退還保證金？"
        }
        description={
          confirmTarget
            ? `即將更新社團「${confirmTarget.clubId}」的保證金狀態`
            : undefined
        }
        confirmLabel={
          confirmTarget?.newStatus === "paid" ? "標記已繳" : "確認退還"
        }
      />

      {/* batch confirm */}
      <ConfirmDialog
        open={!!batchConfirm}
        onClose={() => setBatchConfirm(null)}
        onConfirm={handleBatchConfirm}
        loading={batchLoading}
        title={
          batchConfirm?.status === "paid"
            ? `批次標記 ${selected.size} 筆為已繳？`
            : `批次退還 ${selected.size} 筆保證金？`
        }
        description="此操作將一次更新所選取的所有紀錄，請確認無誤"
        confirmLabel="確認執行"
      />

      {/* notes edit modal */}
      <FormModal
        open={!!notesTarget}
        onClose={() => setNotesTarget(null)}
        onSubmit={handleNotesSave}
        title="編輯備註"
        submitLabel="儲存備註"
        loading={notesLoading}
      >
        <FormField
          as="textarea"
          label="備註"
          value={notesTarget?.notes ?? ""}
          onChange={(e) =>
            setNotesTarget((prev) =>
              prev ? { ...prev, notes: e.target.value } : null,
            )
          }
          placeholder="輸入備註內容..."
          className="min-h-[120px]"
        />
      </FormModal>
    </>
  );
}
