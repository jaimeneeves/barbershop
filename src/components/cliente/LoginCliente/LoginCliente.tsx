import { useState } from "react"
import useSWRMutation from "swr/mutation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

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

export default function LoginCliente() {
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
      }
      else {
        console.error("Erro desconhecido ao fazer login")
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold text-center">Login do Cliente</h1>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isMutating}>
          {isMutating ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  )
}
