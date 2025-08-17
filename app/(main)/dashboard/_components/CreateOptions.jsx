import { Phone, Video } from 'lucide-react'
import Link from 'next/link'
import React from 'react'


const CreateOptions = () => {
    return (
        <div className='grid sm:grid-cols-2 grid-cols-1 gap-5'>


            <Link href={'/dashboard/create-interview'}>

                <div className='bg-white border-gray-200 rounded-lg p-5 flex flex-col gap-2 cursor-pointer'>
                    <Video className='p-3 text-primary bg-blue-50 rounded-lg h-12 w-12 ' />
                    <h2 className='font-bold'>Create New Interview</h2>
                    <p className='text-gray-500' >Create AI Interviews and schedule then with Candidates</p>
                </div>
            </Link>

            <div className='bg-white border-gray-200 rounded-lg p-5 flex flex-col gap-2 cursor-pointer' >
                <div className='flex items-center  justify-between'>

                    <Phone className='p-3 text-primary bg-blue-50 rounded-lg h-12 w-12 ' />
                    {/* Unavailable badge at top-right */}
                    <span className=" text-xs font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full">
                        Unavailable
                    </span>
                </div>
                <h2 className='font-bold'>Create phone Screening Call</h2>
                <p className='text-gray-500' >Scheduale phone screening call with candidates</p>
            </div>

        </div>
    )
}

export default CreateOptions 