-- Create recipes table
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  ingredients text[] not null default '{}',
  instructions text not null,
  style text,
  dietary_notes text,
  nutritional_info jsonb,
  ai_service text default 'local',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'preparing', 'shipped', 'delivered', 'cancelled')),
  juices jsonb not null default '[]',
  total numeric(10,2) not null default 0,
  delivery_address text,
  estimated_delivery date,
  delivered_date date,
  rating integer check (rating >= 1 and rating <= 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.recipes enable row level security;
alter table public.orders enable row level security;

-- RLS policies for recipes
create policy "Users can view their own recipes"
  on public.recipes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own recipes"
  on public.recipes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own recipes"
  on public.recipes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own recipes"
  on public.recipes for delete
  using (auth.uid() = user_id);

-- RLS policies for orders
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own orders"
  on public.orders for update
  using (auth.uid() = user_id);

-- Indexes
create index if not exists recipes_user_id_idx on public.recipes(user_id);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);

-- Updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger recipes_updated_at
  before update on public.recipes
  for each row execute function public.handle_updated_at();

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();

-- Create cost_calculations table
create table if not exists public.cost_calculations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  scenario_name text not null,
  daily_users integer not null,
  recipes_per_user integer not null,
  monthly_recipes integer not null,
  openai_monthly_cost numeric(10,4) not null default 0,
  huggingface_monthly_cost numeric(10,4) not null default 0,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.cost_calculations enable row level security;

-- RLS policies
create policy "Anyone can view cost calculations"
  on public.cost_calculations for select
  using (true);

create policy "Users can insert cost calculations"
  on public.cost_calculations for insert
  with check (auth.uid() = user_id or auth.uid() is null);

create policy "Users can delete their own calculations"
  on public.cost_calculations for delete
  using (auth.uid() = user_id or auth.uid() is null);

create index cost_calculations_user_id_idx on public.cost_calculations(user_id);
