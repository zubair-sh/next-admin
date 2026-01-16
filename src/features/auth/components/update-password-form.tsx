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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { passwordSchema } from "../schemas";
import { useAuth } from "../hooks/useAuth";

const schema = z.object({
  password: passwordSchema,
});

type FormValues = z.infer<typeof schema>;

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { updatePassword, isLoading } = useAuth();
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
    await updatePassword(data);
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
              <Button type="submit" className="w-full" isLoading={isLoading}>
                {dictionary.Auth.updatePassword.submit}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
