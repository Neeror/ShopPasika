import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Clock, Mail, MapPin, Package, Phone, Send, ShieldCheck, Star, Truck } from "lucide-react";
import Shell from "@/components/Shell";
import ProductCard from "@/components/ProductCard";
import ContactSellerButton from "@/components/ContactSellerButton";
import { formatPhone, getSellerBySlug, replyLabel, sellerProducts, sellers } from "@/data/sellers";

export function generateStaticParams() {
  return sellers.map((seller) => ({ slug: seller.slug }));
}

export default function SellerProfilePage({ params }: { params: { slug: string } }) {
  const found = getSellerBySlug(params.slug);

  if (!found) notFound();

  const seller = found!;
  const items = sellerProducts(seller.name);
  const stats = [
    { label: "Рейтинг", value: seller.rating.toFixed(1), note: `${seller.reviews} відгуків` },
    { label: "Успішних угод", value: seller.deals.toLocaleString("uk-UA"), note: `на маркеті з ${seller.since}` },
    { label: "Товарів у продажу", value: String(items.length), note: "оновлено сьогодні" },
    { label: "Час відповіді", value: replyLabel(seller.replyMinutes), note: seller.schedule },
  ];

  return (
    <Shell>
      <main className="wrap py-10">
        <Link href="/" className="text-sm text-ink/60">← До каталогу</Link>

        <section className="mt-6 grid gap-8 rounded-2xl border border-line bg-paper p-6 lg:grid-cols-[1fr_320px] lg:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-ink font-serif text-2xl text-paper">{seller.initials}</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-honey">Профіль продавця</p>
                <h1 className="mt-1 flex flex-wrap items-center gap-3 text-4xl">
                  {seller.name}
                  {seller.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#eef5ed] px-3 py-1 text-xs font-semibold text-moss">
                      <BadgeCheck size={14} /> Перевірений
                    </span>
                  )}
                </h1>
                <p className="mt-2 flex flex-wrap items-center gap-4 text-sm text-ink/60">
                  <span className="inline-flex items-center gap-1"><Star size={14} fill="#d99632" className="text-honey" />{seller.rating.toFixed(1)} · {seller.reviews} відгуків</span>
                  <span className="inline-flex items-center gap-1"><MapPin size={14} />{seller.city ? `${seller.city}, ` : ""}{seller.region} обл.</span>
                  <span className="inline-flex items-center gap-1"><Clock size={14} />Відповідає {replyLabel(seller.replyMinutes)}</span>
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-2xl leading-relaxed text-ink/70">{seller.about}</p>
            <p className="mt-3 text-sm text-ink/55">Власник: {seller.owner}</p>

            {seller.badges.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {seller.badges.map((badge) => (
                  <span key={badge} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold">
                    <ShieldCheck size={13} className="text-honey" /> {badge}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-ink/60">
              <Truck size={16} className="text-honey" />
              {seller.delivery.join(" · ")}
            </div>
          </div>

          <aside className="h-fit rounded-2xl bg-[#f1ece3] p-5">
            <p className="flex items-center gap-2 text-sm font-semibold"><Send size={16} className="text-honey" /> Питання до продавця</p>
            <p className="mt-2 text-sm text-ink/60">Напишіть у чат маркетплейсу — продавець бачить повідомлення в кабінеті і відповідає {replyLabel(seller.replyMinutes)}.</p>

            <div className="mt-4 grid gap-3">
              <ContactSellerButton sellerName={seller.name} variant="primary" />
              <a href={`tel:${seller.phone}`} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-line px-4 font-semibold hover:border-honey hover:text-honey">
                <Phone size={16} /> {formatPhone(seller.phone)}
              </a>
              <a href={`mailto:${seller.email}`} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-line px-4 text-sm font-semibold hover:border-honey hover:text-honey">
                <Mail size={16} /> {seller.email}
              </a>
            </div>

            <p className="mt-4 text-xs text-ink/50">Графік: {seller.schedule}</p>
            <p className="mt-1 text-xs text-ink/50">Телеграм: @{seller.telegram} · Viber: {formatPhone(seller.viber)}</p>
          </aside>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-line p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-ink/45">{stat.label}</p>
              <b className="mt-2 block font-serif text-3xl">{stat.value}</b>
              <p className="mt-1 text-xs text-ink/55">{stat.note}</p>
            </div>
          ))}
        </section>

        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-honey">Асортимент</p>
              <h2 className="mt-2 text-3xl">Товари продавця</h2>
            </div>
            <p className="flex items-center gap-2 text-sm text-ink/60"><Package size={16} /> {items.length} позицій</p>
          </div>

          {items.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {items.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-line py-16 text-center">
              <h3 className="text-2xl">Поки немає активних товарів</h3>
              <p className="mt-2 text-ink/60">Напишіть продавцю — можливо, потрібна позиція є під замовлення.</p>
              <div className="mt-5 flex justify-center">
                <ContactSellerButton sellerName={seller.name} variant="inline" />
              </div>
            </div>
          )}
        </section>

        <section className="mt-14 rounded-2xl bg-deep p-6 text-paper lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <h2 className="text-2xl text-paper">Щось пішло не так із замовленням?</h2>
              <p className="mt-2 max-w-xl text-sm text-paper/70">Спочатку напишіть продавцю. Якщо відповіді немає 24 години — підключиться технічна підтримка Вулик.Маркет.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ContactSellerButton sellerName={seller.name} variant="inline" className="border-paper/30 text-paper hover:border-honey hover:text-honey" />
              <Link href="/help" className="inline-flex min-h-11 items-center rounded-full bg-honey px-5 text-sm font-semibold text-ink hover:bg-paper">
                Центр підтримки
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Shell>
  );
}
