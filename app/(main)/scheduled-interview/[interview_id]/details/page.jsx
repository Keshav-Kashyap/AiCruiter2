"use client"

import { useUser } from '@/app/provider';
import { supabase } from '@/services/supaBaseClient';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import InterviewDetailContainer from './_components/InterviewDetailContainer';
import CandidatList from './_components/CandidatList';


const InterviewDetails = () => {

    const interviewID = useParams();
    const interview_id = interviewID?.interview_id;
    console.log("interview_id", interview_id);
    const [loading, setLoading] = useState(false);
    const [interviewDetail, setInterviewDetail] = useState();
    const user = useUser();
    console.log("user", user?.user?.email);

    useEffect(() => {
        user && GetInterviewDetails();
    }, [user])

    const GetInterviewDetails = async () => {
        setLoading(true);


        const result = await supabase.from('interviews')
            .select(`jobPosition,jobDescription,type,questionList, created_at ,duration,interview_id,interview-feedback(userEmail,userName,feedback,created_at)`)
            .eq('userEmail', user?.user?.email)
            .eq('interview_id', interview_id)
            .order('id', { ascending: false })

        console.log(result);
        setInterviewDetail(result?.data[0]);
        setLoading(false);
    }
    if (interviewDetail) {
        console.log("interview Details", interviewDetail)
    }


    return (
        <div className='mt-5'>

            <h2 className='font-bold text-2xl'>
                Interview Details
            </h2>
            <InterviewDetailContainer interviewDetail={interviewDetail} />
            <CandidatList candidateList={interviewDetail?.['interview-feedback']} />
        </div>
    )
}

export default InterviewDetails