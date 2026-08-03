"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Shell from "@/components/Shell";
import { getChatThreads } from "@/components/SupportChat";

type Thread = ReturnType<typeof getChatThreads>[number];

export default function MessagesPage() {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    setThreads(getChatThreads());
  }, []);

  return (
    <Shell>
      <main className="wrap py-12">
        <p className="text-xs font-bold uppercase tracking-widest text-honey">Ваші звернення</p>
        <h1 className="mt-3 text-4xl">Повідомлення</h1>
        {!threads.length ? (
          <div className="mt-8 rounded-2xl border border-line p-8 text-center text-ink/60">Поки що повідомлень немає. Напишіть продавцю або адміністратору.</div>
        ) : (
          <div className="mt-8 grid gap-3">{threads.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map((thread) => <Link key={thread.id} href={thread.productId ? `/product/${thread.productId}` : "/support"} className="rounded-2xl border border-line p-5 hover:border-honey"><div className="flex items-center justify-between gap-3"><b>{thread.recipient}</b><time className="text-xs text-ink/50">{new Date(thread.updatedAt).toLocaleString("uk-UA")}</time></div>{thread.productName && <p className="mt-1 text-sm text-ink/60">{thread.productName}</p>}<p className="mt-3 line-clamp-2 text-sm text-ink/70">{thread.messages.at(-1)?.text}</p></Link>)}</div>
        )}
      </main>
    </Shell>
  );
}
