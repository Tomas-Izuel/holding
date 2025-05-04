import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 lg:max-w-[50%]">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mt-16 space-y-2">
            <h1 className="text-4xl font-bold">¡Hola!</h1>
            <h2 className="text-4xl font-bold">Nos alegra verte de nuevo</h2>
            <p className="text-muted-foreground">
              Inicia sesión para continuar
            </p>
          </div>

          <div className="mt-10">
            <LoginForm />
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
              src="/login-vector.svg"
              alt="Login security illustration"
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
                  className="lucide lucide-check"
                >
                  <polyline points="20 6 9 17 4 12" />
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
                  className="lucide lucide-lock"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
