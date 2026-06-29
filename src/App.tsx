import { Suspense } from "react";
import { useRoutes } from "react-router-dom";

import { routes } from "@/routes";

export function App() {
  const element = useRoutes(routes);
  return <Suspense fallback={<div className="p-8">Cargando…</div>}>{element}</Suspense>;
}
