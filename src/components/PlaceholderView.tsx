import type { ReactNode } from "react";

import { PageHeader } from "./states";

interface PlaceholderViewProps {
  title: string;
  description: string;
  children?: ReactNode;
}

/**
 * Vista placeholder de scaffolding. Usa el `PageHeader` compartido para mantener el mismo
 * patrón de encabezado que el resto del frontend. Sin reglas de negocio.
 */
export function PlaceholderView({ title, description, children }: PlaceholderViewProps) {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <PageHeader title={title} description={description} />
      {children}
    </main>
  );
}
