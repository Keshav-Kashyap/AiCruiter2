import { Loader2, Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import axios from "axios";
import { Button } from '@/components/ui/button';
import QuestionListContainer from './QuestionListContainer';
import { supabase } from '@/services/supaBaseClient';
import { useUser } from '@/app/provider';
import { v4 as uuidv4 } from 'uuid';

const QuestionList = ({ formData, onCreateLink }) => {
    console.log("FORMDATA in QuestionList:", formData);

    const [loading, setLoading] = useState(false);
    const [questionList, setQuestionList] = useState([]);
    const [saveLoading, setSaveLoading] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        if (formData && Object.keys(formData).length > 0) {
            GenerateQuestionList();
        }
    }, [formData])

    const GenerateQuestionList = async () => {
        setLoading(true);
        try {
            const result = await axios.post('/api/ai-model', {
                ...formData
            })

            const rawContent = result.data.content;

            let content = rawContent.replace(/```json|```/g, '').trim();

            const jsonStart = content.indexOf('{');
            if (jsonStart !== -1) {
                content = content.substring(jsonStart);
            }

            try {
                const parsed = JSON.parse(content);
                setQuestionList(parsed?.interviewQuestions || []);
                setLoading(false);
            } catch (e) {
                console.error("JSON Parse Error:", e);
                console.log("Raw AI Response:", rawContent);
                toast.error("Invalid AI response format.");
                setLoading(false);
            }
        } catch (e) {
            toast.error('Server Error, Try Again');
            setLoading(false);
            console.log(e);
        }
    }

    const onFinish = async () => {
        // Early return if questions are not loaded or already saving
        if (loading || saveLoading || !questionList || questionList.length === 0) {
            return;
        }

        setSaveLoading(true);

        try {
            const interview_id = uuidv4();

            const { data, error } = await supabase
                .from('interviews')
                .insert([
                    {
                        ...formData,
                        questionList: questionList,
                        userEmail: user?.email,
                        interview_id: interview_id
                    },
                ])
                .select()

            if (error) {
                throw error;
            }

            const userUpdate = await supabase
                .from('Users')
                .update({ credits: Number(user?.credits) - 1 })
                .eq('email', user?.email)
                .select()

            if (userUpdate.error) {
                throw userUpdate.error;
            }

            onCreateLink(interview_id);
        } catch (error) {
            console.error("Error saving interview:", error);
            toast.error("Failed to save interview. Please try again.");
        } finally {
            setSaveLoading(false);
        }
    }

    return (
        <div>
            {loading && (
                <div className='p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center'>
                    <Loader2Icon className='animate-spin' />
                    <div>
                        <h2>Generating Interview Questions...</h2>
                        <p>Our AI is creating personalized questions based on your job position</p>
                    </div>
                </div>
            )}

            {questionList?.length > 0 && !loading && (
                <div>
                    <QuestionListContainer questionList={questionList} />
                </div>
            )}

            {/* Button will only show when questions are loaded and not in loading state */}
            {questionList?.length > 0 && !loading && (
                <div className='flex justify-end mt-10'>
                    <Button
                        onClick={onFinish}
                        disabled={saveLoading || loading || questionList.length === 0}
                    >
                        {saveLoading && <Loader2 className='animate-spin mr-2' />}
                        Create Interview & Finish
                    </Button>
                </div>
            )}
        </div>
    )
}

export default QuestionList