"use client"

import { useUser } from '@/app/provider'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supaBaseClient'
import { Camera, Video } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import InterviewCard from './InterviewCard'
import { toast } from 'sonner'



const LatestInterviewsList = () => {
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        user && GetInterViewList();

    }, [user])

    const GetInterViewList = async () => {
        setLoading(true);


        let { data: interviews, error } = await supabase
            .from('interviews')
            .select('*')
            .eq('userEmail', user?.email)
            .order('id', { ascending: false })
            .limit(6)
        console.log(interviews);

        setInterviewList(interviews);
        setLoading(false);


    }





    return (
        <div className='my-5 '>

            <h2 className='font-bold text-2xl' >  Previously Created Interviews</h2>

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

                            {interviewList.map((interview, index) => (
                                <InterviewCard interview={interview} key={index} />
                            ))}

                        </div>
                    )
                    }
                </>
            )}




        </div>
    )
}

export default LatestInterviewsList