import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

const areas = [
  { icon: "🏛", title: "組織治理", desc: "代表大會與委員會運作管理" },
  { icon: "🎪", title: "社博管理", desc: "每學期社團博覽會策劃執行" },
  { icon: "📋", title: "表單系統", desc: "線上報名與資料收集平台" },
  { icon: "✅", title: "數位點名", desc: "代表大會出席紀錄管理" },
];

function OrgBriefSection() {
  return (
    <section className="w-full bg-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          title="關於組織"
          subtitle="About Club Association of NCKU"
          className="mb-12"
        />

        <div className="grid grid-cols-2 gap-16">
          {/* Left — Mission */}
          <div className="flex flex-col gap-8">
            <div className="max-w-[52ch] space-y-5 leading-[28px] text-neutral-600 text-pretty">
              <p>
                成功大學社團聯合會（Club Association of National Cheng Kung University，簡稱 NCA）成立於 1993
                年，是由全校學生社團代表組成的最高自治組織。我們肩負社團運作協調、資源分配以及學生權益代言的重要任務。
              </p>
              <p>
                透過每學期的代表大會、社團博覽會及各項行政服務，我們致力於打造更透明、高效的社團管理體系，讓每一位學生都能在豐富的校園生活中找到歸屬。
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="primary" href="/about">閱讀更多</Button>
              <Button variant="ghost" href="/charter">組織章程</Button>
            </div>
          </div>

          {/* Right — Focus areas */}
          <div className="flex flex-col gap-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-600">
              我們負責的四大領域
            </span>
            <div className="grid grid-cols-2 gap-3">
              {areas.map((area) => (
                <div
                  key={area.title}
                  className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-[0_0_0_1px_rgba(10,10,10,0.08)]"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-sm">
                    {area.icon}
                  </div>
                  <div>
                    <h3 className="text-[13px] font-semibold text-neutral-950">
                      {area.title}
                    </h3>
                    <p className="mt-1 text-[12px] text-neutral-600">
                      {area.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { OrgBriefSection };
