"use client"
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAzure } from "@/providers/assure-provider";

const Assure = () => {
  const { open, handleOpen, title, description, onConfirm } = useAzure();

  return (
    <AlertDialog open={open} onOpenChange={handleOpen}>
      <AlertDialogContent className="bg-themeBlack">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-themeBlack hover:bg-themeGray">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>{handleOpen(); onConfirm()}}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Assure;
