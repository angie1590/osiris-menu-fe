import type { ReactNode } from "react";

interface PlaceholderViewProps {
  title: string;
  description: string;
  children?: ReactNode;
}

/**
 * Vista placeholder de scaffolding. Sin reglas de negocio: sólo consume el contrato del
 * backend en propuestas funcionales posteriores.
 */
export function PlaceholderView({ title, description, children }: PlaceholderViewProps) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-slate-500">{description}</p>
      {children}
    </main>
  );
}
