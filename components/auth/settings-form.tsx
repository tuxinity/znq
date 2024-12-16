"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { FormError } from "@/components/form-error";
import { SettingsSchema } from "@/schemas";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { settings } from "@/actions/settings";
import { FormSuccess } from "@/components/form-success";

export function SettingsForm() {
  const { user } = useCurrentUser();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      walletAddress: user?.walletAddress ?? undefined,
      name: user?.name ?? undefined,
      email: user?.email ?? undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role ?? UserRole.USER,
      isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then(data => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="walletAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wallet Address BEP20</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="0x0000" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button disabled={isPending} type="submit" variant="secondary">
          Save
        </Button>
      </form>
    </Form>
  );
}
