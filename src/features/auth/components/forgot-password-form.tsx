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
import { useState } from "react";
import { forgotPassword } from "@/features/auth/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [success, setSuccess] = useState(false);
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
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await forgotPassword(data);
      setSuccess(true);
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
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {dictionary.Auth.forgotPassword.successTitle}
            </CardTitle>
            <CardDescription>
              {dictionary.Auth.forgotPassword.successDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {dictionary.Auth.forgotPassword.successMessage}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {dictionary.Auth.forgotPassword.title}
            </CardTitle>
            <CardDescription>
              {dictionary.Auth.forgotPassword.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  label={dictionary.Common.email}
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? dictionary.Auth.forgotPassword.submitting
                    : dictionary.Auth.forgotPassword.submit}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {dictionary.Auth.forgotPassword.hasAccount}{" "}
                <Link href="/login" className="underline underline-offset-4">
                  {dictionary.Auth.forgotPassword.backToLogin}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
