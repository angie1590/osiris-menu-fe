import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { generarQr } from "../api";
import type { Mesa } from "../types";

/**
 * Acción de QR por mesa (REG-20-22). El payload/URL usa el `mesa.id` permanente; no genera
 * imagen ni impresión (eso es §32).
 */
export function MesaQrDialog({ mesa }: { mesa: Mesa }) {
  const fallbackUrl = `/qr/${mesa.id}`;
  const [url, setUrl] = useState<string>(fallbackUrl);

  const onOpenChange = (open: boolean) => {
    if (open) {
      generarQr(mesa.id)
        .then((qr) => setUrl(qr.url))
        .catch(() => setUrl(fallbackUrl));
    }
  };

  const copiar = () => {
    void navigator.clipboard?.writeText(url);
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Ver QR
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR de la mesa {mesa.numero_visible}</DialogTitle>
        </DialogHeader>
        <p className="mb-2 text-sm text-slate-500">
          El QR usa el identificador permanente de la mesa.
        </p>
        <code data-testid="qr-url" className="block break-all rounded bg-slate-100 p-2 text-xs">
          {url}
        </code>
        <Button type="button" className="mt-3" onClick={copiar}>
          Copiar URL QR
        </Button>
      </DialogContent>
    </Dialog>
  );
}
