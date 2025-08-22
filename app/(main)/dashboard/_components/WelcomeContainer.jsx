"use client"

import { useUser } from '@/app/provider'
import ThemeToggle from '@/components/ThemeToggle';
import Image from 'next/image';
import React from 'react'


const WelcomeContainer = () => {
    const { user } = useUser();
    // if (user) {
    //     console.log(user);
    // }


    return (
        <div className='bg-white p-5 rounded-xl flex justify-between items-center'>

            <div >
                <h2 className='text-lg font-bold'>
                    Welcome Back ,{user?.name}
                </h2>
                <h2 className='text-gray'>Ai-Driven Interviews,Hassel-Free Hiring</h2>
            </div>

            {user && <Image src={user?.picture} alt="UserAvtar" width={40} height={40}
                className='rounded-full'

            />}

            <ThemeToggle />




        </div>
    )
}

export default WelcomeContainer