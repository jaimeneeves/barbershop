import prisma from "@/lib/prisma";
import { jsonResponse } from "@/utils/response";
import { parseISO, startOfDay, endOfDay } from "date-fns";

type Params = {
  barberId: string
}

export async function GET(request: Request, context: { params: Params }) {
  try {
    const { searchParams } = new URL(request.url);
    const barberId = context.params.barberId;
    const dateParam = searchParams.get("date");
    if (!dateParam) {
      return jsonResponse({ error: "Data não fornecida" }, 400);
    }

    const date = parseISO(dateParam);
    const busyAppointments = await prisma.appointment.findMany({
      where: {
        barberId: barberId,
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
      select: {
        date: true,
      },
    });

    const horarios = busyAppointments.map((a) => new Date(a.date).toISOString());

    return jsonResponse({ horarios }, 200);
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "Erro ao buscar horários ocupados" }, 500);
  }
}
