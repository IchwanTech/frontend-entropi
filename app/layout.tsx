import "./globals.css";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ShoppingCart, Banknote, Bolt } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} dark`}>
      <body className="bg-slate-950 text-slate-200 antialiased font-sans relative overflow-x-hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-500/10 rounded-full filter blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute top-40 right-0 w-72 h-72 bg-emerald-500/5 rounded-full filter blur-3xl opacity-30 pointer-events-none" />

        <div className="min-h-screen flex flex-col sm:flex-row relative z-10">
          <aside className="sm:w-64 bg-slate-900 border-b sm:border-b-0 sm:border-r border-slate-800 flex-shrink-0 flex flex-col shadow-xl z-20">
            <div className="px-6 py-6 border-b border-slate-800/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Bolt className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-white tracking-tight text-xl">
                Entropi
              </span>
            </div>
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              <NavLink
                href="/orders"
                label="Orders"
                icon={<ShoppingCart className="w-4 h-4" />}
              />
              <NavLink
                href="/settlement"
                label="Settlement"
                icon={<Banknote className="w-4 h-4" />}
              />
            </nav>
          </aside>
          <main className="flex-1 px-6 sm:px-10 py-8 min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}

const NavLink = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors group"
    >
      <span className="text-slate-500 group-hover:text-brand-400 transition-colors">
        {icon}
      </span>
      {label}
    </Link>
  );
};
