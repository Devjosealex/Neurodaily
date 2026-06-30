import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4">
      <div className="space-y-6 w-full max-w-md">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gradient">NeuroDaily</h1>
          <p className="text-muted-foreground text-sm">Bienvenido de vuelta</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-lg border border-border rounded-2xl',
            },
          }}
        />
      </div>
    </div>
  );
}
