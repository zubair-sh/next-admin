import { createBrowserClient } from "@supabase/ssr";
import { AppConstants } from "@/config/constants";

export function createClient() {
  return createBrowserClient(
    AppConstants.supabaseUrl!,
    AppConstants.supabasePublishableKey!,
  );
}
