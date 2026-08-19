import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  thumbnail_url: string | null;
  video_url: string | null;
  published: boolean;
  sort_order: number;
};

export type Profile = {
  id: string;
  full_name: string;
  hero_intro: string;
  hero_line1: string;
  hero_line2_a: string;
  hero_line2_b: string;
  hero_description: string;
  about_eyebrow: string;
  about_heading: string;
  about_bio: string;
  work_heading: string;
  contact_heading: string;
  contact_description: string;
  location: string;
};

export type ProfileContact = { id: string; email: string; phone: string };

/** Admin-only: owner email/phone live in a private table, never exposed publicly. */
export const profileContactQuery = queryOptions({
  queryKey: ["profile_contact"],
  queryFn: async (): Promise<ProfileContact | null> => {
    const { data, error } = await supabase.from("profile_contact").select("*").limit(1).maybeSingle();
    if (error) throw error;
    return (data as ProfileContact | null) ?? null;
  },
});

export const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: async (): Promise<Profile | null> => {
    const { data, error } = await supabase.from("profile").select("*").limit(1).maybeSingle();
    if (error) throw error;
    return data as Profile | null;
  },
});

export const publishedProjectsQuery = queryOptions({
  queryKey: ["projects", "published"],
  queryFn: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Project[];
  },
});

export const allProjectsQuery = queryOptions({
  queryKey: ["projects", "all"],
  queryFn: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Project[];
  },
});

function listQuery<T>(table: "statistics" | "services" | "experience" | "social_links") {
  return queryOptions({
    queryKey: [table],
    queryFn: async (): Promise<T[]> => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

export type Stat = { id: string; label: string; value: string; icon: string; sort_order: number };
export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
};
export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  sort_order: number;
};
export type SocialLink = { id: string; platform: string; url: string; sort_order: number };

export const statisticsQuery = listQuery<Stat>("statistics");
export const servicesQuery = listQuery<Service>("services");
export const experienceQuery = listQuery<Experience>("experience");
export const socialLinksQuery = listQuery<SocialLink>("social_links");

/** Thumbnails live in a private bucket; resolve a temporary readable URL. */
export async function resolveThumbnail(value: string | null): Promise<string | null> {
  if (!value) return null;
  if (/^https?:\/\//.test(value)) return value;
  const { data } = await supabase.storage.from("thumbnails").createSignedUrl(value, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? null;
}

export function thumbnailsQuery(projects: Project[]) {
  return queryOptions({
    queryKey: ["thumbnails", projects.map((p) => `${p.id}:${p.thumbnail_url ?? ""}`).join("|")],
    queryFn: async (): Promise<Record<string, string>> => {
      const entries = await Promise.all(
        projects.map(async (p) => [p.id, await resolveThumbnail(p.thumbnail_url)] as const),
      );
      return Object.fromEntries(entries.filter(([, url]) => !!url) as [string, string][]);
    },
  });
}
