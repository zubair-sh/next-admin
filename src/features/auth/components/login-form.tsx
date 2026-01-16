"use client";

import { useDictionary } from "@/hooks/use-dictionary";

import { cn } from "@/lib/utils";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { login } from "@/features/auth/actions";
import { toast } from "sonner";
import { useState } from "react";
import { ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { emailSchema, passwordSchema } from "../schemas";

const schema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

type FormValues = z.infer<typeof schema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const dictionary = useDictionary();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await login(data);
      router.replace(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Invalid credentials"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {dictionary.Auth.login.title}
          </CardTitle>
          <CardDescription>{dictionary.Auth.login.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <Input
                id="email"
                type="email"
                label={dictionary.Common.email}
                placeholder={dictionary.Auth.login.emailPlaceholder}
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                id="password"
                type="password"
                label={dictionary.Common.password}
                error={errors.password?.message}
                {...register("password")}
              />
              <Link
                href={ROUTES.FORGOT_PASSWORD}
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                {dictionary.Auth.login.forgotPassword}
              </Link>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? dictionary.Auth.login.submitting
                  : dictionary.Auth.login.submit}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {dictionary.Auth.login.noAccount}{" "}
              <Link
                href={ROUTES.SIGN_UP}
                className="underline underline-offset-4"
              >
                {dictionary.Auth.login.signupLink}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
