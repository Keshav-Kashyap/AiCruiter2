import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
    try {
        const body = await req.json();
        let { email, otp } = body;
		email = email.trim().toLowerCase()


        if (!email || !otp) {
            return NextResponse.json(
                { error: "Email and OTP required" },
                { status: 400 }
            );
        }

        // User fetch
        const { data: otpRecord, error } = await supabase
            .from("Otp")
            .select("email, otp, expires_at")
            .eq("email", email)
            .single();
        if (error || !otpRecord) {
            return NextResponse.json({ error: "otp not found" }, { status: 404 });
        }

        // OTP check
        if (String(otpRecord.otp) !== String(otp)) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        // Expiry check
        const now = new Date();
        const expiry = new Date(otpRecord.expire_at);

        if (now > expiry) {
            return NextResponse.json({ error: "OTP expired" }, { status: 400 });
        }
		await supabase
    		.from("Otp")
    		.delete()
    		.eq("email", email);

        return NextResponse.json({
            success: true,
            message: "OTP verified successfully",
        });
    } catch (err) {
        console.error("Verify OTP error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
