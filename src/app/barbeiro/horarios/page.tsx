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
import { Input } from "@/components/ui/input";
import useSWRMutation from "swr/mutation";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
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
  const { data: session } = useSession();
  const { data: disponibilidades = [], isLoading } = useSWR("/api/barbers/availability", fetcher);
  const { trigger, isMutating } = useSWRMutation("/api/barbers/availability", postFetcher);

  const form = useForm<AvailabilityForm>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      dayOfWeek: 1,
      startTime: "",
      endTime: ""
    }
  })

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
    } catch {
      toast.error("Erro ao remover");
    }
  };

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
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        value={field.value}
                        className={cn(form.formState.errors.startTime && "border-red-500")}
                        />
                    </FormControl>
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fim</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        value={field.value}
                        className={cn(form.formState.errors.endTime && "border-red-500")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={form.formState.isSubmitting}>
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
