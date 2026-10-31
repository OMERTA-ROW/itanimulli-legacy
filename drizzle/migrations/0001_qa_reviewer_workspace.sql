CREATE TABLE public.qa_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash text NOT NULL UNIQUE,
  invited_email text NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  used_by uuid,
  revoked_at timestamptz
);
GRANT ALL ON public.qa_invitations TO service_role;
ALTER TABLE public.qa_invitations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.qa_access (
  user_id uuid PRIMARY KEY,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'qa_reviewer' CHECK (role IN ('qa_reviewer')),
  granted_by uuid NOT NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);
GRANT ALL ON public.qa_access TO service_role;
ALTER TABLE public.qa_access ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.qa_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL,
  build_version text NOT NULL,
  category text NOT NULL CHECK (category IN ('animation_snapping','foot_sliding','clipping','collision_mismatch','vehicles','performance','multiplayer_desync','other')),
  title text NOT NULL,
  observed text NOT NULL,
  expected text NOT NULL,
  repro_steps text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  evidence_ref text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','triaged','handed_off','fixed','wont_fix')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.qa_issues TO service_role;
ALTER TABLE public.qa_issues ENABLE ROW LEVEL SECURITY;