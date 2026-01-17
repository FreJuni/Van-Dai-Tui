"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteDiscount } from "@/server/actions/discount";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface DeleteDiscountButtonProps {
  id: string;
  onSuccess?: () => void;
}

export function DeleteDiscountButton({ id, onSuccess }: DeleteDiscountButtonProps) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Dashboard.discounts");
  const commonT = useTranslations("Dashboard.locations.delete"); // Reusing common delete confirm translations if possible or define own

  const onDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteDiscount({ id });
        if (result?.data?.success) {
          toast.success(t("toast.deleted"));
          onSuccess?.();
        } else {
          toast.error(t("toast.error"));
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{commonT("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {commonT("desc")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500 cursor-pointer"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
