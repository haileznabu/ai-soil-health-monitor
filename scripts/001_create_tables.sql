-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  organization text,
  role text check (role in ('farmer', 'policymaker', 'researcher', 'ngo', 'admin')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create land_areas table for monitoring zones
create table if not exists public.land_areas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  location_lat decimal(10, 8) not null,
  location_lng decimal(11, 8) not null,
  area_size decimal(10, 2), -- in hectares
  land_type text check (land_type in ('agricultural', 'forest', 'grassland', 'urban', 'mixed')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create soil_health_data table for storing analysis results
create table if not exists public.soil_health_data (
  id uuid primary key default gen_random_uuid(),
  land_area_id uuid references public.land_areas(id) on delete cascade,
  analysis_date timestamp with time zone default now(),
  soil_moisture decimal(5, 2), -- percentage
  vegetation_index decimal(5, 3), -- NDVI value (-1 to 1)
  erosion_risk text check (erosion_risk in ('low', 'moderate', 'high', 'critical')),
  degradation_level decimal(5, 2), -- percentage
  soil_ph decimal(4, 2),
  organic_matter decimal(5, 2), -- percentage
  temperature decimal(5, 2), -- celsius
  ai_analysis_summary text,
  satellite_image_url text,
  created_at timestamp with time zone default now()
);

-- Create alerts table for degradation warnings
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  land_area_id uuid references public.land_areas(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  alert_type text check (alert_type in ('erosion', 'vegetation_loss', 'moisture_deficit', 'degradation', 'general')),
  severity text check (severity in ('low', 'medium', 'high', 'critical')),
  title text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Create recommendations table for AI-generated suggestions
create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  land_area_id uuid references public.land_areas(id) on delete cascade,
  soil_health_data_id uuid references public.soil_health_data(id) on delete cascade,
  recommendation_type text check (recommendation_type in ('reforestation', 'soil_conservation', 'irrigation', 'crop_rotation', 'fertilization', 'general')),
  title text not null,
  description text not null,
  priority text check (priority in ('low', 'medium', 'high')),
  estimated_impact text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.land_areas enable row level security;
alter table public.soil_health_data enable row level security;
alter table public.alerts enable row level security;
alter table public.recommendations enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Land areas policies
create policy "Users can view their own land areas"
  on public.land_areas for select
  using (auth.uid() = user_id);

create policy "Users can insert their own land areas"
  on public.land_areas for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own land areas"
  on public.land_areas for update
  using (auth.uid() = user_id);

create policy "Users can delete their own land areas"
  on public.land_areas for delete
  using (auth.uid() = user_id);

-- Soil health data policies (read access through land_areas relationship)
create policy "Users can view soil health data for their land areas"
  on public.soil_health_data for select
  using (
    exists (
      select 1 from public.land_areas
      where land_areas.id = soil_health_data.land_area_id
      and land_areas.user_id = auth.uid()
    )
  );

create policy "Users can insert soil health data for their land areas"
  on public.soil_health_data for insert
  with check (
    exists (
      select 1 from public.land_areas
      where land_areas.id = soil_health_data.land_area_id
      and land_areas.user_id = auth.uid()
    )
  );

-- Alerts policies
create policy "Users can view their own alerts"
  on public.alerts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own alerts"
  on public.alerts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own alerts"
  on public.alerts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own alerts"
  on public.alerts for delete
  using (auth.uid() = user_id);

-- Recommendations policies
create policy "Users can view recommendations for their land areas"
  on public.recommendations for select
  using (
    exists (
      select 1 from public.land_areas
      where land_areas.id = recommendations.land_area_id
      and land_areas.user_id = auth.uid()
    )
  );

create policy "Users can insert recommendations for their land areas"
  on public.recommendations for insert
  with check (
    exists (
      select 1 from public.land_areas
      where land_areas.id = recommendations.land_area_id
      and land_areas.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
create index if not exists idx_land_areas_user_id on public.land_areas(user_id);
create index if not exists idx_soil_health_data_land_area_id on public.soil_health_data(land_area_id);
create index if not exists idx_soil_health_data_analysis_date on public.soil_health_data(analysis_date desc);
create index if not exists idx_alerts_user_id on public.alerts(user_id);
create index if not exists idx_alerts_created_at on public.alerts(created_at desc);
create index if not exists idx_recommendations_land_area_id on public.recommendations(land_area_id);
