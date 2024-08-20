"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createOrEditGroupSchema,
  type CreateOrEditGroupInput,
} from "@/zod/groups";
import { createGroup, editGroup } from "@/actions/groups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

type CreateOrEditGroupProps = {
  groupId?: string;
  initialData?: CreateOrEditGroupInput;
};

export function CreateOrEditGroup({
  groupId,
  initialData,
}: CreateOrEditGroupProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<CreateOrEditGroupInput>({
    resolver: zodResolver(createOrEditGroupSchema),
    defaultValues: initialData ?? {
      name: "",
      description: "",
      isPrivate: true,
    },
  });

  const onSubmit = (data: CreateOrEditGroupInput) => {
    startTransition(async () => {
      const result = groupId
        ? await editGroup(groupId, data)
        : await createGroup(data);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        toast({
          variant: "success",
          title: "Success",
          description: `Group has been ${groupId ? "updated" : "created"} successfully!`,
        });
        if (!groupId) form.reset();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={isPending} {...field} />
              </FormControl>
              <FormDescription>Enter the group name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea disabled={isPending} {...field} />
              </FormControl>
              <FormDescription>
                Provide an optional description for your group
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Private Group</FormLabel>
                <FormDescription>
                  Make this group private and invite-only
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending
            ? groupId
              ? "Updating..."
              : "Creating..."
            : groupId
              ? "Update Group"
              : "Create Group"}
        </Button>
      </form>
    </Form>
  );
}
