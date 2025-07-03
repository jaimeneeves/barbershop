"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function NovoAgendamentoPage() {
  const [servico, setServico] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [barbeiro, setBarbeiro] = useState("");

  const handleAgendar = () => {
    console.log({ servico, data, hora, barbeiro });
    // Aqui você pode chamar uma mutation ou API route para criar o agendamento
    alert("Agendamento solicitado!");
  };

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Novo Agendamento</h1>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Preencha as informações</h2>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Serviço */}
          <div className="space-y-1">
            <Label>Serviço</Label>
            <Select onValueChange={setServico}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corte">Corte de cabelo</SelectItem>
                <SelectItem value="barba">Barba completa</SelectItem>
                <SelectItem value="combo">Corte + Barba</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data */}
          <div className="space-y-1">
            <Label>Data</Label>
            <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </div>

          {/* Hora */}
          <div className="space-y-1">
            <Label>Hora</Label>
            <Input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
          </div>

          {/* Barbeiro */}
          <div className="space-y-1">
            <Label>Barbeiro</Label>
            <Select onValueChange={setBarbeiro}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um barbeiro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="joao">João</SelectItem>
                <SelectItem value="pedro">Pedro</SelectItem>
                <SelectItem value="lucas">Lucas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão de ação */}
          <Button className="w-full mt-2" onClick={handleAgendar}>
            Confirmar Agendamento
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
