import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { jsonResponse } from "@/utils/response";
import { startOfToday } from "date-fns";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonResponse({ error: "Não autenticado" }, 401);
  }

  try {
    const barbeiro = await prisma.appointment.findMany({
      where: {
        barberId: session.user.id,
        // date: {
        //   gte: startOfToday(),
        // },
      },
      orderBy: {
        date: "asc",
      },
      select: {
        id: true,
        date: true,
        serviceName: true,
        status: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!barbeiro || barbeiro.length === 0) {
      return jsonResponse({ error: "Nenhum agendamento encontrado" }, 404);
    }

    return jsonResponse(barbeiro, 200);

  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "Erro ao buscar perfil do barbeiro" }, 500);
  }
}
