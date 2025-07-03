"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const barbeiro = searchParams.get("barbeiro");
  const servico = searchParams.get("servico");
  const data = searchParams.get("data");
  const hora = searchParams.get("hora");

  const dataFormatada = data
    ? new Date(data).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <main className="p-4 max-w-md mx-auto space-y-6 text-center">
      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
      <h1 className="text-2xl font-bold">Agendamento Confirmado!</h1>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Detalhes</h2>
        </CardHeader>
        <CardContent className="space-y-2 text-left">
          <p><strong>Serviço:</strong> {servico}</p>
          <p><strong>Barbeiro:</strong> {barbeiro}</p>
          <p><strong>Data:</strong> {dataFormatada}</p>
          <p><strong>Horário:</strong> {hora}</p>
        </CardContent>
      </Card>

      <Button className="w-full mt-4 rounded-full" onClick={() => router.push("/perfil")}>
        Ver minha agenda
      </Button>
    </main>
  );
}
