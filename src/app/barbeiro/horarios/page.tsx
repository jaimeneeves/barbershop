"use client";

import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import { fetcher, deleteFetcher } from "@/lib/fetcher";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card, CardContent, CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, CalendarPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const diasSemana = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
  "Quinta-feira", "Sexta-feira", "Sábado"
];

const availabilitySchema = z.object({
  dayOfWeek: z.number().refine(val => val >= 0 && val <= 6, {
    message: "Selecione um dia válido",
  }),
  startTime: z.string().min(1, "Horário inicial obrigatório"),
  endTime: z.string().min(1, "Horário final obrigatório")
}).refine(data => data.startTime < data.endTime, {
  message: "O horário inicial deve ser antes do final",
  path: ["endTime"]
});

type AvailabilityForm = z.infer<typeof availabilitySchema>;

export default function BarberAvailabilityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: disponibilidades = [], isLoading } = useSWR("/api/barbers/availability", fetcher, {
    revalidateOnFocus: false,
  });

  const form = useForm<AvailabilityForm>({
    resolver: zodResolver(availabilitySchema),
    mode: "onChange",
    defaultValues: {
      dayOfWeek: 1,
      startTime: "",
      endTime: ""
    }
  })
  const startTimeValue = form.watch("startTime");

  const removerDisponibilidade = async (id: number) => {
    try {
      await deleteFetcher(`/api/barbers/availability/${id}`);
      toast.success("Removido com sucesso!");
      mutate("/api/barbers/availability");
    } catch (error)  {
      let errorMessage = "Erro desconhecido";
      if (typeof error === "object" && error !== null && "response" in error) {
        const errObj = error as { response?: { error?: string } };
        errorMessage = errObj.response?.error || errorMessage;
      }
      toast.error(`Erro ao agendar: ${errorMessage}`);
    }
  };

  useEffect(() => {
    form.setValue("endTime", "");
  }, [startTimeValue]);

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setLoading(true);
            router.push("/barbeiro/dashboard");
          }}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Gerenciar Horários Disponíveis</h1>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Suas Disponibilidades</h2>
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-2 rounded-full"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              router.push("/barbeiro/horarios/novo")
            }}
            >
            {
              loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <CalendarPlus className="w-4 h-4" />
              )
            }
            Adicionar
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p>Carregando...</p>
          ) : disponibilidades.length === 0 ? (
            <p>Nenhuma disponibilidade cadastrada.</p>
          ) : (
            disponibilidades.map((d: any) => (
              <div key={d.id} className="border rounded-lg px-3 py-2 flex justify-between items-center bg-muted text-sm">
                <div>
                  <p><strong>{diasSemana[d.dayOfWeek]}</strong>: {d.startTime} - {d.endTime}</p>
                </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover disponibilidade</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover esta disponibilidade? Essa ação não poderá ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => removerDisponibilidade(d.id)}
                        >
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  );
}
