import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { type ZonaFormValues, zonaFormSchema } from "./formSchemas";

interface ZonaFormProps {
  onSubmit: (values: ZonaFormValues) => void;
  submitting?: boolean;
}

export function ZonaForm({ onSubmit, submitting }: ZonaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ZonaFormValues>({ resolver: zodResolver(zonaFormSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <label className="text-sm font-medium">
        Nombre <span className="text-rose-600">*</span>
        <input className="mt-1 w-full rounded border px-2 py-1" {...register("nombre")} />
      </label>
      {errors.nombre ? <p className="text-xs text-rose-600">{errors.nombre.message}</p> : null}

      <label className="text-sm font-medium">
        Aforo máximo
        <input
          type="number"
          className="mt-1 w-full rounded border px-2 py-1"
          {...register("aforo_max")}
        />
      </label>
      {errors.aforo_max ? <p className="text-xs text-rose-600">{errors.aforo_max.message}</p> : null}

      <Button type="submit" disabled={submitting}>
        Crear zona
      </Button>
    </form>
  );
}
