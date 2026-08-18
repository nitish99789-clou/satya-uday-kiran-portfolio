create policy "thumbnails public read" on storage.objects for select using (bucket_id = 'thumbnails');
create policy "thumbnails admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'thumbnails' and public.is_admin());
create policy "thumbnails admin update" on storage.objects for update to authenticated using (bucket_id = 'thumbnails' and public.is_admin()) with check (bucket_id = 'thumbnails' and public.is_admin());
create policy "thumbnails admin delete" on storage.objects for delete to authenticated using (bucket_id = 'thumbnails' and public.is_admin());