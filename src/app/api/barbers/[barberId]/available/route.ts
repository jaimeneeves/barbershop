import { parseISO, format, addMinutes, isBefore, startOfDay, endOfDay } from "date-fns";
import prisma from "@/lib/prisma";
import { jsonResponse } from "@/utils/response";

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
    const dayOfWeek = date.getDay(); // 0 (domingo) até 6 (sábado)

    // 1. Buscar disponibilidade do barbeiro no dia da semana
    const disponibilidade = await prisma.barberAvailability.findFirst({
      where: {
        barberId: barberId,
        dayOfWeek,
      },
    });

    if (!disponibilidade) {
      return jsonResponse({ horarios: [] }, 200);
    }

    const { startTime, endTime } = disponibilidade;

    // 2. Converter string de hora para objeto Date baseado na data
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    let current = new Date(date);
    current.setHours(startHour, startMinute, 0, 0);

    const end = new Date(date);
    end.setHours(endHour, endMinute, 0, 0);

    const interval = 30; // minutos entre horários
    const allSlots: string[] = [];

    while (isBefore(current, end) || current.getTime() === end.getTime()) {
      allSlots.push(format(current, "HH:mm"));
      current = addMinutes(current, interval);
    }

    // 3. Buscar agendamentos existentes neste dia
    const agendamentos = await prisma.appointment.findMany({
      where: {
        barberId: barberId,
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
    });

    const horariosOcupados = agendamentos.map((a) =>
      format(new Date(a.date), "HH:mm")
    );

    // 4. Filtrar horários disponíveis
    const horariosDisponiveis = allSlots.filter((h) => !horariosOcupados.includes(h));

    return jsonResponse({ horarios: horariosDisponiveis }, 200);
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "Erro ao buscar horários disponíveis" }, 500);
  }
}
