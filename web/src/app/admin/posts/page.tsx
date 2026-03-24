"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type PostStatus = "all" | "published" | "draft";

interface MockPost {
  id: string;
  title: string;
  category: string;
  status: "published" | "draft";
  author: string;
  date: string;
}

const mockPosts: MockPost[] = [
  { id: "1", title: "113學年度社團博覽會圓滿落幕", category: "最新消息", status: "published", author: "管理員", date: "2026-03-20" },
  { id: "2", title: "寒假聯合會活動回顧", category: "活動回顧", status: "published", author: "管理員", date: "2026-03-15" },
  { id: "3", title: "社團幹部交接須知", category: "最新消息", status: "draft", author: "管理員", date: "2026-03-12" },
  { id: "4", title: "114學年度社團評鑑公告", category: "最新消息", status: "published", author: "管理員", date: "2026-03-10" },
  { id: "5", title: "社團空間使用規範更新", category: "最新消息", status: "draft", author: "管理員", date: "2026-03-08" },
  { id: "6", title: "校慶活動社團表演報名", category: "活動回顧", status: "published", author: "管理員", date: "2026-03-05" },
];

const tabs: { key: PostStatus; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "published", label: "已發布" },
  { key: "draft", label: "草稿" },
];

const statusBadge: Record<string, { variant: "success" | "neutral"; label: string }> = {
  published: { variant: "success", label: "已發布" },
  draft: { variant: "neutral", label: "草稿" },
};

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState<PostStatus>("all");
  const [search, setSearch] = useState("");

  const filtered = mockPosts.filter((p) => {
    if (activeTab !== "all" && p.status !== activeTab) return false;
    if (search && !p.title.includes(search)) return false;
    return true;
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
          文章管理
        </h1>
        <Button>
          <PlusIcon className="h-4 w-4" />
          新增文章
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
              placeholder="搜尋文章..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-44 bg-transparent text-[13px] outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="bg-neutral-100 text-neutral-500">
              <th className="h-10 px-5 font-medium">標題</th>
              <th className="h-10 px-3 font-medium">分類</th>
              <th className="h-10 px-3 font-medium">狀態</th>
              <th className="h-10 px-3 font-medium">作者</th>
              <th className="h-10 px-3 font-medium">日期</th>
              <th className="h-10 px-5 text-right font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((post) => {
              const badge = statusBadge[post.status];
              return (
                <tr
                  key={post.id}
                  className="border-b border-border/50 last:border-0 hover:bg-primary/5"
                >
                  <td className="h-12 px-5 font-medium text-neutral-950">
                    {post.title}
                  </td>
                  <td className="h-12 px-3 text-neutral-600">
                    {post.category}
                  </td>
                  <td className="h-12 px-3">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </td>
                  <td className="h-12 px-3 text-neutral-600">{post.author}</td>
                  <td className="h-12 px-3 text-neutral-400">{post.date}</td>
                  <td className="h-12 px-5 text-right">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <PencilSquareIcon className="h-3.5 w-3.5" />
                      編輯
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="h-32 text-center text-sm text-neutral-400">
                  沒有找到符合條件的文章
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
