import { QUESTION_PROMPT } from "@/services/Constants";
import OpenAI from "openai"
import { NextResponse } from "next/server";



export async function POST(req) {
    const { jobPosition, jobDescription,companyName, duration, type, language } = await req.json();

    console.log("jobPosition:", jobPosition);
	if (jobPosition === "mock") {
    return NextResponse.json({
        content: JSON.stringify({
            interviewQuestions: [
                {
                    question: "Tell me about yourself.",
                    type: "Behavioral"
                },
                {
                    question: "Explain the difference between let, var and const.",
                    type: "Technical"
                },
                {
                    question: "What is REST API?",
                    type: "Technical"
                },
                {
                    question: "What is the difference between SQL and NoSQL databases?",
                    type: "Technical"
                },
                {
                    question: "Describe a challenge you faced in a project.",
                    type: "Experience"
                },
                {
                    question: "How would you optimize a slow website?",
                    type: "Problem Solving"
                },
                {
                    question: "How do you handle conflicts in a team?",
                    type: "Behavioral"
                }
            ]
        })
    });
}

    console.log("companyName",companyName)
    console.log("jobDescription:", jobDescription);
    console.log("duration:", duration);
    console.log("type:", type);
    console.log("Language:", language);

    const FINAL_PROMPT = QUESTION_PROMPT
        .replace('{{jobTitle}}', jobPosition)
        .replace('{{jobDescription}}', jobDescription)
        .replace('{{companyName}}', companyName)
        .replace('{{duration}}', duration)
        .replace('{{type}}', type)
        .replace('{{language}}', language);

    console.log("YOUR PROMOT", FINAL_PROMPT);

    try {
        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY2,

        })

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b:free",
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
