import { Loader2, Loader2Icon, Brain, CheckCircle, Sparkles } from 'lucide-react';
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
        <div className="space-y-8">
            {/* Loading State */}
            {loading && (
                <div className='p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-700/50 shadow-lg'>
                    <div className='flex gap-6 items-center'>
                        <div className='relative'>
                            <div className='absolute -inset-2 bg-blue-500 rounded-full blur opacity-20 animate-pulse'></div>
                            <div className='relative w-16 h-16 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center'>
                                <Brain className='w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse' />
                            </div>
                        </div>

                        <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-2'>
                                <Loader2Icon className='animate-spin w-5 h-5 text-blue-600 dark:text-blue-400' />
                                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                                    Generating Interview Questions...
                                </h2>
                                <Sparkles className='w-5 h-5 text-yellow-500 animate-pulse' />
                            </div>
                            <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed'>
                                Our AI is analyzing your job requirements and creating personalized interview questions tailored to your specific needs.
                            </p>

                            {/* Progress Steps */}
                            <div className='mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400'>
                                <div className='flex items-center gap-1'>
                                    <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                                    <span>Analyzing job description</span>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <div className='w-2 h-2 bg-blue-300 rounded-full animate-pulse' style={{ animationDelay: '0.5s' }}></div>
                                    <span>Creating questions</span>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <div className='w-2 h-2 bg-blue-200 rounded-full animate-pulse' style={{ animationDelay: '1s' }}></div>
                                    <span>Finalizing</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Questions Generated State */}
            {questionList?.length > 0 && !loading && (
                <div className="space-y-6">
                    {/* Success Header */}
                    <div className='p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-700/50 shadow-lg'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center'>
                                <CheckCircle className='w-6 h-6 text-green-600 dark:text-green-400' />
                            </div>
                            <div>
                                <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-1'>
                                    Questions Generated Successfully!
                                </h3>
                                <p className='text-sm text-gray-600 dark:text-gray-300'>
                                    {questionList.length} personalized questions ready for your interview
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Questions Container */}
                    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700'>
                        <QuestionListContainer questionList={questionList} />
                    </div>
                </div>
            )}

            {/* Create Interview Button */}
            {questionList?.length > 0 && !loading && (
                <div className='flex justify-center pt-6'>
                    <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-md'>
                        <div className='text-center mb-4'>
                            <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                                Ready to Create Interview?
                            </h4>
                            <p className='text-sm text-gray-600 dark:text-gray-300'>
                                This will save your questions and generate a shareable interview link
                            </p>
                        </div>

                        <Button
                            onClick={onFinish}
                            disabled={saveLoading || loading || questionList.length === 0}
                            className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white py-3 px-6 transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg group rounded-xl'
                        >
                            {saveLoading ? (
                                <>
                                    <Loader2 className='animate-spin mr-3 h-5 w-5' />
                                    <span>Creating Interview...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className='mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200' />
                                    <span className='font-semibold'>Create Interview & Finish</span>
                                </>
                            )}
                        </Button>

                        {saveLoading && (
                            <div className='mt-4 text-center'>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    Saving interview questions and generating link...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuestionList