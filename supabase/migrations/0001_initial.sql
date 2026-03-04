-- Migration: 0001_initial.sql
-- Purpose: Top 10 Prom Phase 1 Core Schema & RLS Policies

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    style_preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE public.dresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    designer TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    image_urls TEXT[] NOT NULL DEFAULT '{}',
    available_stores TEXT[] NOT NULL DEFAULT '{}',
    attributes JSONB DEFAULT '{}'::jsonb,
    inventory_status TEXT DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE public.fitting_room_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_token TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    items JSONB DEFAULT '[]'::jsonb NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE public.wishlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    dress_id UUID NOT NULL REFERENCES public.dresses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id, dress_id)
);

CREATE TABLE public.availability_inquiries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    session_token TEXT,
    dress_id UUID NOT NULL REFERENCES public.dresses(id) ON DELETE CASCADE,
    target_store TEXT NOT NULL,
    status TEXT DEFAULT 'pending_review' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_dresses_available_stores ON public.dresses USING GIN (available_stores);
CREATE INDEX idx_fitting_room_token ON public.fitting_room_sessions(session_token);
CREATE INDEX idx_wishlist_user ON public.wishlist(user_id);

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_dresses_modtime BEFORE UPDATE ON public.dresses FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_fitting_room_modtime BEFORE UPDATE ON public.fitting_room_sessions FOR EACH ROW EXECUTE FUNCTION update_modified_column();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitting_room_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Dresses are viewable by everyone" ON public.dresses FOR SELECT USING (true);
CREATE POLICY "Anyone can manage their own session" ON public.fitting_room_sessions FOR ALL USING (
    session_token = current_setting('request.jwt.claims', true)::json->>'session_token'
    OR auth.uid() = user_id
);
CREATE POLICY "Users can manage own wishlist" ON public.wishlist FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert inquiries" ON public.availability_inquiries FOR INSERT WITH CHECK (
    auth.uid() = user_id OR session_token IS NOT NULL
);
CREATE POLICY "Users can view own inquiries" ON public.availability_inquiries FOR SELECT USING (
    auth.uid() = user_id OR session_token = current_setting('request.jwt.claims', true)::json->>'session_token'
);
