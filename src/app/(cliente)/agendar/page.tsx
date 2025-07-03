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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const FormSchema = z.object({
  serviceId: z.string().min(1, "Selecione um serviço."),
  barberId: z.string().min(1, "Selecione um barbeiro."),
  data: z.string().min(1, "Informe a data."),
  hora: z.string().min(1, "Informe a hora."),
  userId: z.string().optional(),
});

// type FormData = z.infer<typeof schema>;

export default function NovoAgendamentoPage() {
  // const {
  //   register,
  //   handleSubmit,
  //   setValue,
  //   formState: { errors },
  // } = useForm<FormData>({
  //   resolver: zodResolver(schema),
  // });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const { trigger, isMutating } = useSWRMutation("/api/appointments", postFetcher);

  const { data: barbeiros, isLoading: loadingBarbeiros } = useSWR("/api/barbers", fetcher);
  const { data: servicos, isLoading: loadingServicos } = useSWR("/api/services", fetcher);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    try {
      console.log("Form data submitted:", formData);
      const userId = "cliente-123";
      const isoDate = new Date(`${formData.data}T${formData.hora}`).toISOString();
      const payload = {
        userId,
        barberId: formData.barberId,
        serviceId: formData.serviceId,
        date: isoDate,
        hora: formData.hora,
        data: formData.data,
      };

      await trigger(payload);
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
          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>

              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serviço</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={cn(form.formState.errors.serviceId && "border-red-500", "w-full")}>
                          <SelectValue placeholder="Selecione um serviço" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {servicos?.map((serv: {
                          id: number;
                          name: string;
                        }) => (
                          <SelectItem key={serv.id} value={serv.id.toString()}>
                            {serv.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Data */}
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ""}
                        className={cn(form.formState.errors.data && "border-red-500")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hora */}
              <FormField
                control={form.control}
                name="hora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        value={field.value || ""}
                        className={cn(form.formState.errors.hora && "border-red-500")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Barbeiro */}
              <FormField
                control={form.control}
                name="barberId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barbeiro</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={cn(form.formState.errors.barberId && "border-red-500", "w-full")}>
                          <SelectValue placeholder="Selecione um barbeiro" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {barbeiros?.map((barb: { id: string; name: string }) => (
                          <SelectItem key={barb.id} value={barb.id}>
                            {barb.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Botão */}
              <Button type="submit" size='lg' className="w-full mt-2 rounded-full" disabled={isMutating}>
                {isMutating ? "Agendando..." : "Confirmar Agendamento"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
