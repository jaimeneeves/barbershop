"use client";

import { useSession } from "next-auth/react";
import useSWRInfinite from 'swr/infinite'
import { fetcher } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, CalendarDays, Check, CheckCircle, Clock, Loader2, Play, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PAGE_SIZE } from '@/utils/constants';
import { cn } from '@/lib/utils';
import { APPOINTMENTS_STATUS } from '@/types/APPOINTMENTS_STATUS';

type Agendamento = {
  id: number;
  date: string;
  serviceName: string;
  user: {
    name: string;
    email: string;
  };
  status: APPOINTMENTS_STATUS;
};

export type Filter = {
  sortBy?: "recent" | "today" | null;
  status?: APPOINTMENTS_STATUS | null;
};

function buildQueryString(params: Record<string, any>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      query.set(key, value.toString());
    }
  });
  return query.toString();
}

export default function AppointmentsPage({
  sortBy = null,
  status = null,
}: {
  sortBy?: "recent" | "today" | null;
  status?: APPOINTMENTS_STATUS | null;
}) {
  const router = useRouter();
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Agendamento[]>([]);
  const { data: session } = useSession();

   const params = {
    sortBy: sortBy || null,
    status: status || null,
  };

  const { data, error, isLoading, mutate, size, setSize, isValidating } = useSWRInfinite(
    (index) => `/api/barbers/appointments?${buildQueryString({ ...params, size: PAGE_SIZE, page: index + 1 })}`,
    fetcher, {
      revalidateOnFocus: false,
    }
  );

  const handleFilterChange = (newFilter: Filter) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newFilter).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    replace(`${pathname}?${params.toString()}`);
  };

  const atualizarStatus = async (id: number, status: Agendamento["status"]) => {
    try {
      setLoading(true);
      await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      toast.success("Status atualizado!");
      mutate();
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
        className={cn(
          "rounded-xl p-4 text-sm border border-border shadow-sm transition-all space-y-2",
          "hover:shadow-md hover:border-primary/30"
        )}
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
                  Concluir
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const handleLoadMore = () => setSize(prev => prev + 1);

  useEffect(() => {
    if (data) {
      const flattenedSongs = data.flatMap(page => page.data || []);
      setAppointments(flattenedSongs);
    }
  }, [data]);

  const totalRecords = data?.[0]?.total || 0;
  const loadedRecords = data ? data.flatMap(page => page.data).length : 0;
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || isValidating;
  const isReachingEnd = loadedRecords >= totalRecords;

  if(isLoading) {
    return (
       <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="sr-only">Carregando atendimentos...</span>
      </div>
    );
  }

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            router.push('/barbeiro/dashboard');
          }}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Atendimentos</h1>
      </div>

      <div className="flex flex-wrap items-start gap-4 mt-2">
        <div className='flex flex-col items-start sm:flex-row sm:items-center gap-3'>
          <Button
            variant={(searchParams.get('sortBy')) === 'today' ? 'primary' : 'outline'}
            size="sm"
            className="rounded-full px-4 shadow-none shrink-0"
            onClick={() => {
              const isActive = searchParams.get('sortBy') === 'today';
              handleFilterChange({ sortBy: isActive ? null : 'today' });
            }}
            title="Ordenar por hoje"
          >
            <CalendarDays className="w-4 h-4" />
            Hoje
            {searchParams.get('sortBy') === 'today' && (
              <X size={16} />
            )}
          </Button>
        </div>
          
        <div className="border-l border-border min-h-[25px] hidden sm:block" />

        {(['SCHEDULED', 'COMPLETED'] as APPOINTMENTS_STATUS[]).map((value) => (
          <Button
            key={value}
            variant={(searchParams.get('status')) === value.toLocaleLowerCase() ? 'primary' : 'outline'}
            size="sm"
            className={cn('rounded-full px-4 shadow-none shrink-0')}
            onClick={() => {
              const isActive = searchParams.get('status') === value.toLocaleLowerCase();
              handleFilterChange({ status: isActive ? null : value.toLocaleLowerCase() as APPOINTMENTS_STATUS });
            }}
            aria-pressed={searchParams.get('status') === value.toLocaleLowerCase()}
            title={
              value === 'SCHEDULED'
                ? 'Exibir atendimentos agendados'
                : value === 'COMPLETED'
                  ? 'Exibir atendimentos finalizados'
                  : 'Exibir todos os atendimentos'
            }
          >
            <div className="flex items-center gap-2">
              {value === 'SCHEDULED' && <Clock className="w-4 h-4" />}
              {value === 'COMPLETED' && <CheckCircle className="w-4 h-4" />}
              {value === 'SCHEDULED' ? 'Agendados' : 'Concluídos'}
            </div>
            {
              searchParams.get('status') === value.toLocaleLowerCase() && (
                <X size={16} />
              )
            }
          </Button>
        ))}
      </div>

      {isLoading ? (
        <p>Carregando agendamentos...</p>
      ) : appointments?.length === 0 ? (
        <p>Nenhum atendimento encontrado.</p>
      ) : (
        <>
          <div className="space-y-4">
            {appointments?.map((appointment: Agendamento) => (
              <AtendimentoCard key={appointment.id} appointment={appointment} />
            ))}
          </div>

          <div className="flex justify-center items-center mt-5">
            <Button
              variant="outline"
              className="w-full"
              disabled={isLoadingMore || isReachingEnd}
              onClick={handleLoadMore}
            >
              {isLoadingMore
                ? 'carregando...'
                : isReachingEnd
                ? 'não há mais dados'
                : 'Mais'}
            </Button>
          </div>

        </>
      )}
    </main>
  );
}
