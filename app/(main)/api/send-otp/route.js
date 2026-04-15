// app/api/send-otp/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        // OTP generate
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 min valid

        // 1. Pehle check karo user exist hai ya nahi
        const { data: user, error: fetchError } = await supabase
            .from("Users")
            .select("id")
            .eq("email", email)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            console.error("Fetch error:", fetchError);
            return NextResponse.json(
                { error: "Database fetch error" },
                { status: 500 }
            );
        }

        if (!user) {
            // Agar user nahi hai -> insert new
            const { error: insertError } = await supabase.from("Users").insert({
                email,
                otp,
                otp_expire: otpExpire.toISOString(),
                is_verified: false,
            });

            if (insertError) {
                console.error("Insert error:", insertError);
                return NextResponse.json(
                    { error: "Failed to insert new user" },
                    { status: 500 }
                );
            }
        } else {
            // Agar user hai -> update otp
            const { error: updateError } = await supabase
                .from("Users")
                .update({ otp, otp_expire: otpExpire.toISOString() })
                .eq("id", user.id);

            if (updateError) {
                console.error("Update error:", updateError);
                return NextResponse.json(
                    { error: "Failed to update OTP" },
                    { status: 500 }
                );
            }
        }

        // 2. Email send (Nodemailer)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // gmail
                pass: process.env.EMAIL_PASS, // app password
            },
        });

        await transporter.sendMail({
            from: `"Your App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP Code",
            html: `<p>Your OTP code is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
        });

        return NextResponse.json({
            success: true,
            message: "OTP sent successfully!",
        });
    } catch (err) {
        console.error("Error sending OTP:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
