import prisma from "@/lib/prisma";
import { jsonResponse } from "@/utils/response";
import { hash } from "bcrypt";

export async function GET() {
  try {
    const barber = await prisma.user.findMany({
      where: { role: "BARBER" },
      select: {
        id: true,
        name: true,
      },
    });

    return jsonResponse(barber, 200);
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "Erro ao buscar barbeiros" }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return jsonResponse({ error: "Nome, email e senha são obrigatórios." }, 400)
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return jsonResponse({ error: "Email já cadastrado." }, 409)
    }

    const hashedPassword = await hash(password, 12)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "BARBER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return jsonResponse(newUser, 201)
  } catch (error) {
    console.error("[ERRO_CADASTRO_BARBEIRO]", error)
    return jsonResponse({ error: "Erro ao criar barbeiro." }, 500)
  }
}
