import { useParams } from "react-router-dom";

import { PlaceholderView } from "@/components/PlaceholderView";

export function PublicoQR() {
  // `mesaId` es el identificador permanente de la mesa codificado en el QR (D-04/D-k).
  const { mesaId } = useParams<{ mesaId: string }>();
  return (
    <PlaceholderView
      title="Carta pública QR"
      description={`Carta pública por QR de mesa (§32). Mesa: ${mesaId ?? "—"}. Placeholder de scaffolding.`}
    />
  );
}
