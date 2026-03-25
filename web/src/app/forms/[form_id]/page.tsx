import type { Metadata } from "next";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";
import { getForm } from "@/lib/firestore/forms";
import { anyTimestampToDate, formatDateTimeZhTW } from "@/lib/datetime";
import { ArrowLongLeftIcon } from "@heroicons/react/20/solid";
import { FormClient } from "./form-client";

type Props = { params: Promise<{ form_id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { form_id } = await params;
  try {
    const form = await getForm(form_id);
    if (!form) return { title: "表單未找到" };
    return {
      title: form.title,
      description: form.description?.substring(0, 160) ?? "社聯會線上表單",
    };
  } catch {
    return { title: "表單未找到" };
  }
}

export default async function FormPage({ params }: Props) {
  const { form_id } = await params;

  let form;
  try {
    form = await getForm(form_id);
  } catch {
    form = null;
  }

  if (!form) {
    return (
      <PublicLayout>
        <section className="w-full">
          <div className="mx-auto max-w-6xl px-6 py-24 text-center">
            <h1 className="text-[24px] font-bold text-neutral-950">
              表單未找到
            </h1>
            <p className="mt-2 text-neutral-600">
              找不到對應的表單，請確認連結是否正確。
            </p>
            <Link
              href="/"
              className="group mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLongLeftIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              返回首頁
            </Link>
          </div>
        </section>
      </PublicLayout>
    );
  }

  const closesAt = anyTimestampToDate(form.closes_at);
  const isClosed = form.status === "closed" || (closesAt && closesAt < new Date());
  const closesAtStr = formatDateTimeZhTW(closesAt);

  if (isClosed) {
    return (
      <PublicLayout>
        <section className="w-full">
          <div className="mx-auto max-w-3xl px-6 pt-24 pb-20">
            <div className="rounded-xl bg-white p-8 shadow-[0_0_0_1px_rgba(10,10,10,0.08)] text-center">
              <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 font-mono text-[11px] font-medium text-neutral-600">
                已截止
              </span>
              <h1 className="mt-4 text-[24px] font-bold tracking-tight text-neutral-950">
                {form.title}
              </h1>
              <p className="mt-3 text-[14px] text-neutral-600">{form.description}</p>
              {closesAt && (
                <p className="mt-2 text-[13px] text-neutral-500">
                  截止時間：{closesAtStr}
                </p>
              )}
              <Link
                href="/"
                className="group mt-8 inline-flex items-center gap-1 text-sm font-[450] text-primary hover:underline"
              >
                <ArrowLongLeftIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                返回首頁
              </Link>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  const sortedFields = [...(form.fields ?? [])].sort((a, b) => a.order - b.order);

  return (
    <PublicLayout>
      <section className="w-full">
        <div className="mx-auto max-w-3xl px-6 pt-24 pb-20">
          {/* Form header */}
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 font-mono text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                開放中
              </span>
              {closesAt && (
                <span className="font-mono text-[11px] text-neutral-400">
                  截止：{closesAtStr}
                </span>
              )}
            </div>
            <h1 className="mt-4 text-[28px] font-bold tracking-tight text-neutral-950">
              {form.title}
            </h1>
            <p className="mt-2 max-w-[52ch] text-[14px] leading-[24px] text-neutral-600 text-pretty">
              {form.description}
            </p>
            {form.deposit_policy?.required && form.deposit_policy.amount && (
              <div className="mt-3 rounded-lg bg-amber-50 px-4 py-2.5 text-[13px] text-amber-800 ring-1 ring-inset ring-amber-200">
                ⚠️ 本表單需繳交保證金 NT$ {form.deposit_policy.amount.toLocaleString()}
                {form.deposit_policy.refund_rule && (
                  <span className="ml-1 text-amber-600">({form.deposit_policy.refund_rule})</span>
                )}
              </div>
            )}
          </div>

          {/* Interactive form */}
          <FormClient formId={form_id} fields={sortedFields} />
        </div>
      </section>
    </PublicLayout>
  );
}
