"use client";

import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Check, Loader2, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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
  const [ loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const { data: appointments, isLoading } = useSWR(
    session?.user ? "/api/barbers/appointments" : null,
    fetcher, {
      revalidateOnFocus: false,
    }
  );

  const atualizarStatus = async (id: number, status: Agendamento["status"]) => {
    try {
      setLoading(true);
      await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      toast.success("Status atualizado!");
      mutate("/api/barbers/appointments");
    } catch {
      toast.error("Erro ao atualizar status");
    } finally {
      setLoading(false);
    }
  };

  const cores = useMemo(
    () => ({
      SCHEDULED: "bg-yellow-200 text-yellow-800",
      IN_PROGRESS: "bg-blue-200 text-blue-800",
      COMPLETED: "bg-green-200 text-green-800",
      CANCELED: "bg-red-200 text-red-800",
    }),
    []
  );

  const renderStatus = (status: Agendamento["status"]) => (
    <Badge className={cores[status]}>
      {{
        SCHEDULED: "Agendado",
        IN_PROGRESS: "Em andamento",
        COMPLETED: "Concluído",
        CANCELED: "Cancelado",
      }[status]}
    </Badge>
  );

  const AtendimentoCard = ({ appointment }: { appointment: Agendamento }) => {
    const data = new Date(appointment.date);

    return (
      <div
        key={appointment.id}
        className="border rounded-lg p-3 text-sm shadow-sm bg-muted space-y-2"
      >
        <div className="space-y-1">
          <p>
            <strong>Cliente:</strong> {appointment.user.name}
          </p>
          <p>
            <strong>Serviço:</strong> {appointment.serviceName}
          </p>
          <p>
            <strong>Data/Hora:</strong>{" "}
            {data.toLocaleTimeString("pt-BR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex justify-between items-center mt-2">
          {renderStatus(appointment.status)}

          {appointment.status === "SCHEDULED" && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => atualizarStatus(appointment.id, "IN_PROGRESS")}
              className="rounded-full"
              disabled={loading}
            >
              {
                loading ? (
                   <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Aguarde...
                  </span>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Iniciar
                  </>
                )
              }
            </Button>
          )}

          {appointment.status === "IN_PROGRESS" && (
            <Button
              size="sm"
              onClick={() => atualizarStatus(appointment.id, "COMPLETED")}
              className="bg-green-600 text-white hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Aguarde...
                </span>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Finalizar
                </>
              )}
            </Button>
          )}
        </div>
      </div>
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
          {appointments?.map((appointment: Agendamento) => (
            <AtendimentoCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </main>
  );
}
