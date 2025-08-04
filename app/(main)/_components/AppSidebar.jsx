"use client"

import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { SideBarOptions } from "@/services/Constants"
import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
export function AppSidebar() {

    const path = usePathname();


    return (
        <Sidebar>
            <SidebarHeader className='flex items-center mt-5'>

                <Image src={'/logo.png'} alt="logo" width={200} height={100} className="w-[150px]" />

                <Link className="w-full" href="dashboard/create-interview">
                    <Button className='w-full mt-5' ><Plus />Creat New Interview </Button>
                </Link>


            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>

                    <SidebarContent>
                        <SidebarMenu>

                            {SideBarOptions.map((option, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild className={`p-5 ${path == option.path && 'bg-blue-100'}`}>
                                        <Link href={option.path}>
                                            <option.icon className={`${path == option.path && 'text-primary'}`} />
                                            <span className={`text-[16px] ${path == option.path && 'text-primary'}`}>{option.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}

                        </SidebarMenu>
                    </SidebarContent>

                </SidebarGroup>

            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}