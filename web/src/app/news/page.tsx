"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type Category = "全部" | "公告" | "活動" | "重要";

interface NewsItem {
  slug: string;
  category: "公告" | "活動" | "重要";
  date: string;
  title: string;
  excerpt: string;
}

const mockNews: NewsItem[] = [
  {
    slug: "club-evaluation-2026",
    category: "公告",
    date: "2026-03-20",
    title: "114 學年度第二學期社團評鑑公告",
    excerpt:
      "各社團請於期限內繳交相關資料，以利評鑑作業順利進行。詳細辦法請參閱附件。",
  },
  {
    slug: "expo-registration-2026",
    category: "活動",
    date: "2026-03-15",
    title: "第 28 屆社團博覽會報名開始",
    excerpt:
      "本學期社博將於四月中旬舉辦，歡迎各社團踴躍報名參加。報名截止日期為三月底。",
  },
  {
    slug: "meeting-minutes-3",
    category: "重要",
    date: "2026-03-10",
    title: "第三次代表大會會議紀錄公告",
    excerpt:
      "本次大會通過多項重要議案，請各社團代表詳閱會議紀錄並轉達社團成員。",
  },
  {
    slug: "budget-announcement",
    category: "公告",
    date: "2026-03-05",
    title: "114 學年度第二學期經費補助核定公告",
    excerpt:
      "各社團經費補助金額已核定完畢，請至系統查詢核定結果。如有疑義請於兩週內提出申覆。",
  },
  {
    slug: "workshop-leadership",
    category: "活動",
    date: "2026-02-28",
    title: "社團幹部領導力培訓工作坊",
    excerpt:
      "為提升社團幹部之領導能力與團隊合作技巧，本會特別舉辦為期兩天的培訓工作坊。",
  },
  {
    slug: "venue-policy-update",
    category: "重要",
    date: "2026-02-20",
    title: "場地借用規範修訂通知",
    excerpt:
      "因應校方政策調整，本學期起場地借用流程有所更新，請各社團務必詳閱新規範。",
  },
  {
    slug: "spring-gathering",
    category: "活動",
    date: "2026-02-14",
    title: "學期初社團負責人聯誼會",
    excerpt:
      "新學期伊始，邀請各社團負責人參加聯誼活動，增進彼此交流與合作機會。",
  },
  {
    slug: "insurance-reminder",
    category: "公告",
    date: "2026-02-10",
    title: "社團活動保險申請提醒",
    excerpt:
      "提醒各社團辦理校外活動時，務必於活動前兩週完成團體保險申請作業。",
  },
];

const categories: Category[] = ["全部", "公告", "活動", "重要"];

const categoryBadgeColor: Record<string, string> = {
  公告: "bg-primary",
  活動: "bg-emerald-600",
  重要: "bg-red-600",
};

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("全部");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered =
    activeCategory === "全部"
      ? mockNews
      : mockNews.filter((n) => n.category === activeCategory);

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
                NEWS
              </span>
            </div>
            <h1 className="mt-4 text-[40px] font-bold leading-[1.1] tracking-tight text-neutral-950">
              最新消息
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
                className={`inline-flex h-[32px] items-center rounded-full px-3 text-xs font-[500] transition-colors ${
                  activeCategory === cat
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
                href={`/news/${item.slug}`}
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
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-medium transition-colors ${
                    page === p
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
