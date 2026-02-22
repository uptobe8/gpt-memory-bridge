import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "METHOD_NOT_ALLOWED" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const row = {
      assistant_id: String(body.assistant_id || "web-designer"),
      url: String(body.url || ""),
      issue: String(body.issue || ""),
      fix: String(body.fix || ""),
      tags: String(body.tags || ""),
      severity: Number.isFinite(body.severity) ? body.severity : 2,
      payload: body.payload && typeof body.payload === "object" ? body.payload : {}
    };

    if (!row.issue || !row.fix) {
      return res.status(400).json({ ok: false, error: "MISSING_REQUIRED_FIELDS" });
    }

    const { error } = await supabase.from("gpt_memory").insert([row]);
    if (error) return res.status(400).json({ ok: false, error: error.message });

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(400).json({ ok: false, error: "BAD_REQUEST" });
  }
}
