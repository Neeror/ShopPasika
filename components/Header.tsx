"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Menu,
  Search,
  ShoppingBasket,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { categories } from "@/data/products";
import { useStore } from "./AppState";
import { useEffect, useState } from "react";

type HeaderProps = {
  onSearch?: (value: string) => void;
};

export default function Header({ onSearch }: HeaderProps) {
  const { cart, favorites } = useStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const cartCount = cart.reduce((total, line) => total + line.quantity, 0);

  useEffect(() => {
    const syncCategory = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveCategory(params.get("category") ?? "");
    };

    syncCategory();
    window.addEventListener("popstate", syncCategory);

    return () => {
      window.removeEventListener("popstate", syncCategory);
    };
  }, []);

  const goToCategory = (category: string) => {
    const href = category
      ? `/?category=${encodeURIComponent(category)}#catalog`
      : "/#catalog";

    setActiveCategory(category);
    setMenuOpen(false);
    router.push(href, { scroll: false });
  };

  return (
    <>
      <div className="bg-deep text-xs text-paper/80">
        <div className="wrap flex h-9 items-center gap-2">
          <Truck size={14} className="text-honey" />
          Нова пошта по Україні, відправка в день замовлення
          <span className="ml-auto hidden sm:block">
            Продавцям　 Допомога
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-line bg-paper">
        <div className="wrap flex flex-wrap items-center gap-3 py-3">
          <button
            type="button"
            aria-label="Відкрити меню"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-11 w-11 place-items-center rounded-lg hover:bg-[#f1ece3] md:hidden"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-honey text-xl">
              ♜
            </span>
            <span>
              <b className="font-serif text-xl">
                Вулик<span className="text-honey">.Маркет</span>
              </b>
              <small className="block text-[9px] font-bold uppercase tracking-[.16em] text-ink/45">
                пасіка від пасічника
              </small>
            </span>
          </Link>

          <label className="order-3 flex min-h-11 w-full items-center rounded-full border border-line bg-[#f1ece3] px-4 md:order-none md:ml-5 md:flex-1">
            <Search size={17} className="text-ink/55" />
            <input
              aria-label="Пошук товарів"
              onChange={(event) => onSearch?.(event.target.value)}
              className="w-full bg-transparent px-3 outline-none"
              placeholder="Вулик Дадан, вощина, мед…"
            />
          </label>

          <nav className="ml-auto flex items-center gap-1">
            <Link
              href="/account/favorites"
              aria-label="Обране"
              className="relative grid h-11 w-11 place-items-center rounded-lg hover:bg-[#f1ece3]"
            >
              <Heart size={20} />
              {favorites.length > 0 && (
                <b className="absolute right-0 top-0 rounded-full bg-wine px-1 text-xs text-paper">
                  {favorites.length}
                </b>
              )}
            </Link>

            <Link
              href="/account"
              aria-label="Кабінет"
              className="grid h-11 w-11 place-items-center rounded-lg hover:bg-[#f1ece3]"
            >
              <UserRound size={20} />
            </Link>

            <Link
              href="/cart"
              aria-label="Кошик"
              className="relative grid h-11 w-11 place-items-center rounded-lg hover:bg-[#f1ece3]"
            >
              <ShoppingBasket size={20} />
              {cartCount > 0 && (
                <b className="absolute right-0 top-0 rounded-full bg-honey px-1 text-xs">
                  {cartCount}
                </b>
              )}
            </Link>
          </nav>
        </div>

        <nav
          className={`${
            menuOpen ? "flex" : "hidden"
          } wrap flex-col gap-1 pb-3 text-sm md:flex md:flex-row md:gap-2 md:overflow-x-auto`}
        >
          <button
            type="button"
            onClick={() => goToCategory("")}
            className={`rounded-full px-4 py-2 ${
              activeCategory === ""
                ? "bg-ink font-semibold text-paper"
                : "hover:bg-[#f1ece3]"
            }`}
          >
            Усі товари
          </button>

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => goToCategory(category)}
              className={`rounded-full px-4 py-2 ${
                activeCategory === category
                  ? "bg-ink font-semibold text-paper"
                  : "hover:bg-[#f1ece3]"
              }`}
            >
              {category}
            </button>
          ))}
        </nav>
      </header>
    </>
  );
}
