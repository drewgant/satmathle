import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yargjfdpdlpkrbuuwjao.supabase.co";

const supabaseKey = "sb_publishable_py0yHleucE1fMnmK0Xq0XQ_Tb1rJ6-z";

export const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Supabase loaded");