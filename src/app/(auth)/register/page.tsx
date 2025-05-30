import { RegisterForm } from "@/components/auth/register-form";
import { UserPlus, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 lg:max-w-[50%] relative">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
          <Link href="/" className="flex items-center space-x-3 mb-12">
            <Image
              src="/HoldIn-colorized.svg"
              alt="Holding logo"
              width={120}
              height={60}
            />
          </Link>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              ¡Bienvenido!
            </h1>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              Crea tu cuenta
            </h2>
            <p className="text-muted-foreground text-lg">
              Regístrate para comenzar
            </p>
          </div>

          <div className="mt-10 relative">
            <div className="absolute -left-10 -top-10 w-20 h-20 bg-primary/5 rounded-full blur-xl" />
            <div className="absolute -right-10 -bottom-10 w-20 h-20 bg-primary/5 rounded-full blur-xl" />
            <RegisterForm />
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/80 to-primary/40 rounded-l-3xl relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-[10%] left-[10%] w-24 h-24 bg-white/10 rounded-full blur-sm"></div>
          <div className="absolute bottom-[20%] right-[15%] w-32 h-32 bg-white/10 rounded-full blur-sm"></div>
          <div className="absolute top-[40%] right-[10%] w-16 h-16 bg-white/10 rounded-full blur-sm"></div>

          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--primary-foreground)_0%,_transparent_70%)] opacity-10"></div>

          {/* Grid pattern */}
          <div className="absolute inset-0 backdrop-blur-[100px] opacity-30">
            <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="max-w-md p-6 text-center">
            {/* Abstract visualization instead of image */}
            <div className="relative h-80 w-80 mx-auto">
              {/* Central circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary-foreground/20 rounded-full backdrop-blur-md border border-primary-foreground/30"></div>

              {/* User Plus icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary/90 p-8 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                <UserPlus className="h-12 w-12 text-primary-foreground" />
              </div>

              {/* Orbiting elements */}
              <div className="absolute top-[20%] right-[30%] bg-primary-foreground/90 p-3 rounded-full shadow-lg animate-pulse">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>

              <div className="absolute bottom-[30%] right-[20%] bg-primary-foreground/90 p-3 rounded-lg shadow-lg">
                <Lock className="h-6 w-6 text-primary" />
              </div>

              {/* Connection lines */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full border-2 border-primary-foreground/20 rounded-full"></div>
                <div className="absolute w-3/4 h-3/4 border-2 border-primary-foreground/10 rounded-full"></div>
                <div className="absolute w-1/2 h-1/2 border-2 border-primary-foreground/5 rounded-full"></div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-primary-foreground mt-8">
              Únete a Holding
            </h3>
            <p className="text-primary-foreground/70 mt-2">
              Comienza a monitorear tus inversiones con los mejores análisis
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
