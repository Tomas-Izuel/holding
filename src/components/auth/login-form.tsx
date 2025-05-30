"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema, LoginSchemaType } from "@/types/auth.type";
import { login } from "@/server/services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginSchemaType) {
    try {
      const response = await login(data);
      if (response instanceof Error) {
        throw response;
      }
      router.push(`/dashboard`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al iniciar sesión";
      toast.error(errorMessage);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="stanley@gmail.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="••••••••••••" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
          loading={form.formState.isSubmitting}
        >
          Iniciar sesión
        </Button>

        <div className="text-center text-sm">
          No tienes una cuenta?
          <Link href="/register" className="text-primary hover:underline">
            Regístrate
          </Link>
        </div>
      </form>
    </Form>
  );
}
