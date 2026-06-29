-- Production SQL Script: admin_logs
-- This script sets up the public.admin_logs table, enables RLS, and creates policies.
-- Run this script in the Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    role TEXT,
    action TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED')),
    error_name TEXT,
    error_code TEXT,
    error_message TEXT,
    details JSONB,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    location TEXT,
    user_agent TEXT,
    execution_time_ms NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indexing for performance on typical filter/search columns
CREATE INDEX IF NOT EXISTS idx_admin_logs_user_email ON public.admin_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON public.admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_status ON public.admin_logs(status);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- 1. Read Policy: Only authorized 'super_admin' users can view logs.
-- Strictly and exclusively based on the user's role metadata.
CREATE POLICY "Super admins can read admin logs" ON public.admin_logs
    FOR SELECT TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
    );

-- 2. Insert Policy: Restriction to trusted server-side execution context.
-- No policies are created for public/anon/authenticated INSERT.
-- Since the server action utilizes the 'SUPABASE_SERVICE_ROLE_KEY' to initialize the Supabase client,
-- it will bypass RLS. This guarantees that direct mutations from the client-side/browsers will be blocked.
