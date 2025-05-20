// context/AzureProvider.tsx
"use client"
import { createContext, useContext, useState } from "react";

type AzureContextType = {
  open: boolean;
  title: string;
  description: string;
  handleOpen: () => void;
  setTitle: (title: string) => void;
  setDescription: (desc: string) => void;
  setOnConfirm: (cb: () => void) => void;
  onConfirm: () => void;
};

const AzureContext = createContext<AzureContextType | null>(null);

export const AzureProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [confirmFn, setConfirmFn] = useState<() => void>(() => () => {});

  const handleOpen = () => setOpen((prev) => !prev);
  const onConfirm = () => {
    confirmFn?.();
    handleOpen();
  };

  return (
    <AzureContext.Provider
      value={{
        open,
        title,
        description,
        handleOpen,
        setTitle,
        setDescription,
        setOnConfirm: (fn) => setConfirmFn(() => fn),
        onConfirm,
      }}
    >
      {children}
    </AzureContext.Provider>
  );
};

export const useAzure = () => {
  const context = useContext(AzureContext);
  if (!context) {
    throw new Error("useAzure must be used within AzureProvider");
  }
  return context;
};
