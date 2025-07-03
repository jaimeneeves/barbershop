import prisma from "@/lib/prisma";
import { jsonResponse } from "@/utils/response";

export async function GET() {
  try {
    const barbeiros = await prisma.user.findMany({
      where: { role: "BARBER" },
      select: {
        id: true,
        name: true,
      },
    });

    return jsonResponse(barbeiros, 200);
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "Erro ao buscar barbeiros" }, 500);
  }
}
