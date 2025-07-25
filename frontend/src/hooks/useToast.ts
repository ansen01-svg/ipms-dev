import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({
      title,
      description,
      type = "info",
      duration = 5000,
    }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);

      const newToast: Toast = {
        id,
        title,
        description,
        type,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove toast after duration
      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const dismiss = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    toast,
    dismiss,
    dismissAll,
  };
}

// Helper functions for common toast types
export const useToastHelpers = () => {
  const { toast } = useToast();

  return {
    success: (title: string, description?: string) =>
      toast({ title, description, type: "success" }),
    error: (title: string, description?: string) =>
      toast({ title, description, type: "error" }),
    warning: (title: string, description?: string) =>
      toast({ title, description, type: "warning" }),
    info: (title: string, description?: string) =>
      toast({ title, description, type: "info" }),
  };
};
