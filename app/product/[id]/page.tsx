"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Star,
  Truck,
} from "lucide-react";
import Shell from "@/components/Shell";
import {
  canBuy,
  CURRENT_SELLER,
  getProduct,
  getSeller,
  stockLabel,
  stockTone,
} from "@/data/products";
import type { Review } from "@/data/products";
import { useStore } from "@/components/AppState";
import StatusSwitcher from "@/components/StatusSwitcher";
import { threadHref, threadId } from "@/components/chatStore";

const REVIEWS_STORAGE_KEY = "pasika-reviews";
const MIN_REVIEW_LENGTH = 10;
const MAX_REVIEW_LENGTH = 1000;

type StoredReviews = Record<string, Review[]>;

function readStoredReviews(): StoredReviews {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(REVIEWS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoredReviews) : {};

    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStoredReviews(reviews: StoredReviews) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    /* сховище недоступне, залишаємо відгуки лише в памʼяті */
  }
}

function sellerInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

type ProductPageProps = {
  params: {
    id: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProduct(params.id);
  const { addToCart, favorites, toggleFavorite, statusOf } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSent, setReviewSent] = useState(false);
  const [ownReviews, setOwnReviews] = useState<Review[]>([]);

  useEffect(() => {
    setOwnReviews(readStoredReviews()[params.id] ?? []);
  }, [params.id]);

  if (!product) {
    return (
      <Shell>
        <main className="wrap py-20">
          <h1 className="text-3xl">Товар не знайдено</h1>
          <Link href="/" className="mt-4 inline-block text-honey">
            До каталогу
          </Link>
        </main>
      </Shell>
    );
  }

  const isFavorite = favorites.includes(product.id);
  const status = statusOf(product);
  const buyable = canBuy(status);
  const isOwner = product.seller === CURRENT_SELLER;
  const seller = getSeller(product.seller);
  const totalPrice = product.price * quantity;
  const reviewsList = [...ownReviews, ...product.reviewsList];
  const reviewsCount = product.reviews + ownReviews.length;
  const average =
    reviewsList.reduce((sum, review) => sum + review.rating, 0) /
    reviewsList.length;
  const chatHref = threadHref(threadId(product.seller, product.id));
  const reviewReady = reviewText.trim().length >= MIN_REVIEW_LENGTH;

  const addSelectedQuantity = () => {
    for (let index = 0; index < quantity; index += 1) {
      addToCart(product);
    }
  };

  /** Відгук зʼявляється в списку одразу, без модерації. */
  const publishReview = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = reviewText.trim();

    if (text.length < MIN_REVIEW_LENGTH) {
      return;
    }

    const review: Review = {
      id: Date.now(),
      author: "Ви",
      rating: reviewRating,
      date: new Date().toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      text,
      verified: false,
    };
    const nextOwnReviews = [review, ...ownReviews];

    setOwnReviews(nextOwnReviews);
    writeStoredReviews({
      ...readStoredReviews(),
      [params.id]: nextOwnReviews,
    });
    setReviewText("");
    setReviewRating(5);
    setReviewSent(true);
  };

  return (
    <Shell>
      <main className="wrap py-10">
        <Link href="/" className="text-sm text-ink/60">
          ← До каталогу
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#eee5d6]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className={`object-cover ${buyable ? "" : "opacity-70 grayscale"}`}
            />
          </div>

          <div>
            <small className="font-bold uppercase tracking-widest text-ink/45">
              {product.category}
            </small>
            <h1 className="mt-3 text-4xl">{product.name}</h1>

            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <Star size={16} fill="#d99632" className="text-honey" />
              {product.rating.toFixed(1)} · {reviewsCount} відгуків
              <MapPin size={16} /> {product.region}
            </p>

            <p className={`mt-4 text-sm font-semibold ${stockTone(status)}`}>
              ● {stockLabel(status)}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">
              {product.description}
            </p>

            <div className="mt-8">
              <b className="block font-serif text-4xl">
                {totalPrice.toLocaleString("uk-UA")} ₴
              </b>
              {quantity > 1 && (
                <p className="mt-1 text-sm text-ink/55">
                  {product.price.toLocaleString("uk-UA")} ₴ × {quantity} товарів
                </p>
              )}
            </div>

            {status === "hidden" ? (
              <p className="mt-6 rounded-2xl border border-line bg-[#f1ece3] p-4 text-sm text-ink/60">
                Продавець зняв це оголошення з публікації.
              </p>
            ) : (
              <div className="mt-6 grid gap-3">
                <div className="flex gap-3">
                  <div className="flex items-center rounded-full border border-line">
                    <button
                      type="button"
                      aria-label="Зменшити кількість"
                      disabled={!buyable || quantity <= 1}
                      className="h-12 w-12 disabled:opacity-40"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus size={15} className="mx-auto" />
                    </button>
                    <b className="w-8 text-center">{quantity}</b>
                    <button
                      type="button"
                      aria-label="Збільшити кількість"
                      disabled={!buyable || quantity >= 99}
                      className="h-12 w-12 disabled:opacity-40"
                      onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    >
                      <Plus size={15} className="mx-auto" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={!buyable}
                    className="flex-1 rounded-full bg-ink px-5 font-semibold text-paper disabled:cursor-not-allowed disabled:bg-line disabled:text-ink/40"
                    onClick={addSelectedQuantity}
                  >
                    {buyable ? "Додати в кошик" : stockLabel(status)}
                  </button>

                  <button
                    type="button"
                    aria-label="Обране"
                    className="grid h-12 w-12 place-items-center rounded-full border border-line"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart fill={isFavorite ? "currentColor" : "none"} />
                  </button>
                </div>

                <p className="text-sm text-ink/55">
                  Загальна сума змінюється автоматично відповідно до кількості.
                </p>
              </div>
            )}

            {!isOwner && seller && (
              <div className="mt-7 rounded-2xl border border-line bg-[#f1ece3] p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper font-serif text-sm">
                    {sellerInitials(seller.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <b>{seller.name}</b>
                      {seller.verified && (
                        <span className="inline-flex items-center gap-1 text-xs text-moss">
                          <BadgeCheck size={14} /> Перевірений
                        </span>
                      )}
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/60">
                      <span className="inline-flex items-center gap-1">
                        <Star size={13} fill="#d99632" className="text-honey" />
                        {seller.rating.toFixed(1)} · {seller.reviews} відгуків
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={13} /> Відповідає {seller.responseTime}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={chatHref}
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 font-semibold text-paper"
                  >
                    <MessageCircle size={17} /> Написати продавцю
                  </Link>
                  <Link
                    href="/seller"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 font-semibold hover:border-honey hover:text-honey"
                  >
                    Профіль продавця
                  </Link>
                </div>
              </div>
            )}

            {isOwner && (
              <div className="mt-7 rounded-2xl border border-line bg-[#f1ece3] p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-honey">
                  Керування оголошенням
                </p>
                <h2 className="mt-1 text-lg font-semibold">Статус товару</h2>
                <p className="mt-1 text-sm text-ink/60">
                  Змінюйте будь-коли, покупці бачать оновлення одразу.
                </p>
                <div className="mt-4">
                  <StatusSwitcher product={product} />
                </div>
              </div>
            )}

            <p className="mt-7 flex items-center gap-2 text-sm text-moss">
              <Truck size={18} /> Відправка протягом 1-2 днів
            </p>
          </div>
        </div>

        <section className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-honey">
                  Досвід пасічників
                </p>
                <h2 className="mt-2 text-3xl">Відгуки про товар</h2>
              </div>
              <div className="text-right">
                <b className="font-serif text-3xl">{average.toFixed(1)}</b>
                <p className="text-sm text-ink/60">середня оцінка</p>
              </div>
            </div>

            <div className="mt-7 divide-y divide-line rounded-2xl border border-line bg-paper">
              {reviewsList.map((review) => (
                <article key={review.id} className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <b>{review.author}</b>
                      {review.verified && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs text-moss">
                          <BadgeCheck size={14} /> Покупка підтверджена
                        </span>
                      )}
                    </div>
                    <time className="text-xs text-ink/50">{review.date}</time>
                  </div>
                  <div className="mt-2 flex gap-1 text-honey">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        size={15}
                        fill={index < review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <p className="mt-3 leading-relaxed text-ink/70">{review.text}</p>
                </article>
              ))}
            </div>
          </div>

          <form
            onSubmit={publishReview}
            className="h-fit rounded-2xl bg-[#f1ece3] p-6"
          >
            <h2 className="text-2xl">Залишити відгук</h2>
            <p className="mt-2 text-sm text-ink/60">
              Поділіться досвідом після покупки. Відгук зʼявиться одразу.
            </p>
            {reviewSent && (
              <p className="mt-4 rounded-xl bg-[#eef5ed] p-3 text-sm text-moss">
                Дякуємо, ваш відгук опубліковано.
              </p>
            )}

            <fieldset className="mt-5">
              <legend className="text-sm font-semibold">Оцінка</legend>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value} зірок`}
                    onClick={() => setReviewRating(value)}
                    className="text-honey"
                  >
                    <Star size={24} fill={value <= reviewRating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="mt-5 grid gap-2 text-sm font-semibold">
              Ваш відгук
              <textarea
                required
                minLength={MIN_REVIEW_LENGTH}
                maxLength={MAX_REVIEW_LENGTH}
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                className="control min-h-32 resize-y"
                placeholder="Що сподобалося?"
              />
            </label>
            <p className="mt-2 text-xs text-ink/50">
              Мінімум {MIN_REVIEW_LENGTH} символів · {reviewText.length}/
              {MAX_REVIEW_LENGTH}
            </p>
            <button
              type="submit"
              disabled={!reviewReady}
              className="mt-4 w-full rounded-full bg-ink px-5 py-3 font-semibold text-paper disabled:cursor-not-allowed disabled:bg-line disabled:text-ink/40"
            >
              Опублікувати відгук
            </button>
          </form>
        </section>
      </main>
    </Shell>
  );
}
