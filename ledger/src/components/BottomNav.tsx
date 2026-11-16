"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, PieChart, Wallet, Menu } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/transactions", label: "Activity", icon: List },
  { href: "/budget", label: "Budget", icon: PieChart },
  { href: "/income", label: "Income", icon: Wallet },
  { href: "/more", label: "More", icon: Menu },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/85 backdrop-blur-xl">
      <ul className="mx-auto flex max-w-lg justify-around pt-1.5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} className={`flex w-16 flex-col items-center gap-0.5 py-1 text-[11px] font-medium ${active ? "text-accent" : "text-muted"}`}>
                <Icon size={23} strokeWidth={active ? 2.4 : 1.8} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
