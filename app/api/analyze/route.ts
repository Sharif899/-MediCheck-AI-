import { NextRequest, NextResponse } from "next/server";
import { analyse, type AnalysisInput } from "@/app/lib/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<AnalysisInput>;

    const input: AnalysisInput = {
      symptoms:    (body.symptoms    ?? "").trim().slice(0, 2000),
      medications: (body.medications ?? "").trim().slice(0, 1000),
      age:         body.age,
      context:     (body.context     ?? "").trim().slice(0, 500),
    };

    // At least one field must have content
    if (!input.symptoms && !input.medications) {
      return NextResponse.json(
        { error: "Please describe your symptoms or list your medications." },
        { status: 400 }
      );
    }

    const result = analyse(input);

    return NextResponse.json({ result }, { status: 200 });
  } catch (err) {
    console.error("[/api/analyze] Error:", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}

