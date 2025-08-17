import { Button } from '@/components/ui/button';
import { getAvatarColor, getInitial } from '@/services/Constants';
import { ArrowRight, Copy, Send } from 'lucide-react';
import moment from 'moment'
import Link from 'next/link';
import React from 'react'
import { toast } from 'sonner';



const InterviewCard = ({ interview, viewDetail = false }) => {

    const url = process.env.NEXT_PUBLIC_HOST_URL + '/' + interview?.interview_id

    console.log("Card in data", interview);
    const CopyLink = () => {

        navigator.clipboard.writeText(url);
        toast.success("Link Copied");
    }


    const onSend = () => {
        window.location.href = "mailto:talkwithgamers?subject=AICruiter Interview link & body= Interview Link:" + url



    }

    return (
        <div className='p-5 bg-white border rounded-lg'>

            <div className='flex items-center  justify-between'>
                <div className="relative">
                    {/* Initial Circle */}
                    <div
                        className="h-14 w-14 rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-lg"
                        style={{ backgroundColor: getAvatarColor(`${interview?.jobPosition}`) }}
                    >
                        {getInitial(`${interview?.jobPosition}`)}
                    </div>


                </div>

                <h2 className='text-sm'>{moment(interview?.created_at).format('DD MMM yyy')}</h2>



            </div>
            <h2 className='text-lg font-bold mt-3'>{interview?.jobPosition.charAt(0).toUpperCase() + interview?.jobPosition?.slice(1)}</h2>

            <h2 className=' mt-2 flex justify-between items-center text-gray-500'>{interview?.duration}
                {viewDetail && <span className="text-green-700">{interview['interview-feedback']?.length} Candidates</span>}



            </h2>


            {!viewDetail ? <div className='flex gap-3 w-full mt-5 justify-between'>
                <Button onClick={() => CopyLink()} variant="outline" ><Copy />Copy Link</Button>
                <Button onClick={() => onSend()} ><Send />Send</Button>
            </div> :
                <Link href={'/scheduled-interview/' + interview?.interview_id + "/details"}>
                    <Button className="mt-5 w-full" variant="outline">View Detail <ArrowRight /> </Button>
                </Link>

            }



        </div>
    )
}

export default InterviewCard