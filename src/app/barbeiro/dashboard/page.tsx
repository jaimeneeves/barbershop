"use client";

import { useSession, signOut } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserAvatar from "@/components/userAvatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Smile, Clock4, CalendarCheck, User, Scissors, CalendarDays, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from 'next/navigation';

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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <a href="/barbeiro/horarios">
            <Button
              aria-label="Gerenciar horários disponíveis para atendimento"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              <Clock4 className="w-4 h-4" />
              Horários
            </Button>
          </a>

          <a href="/barbeiro/atendimentos">
            <Button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition"
            >
              <CalendarCheck className="w-4 h-4" />
              Atendimentos
            </Button>
          </a>

          <a href="/barbeiro/editar">
            <Button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 transition"
            >
              <User className="w-4 h-4" />
              Editar Perfil
            </Button>
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
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Próximos Atendimentos</h2>
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-2 rounded-full"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              router.push("/barbeiro/atendimentos")
            }}
            >
            {
              loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <CalendarCheck className="w-4 h-4" />
              )
            }
            Ver todos
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {agendamentosFuturos?.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">
              <Clock4 className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">Nenhum atendimento agendado no momento.</p>
            </div>
          ) : (
            agendamentosFuturos.map((a: Agendamento) => {
              const data = new Date(a.date);
              return (
                <div key={a.id} className="border border-primary/30 rounded-xl p-4 shadow-sm bg-white dark:bg-zinc-900 space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <strong>Cliente:</strong> {a.user.name}
                  </p>
                  <p className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-primary" />
                    <strong>Serviço:</strong> {a.serviceName}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <strong>Data:</strong> {data.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock4 className="w-4 h-4 text-primary" />
                    <strong>Hora:</strong> {data.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </main>
  );
}
