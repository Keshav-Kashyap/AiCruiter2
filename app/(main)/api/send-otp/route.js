// app/api/send-otp/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { OTPVerification } from "../EmailTemplates/OTPVerification";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
    try {
        const body = await req.json();
        const { email } = body;
		console.log("HItted for ",email);
        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        // OTP generate
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 min valid
		console.log("otp",otp);
        //check user alredy  exists
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

        if(user){
			 return NextResponse.json(
                    { error: "User already exists" },
                    { status: 409 }
                );
		}
		
		const { error } = await supabase
    		.from("Otp")
    		.upsert({
      			  email,
       			  otp,
        		  expires_at: otpExpire.toISOString()
    			});
			
			

            if (error) {
                console.error("Update error:", error);
                return NextResponse.json(
                    { error: 'Failed to upsert OTP ' },
                    { status: 500 }
                );
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
            subject: "Verify your email",
            html: OTPVerification({ otp }),
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
