import { Navigate, type RouteObject } from "react-router-dom";

import { Admin } from "@/views/admin/Admin";
import { Barra } from "@/views/barra/Barra";
import { Caja } from "@/views/caja/Caja";
import { Cocina } from "@/views/cocina/Cocina";
import { Mesero } from "@/views/mesero/Mesero";
import { PublicoQR } from "@/views/publico/PublicoQR";

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
