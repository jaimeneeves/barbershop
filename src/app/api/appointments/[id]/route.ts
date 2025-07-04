import prisma from "@/lib/prisma";
import { jsonResponse } from "@/utils/response";
import { auth } from "auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return jsonResponse({ error: "Não autenticado" }, 401);
  }

  try {
    const agendamento = await prisma.appointment.findUnique({
      where: { id: Number(params.id) },
    });

    if (!agendamento || agendamento.userId !== session.user.id) {
      return jsonResponse({ error: "Agendamento não encontrado ou não permitido" }, 403);
    }

    const now = new Date();
    if (new Date(agendamento.date) <= now) {
      return jsonResponse({ error: "Somente agendamentos futuros podem ser cancelados" }, 403);
    }

    await prisma.appointment.delete({
      where: { id: Number(params.id) },
    });

    return jsonResponse({ success: true }, 200);
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "Erro ao cancelar" }, 500);
  }
}
