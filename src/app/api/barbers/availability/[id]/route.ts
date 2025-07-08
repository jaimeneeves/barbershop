import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { jsonResponse } from "@/utils/response";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonResponse({ error: "Não autenticado" }, 401);
  }

  if (!session.user.email) {
    return jsonResponse({ error: "Email não encontrado" }, 400);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "BARBER") {
      return jsonResponse({ error: "Access denied" }, 403);
    }

    await prisma.barberAvailability.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return jsonResponse({ success: true }, 200);
  } catch (error) {
    return jsonResponse({ error: "Erro ao processar a sessão" }, 500);
  }
}
