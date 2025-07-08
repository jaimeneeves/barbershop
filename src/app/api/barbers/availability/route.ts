import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { jsonResponse } from "@/utils/response";

async function createAvailability(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonResponse({ error: "Não autenticado" }, 401);
  }
  
  const body = await req.json();

  if (!session?.user?.email) {
    return jsonResponse({ error: "Email não encontrado" }, 400);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== "BARBER") {
    return jsonResponse({ error: "Access denied" }, 403);
  }

  const { dayOfWeek, startTime, endTime } = body;

  if (
    typeof dayOfWeek !== "number" ||
    !startTime ||
    !endTime ||
    startTime >= endTime
  ) {
    return jsonResponse({ error: "Dados inválidos" }, 400);
  }

  const created = await prisma.barberAvailability.create({
    data: {
      dayOfWeek,
      startTime,
      endTime,
      barberId: user.id,
    },
  });
  return jsonResponse(created, 201);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonResponse({ error: "Não autenticado" }, 401);
  }

  if(!session.user.email) {
    return jsonResponse({ error: "Email não encontrado" }, 400);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== "BARBER") {
    return jsonResponse({ error: "Access denied" }, 403);
  }

  const availability = await prisma.barberAvailability.findMany({
    where: { barberId: user.id },
    orderBy: { dayOfWeek: "asc" },
  });

  return jsonResponse(availability, 200);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonResponse({ error: "Não autenticado" }, 401);
  }

  try {
    return await createAvailability(req);
  } catch (error) {
    console.error("Erro ao criar disponibilidade:", error);
    return jsonResponse({ error: "Erro ao criar disponibilidade" }, 500);
  }
}