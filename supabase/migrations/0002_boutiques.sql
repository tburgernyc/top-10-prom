-- 0002_boutiques.sql
-- Boutique store locations table

CREATE TABLE public.boutiques (
    id         UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
    name       TEXT        NOT NULL,
    address    TEXT,
    city       TEXT,
    state      TEXT,
    phone      TEXT,
    website    TEXT,
    slug       TEXT        UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX boutiques_slug_idx ON public.boutiques (slug);

-- RLS: public read, no write from client
ALTER TABLE public.boutiques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Boutiques are publicly readable"
    ON public.boutiques FOR SELECT
    USING (true);
