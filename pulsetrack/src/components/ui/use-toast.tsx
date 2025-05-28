import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    if (variant === "destructive") {
      sonnerToast.error(title, {
        description,
        position: "bottom-right",
      })
    } else {
      sonnerToast(title, {
        description,
        position: "bottom-right",
      })
    }
  }

  return { toast }
} 