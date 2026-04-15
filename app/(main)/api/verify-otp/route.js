import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json(
                { error: "Email and OTP required" },
                { status: 400 }
            );
        }

        // User fetch
        const { data: user, error } = await supabase
            .from("Users")
            .select("id, otp, otp_expire, is_verified")
            .eq("email", email)
            .single();

        if (error || !user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Agar pehle se verified hai
        if (user.is_verified) {
            return NextResponse.json(
                { success: true, message: "User already verified" },
                { status: 200 }
            );
        }

        // OTP check
        if (String(user.otp) !== String(otp)) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        // Expiry check
        const now = new Date();
        const expiry = new Date(user.otp_expire);

        if (now > expiry) {
            return NextResponse.json({ error: "OTP expired" }, { status: 400 });
        }

        // Update user -> mark verified
        const { error: updateError } = await supabase
            .from("Users")
            .update({ otp: null, otp_expire: null, is_verified: true })
            .eq("id", user.id);

        if (updateError) {
            return NextResponse.json(
                { error: "Failed to update verification status" },
                { status: 500 }
            );
        }

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
