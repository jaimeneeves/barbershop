"use client";

import { useSession, signOut } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserAvatar from "@/components/userAvatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Smile, Clock4 } from "lucide-react"

type Agendamento = {
  id: string;
  date: string;
  serviceName: string;
  user: {
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

  if (!session) {
    return <main className="p-4 max-w-md mx-auto text-center text-red-500">
      Sessão inválida. Por favor, faça login novamente.
    </main>
  }

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Painel do Barbeiro</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <UserAvatar session={session} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" sideOffset={4}>
              <DropdownMenuItem
                onClick={() => {
                  signOut({ callbackUrl: "/barbeiro/login" });
                }}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Smile className="w-4 h-4 text-primary" />
          <span>Bem-vindo, <strong>{session?.user?.name}</strong> 👋</span>
        </div>

        <div>
          <a href="/barbeiro/horarios">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition">
              <Clock4 className="w-4 h-4" />
              Gerenciar Horários Disponíveis
            </button>
          </a>
        </div>
      </div>

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
                  <p><strong>Cliente:</strong> {a?.user?.name}</p>
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
