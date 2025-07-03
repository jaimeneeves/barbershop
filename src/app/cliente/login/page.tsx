export const dynamic = "force-dynamic";
import LoginCliente from "@/components/cliente/LoginCliente";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <LoginCliente />
    </div>
  );
}