"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronDown, Clock, Headphones, Search, Send, ShieldCheck, Trash2 } from "lucide-react";
import Shell from "@/components/Shell";
import { faq, supportCategories, supportChannels, supportSchedule, supportTopics } from "@/data/support";
import {
  SUPPORT_TICKETS_KEY,
  createId,
  createTicketNumber,
  formatDateTime,
  readProfile,
  useStoredList,
  writeProfile,
} from "@/lib/storage";
import type { SupportTicket } from "@/lib/storage";
import { validateEmail, validateText } from "@/lib/validation";

const statusLabels: Record<SupportTicket["status"], string> = {
  new: "Нове",
  progress: "В роботі",
  closed: "Закрито",
};

const statusStyles: Record<SupportTicket["status"], string> = {
  new: "bg-[#fdf3e2] text-[#8a5a10]",
  progress: "bg-[#eef5ed] text-moss",
  closed: "bg-[#f1ece3] text-ink/55",
};

export default function Help() {
  const [open, setOpen] = useState(-1);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(supportCategories[0]);

  const tickets = useStoredList<SupportTicket>(SUPPORT_TICKETS_KEY);

  const [topic, setTopic] = useState(supportTopics[0]);
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<{ email?: string; text?: string }>({});
  const [created, setCreated] = useState<SupportTicket | null>(null);

  const visibleFaq = useMemo(() => {
    const search = query.trim().toLowerCase();
    return faq.filter((item) => {
      const byCategory = category === supportCategories[0] || item.category === category;
      const bySearch = !search || `${item.question} ${item.answer} ${item.category}`.toLowerCase().includes(search);
      return byCategory && bySearch;
    });
  }, [category, query]);

  const submitTicket = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = {
      email: validateEmail(email) || undefined,
      text: validateText(text, 15) || undefined,
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.text) return;

    const ticket: SupportTicket = {
      id: createId("ticket"),
      number: createTicketNumber(),
      topic,
      order: order.trim(),
      contact: email.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      status: "new",
    };

    tickets.prepend(ticket);
    writeProfile({ name: readProfile().name, contact: email.trim() });
    setCreated(ticket);
    setText("");
    setOrder("");
  };

  const closeTicket = (id: string) => {
    tickets.save(tickets.items.map((item) => (item.id === id ? { ...item, status: "closed" as const } : item)));
  };

  const removeTicket = (id: string) => {
    tickets.save(tickets.items.filter((item) => item.id !== id));
  };

  return (
    <Shell>
      <main className="wrap py-14">
        <p className="text-xs font-bold uppercase tracking-widest text-honey">Центр підтримки</p>
        <h1 className="mt-3 text-4xl">Допомога</h1>
        <p className="mt-3 max-w-2xl text-ink/65">
          Знайдіть готову відповідь, напишіть продавцю або створіть звернення — оператор відповідає протягом 4 годин, {supportSchedule.toLowerCase()}.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {supportChannels.map((channel) => (
            <a key={channel.id} href={channel.href} className="rounded-2xl border border-line p-5 transition hover:border-honey">
              <p className="text-xs font-bold uppercase tracking-widest text-ink/45">{channel.label}</p>
              <b className="mt-2 block text-lg">{channel.value}</b>
              <p className="mt-1 text-sm text-ink/55">{channel.note}</p>
            </a>
          ))}
        </div>

        <section className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <h2 className="text-3xl">Часті питання</h2>

            <label className="mt-5 flex min-h-12 items-center gap-2 rounded-full border border-line bg-[#fbf8f2] px-4">
              <Search size={17} className="text-ink/45" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setOpen(-1);
                }}
                className="w-full bg-transparent py-3 outline-none"
                placeholder="Пошук: доставка, повернення, оплата…"
                aria-label="Пошук по базі знань"
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-2">
              {supportCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCategory(item);
                    setOpen(-1);
                  }}
                  className={`rounded-full px-4 py-2 text-sm ${category === item ? "bg-ink font-semibold text-paper" : "border border-line hover:border-honey hover:text-honey"}`}
                >
                  {item}
                </button>
              ))}
            </div>

            {visibleFaq.length > 0 ? (
              <section className="mt-6 divide-y divide-line rounded-2xl border border-line bg-paper">
                {visibleFaq.map((item, index) => (
                  <div className="p-5" key={item.id}>
                    <button
                      type="button"
                      aria-expanded={open === index}
                      className="flex w-full items-center justify-between gap-4 text-left font-semibold"
                      onClick={() => setOpen(open === index ? -1 : index)}
                    >
                      <span>{item.question}</span>
                      <ChevronDown size={18} className={`shrink-0 transition ${open === index ? "rotate-180 text-honey" : "text-ink/40"}`} />
                    </button>
                    <p className="mt-1 text-xs uppercase tracking-widest text-ink/40">{item.category}</p>
                    {open === index && <p className="mt-3 leading-relaxed text-ink/65">{item.answer}</p>}
                  </div>
                ))}
              </section>
            ) : (
              <div className="mt-6 rounded-2xl border border-line py-14 text-center">
                <h3 className="text-2xl">Нічого не знайшли</h3>
                <p className="mt-2 text-ink/60">Спробуйте інші слова або створіть звернення нижче.</p>
              </div>
            )}

            <div id="tickets" className="mt-12 scroll-mt-24">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 className="text-3xl">Мої звернення</h2>
                <p className="text-sm text-ink/55">Зберігаються у цьому браузері</p>
              </div>

              {!tickets.hydrated ? (
                <p className="mt-5 text-sm text-ink/50">Завантаження…</p>
              ) : tickets.items.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-line p-6 text-sm text-ink/60">
                  Поки що звернень немає. Створіть перше у формі поруч — номер заявки зʼявиться тут.
                </div>
              ) : (
                <div className="mt-5 grid gap-3">
                  {tickets.items.map((ticket) => (
                    <article key={ticket.id} className="rounded-2xl border border-line bg-paper p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <b className="font-serif text-lg">{ticket.number}</b>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[ticket.status]}`}>
                            {statusLabels[ticket.status]}
                          </span>
                        </div>
                        <time className="text-xs text-ink/50">{formatDateTime(ticket.createdAt)}</time>
                      </div>
                      <p className="mt-3 text-sm font-semibold">{ticket.topic}</p>
                      {ticket.order && <p className="mt-1 text-xs text-ink/55">Замовлення: {ticket.order}</p>}
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/70">{ticket.text}</p>
                      <p className="mt-3 flex items-center gap-2 text-xs text-ink/50">
                        <Clock size={13} /> Відповідь надійде на {ticket.contact}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {ticket.status !== "closed" && (
                          <button
                            type="button"
                            onClick={() => closeTicket(ticket.id)}
                            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-xs font-semibold hover:border-honey hover:text-honey"
                          >
                            <CheckCircle2 size={14} /> Питання вирішено
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeTicket(ticket.id)}
                          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-xs font-semibold text-wine hover:border-wine"
                        >
                          <Trash2 size={14} /> Видалити
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit lg:sticky lg:top-6">
            <div className="rounded-2xl bg-[#f1ece3] p-6">
              <h2 className="flex items-center gap-2 text-2xl"><Headphones size={20} className="text-honey" /> Створити звернення</h2>
              <p className="mt-2 text-sm text-ink/60">Опишіть проблему — відповімо на пошту протягом 4 годин.</p>

              {created ? (
                <div className="mt-5 grid gap-4">
                  <div className="flex items-start gap-3 rounded-2xl bg-[#eef5ed] p-4 text-moss">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                    <div>
                      <b className="block">Звернення {created.number} створено</b>
                      <p className="mt-1 text-sm text-ink/70">Відповідь надійде на {created.contact}.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCreated(null)}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-line px-5 font-semibold hover:border-honey hover:text-honey"
                  >
                    Створити ще одне
                  </button>
                </div>
              ) : (
                <form onSubmit={submitTicket} noValidate className="mt-5 grid gap-3">
                  <label className="grid gap-2 text-sm font-semibold">
                    Тема
                    <select value={topic} onChange={(event) => setTopic(event.target.value)} className="control">
                      {supportTopics.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm font-semibold">
                    Email для відповіді
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="control"
                      placeholder="you@example.com"
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </label>

                  <label className="grid gap-2 text-sm font-semibold">
                    Номер замовлення (необовʼязково)
                    <input value={order} onChange={(event) => setOrder(event.target.value)} className="control" placeholder="VM-123456" />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold">
                    Опис
                    <textarea
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                      maxLength={1500}
                      className="control min-h-32 resize-y"
                      placeholder="Що сталося і на якій сторінці"
                      aria-invalid={Boolean(errors.text)}
                    />
                    <span className="flex justify-between text-xs font-normal text-ink/50">
                      {errors.text ? <span className="field-error">{errors.text}</span> : <span>Мінімум 15 символів</span>}
                      <span>{text.trim().length}/1500</span>
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 font-semibold text-paper transition hover:bg-honey hover:text-ink"
                  >
                    <Send size={17} /> Надіслати звернення
                  </button>
                </form>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-line p-5 text-sm text-ink/65">
              <p className="flex items-center gap-2 font-semibold text-ink"><ShieldCheck size={16} className="text-honey" /> Питання по товару?</p>
              <p className="mt-2">Швидше відповість продавець: кнопка «Написати продавцю» є на картці товару, на сторінці товару і в його профілі.</p>
              <Link href="/account/messages" className="mt-3 inline-block font-semibold text-honey underline-offset-4 hover:underline">
                Мої повідомлення продавцям →
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </Shell>
  );
}
