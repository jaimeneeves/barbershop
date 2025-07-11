'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner"

export default function SignInGoogleButton() {
  const [loading, setLoading] = useState(false);

   const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn('google', { redirectTo: "/perfil" });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setLoading(false);
      toast.error('Erro ao entrar com Google. Tente novamente.');
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
      onClick={handleLogin}
      disabled={loading}
    >
      {/* <ShieldCheck className="h-5 w-5 text-blue-600" /> */}
      {/* <Icon className="mr-2 h-4 w-4" path={mdiGoogle} size={1} /> */}
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Redirecionando...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          Entrar com Google
        </>
      )}
    </Button>
  );
}
