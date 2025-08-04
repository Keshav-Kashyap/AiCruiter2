"use client"
import { useUser } from '@/app/provider'


import { Progress } from '@/components/ui/progress'

import { Loader2Icon, Rocket } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const UserStatus = () => {

    const [loading, setLoading] = useState(true);

    const userObj = useUser();

    useEffect(() => {
        if (userObj) {
            setLoading(false);
        }

    }, [userObj])


    const user = userObj?.user;
    console.log(user);
    return (

        <>
            {loading && <div> <Loader2Icon className='animate-spin' /> Loading... </div>}
            {!loading &&
                <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border-l-4 border-blue-500">




                    <div className="flex items-center justify-between flex-wrap gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Rocket className="w-8 h-8 text-blue-600" />

                            </div>
                            <div>
                                <div className="text-3xl font-bold text-blue-600">
                                    {user?.credits}
                                </div>
                                <div className="text-sm text-gray-500">Credits Remaining</div>
                            </div>


                        </div>

                        <div className="flex gap-8">

                            <div className="text-center">
                                <div className="text-sm text-gray-500">
                                    {/* Expires: {new Date(currentUser.planExpiry).toLocaleDateString()} */}
                                    Expires: 30/01/2026

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Credits Progress Bar */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Credits Used</span>
                            <span>{user?.credits}/100</span>
                        </div>

                        <Progress value={33} />

                    </div>




                </div>
            }
        </>
    )
}

export default UserStatus