"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWRMutation from "swr/mutation";
import { ArrowLeft } from "lucide-react";
import useSWR from "swr";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { fetcher, postFetcher } from "@/lib/fetcher";
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const FormSchema = z.object({
  serviceId: z.number().min(1, "Selecione um serviço."),
  barberId: z.string().min(1, "Selecione um barbeiro."),
  data: z.string().min(1, "Informe a data."),
  hora: z.string().min(1, "Informe a hora."),
  userId: z.string().optional(),
});

// type FormData = z.infer<typeof schema>;

export default function NovoAgendamentoPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation("/api/appointments", postFetcher);

  const { data: barbeiros } = useSWR("/api/barbers", fetcher);
  const { data: servicos } = useSWR("/api/services", fetcher);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    try {
      console.log("Form data submitted:", formData);
      const userId = "cmcm2mrni0001jxs4sozjt0hj";
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
      toast.success("Agendamento realizado com sucesso!");
      form.reset();
      router.push("/perfil");
    } catch (error) {
      console.log("Erro ao agendar:", error);
      let errorMessage = "Erro desconhecido";
      if (typeof error === "object" && error !== null && "response" in error) {
        const errObj = error as { response?: { error?: string } };
        errorMessage = errObj.response?.error || errorMessage;
      }
      toast.error(`Erro ao agendar: ${errorMessage}`);
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
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Novo Agendamento</h1>
      </div>

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
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      defaultValue={field.value ? String(field.value) : undefined}>
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
                          <SelectItem key={serv.id} value={String(serv.id)}>
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
