import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout/public-layout";

export const metadata: Metadata = {
  title: "組織章程",
  description:
    "國立成功大學社團聯合會組織章程，包含總則、組織架構、會議制度、財務管理等規範條文。",
  openGraph: {
    title: "組織章程 | 成大社聯會",
    description: "國立成功大學社團聯合會組織章程全文。",
  },
};

const chapters = [
  {
    id: "chapter-1",
    title: "第一章　總則",
    articles: [
      {
        num: "第一條",
        content:
          "本會定名為「國立成功大學社團聯合會」（以下簡稱本會），英文名稱為 Club Association of National Cheng Kung University（NCA）。",
      },
      {
        num: "第二條",
        content:
          "本會以促進校內各社團間之交流與合作，維護社團權益，提升社團活動品質為宗旨。",
      },
      {
        num: "第三條",
        content:
          "本會會址設於國立成功大學光復校區學生活動中心。本會以國立成功大學全體登記有案之學生社團為會員團體。",
      },
    ],
  },
  {
    id: "chapter-2",
    title: "第二章　組織架構",
    articles: [
      {
        num: "第四條",
        content:
          "本會設會長一人，綜理會務，對外代表本會；設副會長一人，襄助會長處理會務。會長、副會長之任期為一學年。",
      },
      {
        num: "第五條",
        content:
          "本會設下列各部門：一、活動部：負責規劃與執行社團博覽會及各類活動。二、公關部：負責對外聯繫、媒體關係及贊助洽談。三、財務部：負責本會經費之收支管理與預算編列。四、文書部：負責會議紀錄、公文處理及檔案管理。",
      },
      {
        num: "第六條",
        content:
          "各部設部長一人，由會長提名，經代表大會同意後任命之。各部得視業務需要設副部長及幹事若干人。",
      },
    ],
  },
  {
    id: "chapter-3",
    title: "第三章　會議制度",
    articles: [
      {
        num: "第七條",
        content:
          "代表大會為本會最高決策機構，由各社團推派之代表組成。代表大會每學期至少召開二次。",
      },
      {
        num: "第八條",
        content:
          "代表大會之決議，除本章程另有規定外，以出席代表過半數之同意行之。代表大會之出席人數不足全體代表二分之一時，不得進行議決。",
      },
      {
        num: "第九條",
        content:
          "幹部會議由會長召集，每月至少召開一次，討論會務推動及執行事項。必要時得召開臨時幹部會議。",
      },
    ],
  },
  {
    id: "chapter-4",
    title: "第四章　財務管理",
    articles: [
      {
        num: "第十條",
        content:
          "本會經費來源如下：一、學校編列之社團輔導經費。二、會費收入。三、活動收入。四、捐贈收入。五、其他收入。",
      },
      {
        num: "第十一條",
        content:
          "本會之經費收支應編列年度預算，經代表大會審議通過後執行。決算報告應於學年結束後一個月內提出。",
      },
      {
        num: "第十二條",
        content:
          "本會之財務帳冊應公開透明，任何會員社團均得申請查閱。財務部應於每學期結束時公佈收支報告。",
      },
    ],
  },
  {
    id: "chapter-5",
    title: "第五章　社團管理",
    articles: [
      {
        num: "第十三條",
        content:
          "凡於本校登記有案之學生社團，均為本會之會員社團，享有本會所提供之各項服務與權利。",
      },
      {
        num: "第十四條",
        content:
          "本會每學年辦理社團評鑑一次，評鑑結果作為社團經費補助及獎勵之依據。評鑑辦法另訂之。",
      },
      {
        num: "第十五條",
        content:
          "會員社團如有違反校規或本會章程之行為，經代表大會議決後，得予以警告、停權或其他適當處分。",
      },
    ],
  },
  {
    id: "chapter-6",
    title: "第六章　附則",
    articles: [
      {
        num: "第十六條",
        content:
          "本章程之修改，須經代表大會出席代表三分之二以上之同意，始得修正。",
      },
      {
        num: "第十七條",
        content:
          "本章程未盡事宜，悉依國立成功大學相關法規及學生自治相關規範辦理。",
      },
      {
        num: "第十八條",
        content:
          "本章程經代表大會通過後施行，修正時亦同。",
      },
    ],
  },
];

export default function CharterPage() {
  return (
    <PublicLayout>
      <section className="w-full">
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-20">
          {/* Hero */}
          <div className="mb-16">
            <div className="flex items-center gap-3">
              <span
                className="inline-block w-6 border-t border-neutral-400"
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-600">
                CHARTER
              </span>
            </div>
            <h1 className="mt-4 text-[40px] font-bold leading-[1.1] tracking-tight text-neutral-950">
              組織章程
            </h1>
          </div>

          {/* Two-column layout */}
          <div className="flex gap-12 lg:gap-16">
            {/* Sidebar TOC */}
            <nav className="hidden w-56 shrink-0 lg:block">
              <div className="sticky top-20">
                <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wide text-neutral-950">
                  目錄
                </h2>
                <ul className="mt-4 flex flex-col gap-1">
                  {chapters.map((ch) => (
                    <li key={ch.id}>
                      <a
                        href={`#${ch.id}`}
                        className="block rounded-md px-3 py-2 text-[13px] font-[450] text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-950"
                      >
                        {ch.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* Main content */}
            <div className="min-w-0 flex-1">
              <div className="max-w-[65ch]">
                <p className="text-[15px] leading-[28px] text-neutral-600 text-pretty">
                  本章程為國立成功大學社團聯合會之最高組織規範，經代表大會通過後施行。全文共六章十八條，涵蓋總則、組織架構、會議制度、財務管理、社團管理及附則。
                </p>

                {chapters.map((chapter) => (
                  <div key={chapter.id} id={chapter.id} className="mt-14">
                    <h2 className="text-[20px] font-[700] tracking-tight text-neutral-950">
                      {chapter.title}
                    </h2>
                    <div className="mt-5 flex flex-col gap-5">
                      {chapter.articles.map((article) => (
                        <div
                          key={article.num}
                          className="rounded-lg border border-border bg-white px-5 py-4"
                        >
                          <span className="font-mono text-[12px] font-semibold text-primary">
                            {article.num}
                          </span>
                          <p className="mt-2 text-[14px] leading-[24px] text-neutral-700 text-pretty">
                            {article.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
