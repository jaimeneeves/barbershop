'use client'

import { useState } from "react"
import useSWRMutation from "swr/mutation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import SignInGoogleButton from "@/components/login/SignInGoogleButton"

async function loginCliente(url: string, { arg }: { arg: { email: string; password: string } }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Erro ao fazer login")
  }

  return res.json()
}

export default function LoginCliente({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const { trigger, isMutating } = useSWRMutation("/api/login", loginCliente)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    try {
      await trigger({ email, password })
      router.push("/cliente/dashboard")
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro ao fazer login:", error.message)
      } else {
        console.error("Erro desconhecido ao fazer login")
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 min-h-screen  justify-center px-4 py-8", className)} {...props}>
      <Card className="w-full max-w-sm mx-auto shadow-xl/30">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Barbershop</CardTitle>
          <CardDescription>Login com sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <SignInGoogleButton />
              <div className="relative text-center text-sm">
                <span className="bg-white px-2 relative z-10">ou continue com</span>
                <div className="absolute inset-0 top-1/2 border-t border-border" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <a href="#" className="text-sm underline hover:text-primary">Esqueceu?</a>
                </div>
                <Input
                  id="password"
                  type="password"
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={isMutating}>
                {isMutating ? "Entrando..." : "Entrar"}
              </Button>
            </div>
            <div className="text-center text-sm">
              Não tem uma conta? <a href="#" className="underline">Cadastre-se</a>
            </div>
          </form>
        </CardContent>
      </Card>
      <p className="text-center text-xs text-muted-foreground px-6">
        Ao continuar, você concorda com nossos <a href="#" className="underline">Termos de Serviço</a> e <a href="#" className="underline">Política de Privacidade</a>.
      </p>
    </div>
  )
}
