"use client";
import type { z } from "zod";
import { useSession } from "next-auth/react";
import { userSettingsSchema } from "@/schemas/user-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { TransitionStartFunction } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { updateUserAction } from "@/actions/users";

type Props = {
  isPending: boolean;
  startTransition: TransitionStartFunction;
};

function EditAccountSection({ isPending, startTransition }: Props) {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof userSettingsSchema>>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      name: session?.user.name,
    },
  });
  async function onSubmit(values: z.infer<typeof userSettingsSchema>) {
    startTransition(async () => {
      const response = await updateUserAction(values);
      await update();
      toast({
        variant: response.message ? "success" : "destructive",
        title: response.message ?? response.error,
      });
    });
  }
  return (
    <section className="mb-3">
      <h1 className="text-3xl font-bold">User Settings</h1>
      <hr className="my-2" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="John Doe"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Your name is shown to the public
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} type="submit">
            Update Profile
          </Button>
        </form>
      </Form>
    </section>
  );
}

export default EditAccountSection;
