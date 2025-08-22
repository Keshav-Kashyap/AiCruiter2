import React from 'react'
import DashboardProvider from './provider'


const DashboardLayout = ({ children }) => {
    return (


        <DashboardProvider>
            <div >


                {children}


            </div>
        </DashboardProvider>



    )
}

export default DashboardLayout