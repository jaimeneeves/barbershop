import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <Image
          src="/logo.png"
          alt="Barbershop Logo"
          width={150}
          height={150}
          className="mb-6"
        />
        <h1 className="text-2xl font-bold mb-4">Welcome to Barbershop</h1>
        <p className="text-gray-600">Your one-stop solution for all grooming needs.</p>
      </div>
    </div>
  );
}
