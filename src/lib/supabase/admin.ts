import { createClient } from "@supabase/supabase-js";
import { AppConstants } from "@/config/constants";

export const supabaseAdmin = createClient(
  AppConstants.supabaseUrl!,
  AppConstants.supabaseServiceRoleKey!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
