import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PerfilClientePage() {
  // Simulação de dados (substituir por dados reais da API/autenticação)
  const cliente = {
    nome: "João da Silva",
    email: "joao@email.com",
    agendamentos: [
      { id: 1, data: "2025-07-10", hora: "14:00", servico: "Corte de cabelo" },
      { id: 2, data: "2025-07-15", hora: "10:30", servico: "Barba completa" },
    ],
  };

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Meu Perfil</h1>

      {/* Informações do cliente */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Informações</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Nome:</strong> {cliente.nome}</p>
          <p><strong>Email:</strong> {cliente.email}</p>
          <Button className="mt-4 w-full">Editar Perfil</Button>
        </CardContent>
      </Card>

      {/* Agendamentos futuros */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Próximos Agendamentos</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {cliente.agendamentos.length === 0 ? (
            <p>Você não possui agendamentos futuros.</p>
          ) : (
            cliente.agendamentos.map((a) => (
              <div
                key={a.id}
                className="border rounded-lg p-3 text-sm shadow-sm bg-muted"
              >
                <p><strong>Serviço:</strong> {a.servico}</p>
                <p><strong>Data:</strong> {a.data}</p>
                <p><strong>Hora:</strong> {a.hora}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  );
}
