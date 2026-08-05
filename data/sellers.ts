import { products } from "@/data/products";
import type { Product } from "@/data/products";

export type Seller = {
  slug: string;
  name: string;
  owner: string;
  region: string;
  city: string;
  initials: string;
  since: number;
  rating: number;
  reviews: number;
  deals: number;
  replyMinutes: number;
  verified: boolean;
  about: string;
  phone: string;
  email: string;
  telegram: string;
  viber: string;
  schedule: string;
  delivery: string[];
  badges: string[];
};

export const sellers: Seller[] = [
  {
    slug: "pasika-bortnyk",
    name: "Пасіка Бортник",
    owner: "Андрій Бортник",
    region: "Полтавська",
    city: "Миргород",
    initials: "ПБ",
    since: 2014,
    rating: 4.9,
    reviews: 316,
    deals: 1240,
    replyMinutes: 12,
    verified: true,
    about: "Родинна пасіка на 180 вуликів у Миргородському районі. Робимо вулики з липи та сосни під замовлення, качаємо мед з власних кочівок і возимо на ярмарки по всій Україні.",
    phone: "+380671234501",
    email: "bortnyk@vulyk.market",
    telegram: "vulyk_bortnyk",
    viber: "+380671234501",
    schedule: "Пн–Сб, 08:00–19:00",
    delivery: ["Нова пошта", "Укрпошта", "Самовивіз у Миргороді"],
    badges: ["Перевірені документи", "Швидка відповідь", "Топ продавець сезону"],
  },
  {
    slug: "apiteh",
    name: "Апітех",
    owner: "Ольга Крамар",
    region: "Київська",
    city: "Бровари",
    initials: "АП",
    since: 2011,
    rating: 4.8,
    reviews: 428,
    deals: 2130,
    replyMinutes: 25,
    verified: true,
    about: "Виробництво і продаж пасічного інвентарю: медогонки з нержавіючої сталі, столи для розпечатування, воскотопки. Власний сервіс і гарантія 24 місяці.",
    phone: "+380442280190",
    email: "sales@apiteh.ua",
    telegram: "apiteh_ua",
    viber: "+380442280190",
    schedule: "Пн–Пт, 09:00–18:00",
    delivery: ["Нова пошта", "Делівері", "Самовивіз зі складу"],
    badges: ["Гарантія 24 місяці", "Офіційний виробник"],
  },
  {
    slug: "rozplidnyk-hutsul",
    name: "Розплідник Гуцул",
    owner: "Василь Гуцул",
    region: "Закарпатська",
    city: "Мукачево",
    initials: "РГ",
    since: 2008,
    rating: 5,
    reviews: 574,
    deals: 3480,
    replyMinutes: 40,
    verified: true,
    about: "Племінний розплідник карпатської породи. Матки з міченням, ветеринарні документи на кожну партію, відправка спецпоштою в термобоксі.",
    phone: "+380503117744",
    email: "hutsul@vulyk.market",
    telegram: "hutsul_queens",
    viber: "+380503117744",
    schedule: "Щодня, 07:00–20:00 (сезон)",
    delivery: ["Нова пошта", "Спецперевезення маток"],
    badges: ["Племінне свідоцтво", "Ветконтроль", "Заміна матки протягом 14 днів"],
  },
  {
    slug: "pasika-sontsedar",
    name: "Пасіка Сонцедар",
    owner: "Ірина Ланова",
    region: "Херсонська",
    city: "Нова Каховка",
    initials: "ПС",
    since: 2017,
    rating: 4.7,
    reviews: 189,
    deals: 760,
    replyMinutes: 18,
    verified: false,
    about: "Мед соняшниковий, різнотрав'я, пилок і перга з власної кочової пасіки. Фасуємо під замовлення, є опт від 20 кг.",
    phone: "+380995540322",
    email: "sontsedar@vulyk.market",
    telegram: "sontsedar_med",
    viber: "+380995540322",
    schedule: "Пн–Сб, 09:00–20:00",
    delivery: ["Нова пошта", "Самовивіз"],
    badges: ["Опт від 20 кг", "Своя лабораторія"],
  },
];

export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function fallbackSeller(name: string): Seller {
  return {
    slug: encodeURIComponent(name.trim().toLowerCase().replace(/\s+/g, "-")),
    name,
    owner: name,
    region: "Україна",
    city: "",
    initials: initialsOf(name) || "ВМ",
    since: 2020,
    rating: 4.8,
    reviews: 0,
    deals: 0,
    replyMinutes: 60,
    verified: false,
    about: "Продавець ще не заповнив опис пасіки. Напишіть йому — відповідь прийде на вказаний вами контакт.",
    phone: "+380800300400",
    email: "support@vulyk.market",
    telegram: "vulyk_support",
    viber: "+380800300400",
    schedule: "Пн–Пт, 09:00–18:00",
    delivery: ["Нова пошта"],
    badges: [],
  };
}

export const getSellerBySlug = (slug: string): Seller | undefined =>
  sellers.find((seller) => seller.slug === slug);

export const getSellerByName = (name: string): Seller | undefined =>
  sellers.find((seller) => seller.name === name);

export const resolveSeller = (name: string): Seller => getSellerByName(name) ?? fallbackSeller(name);

export const sellerHref = (name: string): string => `/seller/${resolveSeller(name).slug}`;

export const sellerProducts = (name: string): Product[] =>
  products.filter((product) => product.seller === name);

export function replyLabel(minutes: number) {
  if (minutes < 60) return `≈ ${minutes} хв`;
  const hours = Math.round(minutes / 60);
  return `≈ ${hours} год`;
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 12) return phone;
  return `+${digits.slice(0, 2)} (${digits.slice(2, 5)}) ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10)}`;
}
