import { FEEDBACK_PROMT } from "@/services/Constants";
import OpenAI from "openai"
import { NextResponse } from "next/server";

export async function POST(req) {

    const { conversation } = await req.json();
    const FINAL_PROMPT = FEEDBACK_PROMT.replace('{{conversation}}', JSON.stringify(conversation));

    try {
        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY2,

        })

        const completion = await openai.chat.completions.create({
            model: "google/gemma-3n-e2b-it:free",
            messages: [
                { role: "user", content: FINAL_PROMPT }
            ],

        })

        const message = completion?.choices?.[0]?.message;
        if (!message) {
            throw new Error("No response from AI model");
        }
        return NextResponse.json(message);

    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: e.message || "Something went wrong" }, { status: 500 });


    }





}