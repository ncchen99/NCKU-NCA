"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type FormStatus = "all" | "open" | "closed" | "draft";

interface MockForm {
  id: string;
  title: string;
  type: string;
  status: "open" | "closed" | "draft";
  responses: number;
  createdAt: string;
  closesAt: string;
}

const mockForms: MockForm[] = [
  { id: "1", title: "113-2 社團博覽會報名", type: "博覽會報名", status: "open", responses: 85, createdAt: "2026-02-20", closesAt: "2026-04-01" },
  { id: "2", title: "寒假聯合會報名表", type: "寒聯會報名", status: "open", responses: 42, createdAt: "2026-01-10", closesAt: "2026-03-30" },
  { id: "3", title: "社團幹部調查", type: "自訂表單", status: "open", responses: 60, createdAt: "2026-02-15", closesAt: "2026-04-15" },
  { id: "4", title: "112-2 社團博覽會報名", type: "博覽會報名", status: "closed", responses: 110, createdAt: "2025-09-01", closesAt: "2025-10-01" },
  { id: "5", title: "社團空間申請", type: "自訂表單", status: "draft", responses: 0, createdAt: "2026-03-10", closesAt: "" },
  { id: "6", title: "校慶活動意願調查", type: "自訂表單", status: "closed", responses: 78, createdAt: "2025-11-01", closesAt: "2025-11-20" },
];

const tabs: { key: FormStatus; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "open", label: "開放中" },
  { key: "closed", label: "已關閉" },
  { key: "draft", label: "草稿" },
];

const statusConfig: Record<string, { variant: "success" | "neutral" | "warning"; label: string }> = {
  open: { variant: "success", label: "開放中" },
  closed: { variant: "neutral", label: "已關閉" },
  draft: { variant: "warning", label: "草稿" },
};

export default function FormsPage() {
  const [activeTab, setActiveTab] = useState<FormStatus>("all");
  const [search, setSearch] = useState("");

  const filtered = mockForms.filter((f) => {
    if (activeTab !== "all" && f.status !== activeTab) return false;
    if (search && !f.title.includes(search)) return false;
    return true;
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
          表單管理
        </h1>
        <Button>
          <PlusIcon className="h-4 w-4" />
          建立表單
        </Button>
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
              placeholder="搜尋表單..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-44 bg-transparent text-[13px] outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="bg-neutral-100 text-neutral-500">
              <th className="h-10 px-5 font-medium">表單名稱</th>
              <th className="h-10 px-3 font-medium">類型</th>
              <th className="h-10 px-3 font-medium">狀態</th>
              <th className="h-10 px-3 font-medium">回覆數</th>
              <th className="h-10 px-3 font-medium">截止日期</th>
              <th className="h-10 px-5 text-right font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((form) => {
              const badge = statusConfig[form.status];
              return (
                <tr
                  key={form.id}
                  className="border-b border-border/50 last:border-0 hover:bg-primary/5"
                >
                  <td className="h-12 px-5 font-medium text-neutral-950">
                    {form.title}
                  </td>
                  <td className="h-12 px-3 text-neutral-600">{form.type}</td>
                  <td className="h-12 px-3">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </td>
                  <td className="h-12 px-3 font-mono text-neutral-600">
                    {form.responses}
                  </td>
                  <td className="h-12 px-3 text-neutral-400">
                    {form.closesAt || "—"}
                  </td>
                  <td className="h-12 px-5 text-right">
                    <Link
                      href={`/admin/forms/${form.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <EyeIcon className="h-3.5 w-3.5" />
                      檢視
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="h-32 text-center text-sm text-neutral-400">
                  沒有找到符合條件的表單
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
