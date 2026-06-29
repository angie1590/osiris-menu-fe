import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Estados compartidos de datos: idénticos en todas las vistas del frontend. */

export function LoadingState({ message = "Cargando…" }: { message?: string }) {
  return (
    <div
      role="status"
      data-testid="loading-state"
      className="flex items-center justify-center gap-2 p-8 text-slate-500"
    >
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{message}</span>
    </div>
  );
}

export function EmptyState({
  message = "No hay datos.",
  action,
}: {
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div
      data-testid="empty-state"
      className="flex flex-col items-center justify-center gap-2 p-8 text-center text-slate-500"
    >
      <Inbox className="h-6 w-6" />
      <p>{message}</p>
      {action}
    </div>
  );
}

export function ErrorState({
  message = "Ocurrió un error.",
  action,
}: {
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div
      role="alert"
      data-testid="error-state"
      className="flex flex-col items-center justify-center gap-2 p-8 text-center text-rose-600"
    >
      <AlertCircle className="h-6 w-6" />
      <p>{message}</p>
      {action}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-6 flex flex-wrap items-start justify-between gap-3", className)}>
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

interface DataStateProps {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  emptyAction?: ReactNode;
  children: ReactNode;
}

/**
 * Envoltorio que estandariza loading/empty/error. Si ninguno aplica, renderiza `children`.
 * Garantiza que los tres estados se vean iguales en todo el frontend.
 */
export function DataState({
  isLoading,
  isError,
  isEmpty,
  loadingMessage,
  errorMessage,
  emptyMessage,
  emptyAction,
  children,
}: DataStateProps) {
  if (isLoading) return <LoadingState message={loadingMessage} />;
  if (isError) return <ErrorState message={errorMessage} />;
  if (isEmpty) return <EmptyState message={emptyMessage} action={emptyAction} />;
  return <>{children}</>;
}
