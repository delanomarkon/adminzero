-- Maak de tabel 'invoices' aan
create table public.invoices (
  id bigint generated always as identity primary key,
  klant text not null,
  bedrag numeric not null,
  datum date not null,
  beschrijving text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activeer Row-Level Security voor toekomstige policies
alter table public.invoices enable row level security;
