"use client";

import { useDictionary } from "@/hooks/use-dictionary";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ROUTES } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { signup } from "@/features/auth/actions";
import { emailSchema, passwordSchema } from "../schemas";

const schema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    repeatPassword: passwordSchema,
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "passwordsDontMatch",
    path: ["repeatPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function SignUpForm({
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
      repeatPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await signup({ email: data.email, password: data.password });
      router.replace(ROUTES.SIGN_UP_SUCCESS);
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
            {dictionary.Auth.signup.title}
          </CardTitle>
          <CardDescription>
            {dictionary.Auth.signup.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <Input
                id="email"
                type="email"
                label={dictionary.Common.email}
                placeholder="m@example.com"
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
              <Input
                id="repeat-password"
                type="password"
                label={dictionary.Common.confirmPassword}
                error={errors.repeatPassword?.message}
                {...register("repeatPassword")}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? dictionary.Auth.signup.submitting
                  : dictionary.Auth.signup.submit}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {dictionary.Auth.signup.hasAccount}{" "}
              <Link href="/login" className="underline underline-offset-4">
                {dictionary.Auth.signup.loginLink}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
