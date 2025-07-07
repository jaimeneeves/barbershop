'use client'

import { useState } from "react"
import useSWRMutation from "swr/mutation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { z } from "zod";
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"
import { signIn } from "next-auth/react"

const FormSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

export default function LoginBarber() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    setLoading(true)
    try {
      console.log("Dados do formulário:", formData)
      // await trigger(formData)

      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        toast.error(`Erro ao fazer login: ${result.error}`)
      } else {
        console.log("Dados do usuário:", result)
        router.push("/barbeiro/dashboard")
      }
    } catch (error) {
      console.log("Erro ao agendar:", error);
      let errorMessage = "Erro desconhecido";
      if (typeof error === "object" && error !== null && "response" in error) {
        const errObj = error as { response?: { error?: string } };
        errorMessage = errObj.response?.error || errorMessage;
      }
      toast.error(`Erro ao agendar: ${errorMessage}`);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen px-4 py-8")}>
      <Card className="w-full max-w-sm mx-auto shadow-xl/30">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Barbershop</CardTitle>
          <CardDescription>Login exclusivo para barbeiros</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="barbeiro@barbearia.com"
                            {...field}
                            value={field.value || ""}
                            className={cn(form.formState.errors.email && "border-red-500")}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel htmlFor="password">Senha</FormLabel>
                          <a href="#" className="text-sm underline hover:text-primary">Esqueceu?</a>
                        </div>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Digite sua senha"
                            {...field}
                            value={field.value || ""}
                            className={cn(form.formState.errors.password && "border-red-500")}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <p className="text-center text-xs text-muted-foreground px-6 max-w-xs mx-auto leading-snug mt-4">
        Acesso permitido apenas para barbeiros cadastrados pelo administrador.
      </p>
    </div>
  )
}
