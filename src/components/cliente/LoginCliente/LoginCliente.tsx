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
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login com Google
              </Button>
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
