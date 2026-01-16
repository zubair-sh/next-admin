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
import { ROUTES } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { emailSchema, passwordSchema } from "../schemas";
import { useAuth } from "../hooks/useAuth";

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
  const { signup, isLoading } = useAuth();
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
    await signup(data);
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
              <Button type="submit" className="w-full" isLoading={isLoading}>
                {dictionary.Auth.signup.submit}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {dictionary.Auth.signup.hasAccount}{" "}
              <Link
                href={ROUTES.LOGIN}
                className="underline underline-offset-4"
              >
                {dictionary.Auth.signup.loginLink}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
