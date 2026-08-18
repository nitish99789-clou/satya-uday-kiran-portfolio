import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export type FieldDef = { key: string; label: string; type?: "text" | "textarea" | "number" };

type Row = Record<string, unknown> & { id: string };

export function CrudSection({
  table,
  title,
  fields,
  defaults,
}: {
  table: "services" | "experience" | "social_links" | "statistics";
  title: string;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
}) {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: [table] });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from(table)
        .insert({ ...defaults, sort_order: rows.length + 1 } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Item added");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Item deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const save = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { error } = await supabase
        .from(table)
        .update(values as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={() => create.mutate()}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      <div className="grid gap-4">
        {rows.map((row) => (
          <RowEditor
            key={row.id}
            row={row}
            fields={fields}
            onSave={(values) => save.mutate({ id: row.id, values })}
            onDelete={() => remove.mutate(row.id)}
          />
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">Nothing here yet.</p>}
      </div>
    </section>
  );
}

function RowEditor({
  row,
  fields,
  onSave,
  onDelete,
}: {
  row: Row;
  fields: FieldDef[];
  onSave: (values: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(
    Object.fromEntries(fields.map((f) => [f.key, row[f.key] ?? ""])),
  );

  return (
    <div className="panel space-y-3 rounded-2xl border border-border p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className="block text-sm">
            <span className="text-muted-foreground">{f.label}</span>
            {f.type === "textarea" ? (
              <textarea
                rows={3}
                value={String(values[f.key] ?? "")}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className="mt-1 w-full resize-none rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:border-primary"
              />
            ) : (
              <input
                type={f.type === "number" ? "number" : "text"}
                value={String(values[f.key] ?? "")}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                  })
                }
                className="mt-1 w-full rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:border-primary"
              />
            )}
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(values)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Save className="h-4 w-4" /> Save
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-2 rounded-xl border border-destructive px-4 py-2 text-sm font-semibold text-destructive"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>
    </div>
  );
}
