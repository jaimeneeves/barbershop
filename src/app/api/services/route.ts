import prisma from "@/lib/prisma";
import { jsonResponse } from "@/utils/response";

export async function GET() {
  try {
    const servicos = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return jsonResponse(servicos, 200);
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "Erro ao buscar serviços" }, 500);
  }
}