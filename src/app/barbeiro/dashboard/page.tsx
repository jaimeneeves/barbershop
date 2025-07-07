"use client";

import { useSession, signOut } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/userAvatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Agendamento = {
  id: string;
  date: string;
  serviceName: string;
  client: {
    name: string;
    email: string;
  };
};

export default function BarbeiroDashboard() {
  const { data: session, status } = useSession();

  const { data: barbeiro, isLoading } = useSWR(
    status === "authenticated" ? "/api/barbers/profile" : null,
    fetcher
  );

  const agendamentosFuturos = barbeiro?.appointmentsAsBarber?.filter(
    (a: Agendamento) => new Date(a.date) >= new Date()
  );

  if (status === "loading" || isLoading) {
    return <main className="p-4 max-w-md mx-auto">Carregando...</main>;
  }

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      {/* Topo */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Painel do Barbeiro</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <UserAvatar session={session} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" sideOffset={4}>
            <DropdownMenuItem onClick={() => signOut()}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Informações do barbeiro */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Informações</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Nome:</strong> {barbeiro.name}</p>
          <p><strong>Email:</strong> {barbeiro.email}</p>
        </CardContent>
      </Card>

      {/* Agendamentos */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Próximos Atendimentos</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {agendamentosFuturos?.length === 0 ? (
            <p>Nenhum atendimento agendado.</p>
          ) : (
            agendamentosFuturos.map((a: Agendamento) => {
              const data = new Date(a.date);
              return (
                <div key={a.id} className="border rounded-lg p-3 bg-muted text-sm space-y-1">
                  <p><strong>Cliente:</strong> {a.client.name}</p>
                  <p><strong>Serviço:</strong> {a.serviceName}</p>
                  <p><strong>Data:</strong> {data.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</p>
                  <p><strong>Hora:</strong> {data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </main>
  );
}
