$ErrorActionPreference = 'Stop'

function Read-File([string]$Path) {
  [System.IO.File]::ReadAllText((Resolve-Path -LiteralPath $Path), [System.Text.Encoding]::UTF8)
}
function Write-File([string]$Path, [string]$Text) {
  [System.IO.File]::WriteAllText((Resolve-Path -LiteralPath $Path), $Text, [System.Text.UTF8Encoding]::new($false))
}
function Backup([string]$Path) {
  Copy-Item -LiteralPath $Path -Destination "$Path.before-shop-pasika-fix.bak" -Force
}
function Replace-Exact([string]$Path, [string]$Old, [string]$New, [string]$What) {
  $text = Read-File $Path
  if (!$text.Contains($Old)) { throw "Не знайдено: $What" }
  Backup $Path
  Write-File $Path ($text.Replace($Old, $New))
  Write-Host "OK: $What"
}
function Replace-Regex([string]$Path, [string]$Pattern, [string]$New, [string]$What) {
  $text = Read-File $Path
  $next = [regex]::Replace($text, $Pattern, $New, 1)
  if ($next -eq $text) { throw "Не знайдено: $What" }
  Backup $Path
  Write-File $Path $next
  Write-Host "OK: $What"
}
function Replace-WholeFile([string]$Path, [string]$Content, [string]$What) {
  if (!(Test-Path -LiteralPath $Path)) { throw "Файл не знайдено: $Path" }
  Backup $Path
  Write-File $Path $Content
  Write-Host "OK: $What"
}

# Верхній рядок: тільки ці два написи. Нижній футер не чіпаємо.
Replace-Regex 'components/Header.tsx' 'Продавцям\s*　\s*Допомога' '' 'прибрано верхні Продавцям і Допомога'

# Кошик: знімаємо тільки помилковий блокувальник canBuy. Видалені товари як і раніше не додаються.
Replace-Exact 'components/AppState.tsx' 'if (isRemoved(product.id) || !canBuy(statusOf(product))) {' 'if (isRemoved(product.id)) {' 'дозволено додавання товару в кошик'

# На сторінці товару quantity вже керує totalPrice, але примусово залишаємо саме цю формулу і доступні +/-.
Replace-Exact 'app/product/[id]/page.tsx' 'const totalPrice = product.price * quantity;' 'const totalPrice = product.price * quantity;' 'перевірено формулу ціни quantity × ціна'
Replace-Regex 'app/product/[id]/page.tsx' 'Дякуємо, відгук відправлено на перевірку\.' 'Дякуємо, відгук відправлено.' 'коментар без статусу перевірки'

$supportChat = @'
"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  id: string;
  text: string;
  author: "buyer" | "recipient";
  createdAt: string;
};

type ChatThread = {
  id: string;
  recipient: string;
  productId?: number;
  productName?: string;
  messages: ChatMessage[];
  updatedAt: string;
};

type SupportChatProps = {
  recipient: string;
  productId?: number;
  productName?: string;
  buttonLabel?: string;
  title?: string;
};

const STORAGE_KEY = "pasika-chat-threads";
export const BUYER_NAME = "Ви";

function readThreads(): ChatThread[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function threadId(recipient: string, productId?: number) {
  return `${recipient}:${productId ?? "support"}`;
}

export default function SupportChat({
  recipient,
  productId,
  productName,
  buttonLabel = "Написати продавцю",
  title = "Повідомлення",
}: SupportChatProps) {
  const id = useMemo(() => threadId(recipient, productId), [recipient, productId]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setThreads(readThreads());
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (open) feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight });
  }, [open, threads.length]);

  const thread = threads.find((item) => item.id === id);
  const messages = thread?.messages ?? [];

  const persist = (next: ChatThread[]) => {
    setThreads(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
  };

  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault();
    const text = message.trim();
    if (!text) return;

    const now = new Date().toISOString();
    const current: ChatThread = thread ?? {
      id,
      recipient,
      productId,
      productName,
      messages: [],
      updatedAt: now,
    };
    const nextThread: ChatThread = {
      ...current,
      productName: current.productName ?? productName,
      messages: [...current.messages, { id: `${Date.now()}-${Math.random()}`, text, author: "buyer", createdAt: now }],
      updatedAt: now,
    };
    persist([...threads.filter((item) => item.id !== id), nextThread]);
    setMessage("");
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line px-5 font-semibold text-ink hover:border-honey hover:text-honey">
        <MessageCircle size={17} /> {buttonLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
          <section className="flex max-h-[min(720px,90vh)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-lift" role="dialog" aria-modal="true" aria-label={title}>
            <header className="flex items-start justify-between gap-4 border-b border-line p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-honey">{productName ? "Питання про товар" : "Технічна підтримка"}</p>
                <h2 className="mt-1 text-2xl">{title}</h2>
                <p className="mt-1 text-sm text-ink/60">{recipient}</p>
              </div>
              <button type="button" aria-label="Закрити чат" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-line hover:bg-[#f1ece3]"><X size={18} /></button>
            </header>

            <div ref={feedRef} className="min-h-48 flex-1 space-y-3 overflow-y-auto p-5">
              {productName && <p className="rounded-xl bg-[#f1ece3] p-3 text-sm text-ink/70">Товар: <b>{productName}</b></p>}
              {!messages.length && <p className="rounded-xl bg-[#f1ece3] p-4 text-sm text-ink/65">Напишіть перше повідомлення. Воно збережеться у ваших повідомленнях.</p>}
              {messages.map((item) => (
                <div key={item.id} className={`max-w-[85%] rounded-2xl p-3 text-sm ${item.author === "buyer" ? "ml-auto bg-ink text-paper" : "bg-[#f1ece3]"}`}>
                  <p className="whitespace-pre-line">{item.text}</p>
                  <time className="mt-1 block text-[10px] opacity-60">{new Date(item.createdAt).toLocaleString("uk-UA")}</time>
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2 border-t border-line p-4">
              <label className="sr-only" htmlFor={`chat-${id}`}>Ваше повідомлення</label>
              <textarea id={`chat-${id}`} value={message} onChange={(event) => setMessage(event.target.value)} className="control min-h-12 flex-1 resize-y" placeholder="Ваше повідомлення…" rows={1} />
              <button type="submit" aria-label="Надіслати" disabled={!message.trim()} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ink text-paper disabled:opacity-40"><Send size={17} /></button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

export function getChatThreads(): ChatThread[] {
  return readThreads();
}

export type { ChatMessage, ChatThread };
'@
Replace-WholeFile 'components/SupportChat.tsx' $supportChat 'повний чат із textarea, історією і localStorage'

$messages = @'
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Shell from "@/components/Shell";
import { getChatThreads, type ChatThread } from "@/components/SupportChat";

export default function MessagesPage() {
  const [threads, setThreads] = useState<ChatThread[]>([]);

  useEffect(() => {
    const sync = () => setThreads(getChatThreads());
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const sorted = [...threads].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <Shell>
      <main className="wrap py-12">
        <Link href="/account" className="text-sm text-ink/60">← Кабінет</Link>
        <p className="mt-4 text-xs uppercase tracking-widest text-honey">Ваші звернення</p>
        <h1 className="mt-3 text-4xl">Повідомлення</h1>
        {!sorted.length ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line p-10 text-center">
            <MessageCircle size={30} className="mx-auto text-honey" />
            <p className="mt-4 text-ink/65">Поки що повідомлень немає. Напишіть продавцю або адміністратору.</p>
            <Link href="/" className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 font-semibold text-paper">До каталогу</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {sorted.map((thread) => (
              <article key={thread.id} className="rounded-2xl border border-line bg-paper p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <b className="text-lg">{thread.recipient}</b>
                    <p className="text-xs text-ink/50">{new Date(thread.updatedAt).toLocaleString("uk-UA")}</p>
                  </div>
                  <span className="rounded-full bg-[#f1ece3] px-3 py-1 text-xs font-semibold">{thread.messages.length} повідомлень</span>
                </div>
                {thread.productName && <p className="mt-3 text-sm text-ink/60">Товар: {thread.productName}</p>}
                <p className="mt-3 whitespace-pre-line text-ink/70">{thread.messages.at(-1)?.text}</p>
              </article>
            ))}
          </div>
        )}
      </main>
    </Shell>
  );
}
'@
Replace-WholeFile 'app/messages/page.tsx' $messages 'сторінка повної історії чату'

Write-Host ""
Write-Host "Готово. Нижній футер не змінювався."
