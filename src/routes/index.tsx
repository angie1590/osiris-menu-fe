import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

// Code splitting por ruta: cada vista es su propio chunk (PEND-FE-PERF-01).
const Mesero = lazy(() => import("@/views/mesero/Mesero").then((m) => ({ default: m.Mesero })));
const Cocina = lazy(() => import("@/views/cocina/Cocina").then((m) => ({ default: m.Cocina })));
const Barra = lazy(() => import("@/views/barra/Barra").then((m) => ({ default: m.Barra })));
const Caja = lazy(() => import("@/views/caja/Caja").then((m) => ({ default: m.Caja })));
const Admin = lazy(() => import("@/views/admin/Admin").then((m) => ({ default: m.Admin })));
const PublicoQR = lazy(() =>
  import("@/views/publico/PublicoQR").then((m) => ({ default: m.PublicoQR })),
);

/** Rutas de los seis perfiles operativos (D-g/D-k). */
export const routes: RouteObject[] = [
  { path: "/", element: <Navigate to="/admin" replace /> },
  { path: "/mesero", element: <Mesero /> },
  { path: "/cocina", element: <Cocina /> },
  { path: "/barra", element: <Barra /> },
  { path: "/caja", element: <Caja /> },
  { path: "/admin", element: <Admin /> },
  { path: "/qr/:mesaId", element: <PublicoQR /> },
];
