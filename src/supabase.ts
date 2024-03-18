import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || "https://qcwznwbgxxfcappvfugv.supabase.co";
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjd3pud2JneHhmY2FwcHZmdWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg4NTA4NzUsImV4cCI6MjAyNDQyNjg3NX0.v9EVGbYZXEnYQBFrv1Fw8GDiibkc0SHyKJfs6r9uAgc";

console.log(supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
