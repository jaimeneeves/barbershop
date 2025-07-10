import prisma from "@/lib/prisma";
import { jsonResponse } from "@/utils/response";
import { auth } from "@/auth";

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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user?.id) {
    return jsonResponse({ error: "Não autenticado" }, 401);
  }

  try {
    const appointmentId = parseInt(params.id);

    if (!session?.user?.email) {
      return jsonResponse({ error: "Email não encontrado" }, 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "BARBER") {
      return jsonResponse({ error: "Acesso negado" }, 403);
    }

    const body = await req.json();
    const { status } = body;

    if (!["SCHEDULED", "COMPLETED", "CANCELED"].includes(status)) {
      return jsonResponse({ error: "Status inválido" }, 400);
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        barberId: user.id,
      },
    });

    if (!appointment) {
      return jsonResponse({ error: "Agendamento não encontrado" }, 404);
    }

    const updated = await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status },
    });

    return jsonResponse({ success: true, appointment: updated }, 200);
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "Erro ao atualizar agendamento" }, 500);
  }
}
