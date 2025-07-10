import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mlrxudffywxsgklhursq.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1scnh1ZGZmeXd4c2drbGh1cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MDYxODQsImV4cCI6MjA1NzE4MjE4NH0.UBil2usUu1LdR_3x6v7m3rSxVV_Vp4RK39wq0VPpOcE";

  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
