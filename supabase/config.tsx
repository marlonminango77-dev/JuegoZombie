import { createClient } from '@supabase/supabase-js';

// Cliente único para interactuar con Supabase
export const supabase = createClient(
  'https://kzsijkawayixrmznjezx.supabase.co',
  'sb_publishable_4TOwgNkqYHUntpdiOKh4Mg_AmrE349Z'
);