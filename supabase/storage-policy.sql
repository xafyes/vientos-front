-- Lets the website list the photos in the two public buckets.
-- "Public" on a bucket only allows downloading a file by its URL; listing a
-- folder's contents also needs this SELECT policy. Read-only: it grants no
-- upload, update or delete. Run once in Supabase > SQL Editor.
drop policy if exists "vy_public_list_images" on storage.objects;

create policy "vy_public_list_images" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('Vientos', 'Yareta'));
