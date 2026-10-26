CREATE TABLE public.linked_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  provider text NOT NULL,
  provider_user_id text NOT NULL,
  display_name text,
  linked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_user_id),
  UNIQUE (user_id, provider)
);
GRANT SELECT, DELETE ON public.linked_accounts TO authenticated;
GRANT ALL ON public.linked_accounts TO service_role;
ALTER TABLE public.linked_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own links readable" ON public.linked_accounts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own links removable" ON public.linked_accounts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Short-lived OAuth/OpenID state rows; only the server (service role) touches them.
CREATE TABLE public.link_states (
  state text PRIMARY KEY,
  user_id uuid NOT NULL,
  provider text NOT NULL,
  nonce text NOT NULL,
  code_verifier text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '10 minutes'
);
GRANT ALL ON public.link_states TO service_role;
ALTER TABLE public.link_states ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.game_servers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 3 AND 48),
  game text NOT NULL CHECK (game IN ('itanimulli-kingdom','itanimulli-duat')),
  region text NOT NULL CHECK (region IN ('na-east','na-west','eu-west','eu-central','asia-east','oce')),
  capacity int NOT NULL CHECK (capacity BETWEEN 2 AND 64),
  privacy text NOT NULL CHECK (privacy IN ('public','friends','private')),
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_servers TO authenticated;
GRANT ALL ON public.game_servers TO service_role;
ALTER TABLE public.game_servers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own servers read" ON public.game_servers FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Own servers insert" ON public.game_servers FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Own servers update" ON public.game_servers FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Own servers delete" ON public.game_servers FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- No provisioning adapter exists: servers can only ever be drafts.
CREATE OR REPLACE FUNCTION public.game_servers_guard()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.status <> 'draft' THEN
    RAISE EXCEPTION 'Provisioning is not configured; servers can only be drafts';
  END IF;
  IF TG_OP = 'UPDATE' AND NEW.owner_id <> OLD.owner_id THEN
    RAISE EXCEPTION 'Ownership cannot be transferred';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER game_servers_guard BEFORE INSERT OR UPDATE ON public.game_servers
FOR EACH ROW EXECUTE FUNCTION public.game_servers_guard();

CREATE TABLE public.server_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id uuid NOT NULL REFERENCES public.game_servers(id) ON DELETE CASCADE,
  invited_email text NOT NULL CHECK (char_length(invited_email) BETWEEN 3 AND 254),
  role text NOT NULL CHECK (role IN ('admin','moderator','player')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (server_id, invited_email)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.server_members TO authenticated;
GRANT ALL ON public.server_members TO service_role;
ALTER TABLE public.server_members ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.owns_server(_server_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.game_servers WHERE id = _server_id AND owner_id = auth.uid())
$$;
CREATE POLICY "Owner manages members" ON public.server_members FOR ALL TO authenticated
USING (public.owns_server(server_id)) WITH CHECK (public.owns_server(server_id));