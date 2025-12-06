// src/app/admin/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "Admin | Elaene",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex md:flex-col">
        <div className="h-16 flex items-center justify-center border-b border-slate-200">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Elaene Admin
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 text-sm">
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase">
            Dashboard
          </p>
          <Link
            href="/admin"
            className="block px-3 py-2 rounded-lg hover:bg-slate-100 font-medium"
          >
            Overview
          </Link>

          <p className="px-2 mt-4 text-xs font-semibold text-slate-500 uppercase">
            Catalog
          </p>
          <Link
            href="/admin/products"
            className="block px-3 py-2 rounded-lg hover:bg-slate-100 font-medium"
          >
            Products
          </Link>
        </nav>

        <div className="border-t border-slate-200 p-4 text-xs text-slate-500">
          Logged in as Admin
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-8 justify-between">
          <div>
            <h1 className="text-lg font-semibold">Elaene Admin</h1>
            <p className="text-xs text-slate-500">
              Manage products and store settings
            </p>
          </div>
          {/* Future: user avatar, logout button */}
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
