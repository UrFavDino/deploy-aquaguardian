import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cryokbzmtpmclaukyplq.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeW9rYnptdHBtY2xhdWt5cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTkwMjYsImV4cCI6MjA2MzM5NTAyNn0.Vyz14ENyzDdPSWWNk-W3AOVmflJEdDiyH9caycD1M0k";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
