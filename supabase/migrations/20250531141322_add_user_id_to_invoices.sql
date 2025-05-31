alter table public.invoices add column user_id uuid not null;

-- Voeg RLS policies toe:
create policy "User can insert own invoices"
on public.invoices
for insert
with check (auth.uid() = user_id);

create policy "User can view own invoices"
on public.invoices
for select
using (auth.uid() = user_id);
