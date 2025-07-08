"use client";

import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import { fetcher, postFetcher, deleteFetcher } from "@/lib/fetcher";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card, CardContent, CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const diasSemana = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
  "Quinta-feira", "Sexta-feira", "Sábado"
];

const availabilitySchema = z.object({
  dayOfWeek: z.string().transform(Number).refine(val => val >= 0 && val <= 6, {
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

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<AvailabilityForm>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      dayOfWeek: "1",
      startTime: "",
      endTime: ""
    }
  });

  const onSubmit = async (data: AvailabilityForm) => {
    try {
      await postFetcher("/api/barbers/availability", data);
      toast.success("Disponibilidade adicionada!");
      mutate("/api/barbers/availability");
      reset();
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Dia da semana */}
            <div className="space-y-1">
              <Label>Dia da semana</Label>
              <Select onValueChange={val => setValue("dayOfWeek", val)} defaultValue="1">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  {diasSemana.map((dia, idx) => (
                    <SelectItem key={idx} value={String(idx)}>{dia}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dayOfWeek && <p className="text-red-600 text-sm">{errors.dayOfWeek.message}</p>}
            </div>

            {/* Início */}
            <div className="space-y-1">
              <Label htmlFor="startTime">Início</Label>
              <Input type="time" id="startTime" {...register("startTime")} />
              {errors.startTime && <p className="text-red-600 text-sm">{errors.startTime.message}</p>}
            </div>

            {/* Fim */}
            <div className="space-y-1">
              <Label htmlFor="endTime">Fim</Label>
              <Input type="time" id="endTime" {...register("endTime")} />
              {errors.endTime && <p className="text-red-600 text-sm">{errors.endTime.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Adicionar"}
            </Button>
          </form>
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
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removerDisponibilidade(d.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  );
}
