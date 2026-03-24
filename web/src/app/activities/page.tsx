"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type Category = "全部" | "社博" | "大會" | "講座" | "其他";

interface ActivityItem {
  slug: string;
  category: "社博" | "大會" | "講座" | "其他";
  date: string;
  title: string;
  excerpt: string;
}

const mockActivities: ActivityItem[] = [
  {
    slug: "expo-27-review",
    category: "社博",
    date: "2025-11-20",
    title: "113 學年第一學期社團博覽會圓滿落幕",
    excerpt:
      "本次社博共有超過 200 個社團參與，吸引近萬名新生到場。活動期間舉辦了多場精彩表演。",
  },
  {
    slug: "assembly-2-review",
    category: "大會",
    date: "2025-12-15",
    title: "第二次代表大會順利召開",
    excerpt:
      "本次大會審議通過年度預算案及多項社團管理辦法修正案。出席率達 87%。",
  },
  {
    slug: "leadership-workshop",
    category: "講座",
    date: "2025-10-08",
    title: "社團經營分享座談會",
    excerpt:
      "邀請資深社團幹部分享經營心得，提供新任幹部實用建議。共計 60 位幹部參加。",
  },
  {
    slug: "expo-26-review",
    category: "社博",
    date: "2025-04-18",
    title: "112 學年第二學期社團博覽會回顧",
    excerpt:
      "本次社博以「無限延伸」為主題，180 個社團聯合展出，展現成大社團的多元風貌。",
  },
  {
    slug: "assembly-1-review",
    category: "大會",
    date: "2025-10-01",
    title: "第一次代表大會紀實",
    excerpt:
      "新學期首次代表大會順利召開，完成幹部改選及新年度工作計畫審議。",
  },
  {
    slug: "community-service",
    category: "其他",
    date: "2025-09-15",
    title: "社團聯合志工服務活動",
    excerpt:
      "聯合二十餘個社團共同參與社區清潔與關懷服務，發揮大學社會責任。",
  },
  {
    slug: "handover-ceremony",
    category: "其他",
    date: "2025-08-20",
    title: "113 學年幹部交接典禮",
    excerpt:
      "新舊任幹部正式交接，傳承社聯會的服務精神與運營經驗。",
  },
];

const categories: Category[] = ["全部", "社博", "大會", "講座", "其他"];

const categoryBadgeColor: Record<string, string> = {
  社博: "bg-primary",
  大會: "bg-emerald-600",
  講座: "bg-amber-600",
  其他: "bg-neutral-600",
};

export default function ActivitiesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("全部");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered =
    activeCategory === "全部"
      ? mockActivities
      : mockActivities.filter((a) => a.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <PublicLayout>
      <section className="w-full">
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-20">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <span
                className="inline-block w-6 border-t border-neutral-400"
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-600">
                ACTIVITIES
              </span>
            </div>
            <h1 className="mt-4 text-[40px] font-bold leading-[1.1] tracking-tight text-neutral-950">
              活動回顧
            </h1>
          </div>

          {/* Category tabs */}
          <div className="mb-8 flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setPage(1);
                }}
                className={`inline-flex h-[32px] items-center rounded-full px-3 text-xs font-[500] transition-colors ${activeCategory === cat
                    ? "bg-primary text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {paginated.map((item) => (
              <Link
                key={item.slug}
                href={`/activities/${item.slug}`}
                className="group overflow-hidden rounded-lg shadow-[0_0_0_1px_rgba(10,10,10,0.08)] transition-shadow duration-150 hover:shadow-[0_0_0_1px_rgba(10,10,10,0.12),0_2px_8px_rgba(10,10,10,0.06)]"
              >
                <div className="relative aspect-[16/9] bg-neutral-200">
                  <span
                    className={`absolute left-3 top-3 rounded-full px-2.5 py-1 font-mono text-[10px] font-medium text-white ${categoryBadgeColor[item.category]}`}
                  >
                    {item.category}
                  </span>
                </div>
                <div className="bg-white p-4">
                  <time className="font-mono text-[11px] text-neutral-400">
                    {item.date}
                  </time>
                  <h3 className="mt-2 text-[14px] font-semibold tracking-tight text-neutral-950 group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[12px] text-neutral-600">
                    {item.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-neutral-950/8 transition-colors hover:bg-neutral-50 disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronLeftIcon className="h-4 w-4 text-neutral-600" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-medium transition-colors ${page === p
                      ? "bg-primary text-white"
                      : "text-neutral-600 ring-1 ring-neutral-950/8 hover:bg-neutral-50"
                    }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-neutral-950/8 transition-colors hover:bg-neutral-50 disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronRightIcon className="h-4 w-4 text-neutral-600" />
              </button>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
