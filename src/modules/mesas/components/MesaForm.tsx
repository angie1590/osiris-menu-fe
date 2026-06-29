import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { type MesaFormValues, mesaFormSchema } from "./formSchemas";

interface MesaFormProps {
  zonaId: string;
  onSubmit: (values: MesaFormValues) => void;
  submitting?: boolean;
}

export function MesaForm({ zonaId, onSubmit, submitting }: MesaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MesaFormValues>({
    resolver: zodResolver(mesaFormSchema),
    defaultValues: { zona_id: zonaId, capacidad: 0 },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <input type="hidden" {...register("zona_id")} />
      <label className="text-sm font-medium">
        Número visible <span className="text-rose-600">*</span>
        <input className="mt-1 w-full rounded border px-2 py-1" {...register("numero_visible")} />
      </label>
      {errors.numero_visible ? (
        <p className="text-xs text-rose-600">{errors.numero_visible.message}</p>
      ) : null}

      <label className="text-sm font-medium">
        Capacidad
        <input
          type="number"
          className="mt-1 w-full rounded border px-2 py-1"
          {...register("capacidad")}
        />
      </label>
      {errors.capacidad ? <p className="text-xs text-rose-600">{errors.capacidad.message}</p> : null}

      <Button type="submit" disabled={submitting}>
        Crear mesa
      </Button>
    </form>
  );
}
