"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/usuarios", label: "Usuários" },
  { href: "/admin/barbeiros", label: "Barbeiros" },
  { href: "/admin/agendamentos", label: "Agendamentos" },
];

export default function AdminLayout() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Protege a rota: só admin pode acessar
  // useEffect(() => {
  //   if (status === "authenticated" && session?.user?.role !== "ADMIN") {
  //     router.replace("/");
  //   }
  // }, [session, status, router]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r hidden md:block">
        <div className="p-4 font-bold text-lg border-b">Admin</div>
        <nav className="flex flex-col gap-2 p-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm p-2 rounded hover:bg-gray-200 transition"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">Painel do Administrador</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-sm font-medium text-muted-foreground">Total de Usuários</h2>
            <p className="text-2xl font-bold">--</p>
          </div>
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-sm font-medium text-muted-foreground">Barbeiros Ativos</h2>
            <p className="text-2xl font-bold">--</p>
          </div>
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-sm font-medium text-muted-foreground">Agendamentos no mês</h2>
            <p className="text-2xl font-bold">--</p>
          </div>
        </div>
      </main>
    </div>
  );
}
