"use client"

import React, { useContext, useEffect, useState } from 'react'
import InterviewHeader from '../_components/InterviewHeader'
import Image from 'next/image'
import { Clock, Info, Loader2Icon, Video } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { supabase } from '@/services/supaBaseClient'
import { InterviewDataContext } from '@/app/context/InterviewDataContext'
import { useRouter } from 'next/navigation';





const Interview = () => {

    const { interview_id } = useParams();
    const [interviewData, setInterviewData] = useState();
    const [userName, setUserName] = useState();
    const [userEmail, setUserEmail] = useState();
    const [loading, setLoading] = useState(false);
    const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
    const router = useRouter();



    useEffect(() => {
        interview_id && GetInterviewDetails();
    }, [interview_id])


    const GetInterviewDetails = async () => {
        setLoading(true);

        try {
            let { data: interviews, error } = await supabase
                .from('interviews')
                .select("jobPosition, jobDescription, duration, type")
                .eq('interview_id', interview_id);
            setInterviewData({
                userName: userName,
                interviewData: interviews[0],

            });
            if (interviews?.length == 0) {

                setLoading(false);
                toast.error("Incorrect Interview Link");
                return;

            }
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
            toast.error("Incorrect Interview Link");
        }

    }


    const onJoinInterview = async () => {
        setLoading(true);

        let { data: interviews, error } = await supabase
            .from('interviews')
            .select("*")
            .eq('interview_id', interview_id);

        setInterviewInfo({
            userName: userName,
            userEmail: userEmail,
            interviewData: interviews[0],


        });
        router.push('/interview/' + interview_id + '/start')
        setLoading(false);
    }




    return (
        <div className='px-10 md:px-28 lg:px-48 xl:px-64 mt-16  '>

            <div className='flex flex-col  items-center justify-center border rounded-lg bg-white p-7 lg:px-33 xl:px-52 mb-20'>
                <Image src={'/logo.png'} alt='logo' width={200} height={100} className='w-[100px]' />

                <h2 className='mt-3'>AI-Powered Interview Platform</h2>

                <Image src={'/interview.png'} alt="interview " width={500} height={500} className='w-[280px] my-6' />

                <h2 className='font-bold text-xl '>{interviewData?.jobPosition}</h2>

                <h2 className='flex gap-2 items-center text-gray-500 mt-3'><Clock className='h-4 w-4' />{interviewData?.duration}</h2>

                <div className='w-full'>
                    <h2>Enter your full name</h2>
                    <Input placeholder="e.g Jhon Smith" onChange={(event) => setUserName(event.target.value)} />
                </div>

                <div className='w-full mt-4'>
                    <h2>Enter your full Email</h2>
                    <Input placeholder="e.g jhonsmith@gmail.com" onChange={(event) => setUserEmail(event.target.value)} />
                </div>

                <div className='p-3 bg-blue-100 flex gap-4 rounded-lg mt-3'>
                    <Info className='text-primary' />
                    <div>

                        <h2 className='font-bold'>Before you begin</h2>
                        <ul className="list-disc pl-5">
                            <li className='text-sm text-primary'>
                                Test Your Camera and microphone
                            </li>
                            <li className='text-sm text-primary'>
                                Ensure You have a stable internet connection
                            </li>
                            <li className='text-sm text-primary'>
                                Find a Quiet Place for interview
                            </li>
                        </ul>

                    </div>
                </div>


                <Button disabled={loading || !userName} className={'mt-5 w-full font-bold'}

                    onClick={() => onJoinInterview()}

                > <Video />{loading && <Loader2Icon className='' />} Join Interview</Button>

            </div>



        </div>
    )
}

export default Interview