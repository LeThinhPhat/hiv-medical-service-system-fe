import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nzgdnisftlsxdzlbhgqt.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56Z2RuaXNmdGxzeGR6bGJoZ3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NDA3NzQsImV4cCI6MjA2OTExNjc3NH0.ypqwUyZu6SlYBDZU20TwEbVczKjWjba7gPopMYlPjok";

  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
