import { jsonResponse } from "@/utils/response";
import { hash, compare } from "bcrypt";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonResponse({ error: "Não autenticado" }, 401);
  }
  try {
    const { oldPassword, newPassword } = await request.json();

    if (!oldPassword || !newPassword) {
      return jsonResponse({ error: "Senha antiga e nova são obrigatórias." }, 400);
    }

    const barberId = session.user.id;

    if (!barberId) {
      return jsonResponse({ error: "Barbeiro não encontrado." }, 404);
    }

    const barber = await prisma.user.findUnique({
      where: { id: barberId },
      select: { password: true },
    });

    if (!barber || !barber.password) {
      return jsonResponse({ error: "Barbeiro não encontrado ou senha inválida." }, 404);
    }

    const isOldPasswordValid = await compare(oldPassword, barber.password);
    if (!isOldPasswordValid) {
      return jsonResponse({ error: "Senha antiga está incorreta." }, 400);
    }

    const hashedNewPassword = await hash(newPassword, 12);
    if (hashedNewPassword === barber.password) {
      return jsonResponse({ error: "A nova senha não pode ser igual à senha antiga." }, 400);
    }

    const updatedBarber = await prisma.user.update({
      where: { id: barberId },
      data: { password: hashedNewPassword },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return jsonResponse(updatedBarber, 200);
  } catch (error) {
    console.error("[ERRO_ATUALIZACAO_SENHA]", error);
    return jsonResponse({ error: "Erro ao atualizar senha." }, 500);
  }
}

export async function GET() {
  return jsonResponse({ message: "Use POST to update password." }, 405);
}

export async function PUT() {
  return jsonResponse({ message: "Use POST to update password." }, 405);
}

export async function DELETE() {
  return jsonResponse({ message: "Use POST to update password." }, 405);
}