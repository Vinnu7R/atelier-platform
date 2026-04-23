import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, source = "landing" } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Check for duplicate
    const { data: existing } = await supabase
      .from("waitlist")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existing) {
      return NextResponse.json({ message: "Already on the list!", alreadyExists: true });
    }

    const { error } = await supabase.from("waitlist").insert({
      email: email.toLowerCase().trim(),
      source,
      signed_up_at: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({ message: "You're on the list!" });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
