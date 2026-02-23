import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "METHOD_NOT_ALLOWED" });

  const assistant_id = String((req.query && req.query.assistant_id) || "web-designer");
  const url = String((req.query && req.query.url) || "");

  const { data, error } = await supabase
    .from("gpt_memory")
    .select("created_at,url,issue,fix,tags,severity")
    .eq("assistant_id", assistant_id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return res.status(400).json({ ok: false, error: error.message });

  let rules = data || [];
  if (url) {
    rules = rules.sort((a, b) => (b.url === url) - (a.url === url));
  }

  return res.status(200).json({ ok: true, rules });
}
