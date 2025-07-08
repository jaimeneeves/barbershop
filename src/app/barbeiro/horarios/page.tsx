"use client";

import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import { fetcher, postFetcher, deleteFetcher } from "@/lib/fetcher";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  Card, CardContent, CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

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
import { useEffect } from "react";

const diasSemana = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
  "Quinta-feira", "Sexta-feira", "Sábado"
];

const gerarHorarios = (start = "08:00", end = "20:00") => {
  const horarios: string[] = [];
  let [hora, minuto] = start.split(":").map(Number);
  const [horaFim, minutoFim] = end.split(":").map(Number);

  while (hora < horaFim || (hora === horaFim && minuto <= minutoFim)) {
    const h = hora.toString().padStart(2, "0");
    const m = minuto.toString().padStart(2, "0");
    horarios.push(`${h}:${m}`);

    minuto += 30;
    if (minuto >= 60) {
      minuto = 0;
      hora += 1;
    }
  }

  return horarios;
};

const horarioMaiorQue = (a: string, b: string) => {
  const [h1, m1] = a.split(":").map(Number);
  const [h2, m2] = b.split(":").map(Number);
  return h1 > h2 || (h1 === h2 && m1 > m2);
};

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
  const { data: session } = useSession();
  const { data: disponibilidades = [], isLoading } = useSWR("/api/barbers/availability", fetcher, {
    revalidateOnFocus: false,
  });
  const { trigger, isMutating } = useSWRMutation("/api/barbers/availability", postFetcher);

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

  const onSubmit = async (data: AvailabilityForm) => {
    try {
      await trigger(data);
      toast.success("Disponibilidade adicionada!");
      form.reset();
      mutate("/api/barbers/availability");
    } catch (error) {
      toast.error("Erro ao adicionar disponibilidade");
    }
  };

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
      <div className="flex items-center gap-2 text-primary">
        <CalendarClock className="w-5 h-5" />
        <h1 className="text-2xl font-bold">Gerenciar Horários Disponíveis</h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Nova Disponibilidade</h2>
        </CardHeader>
        <CardContent>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Dia da semana */}
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="dayOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia da semana</FormLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {diasSemana.map((dia, idx) => {
                        const isSelected = field.value === idx;
                        return (
                          <Button
                            key={idx}
                            type="button"
                            onClick={() => field.onChange(idx)}
                            className={cn(
                              "text-sm w-full",
                              isSelected
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            )}
                          >
                            {dia}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Início */}
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Início</FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                      {gerarHorarios().map((hora) => (
                        <Button
                          key={hora}
                          type="button"
                          variant={field.value === hora ? "default" : "ghost"}
                          onClick={() => field.onChange(hora)}
                          className={cn(
                            "text-sm w-full",
                            field.value === hora
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          )}
                        >
                          {hora}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fim */}
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => {
                  const horariosFiltrados = gerarHorarios().filter((hora) =>
                    startTimeValue ? horarioMaiorQue(hora, startTimeValue) : true
                  );
                  return (
                    <FormItem>
                      <FormLabel>Fim</FormLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {horariosFiltrados.length === 0 && (
                          <p className="col-span-3 text-sm text-muted-foreground">
                            Selecione um horário de início primeiro
                          </p>
                        )}
                        {horariosFiltrados.map((hora) => (
                          <Button
                            key={hora}
                            type="button"
                            variant={field.value === hora ? "default" : "ghost"}
                            onClick={() => field.onChange(hora)}
                            className={cn(
                              "text-sm w-full",
                              field.value === hora
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            )}
                          >
                            {hora}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Salvando..." : "Adicionar"}
            </Button>
          </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Suas Disponibilidades</h2>
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
