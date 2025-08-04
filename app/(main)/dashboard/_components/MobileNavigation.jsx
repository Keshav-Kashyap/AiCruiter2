"use client"

import { ToggleLeft, Video } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';



const MobileNavigation = () => {
    return (
        <div className='w-full p-4 bg-white flex items-center justify-between rounded-lg mb-10'>

            <div>

                <SidebarTrigger />

            </div>
            <div>


                <Image src='/logo.png' alt='logo' width={100} height={100} />

            </div>
            <div>
                <Link href="dashboard/create-interview">
                    <Video />
                </Link>
            </div>

        </div >
    )
}

export default MobileNavigation