"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { postFetcher } from "@/lib/fetcher";
import useSWRMutation from "swr/mutation";

const FormSchema = z
  .object({
    oldPassword: z.string().min(6, {message:"A senha atual é obrigatória"}),
    newPassword: z.string().min(6, {message:"A nova senha precisa ter no mínimo 6 caracteres"}),
    confirmNewPassword: z.string().min(6, { message: "Confirmação da senha deve ter no mínimo 6 caracteres" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmNewPassword"],
  });

export default function ProfileEdit() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  })

  const { trigger, isMutating } = useSWRMutation("/api/barbers/update-password", postFetcher);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    setLoading(true);
    setSuccess(false);

    try {
      await trigger({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      form.reset();
      setSuccess(true);
      toast.success("Senha atualizada com sucesso!");
      router.push("/barber/dashboard");
    } catch (error) {
      console.log("Erro ao agendar:", error);
      let errorMessage = "Erro desconhecido";
      if (typeof error === "object" && error !== null && "response" in error) {
        const errObj = error as { response?: { error?: string } };
        errorMessage = errObj.response?.error || errorMessage;
      }
      toast.error(`Erro ao agendar: ${errorMessage}`);
    } finally {
      setLoading(false);
      setSuccess(false);
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
          <h2 className="text-lg font-semibold">Informações do Perfil</h2>
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
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Atualizar Senha</h2>
        </CardHeader>
        <CardContent>
          <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha Atual</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showOld ? "text" : "password"}
                          placeholder="Digite sua senha atual"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowOld((prev) => !prev)}
                          tabIndex={-1}
                        >
                          {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNew ? "text" : "password"}
                          placeholder="Digite a nova senha"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowNew((prev) => !prev)}
                          tabIndex={-1}
                        >
                          {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Nova Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Repita a nova senha"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowConfirm((prev) => !prev)}
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {success && (
              <p className="text-sm text-green-600">Senha atualizada com sucesso!</p>
            )}
            <Button type="submit" size='lg' className="w-full mt-2 rounded-full" disabled={isMutating}>
              {isMutating ? "Aguarde..." : "Atualizar Senha"}
            </Button>
          </form>
          </Form>
        </CardContent>
      </Card>

    </main>
  );
}
