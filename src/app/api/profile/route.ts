import { auth } from "auth";
import prisma from "@/lib/prisma";
import { jsonResponse } from "@/utils/response";
import { startOfToday } from "date-fns";

export async function GET() {
  const session = await auth();
  if (!session || !session.user?.email) {
    return jsonResponse('Unauthorized', 401);
  }

  try {
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        appointmentsAsClient: {
          where: {
            date: {
              gte: startOfToday(),
            },
          },
          orderBy: {
            date: "asc",
          },
          select: {
            id: true,
            date: true,
            serviceName: true,
          },
        },
      },
    });

    if (!usuario) {
      return jsonResponse({ error: "Usuário não encontrado" }, 404);
    }

    return jsonResponse(usuario, 200);
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "Erro ao buscar dados do perfil" }, 500);
  }
}
