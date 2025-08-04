"use client"

import { useUser } from '@/app/provider'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supaBaseClient'
import { Video } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import InterviewCard from '../dashboard/_components/InterviewCard'


function ScheduledInterview() {

    const user = useUser();
    const [interviewList, setInterviewList] = useState();
    const [loading, setLoading] = useState(true);
    // console.log("user", user.user.email);


    useEffect(() => {
        user && GetInterviewList();
    }, [user])

    const GetInterviewList = async () => {
        setLoading(true);

        const result = await supabase.from('interviews')
            .select('jobPosition,duration,interview_id,interview-feedback(userEmail)')
            .eq('userEmail', user?.user?.email)
            .order('id', { ascending: false })

        console.log(result);
        setInterviewList(result.data);
        setLoading(false);
    }

    return (
        <div className=" mt-5">


            <h2 className="font-bold text-xl">Interview Lists with Candidate Feedback</h2>

            {loading ? (
                <div className='mt-5 text-center text-muted-foreground'>
                    Interviews Fetching...
                </div>
            ) : (
                <>
                    {interviewList?.length == 0 ? (

                        <div className='p-5 flex flex-col gap-3 items-center  bg-white mt-5'>
                            <Video className='h-10 w-10 text-primary' />
                            <h2>You don't have any interview created!</h2>
                            <Button>+ Create New Interview</Button>

                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2  mt-5 xl:grid-cols-3 gap-5 '>

                            {interviewList?.map((interview, index) => (
                                <InterviewCard interview={interview} key={index} viewDetail={true} />
                            ))}

                        </div>
                    )
                    }
                </>
            )}

        </div>
    )
}

export default ScheduledInterview