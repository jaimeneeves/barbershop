"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react"
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import UserAvatar from "@/components/userAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { mutate } from "swr";
import { toast } from "sonner";
import { deleteFetcher } from '@/lib/fetcher'

type Agendamento = {
  id: number;
  date: string;
  serviceName: string;
};


export default function Profile() {
  const { data: session, status  } = useSession()

  const { data: usuario, isLoading } = useSWR(
    status === "authenticated" ? "/api/profile" : null,
    fetcher
  );

  const deleteAgendamento = async (id: number) => {
    try {
      await deleteFetcher(`/api/appointments/${id}`);
      mutate("/api/profile");
      toast.success('Agendamento cancelado com sucesso!');
    } catch (error) {
      console.error('Failed to delete author', error);
      toast.error('Erro ao cancelar agendamento. Tente novamente mais tarde.');
    }
  };

  const renderAgendamento = (agendamento: Agendamento) => {
    const data = new Date(agendamento.date);
    return (
      <div
        key={agendamento.id}
        className="border rounded-lg p-3 text-sm shadow-sm bg-muted hover:bg-muted/80 transition-colors flex justify-between items-center"
      >
        <div className="space-y-1">
          <p>
            <strong>Serviço:</strong> {agendamento.serviceName}
          </p>
          <p>
            <strong>Data:</strong>{" "}
            {data.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <p>
            <strong>Hora:</strong>{" "}
            {data.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto text-red-600 hover:bg-red-100"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancelar agendamento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja cancelar este agendamento? Essa ação não
                poderá ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Voltar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteAgendamento(agendamento.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  if (status === "loading" || isLoading) {
    return (
      <main className="p-4 max-w-md mx-auto">
        <p>Carregando perfil...</p>
      </main>
    );
  }

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <UserAvatar session={session} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem
              onClick={() => signOut()}
            >
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Próximos Agendamentos</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {usuario?.appointmentsAsClient?.length === 0 ? (
            <p>Você não possui agendamentos futuros.</p>
          ) : (
            usuario?.appointmentsAsClient.map(renderAgendamento)
          )}
        </CardContent>
      </Card>
    </main>
  );
}