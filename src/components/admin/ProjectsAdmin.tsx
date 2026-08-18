import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Plus, Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { allProjectsQuery, resolveThumbnail, type Project } from "@/lib/portfolio";

export function ProjectsAdmin() {
  const qc = useQueryClient();
  const { data: projects = [] } = useQuery(allProjectsQuery);
  const invalidate = () => qc.invalidateQueries({ queryKey: ["projects"] });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("projects")
        .insert({ title: "NEW PROJECT", sort_order: projects.length + 1 });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Project created");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Projects</h2>
        <button
          onClick={() => create.mutate()}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>
      <div className="grid gap-4">
        {projects.map((p) => (
          <ProjectEditor key={p.id} project={p} onChanged={invalidate} />
        ))}
      </div>
    </section>
  );
}

function ProjectEditor({ project, onChanged }: { project: Project; onChanged: () => void }) {
  const [form, setForm] = useState<Project>(project);
  const [busy, setBusy] = useState(false);

  const { data: preview } = useQuery({
    queryKey: ["thumb", project.id, form.thumbnail_url],
    queryFn: () => resolveThumbnail(form.thumbnail_url),
  });

  async function save(next?: Partial<Project>) {
    setBusy(true);
    const payload = { ...form, ...next };
    const { error } = await supabase
      .from("projects")
      .update({
        title: payload.title,
        subtitle: payload.subtitle,
        category: payload.category,
        description: payload.description,
        video_url: payload.video_url,
        thumbnail_url: payload.thumbnail_url,
        published: payload.published,
        sort_order: Number(payload.sort_order),
      })
      .eq("id", project.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    setForm(payload as Project);
    onChanged();
    toast.success("Project saved");
  }

  async function remove() {
    const { error } = await supabase.from("projects").delete().eq("id", project.id);
    if (error) return toast.error(error.message);
    onChanged();
    toast.success("Project deleted");
  }

  async function upload(file: File) {
    setBusy(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${project.id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("thumbnails").upload(path, file, { upsert: true });
    setBusy(false);
    if (error) return toast.error(error.message);
    setForm({ ...form, thumbnail_url: path });
    await save({ thumbnail_url: path });
  }

  return (
    <div className="panel grid gap-4 rounded-2xl border border-border p-5 md:grid-cols-[220px_1fr]">
      <div className="space-y-3">
        <div className="aspect-video overflow-hidden rounded-xl border border-border bg-input/40">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              No thumbnail
            </div>
          )}
        </div>
        <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-sm">
          <Upload className="h-4 w-4" /> Upload thumbnail
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
            }}
          />
        </label>
      </div>

      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <Field
            label="Subtitle"
            value={form.subtitle}
            onChange={(v) => setForm({ ...form, subtitle: v })}
          />
          <Field
            label="Category"
            value={form.category}
            onChange={(v) => setForm({ ...form, category: v })}
          />
          <Field
            label="Order"
            value={String(form.sort_order)}
            onChange={(v) => setForm({ ...form, sort_order: Number(v) || 0 })}
          />
          <Field
            label="YouTube / Vimeo URL"
            value={form.video_url ?? ""}
            onChange={(v) => setForm({ ...form, video_url: v })}
          />
        </div>
        <label className="block text-sm">
          <span className="text-muted-foreground">Description</span>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full resize-none rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:border-primary"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            disabled={busy}
            onClick={() => void save()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            <Save className="h-4 w-4" /> Save
          </button>
          <button
            onClick={() => void save({ published: !form.published })}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold"
          >
            {form.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {form.published ? "Unpublish" : "Publish"}
          </button>
          <span
            className={
              form.published
                ? "self-center rounded-full bg-primary/15 px-3 py-1 text-xs text-primary"
                : "self-center rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
            }
          >
            {form.published ? "Live" : "Draft"}
          </span>
          <button
            onClick={() => void remove()}
            className="ml-auto inline-flex items-center gap-2 rounded-xl border border-destructive px-4 py-2 text-sm font-semibold text-destructive"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:border-primary"
      />
    </label>
  );
}
