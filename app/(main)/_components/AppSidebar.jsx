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
    useSidebar
} from "@/components/ui/sidebar"
import { SideBarOptions } from "@/services/Constants"
import { Plus, PanelLeftClose, PanelLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function AppSidebar() {
    const path = usePathname();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <TooltipProvider>
            <Sidebar
                collapsible="icon"
                className="border-r border-gray-200/60 bg-white shadow-lg"
                style={{
                    "--sidebar-width": "280px",
                    "--sidebar-width-icon": "60px"
                }}
            >
                <SidebarHeader className='relative p-4 bg-gradient-to-br from-slate-50 to-gray-100 border-b border-gray-200/50'>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 overflow-hidden">
                            {!isCollapsed && (
                                <div className="flex items-center gap-2 animate-in fade-in-0 slide-in-from-left-2 duration-300">

                                    <Image
                                        src={'/logo2.png'}
                                        alt="logo"
                                        width={120}
                                        height={40}
                                        className="w-[40px] h-auto"
                                    />

                                    <h2 className="text-xl ">QRA</h2>
                                </div>
                            )}

                        </div>
                        <SidebarTrigger className="ml-auto hover:bg-gray-100 rounded-lg p-1.5 transition-colors">
                            {isCollapsed ?
                                <PanelLeft className="h-4 w-4 text-gray-600" /> :
                                <PanelLeftClose className="h-4 w-4 text-gray-600" />
                            }
                        </SidebarTrigger>
                    </div>
                </SidebarHeader>

                <SidebarContent className={`py-4 ${isCollapsed ? 'px-1' : 'px-3'}`}>
                    <SidebarGroup>
                        <div className={`mb-6 ${isCollapsed ? 'flex justify-center' : ''}`}>
                            {isCollapsed ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href="/dashboard/create-interview">
                                            <Button
                                                size="sm"
                                                className="w-12 h-12 p-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 rounded-xl"
                                            >
                                                <Plus className="h-5 w-5" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="font-medium">
                                        Create New Interview
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <Link href="/dashboard/create-interview" className="w-full">
                                    <Button
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] rounded-xl font-medium"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create New Interview
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {!isCollapsed && (
                            <div className="px-3 py-2 mb-3">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</h3>
                            </div>
                        )}

                        <SidebarMenu className={`space-y-1 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
                            {SideBarOptions.map((option, index) => (
                                <SidebarMenuItem key={index} className={isCollapsed ? 'w-full flex justify-center' : ''}>
                                    {isCollapsed ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton
                                                    asChild
                                                    className={`
                                                        w-12 h-12 p-0 rounded-xl transition-all duration-200
                                                        hover:bg-gray-100 hover:scale-105 group
                                                        ${path === option.path
                                                            ? 'bg-blue-50 border border-blue-200 shadow-sm'
                                                            : 'hover:shadow-sm'
                                                        }
                                                    `}
                                                >
                                                    <Link href={option.path} className="flex items-center justify-center w-full h-full">
                                                        <option.icon
                                                            className={`h-5 w-5 transition-colors ${path === option.path
                                                                ? 'text-blue-600'
                                                                : 'text-gray-500 group-hover:text-gray-700'
                                                                }`}
                                                        />
                                                    </Link>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="font-medium">
                                                {option.name}
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <SidebarMenuButton
                                            asChild
                                            className={`
                                                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                                                hover:bg-gray-50 hover:scale-[1.01] hover:shadow-sm group
                                                ${path === option.path
                                                    ? 'bg-blue-50 border border-blue-200/50 shadow-sm text-blue-700'
                                                    : 'text-gray-700 hover:text-gray-900'
                                                }
                                            `}
                                        >
                                            <Link href={option.path} className="flex items-center gap-3 w-full">
                                                <div className={`
                                                    w-6 h-6 rounded-lg flex items-center justify-center transition-colors
                                                    ${path === option.path
                                                        ? 'bg-blue-100 text-blue-600'
                                                        : 'text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-700'
                                                    }
                                                `}>
                                                    <option.icon className="h-4 w-4" />
                                                </div>
                                                <span className={`text-sm font-medium transition-colors ${path === option.path ? 'text-blue-700' : 'text-gray-700'
                                                    }`}>
                                                    {option.name}
                                                </span>
                                                {path === option.path && (
                                                    <div className="ml-auto flex items-center">
                                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                                    </div>
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className={`border-t border-gray-200/50 bg-gray-50/50 ${isCollapsed ? 'p-2' : 'p-3'}`}>
                    {!isCollapsed ? (
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="font-medium">System Online</span>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">© 2024 Interview AI</p>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        </div>
                    )}
                </SidebarFooter>
            </Sidebar>
        </TooltipProvider>
    )
}