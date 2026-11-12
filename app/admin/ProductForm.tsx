"use client";

import { useActionState } from "react";
import { createProductAction, type FormState } from "@/app/actions";

export function ProductForm({ categories }: { categories: { slug: string; label: string }[] }) {
  const [state, action, pending] = useActionState(createProductAction, {} as FormState);
  const v = state.values ?? {};

  return (
    // La key vuelve a montar el formulario: limpio tras crear, con los datos previos si hubo error.
    <form action={action} className="form panel" key={state.key ?? 0}>
      <label>
        Nombre
        <input name="name" required minLength={2} maxLength={120} defaultValue={v.name} />
      </label>
      <label>
        Descripción
        <textarea name="description" required minLength={10} maxLength={2000} rows={4} defaultValue={v.description} />
      </label>
      <div className="form-row">
        <label>
          Categoría
          <select name="category" required defaultValue={v.category ?? ""}>
            <option value="" disabled>
              Elige una
            </option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Precio (S/)
          <input name="price" inputMode="decimal" placeholder="1299.90" required defaultValue={v.price} />
        </label>
        <label>
          Stock
          <input name="stock" type="number" min={0} step={1} required defaultValue={v.stock ?? "10"} />
        </label>
      </div>
      <label>
        Imagen (opcional)
        <input name="imageUrl" placeholder="https://… o /imagenes/foto.jpg" defaultValue={v.imageUrl} />
        <span className="hint">Si la dejas vacía, se usa una ilustración según la categoría.</span>
      </label>
      {state.error && (
        <p className="alert alert--error" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="alert alert--success" role="status">
          {state.success}
        </p>
      )}
      <button className="btn btn--primary" disabled={pending}>
        {pending ? "Guardando…" : "Agregar producto"}
      </button>
    </form>
  );
}
