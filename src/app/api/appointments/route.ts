import { jsonResponse } from '@/utils/response';
import prisma from '@/lib/prisma'
import { parseISO, isBefore, format } from 'date-fns'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, barberId, serviceId, date } = body

    if (!userId || !barberId || !serviceId || !date) {
      return jsonResponse({ error: 'Dados incompletos' }, 40);
    }

    const parsedDate = parseISO(date)
    if (isBefore(parsedDate, new Date())) {
      return jsonResponse({ error: 'Não é possível agendar no passado' }, 400);
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } })
    if (!service) {
      return jsonResponse({ error: 'Serviço não encontrado' }, 404);
    }

    const dayOfWeek = parsedDate.getDay()
    const time = format(parsedDate, 'HH:mm')

    const availability = await prisma.barberAvailability.findFirst({
      where: {
        barberId,
        dayOfWeek,
        startTime: { lte: time },
        endTime: { gte: time },
      },
    })

    if (!availability) {
      return jsonResponse({ error: 'Horário fora da disponibilidade do barbeiro' }, 400);
    }

    const overlapping = await prisma.appointment.findFirst({
      where: {
        barberId,
        date: parsedDate,
      },
    })

    if (overlapping) {
      return jsonResponse({ error: 'Horário já reservado' }, 409);
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        barberId,
        serviceId,
        serviceName: service.name,
        date: parsedDate,
      },
    })

    return jsonResponse(appointment, 201)
  } catch (error) {
    console.error(error)
    return jsonResponse({ error: 'Erro interno do servidor' }, 500)
  }
}
