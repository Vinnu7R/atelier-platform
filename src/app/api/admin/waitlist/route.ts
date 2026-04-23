import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const ADMIN_PW = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PW || password !== ADMIN_PW) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("waitlist")
      .select("*")
      .order("signed_up_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("Admin fetch error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
