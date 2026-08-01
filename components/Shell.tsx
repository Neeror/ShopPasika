import Link from "next/link";
import Header from "./Header";

type ShellProps = {
  children: React.ReactNode;
  onSearch?: (value: string) => void;
};

export default function Shell({ children, onSearch }: ShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header onSearch={onSearch} />

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-[#241c17] py-10 text-sm text-paper/60">
        <div className="wrap flex flex-wrap justify-between gap-4">
          <span>© 2019–2026 Вулик.Маркет</span>

          <span className="flex gap-4">
            <Link href="/help">Допомога</Link>
            <Link href="/seller">Продавцям</Link>
            <Link href="/account">Кабінет</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
