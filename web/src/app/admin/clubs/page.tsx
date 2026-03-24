"use client";

import { useState } from "react";
import {
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type CategoryTab = "all" | "學術" | "康樂" | "體育" | "服務" | "聯誼";

interface MockClub {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  isActive: boolean;
}

const mockClubs: MockClub[] = [
  { id: "1", name: "吉他社", category: "康樂", contactPerson: "王小明", email: "guitar@club.ncku.edu.tw", isActive: true },
  { id: "2", name: "熱舞社", category: "康樂", contactPerson: "李美麗", email: "dance@club.ncku.edu.tw", isActive: true },
  { id: "3", name: "攝影社", category: "學術", contactPerson: "張大衛", email: "photo@club.ncku.edu.tw", isActive: true },
  { id: "4", name: "桌遊社", category: "聯誼", contactPerson: "陳志明", email: "boardgame@club.ncku.edu.tw", isActive: true },
  { id: "5", name: "日文研究社", category: "學術", contactPerson: "林欣怡", email: "japanese@club.ncku.edu.tw", isActive: true },
  { id: "6", name: "籃球社", category: "體育", contactPerson: "周杰倫", email: "basketball@club.ncku.edu.tw", isActive: true },
  { id: "7", name: "志工服務社", category: "服務", contactPerson: "黃小華", email: "volunteer@club.ncku.edu.tw", isActive: false },
  { id: "8", name: "天文社", category: "學術", contactPerson: "吳宇宙", email: "astro@club.ncku.edu.tw", isActive: true },
];

const categoryTabs: { key: CategoryTab; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "學術", label: "學術" },
  { key: "康樂", label: "康樂" },
  { key: "體育", label: "體育" },
  { key: "服務", label: "服務" },
  { key: "聯誼", label: "聯誼" },
];

export default function ClubsPage() {
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");
  const [search, setSearch] = useState("");

  const filtered = mockClubs.filter((c) => {
    if (activeTab !== "all" && c.category !== activeTab) return false;
    if (search && !c.name.includes(search) && !c.contactPerson.includes(search))
      return false;
    return true;
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
          社團名單
        </h1>
        <Button>
          <ArrowUpTrayIcon className="h-4 w-4" />
          匯入名單
        </Button>
      </div>

      <Card className="mt-6">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 pt-4 pb-3">
          <div className="flex gap-1">
            {categoryTabs.map((t) => (
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
              placeholder="搜尋社團..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-44 bg-transparent text-[13px] outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="bg-neutral-100 text-neutral-500">
              <th className="h-10 px-5 font-medium">社團名稱</th>
              <th className="h-10 px-3 font-medium">分類</th>
              <th className="h-10 px-3 font-medium">聯絡人</th>
              <th className="h-10 px-3 font-medium">Email</th>
              <th className="h-10 px-3 font-medium">狀態</th>
              <th className="h-10 px-5 text-right font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((club) => (
              <tr
                key={club.id}
                className="border-b border-border/50 last:border-0 hover:bg-primary/5"
              >
                <td className="h-12 px-5 font-medium text-neutral-950">
                  {club.name}
                </td>
                <td className="h-12 px-3 text-neutral-600">{club.category}</td>
                <td className="h-12 px-3 text-neutral-600">
                  {club.contactPerson}
                </td>
                <td className="h-12 px-3 font-mono text-[12px] text-neutral-400">
                  {club.email}
                </td>
                <td className="h-12 px-3">
                  <Badge variant={club.isActive ? "success" : "neutral"}>
                    {club.isActive ? "啟用" : "停用"}
                  </Badge>
                </td>
                <td className="h-12 px-5 text-right">
                  <button className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    <PencilSquareIcon className="h-3.5 w-3.5" />
                    編輯
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="h-32 text-center text-sm text-neutral-400">
                  沒有找到符合條件的社團
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
