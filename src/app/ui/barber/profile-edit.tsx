"use client";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import { useState } from "react";
import { fetcher } from "@/lib/fetcher";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function ProfileEdit() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleUpdatePassword = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    if (newPassword !== confirmNewPassword) {
      setError("A nova senha e a confirmação não coincidem.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/barbers/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro desconhecido.");
      } else {
        setSuccess(true);
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (e) {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };


  if (status === "loading") {
    return <main className="p-4 max-w-md mx-auto">Carregando...</main>;
  }

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            router.back();
          }}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          Editar Perfil do Barbeiro
        </h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Editar Perfil</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Nome</p>
            <p>{session?.user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{session?.user?.email}</p>
          </div>

          <div className="space-y-4 pt-2 bg-muted dark:bg-muted-800 rounded-lg p-4">
            <div className="space-y-2">
              <label className="text-sm font-medium block">Senha Atual</label>
              <Input
                type="password"
                placeholder="Digite sua senha atual"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">Nova Senha</label>
              <Input
                type="password"
                placeholder="Digite a nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">Confirmar Nova Senha</label>
              <Input
                type="password"
                placeholder="Repita a nova senha"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>

            <Button
              onClick={handleUpdatePassword}
              disabled={loading || newPassword.length < 6}
              className="w-full"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Atualizar Senha
            </Button>

            {success && (
              <p className="text-sm text-green-600">Senha atualizada com sucesso!</p>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
