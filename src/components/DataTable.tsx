import type { ReactNode } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { EmptyState, ErrorState, LoadingState } from "./states";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  caption?: string;
}

const alignClass = { left: "text-left", right: "text-right", center: "text-center" } as const;

/**
 * Tabla/listado compartido de datos. Centraliza formato, espaciado, tipografía y los estados
 * loading/empty/error para que todas las vistas tabulares se vean iguales. Sin lógica de
 * negocio: recibe filas y columnas (con render de celda) ya resueltas por la vista.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  isLoading,
  isError,
  loadingMessage,
  errorMessage,
  emptyMessage = "No hay datos.",
  caption,
}: DataTableProps<T>) {
  if (isLoading) return <LoadingState message={loadingMessage} />;
  if (isError) return <ErrorState message={errorMessage} />;
  if (rows.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <Table>
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.id} className={alignClass[col.align ?? "left"]}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={getRowId(row)}>
            {columns.map((col) => (
              <TableCell key={col.id} className={`${alignClass[col.align ?? "left"]} ${col.className ?? ""}`}>
                {col.cell(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
