import { toast as sonnerToast } from 'sonner';

type ToastProps = {
  title?: string;
  description?: string;
  duration?: number;
};

export const toast = ({ title, description, duration = 3000 }: ToastProps) => {
  sonnerToast(title, {
    description,
    duration,
  });
}; 