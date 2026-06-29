import { Button } from "@/components/ui/button";
import { PlaceholderView } from "@/components/PlaceholderView";

export function Admin() {
  return (
    <PlaceholderView
      title="Admin"
      description="Configuración de negocio y del sistema (§31). Placeholder de scaffolding."
    >
      <Button className="mt-4" variant="outline">
        Acción de ejemplo
      </Button>
    </PlaceholderView>
  );
}
