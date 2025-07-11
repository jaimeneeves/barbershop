import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { jsonResponse } from "@/utils/response";
import { AppointmentStatus } from "@prisma/client";
import { startOfToday, endOfToday } from "date-fns"

const todayStart = startOfToday();
const todayEnd = endOfToday();

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonResponse({ error: "Não autenticado" }, 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sortBy") || null;
    const status = searchParams.get("status") || null;
    
    const page = parseInt(searchParams.get("page") || "1", 10);
    const size = parseInt(searchParams.get('size') || '10', 10);
    const skip = (page - 1) * size;
    const take = size;

    const whereCondition = {
      ...(sortBy === 'today' && { date: { gte: todayStart, lte: todayEnd } }),
      ...(status && { status: status.toLocaleUpperCase() as AppointmentStatus }),
    };

    const barbeiro = await prisma.appointment.findMany({
      where: {
        barberId: session.user.id,
        ...whereCondition,
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
      skip: skip,
      take: take,
    });

    if (!barbeiro || barbeiro.length === 0) {
      return jsonResponse({ error: "Nenhum agendamento encontrado" }, 200);
    }

    return jsonResponse({
      data: barbeiro,
      total: await prisma.appointment.count({
        where: {
          barberId: session.user.id,
          ...whereCondition,
        },
      }),
    }, 200);

  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "Erro ao buscar perfil do barbeiro" }, 500);
  }
}
