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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updatePassword } from "@/features/auth/actions";
import { ROUTES } from "@/lib/constants";

const schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export function UpdatePasswordForm({
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
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await updatePassword(data);
      router.push(ROUTES.DASHBOARD);
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
            {dictionary.Auth.updatePassword.title}
          </CardTitle>
          <CardDescription>
            {dictionary.Auth.updatePassword.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <Input
                id="password"
                type="password"
                placeholder={dictionary.Auth.updatePassword.placeholder}
                label={dictionary.Common.password}
                error={errors.password?.message}
                {...register("password")}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? dictionary.Auth.updatePassword.submitting
                  : dictionary.Auth.updatePassword.submit}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
