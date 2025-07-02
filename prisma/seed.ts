import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Criação de serviços
  const corte = await prisma.service.create({
    data: {
      name: 'Corte de cabelo',
      duration: 30,
      price: 50.0,
    },
  })

  const barba = await prisma.service.create({
    data: {
      name: 'Barba',
      duration: 20,
      price: 35.0,
    },
  })

  // Criação de barbeiro
  const barbeiro = await prisma.user.create({
    data: {
      name: 'João Barbeiro',
      email: 'joao@barbearia.com',
      password: 'senhaSegura123',
      role: 'BARBER',
      availability: {
        create: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' }, // Segunda
          { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
        ],
      },
    },
  })

  // Criação de cliente
  const cliente = await prisma.user.create({
    data: {
      name: 'Maria Cliente',
      email: 'maria@cliente.com',
      password: 'senhaSegura456',
      role: 'CLIENT',
      Loyalty: {
        create: {
          points: 20,
        },
      },
    },
  })

  // Agendamento
  await prisma.appointment.create({
    data: {
      date: new Date(),
      userId: cliente.id,
      barberId: barbeiro.id,
      serviceId: corte.id,
      serviceName: corte.name,
    },
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
