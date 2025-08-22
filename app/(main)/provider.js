import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import { AppSidebar } from "./_components/AppSidebar"
import WelcomeContainer from './dashboard/_components/WelcomeContainer'
import MobileNavigation from './dashboard/_components/MobileNavigation'
import BackgroundLines from '@/components/Background'

const DashboardProvider = ({ children }) => {
    return (
        <SidebarProvider>
            <AppSidebar />


            <div className='  bg-gray-100 p-10 w-full'>


                {/* <SidebarTrigger /> */}

                <div className="block md:hidden">
                    <MobileNavigation />
                </div>


                <WelcomeContainer />

                {children}


            </div>



        </SidebarProvider>


    )
}

export default DashboardProvider


