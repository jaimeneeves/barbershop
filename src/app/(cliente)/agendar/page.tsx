"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

const schema = z.object({
  servico: z.string().min(1, "Selecione um serviço."),
  data: z.string().min(1, "Informe a data."),
  hora: z.string().min(1, "Informe a hora."),
  barbeiro: z.string().min(1, "Selecione um barbeiro."),
});

type FormData = z.infer<typeof schema>;

export default function NovoAgendamentoPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/agendamentos", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Erro ao agendar");
      }

      alert("Agendamento criado com sucesso!");
    } catch (error) {
      alert("Erro ao agendar. Tente novamente.");
      console.error(error);
    }
  };

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
              <Select onValueChange={(val) => setValue("servico", val)}>
                <SelectTrigger className={cn(errors.servico && "border-red-500")}>
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corte">Corte de cabelo</SelectItem>
                  <SelectItem value="barba">Barba completa</SelectItem>
                  <SelectItem value="combo">Corte + Barba</SelectItem>
                </SelectContent>
              </Select>
              {errors.servico && (
                <p className="text-sm text-red-500">{errors.servico.message}</p>
              )}
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
              <Select onValueChange={(val) => setValue("barbeiro", val)}>
                <SelectTrigger className={cn(errors.barbeiro && "border-red-500")}>
                  <SelectValue placeholder="Selecione um barbeiro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joao">João</SelectItem>
                  <SelectItem value="pedro">Pedro</SelectItem>
                  <SelectItem value="lucas">Lucas</SelectItem>
                </SelectContent>
              </Select>
              {errors.barbeiro && (
                <p className="text-sm text-red-500">{errors.barbeiro.message}</p>
              )}
            </div>

            {/* Botão */}
            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
