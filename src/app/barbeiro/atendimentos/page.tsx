"use client";

import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Check, Play } from "lucide-react";
import { useRouter } from "next/navigation";

type Agendamento = {
  id: number;
  date: string;
  serviceName: string;
  user: {
    name: string;
    email: string;
  };
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
};

export default function AtendimentosPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: appointments, isLoading } = useSWR(
    session?.user ? "/api/barbers/appointments" : null,
    fetcher
  );

  const atualizarStatus = async (id: number, status: Agendamento["status"]) => {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      toast.success("Status atualizado!");
      mutate("/api/barbers/profile");
    } catch {
      toast.error("Erro ao atualizar status");
    }
  };

  const renderStatus = (status: Agendamento["status"]) => {
    const cores = {
      SCHEDULED: "bg-yellow-200 text-yellow-800",
      IN_PROGRESS: "bg-blue-200 text-blue-800",
      COMPLETED: "bg-green-200 text-green-800",
      CANCELED: "bg-red-200 text-red-800",
    };
    return (
      <Badge className={cores[status]}>
        {status === "SCHEDULED" && "Agendado"}
        {status === "IN_PROGRESS" && "Em andamento"}
        {status === "COMPLETED" && "Concluído"}
        {status === "CANCELED" && "Cancelado"}
      </Badge>
    );
  };

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Atendimentos</h1>
      </div>

      {isLoading ? (
        <p>Carregando agendamentos...</p>
      ) : appointments?.length === 0 ? (
        <p>Nenhum atendimento encontrado.</p>
      ) : (
        <div className="space-y-4">
          {appointments?.map((a:any) => {
            const data = new Date(a.date);
            return (
              <div
                key={a.id}
                className="border rounded-lg p-3 text-sm shadow-sm bg-muted space-y-2"
              >
                <div className="space-y-1">
                  <p><strong>Cliente:</strong> {a.user.name}</p>
                  <p><strong>Serviço:</strong> {a.serviceName}</p>
                  <p><strong>Data/Hora:</strong> {data.toLocaleTimeString("pt-BR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</p>
                </div>

                <div className="flex justify-between items-center mt-2">
                  {renderStatus(a.status)}

                  {a.status === "SCHEDULED" && (
                    <Button
                      size="sm"
                      onClick={() => atualizarStatus(a.id, "IN_PROGRESS")}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Iniciar
                    </Button>
                  )}

                  {a.status === "IN_PROGRESS" && (
                    <Button
                      size="sm"
                      onClick={() => atualizarStatus(a.id, "COMPLETED")}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Finalizar
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
