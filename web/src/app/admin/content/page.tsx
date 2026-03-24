"use client";

import Link from "next/link";
import {
  PencilSquareIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/card";

interface MockPage {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  updatedBy: string;
}

const mockPages: MockPage[] = [
  { id: "about", title: "關於社聯會", description: "社聯會簡介、組織架構、聯絡資訊", updatedAt: "2026-03-20", updatedBy: "管理員" },
  { id: "regulations", title: "相關法規", description: "社團管理辦法、經費補助辦法、場地使用辦法", updatedAt: "2026-03-15", updatedBy: "管理員" },
  { id: "faq", title: "常見問題", description: "新社團成立、經費申請、活動舉辦等常見 Q&A", updatedAt: "2026-03-10", updatedBy: "管理員" },
  { id: "contact", title: "聯絡我們", description: "辦公室地址、電話、Email、服務時間", updatedAt: "2026-02-28", updatedBy: "管理員" },
  { id: "links", title: "相關連結", description: "學校單位、合作夥伴等外部連結", updatedAt: "2026-02-20", updatedBy: "管理員" },
];

export default function ContentPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
          網站內容
        </h1>
      </div>
      <p className="mt-1 text-sm text-neutral-500">
        管理網站靜態頁面內容，使用 Markdown 編輯器
      </p>

      <div className="mt-6 space-y-3">
        {mockPages.map((page) => (
          <Card key={page.id} hoverable>
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                <DocumentTextIcon className="h-5 w-5 text-neutral-500" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-neutral-950">
                  {page.title}
                </h3>
                <p className="mt-0.5 truncate text-[13px] text-neutral-500">
                  {page.description}
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-[12px] text-neutral-400">
                  更新於 {page.updatedAt}
                </p>
                <p className="text-[12px] text-neutral-400">
                  由 {page.updatedBy}
                </p>
              </div>
              <Link
                href={`/admin/content/${page.id}`}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                <PencilSquareIcon className="h-3.5 w-3.5" />
                編輯
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
