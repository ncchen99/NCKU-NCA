"use client";

import Link from "next/link";
import {
  TagIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/card";
import type { ComponentType, SVGProps } from "react";

interface StatCard {
  label: string;
  value: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
}

const stats: StatCard[] = [
  { label: "已登記社團", value: "127 個", icon: TagIcon, href: "/admin/clubs" },
  {
    label: "開放中表單",
    value: "3 個",
    icon: ClipboardDocumentListIcon,
    href: "/admin/forms",
  },
  {
    label: "待繳保證金",
    value: "18 筆",
    icon: BanknotesIcon,
    href: "/admin/deposit",
  },
  {
    label: "今日點名出席率",
    value: "82%",
    icon: CheckBadgeIcon,
    href: "/admin/attendance",
  },
];

const recentResponses = [
  { club: "吉他社", form: "社團博覽會報名", time: "10 分鐘前" },
  { club: "熱舞社", form: "社團博覽會報名", time: "25 分鐘前" },
  { club: "攝影社", form: "寒聯會報名", time: "1 小時前" },
  { club: "桌遊社", form: "社團博覽會報名", time: "2 小時前" },
  { club: "日文研究社", form: "寒聯會報名", time: "3 小時前" },
];

const pendingDeposits = [
  { club: "熱舞社", amount: 3000, form: "社團博覽會報名" },
  { club: "吉他社", amount: 3000, form: "社團博覽會報名" },
  { club: "攝影社", amount: 2000, form: "寒聯會報名" },
  { club: "桌遊社", amount: 3000, form: "社團博覽會報名" },
  { club: "日文研究社", amount: 2000, form: "寒聯會報名" },
];

export default function AdminDashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        成功大學社團聯合會管理後台總覽
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card hoverable className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-medium text-neutral-500">
                    {s.label}
                  </p>
                  <p className="mt-1.5 text-[32px] font-bold leading-none tracking-tight text-neutral-950">
                    {s.value}
                  </p>
                </div>
                <div className="rounded-lg bg-neutral-100 p-2">
                  <s.icon className="h-5 w-5 text-neutral-500" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent form responses */}
        <Card>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-sm font-semibold text-neutral-950">
              最近 5 筆表單回覆
            </h2>
            <Link
              href="/admin/forms"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              查看全部 <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </div>
          <div className="px-5 pb-5">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-border text-neutral-500">
                  <th className="pb-2 font-medium">社團</th>
                  <th className="pb-2 font-medium">表單</th>
                  <th className="pb-2 text-right font-medium">時間</th>
                </tr>
              </thead>
              <tbody>
                {recentResponses.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 last:border-0 hover:bg-primary/5"
                  >
                    <td className="h-12 font-medium text-neutral-950">
                      {r.club}
                    </td>
                    <td className="h-12 text-neutral-600">{r.form}</td>
                    <td className="h-12 text-right text-neutral-400">
                      {r.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pending deposits */}
        <Card>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-sm font-semibold text-neutral-950">
              待繳保證金清單
            </h2>
            <Link
              href="/admin/deposit"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              查看全部 <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </div>
          <div className="px-5 pb-5">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-border text-neutral-500">
                  <th className="pb-2 font-medium">社團</th>
                  <th className="pb-2 font-medium">表單</th>
                  <th className="pb-2 text-right font-medium">金額</th>
                  <th className="pb-2 text-right font-medium" />
                </tr>
              </thead>
              <tbody>
                {pendingDeposits.map((d, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 last:border-0 hover:bg-primary/5"
                  >
                    <td className="h-12 font-medium text-neutral-950">
                      {d.club}
                    </td>
                    <td className="h-12 text-neutral-600">{d.form}</td>
                    <td className="h-12 text-right font-mono text-sm font-semibold text-red-600">
                      ${d.amount.toLocaleString()}
                    </td>
                    <td className="h-12 text-right">
                      <Link
                        href="/admin/deposit"
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        前往處理
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
