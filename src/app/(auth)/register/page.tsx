import { RegisterForm } from "@/components/auth/register-form";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 lg:max-w-[50%]">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mt-16 space-y-2">
            <h1 className="text-4xl font-bold">¡Bienvenido!</h1>
            <h2 className="text-4xl font-bold">Crea tu cuenta</h2>
            <p className="text-muted-foreground">Regístrate para comenzar</p>
          </div>

          <div className="mt-10">
            <RegisterForm />
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-1 bg-primary/90 rounded-l-3xl relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[10%] left-[10%] w-24 h-24 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-[20%] right-[15%] w-32 h-32 bg-white/20 rounded-full"></div>
          <div className="absolute top-[40%] right-[10%] w-16 h-16 bg-white/20 rounded-full"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="max-w-md p-6">
            <Image
              src="/register-vector.svg"
              alt="Register security illustration"
              width={1000}
              height={1000}
              className="drop-shadow-2xl rounded-lg"
            />

            <div className="absolute top-[20%] right-[30%] bg-white/90 dark:bg-slate-800 p-3 rounded-full shadow-lg">
              <div className="text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user-plus"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </div>
            </div>

            <div className="absolute bottom-[30%] right-[20%] bg-white/90 dark:bg-slate-800 p-3 rounded-lg shadow-lg">
              <div className="text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-shield-check"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
