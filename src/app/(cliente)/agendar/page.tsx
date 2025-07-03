"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { fetcher, postFetcher } from "@/lib/fetcher";

const schema = z.object({
  serviceId: z.string().min(1, "Selecione um serviço."),
  barberId: z.string().min(1, "Selecione um barbeiro."),
  data: z.string().min(1, "Informe a data."),
  hora: z.string().min(1, "Informe a hora."),
  userId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NovoAgendamentoPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { trigger, isMutating } = useSWRMutation("/api/agendamentos", postFetcher);
  
  const { data: barbeiros, isLoading: loadingBarbeiros } = useSWR("/api/barbers", fetcher);
  const { data: servicos, isLoading: loadingServicos } = useSWR("/api/services", fetcher);

  const onSubmit = async (formData: FormData) => {
    try {
      const userId = "cliente-123";
      const serviceMap: Record<string, string> = {
        corte: "srv-corte-1",
        barba: "srv-barba-1",
        combo: "srv-combo-1",
      };
      const barberMap: Record<string, string> = {
        joao: "barbeiro-joao-1",
        pedro: "barbeiro-pedro-2",
        lucas: "barbeiro-lucas-3",
      };

      const isoDate = new Date(`${formData.data}T${formData.hora}`).toISOString();
      const payload = {
        userId,
        barberId: barberMap[formData.barberId],
        serviceId: serviceMap[formData.serviceId],
        date: isoDate,
        hora: formData.hora,
        data: formData.data,
      };

      await trigger(payload);
      alert("Agendamento criado com sucesso!");
    } catch (error) {
      alert("Erro ao agendar. Tente novamente.");
      console.error(error);
    }
  };

  if (!barbeiros || !servicos) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Novo Agendamento</h1>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Preencha as informações</h2>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

            {/* Serviço */}
            <div className="space-y-1">
              <Label>Serviço</Label>
              <Select onValueChange={(val) => setValue("serviceId", val)}>
                <SelectTrigger className={cn(errors.serviceId && "border-red-500", "w-full")}>
                  <SelectValue placeholder={loadingServicos ? "Carregando..." : "Selecione um serviço"} />
                </SelectTrigger>
                <SelectContent>
                  {servicos?.map((serv: {
                    id: string;
                    name: string;
                  }) => (
                    <SelectItem key={serv.id} value={serv.id}>
                      {serv.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceId && <p className="text-sm text-red-500">{errors.serviceId.message}</p>}
            </div>

            {/* Data */}
            <div className="space-y-1">
              <Label>Data</Label>
              <Input
                type="date"
                {...register("data")}
                className={cn(errors.data && "border-red-500")}
              />
              {errors.data && (
                <p className="text-sm text-red-500">{errors.data.message}</p>
              )}
            </div>

            {/* Hora */}
            <div className="space-y-1">
              <Label>Hora</Label>
              <Input
                type="time"
                {...register("hora")}
                className={cn(errors.hora && "border-red-500")}
              />
              {errors.hora && (
                <p className="text-sm text-red-500">{errors.hora.message}</p>
              )}
            </div>

            {/* Barbeiro */}
            <div className="space-y-1">
              <Label>Barbeiro</Label>
              <Select
               onValueChange={(val) => setValue("barberId", val)}
              >
                <SelectTrigger className={cn(errors.barberId && "border-red-500", "w-full")}>
                  <SelectValue placeholder={loadingBarbeiros ? "Carregando..." : "Selecione um barbeiro"} />
                </SelectTrigger>
                <SelectContent>
                  {barbeiros?.map((barb: { id: string; name: string }) => (
                    <SelectItem key={barb.id} value={barb.id}>
                      {barb.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.barberId && <p className="text-sm text-red-500">{errors.barberId.message}</p>}
            </div>

            {/* Botão */}
            <Button type="submit" size='lg' className="w-full mt-2 rounded-full" disabled={isMutating}>
              {isMutating ? "Agendando..." : "Confirmar Agendamento"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
