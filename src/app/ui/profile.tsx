"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react"
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function Profile() {
  const { data: session, status  } = useSession()

  const { data: usuario, isLoading } = useSWR(
    status === "authenticated" ? "/api/profile" : null,
    fetcher
  );

  if (status === "loading" || isLoading) {
    return (
      <main className="p-4 max-w-md mx-auto">
        <p>Carregando perfil...</p>
      </main>
    );
  }

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => signOut()}
          className="rounded-full"
        >
          Sair
        </Button>
      </div>

      {/* Informações do cliente */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Informações</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Nome:</strong> {session?.user?.name}</p>
          <p><strong>Email:</strong> {session?.user?.email}</p>
          <Button className="mt-4 w-full">Editar Perfil</Button>
        </CardContent>
      </Card>

      {/* Agendamentos futuros */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Próximos Agendamentos</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {usuario?.appointmentsAsClient?.length === 0 ? (
            <p>Você não possui appointmentsAsClient futuros.</p>
          ) : (
            usuario?.appointmentsAsClient.map((a: {
              id: string;
              date: string;
              serviceName: string;
            }) => {
              const data = new Date(a.date);
              return (
                <div
                  key={a.id}
                  className="border rounded-lg p-3 text-sm shadow-sm bg-muted"
                >
                  <p><strong>Serviço:</strong> {a.serviceName}</p>
                  <p><strong>Data:</strong> {data.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}</p>
                  <p><strong>Hora:</strong> {data.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</p>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </main>
  );
}