import { QUESTION_PROMPT } from "@/services/Constants";
import OpenAI from "openai"
import { NextResponse } from "next/server";



export async function POST(req) {
    const { jobPosition, jobDescription, duration, type } = await req.json();

    console.log("jobPosition:", jobPosition);
    console.log("jobDescription:", jobDescription);
    console.log("duration:", duration);
    console.log("type:", type);

    const FINAL_PROMPT = QUESTION_PROMPT
        .replace('{{jobTitle}}', jobPosition)
        .replace('{{jobDescription}}', jobDescription)
        .replace('{{duration}}', duration)
        .replace('{{type}}', type)

    console.log("YOUR PROMOT", FINAL_PROMPT);

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
