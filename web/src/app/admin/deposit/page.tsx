"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type DepositStatus = "all" | "pending_payment" | "paid" | "returned";

interface MockDeposit {
  id: string;
  club: string;
  form: string;
  amount: number;
  status: "pending_payment" | "paid" | "returned";
  paidAt: string;
  returnedAt: string;
}

const mockDeposits: MockDeposit[] = [
  { id: "1", club: "熱舞社", form: "社團博覽會報名", amount: 3000, status: "pending_payment", paidAt: "", returnedAt: "" },
  { id: "2", club: "吉他社", form: "社團博覽會報名", amount: 3000, status: "pending_payment", paidAt: "", returnedAt: "" },
  { id: "3", club: "攝影社", form: "寒聯會報名", amount: 2000, status: "pending_payment", paidAt: "", returnedAt: "" },
  { id: "4", club: "桌遊社", form: "社團博覽會報名", amount: 3000, status: "paid", paidAt: "2026-03-15", returnedAt: "" },
  { id: "5", club: "日文研究社", form: "寒聯會報名", amount: 2000, status: "paid", paidAt: "2026-03-10", returnedAt: "" },
  { id: "6", club: "籃球社", form: "社團博覽會報名", amount: 3000, status: "paid", paidAt: "2026-03-08", returnedAt: "" },
  { id: "7", club: "天文社", form: "社團博覽會報名", amount: 3000, status: "returned", paidAt: "2026-02-20", returnedAt: "2026-03-20" },
  { id: "8", club: "志工服務社", form: "寒聯會報名", amount: 2000, status: "returned", paidAt: "2026-01-15", returnedAt: "2026-03-18" },
];

const tabs: { key: DepositStatus; label: string }[] = [
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

  const filtered = mockDeposits.filter((d) => {
    if (activeTab !== "all" && d.status !== activeTab) return false;
    if (search && !d.club.includes(search) && !d.form.includes(search))
      return false;
    return true;
  });

  const pendingTotal = mockDeposits
    .filter((d) => d.status === "pending_payment")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
            保證金管理
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            待繳總額{" "}
            <span className="font-semibold text-red-600">
              ${pendingTotal.toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      <Card className="mt-6">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 pt-4 pb-3">
          <div className="flex gap-1">
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
          <div className="ml-auto flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5">
            <MagnifyingGlassIcon className="h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="搜尋社團或表單..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-44 bg-transparent text-[13px] outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="bg-neutral-100 text-neutral-500">
              <th className="h-10 px-5 font-medium">社團</th>
              <th className="h-10 px-3 font-medium">關聯表單</th>
              <th className="h-10 px-3 font-medium">金額</th>
              <th className="h-10 px-3 font-medium">狀態</th>
              <th className="h-10 px-3 font-medium">繳費日期</th>
              <th className="h-10 px-3 font-medium">退還日期</th>
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
                  <td className="h-12 px-5 font-medium text-neutral-950">
                    {dep.club}
                  </td>
                  <td className="h-12 px-3 text-neutral-600">{dep.form}</td>
                  <td className="h-12 px-3 font-mono text-sm font-semibold text-neutral-950">
                    ${dep.amount.toLocaleString()}
                  </td>
                  <td className="h-12 px-3">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </td>
                  <td className="h-12 px-3 text-neutral-400">
                    {dep.paidAt || "—"}
                  </td>
                  <td className="h-12 px-3 text-neutral-400">
                    {dep.returnedAt || "—"}
                  </td>
                  <td className="h-12 px-5 text-right">
                    {dep.status === "pending_payment" && (
                      <button className="text-xs font-medium text-primary hover:underline">
                        標記已繳
                      </button>
                    )}
                    {dep.status === "paid" && (
                      <button className="text-xs font-medium text-primary hover:underline">
                        退還保證金
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="h-32 text-center text-sm text-neutral-400">
                  沒有找到符合條件的保證金紀錄
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
