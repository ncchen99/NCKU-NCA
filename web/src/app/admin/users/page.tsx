"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type RoleTab = "all" | "admin" | "club_member";

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "club_member";
  club: string;
  createdAt: string;
}

const mockUsers: MockUser[] = [
  { id: "1", name: "管理員", email: "admin@nca.ncku.edu.tw", role: "admin", club: "—", createdAt: "2025-08-01" },
  { id: "2", name: "王小明", email: "wang@club.ncku.edu.tw", role: "club_member", club: "吉他社", createdAt: "2025-09-10" },
  { id: "3", name: "李美麗", email: "lee@club.ncku.edu.tw", role: "club_member", club: "熱舞社", createdAt: "2025-09-12" },
  { id: "4", name: "張大衛", email: "chang@club.ncku.edu.tw", role: "club_member", club: "攝影社", createdAt: "2025-09-15" },
  { id: "5", name: "陳志明", email: "chen@club.ncku.edu.tw", role: "club_member", club: "桌遊社", createdAt: "2025-09-20" },
  { id: "6", name: "林欣怡", email: "lin@club.ncku.edu.tw", role: "club_member", club: "日文研究社", createdAt: "2025-10-01" },
  { id: "7", name: "副管理員", email: "admin2@nca.ncku.edu.tw", role: "admin", club: "—", createdAt: "2025-08-05" },
  { id: "8", name: "周杰倫", email: "chou@club.ncku.edu.tw", role: "club_member", club: "籃球社", createdAt: "2025-10-10" },
];

const tabs: { key: RoleTab; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "admin", label: "管理員" },
  { key: "club_member", label: "社團成員" },
];

const roleConfig: Record<string, { variant: "primary" | "neutral"; label: string }> = {
  admin: { variant: "primary", label: "管理員" },
  club_member: { variant: "neutral", label: "社團成員" },
};

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<RoleTab>("all");
  const [search, setSearch] = useState("");

  const filtered = mockUsers.filter((u) => {
    if (activeTab !== "all" && u.role !== activeTab) return false;
    if (
      search &&
      !u.name.includes(search) &&
      !u.email.includes(search) &&
      !u.club.includes(search)
    )
      return false;
    return true;
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
          用戶管理
        </h1>
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
              placeholder="搜尋用戶..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-44 bg-transparent text-[13px] outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="bg-neutral-100 text-neutral-500">
              <th className="h-10 px-5 font-medium">姓名</th>
              <th className="h-10 px-3 font-medium">Email</th>
              <th className="h-10 px-3 font-medium">角色</th>
              <th className="h-10 px-3 font-medium">所屬社團</th>
              <th className="h-10 px-3 font-medium">建立日期</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => {
              const badge = roleConfig[user.role];
              return (
                <tr
                  key={user.id}
                  className="border-b border-border/50 last:border-0 hover:bg-primary/5"
                >
                  <td className="h-12 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 text-[11px] font-semibold text-neutral-600">
                        {user.name[0]}
                      </div>
                      <span className="font-medium text-neutral-950">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="h-12 px-3 font-mono text-[12px] text-neutral-400">
                    {user.email}
                  </td>
                  <td className="h-12 px-3">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </td>
                  <td className="h-12 px-3 text-neutral-600">{user.club}</td>
                  <td className="h-12 px-3 text-neutral-400">
                    {user.createdAt}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="h-32 text-center text-sm text-neutral-400">
                  沒有找到符合條件的用戶
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
