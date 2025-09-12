import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React, { useEffect, useState } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { companySelected, InterviewType } from '@/services/Constants'
import { Button } from '@/components/ui/button'
import { ArrowRight, Briefcase, FileText, Clock, Tags, Globe } from 'lucide-react'


const FormContainer = ({ onHandleInputChange, GoToNext }) => {

    const [interviewType, setInterviewType] = useState([]);

    useEffect(() => {
        if (interviewType) {
            onHandleInputChange('type', interviewType);
        }
    }, [interviewType])

    const AddInterviewType = (type) => {
        const data = interviewType.includes(type);
        if (!data) {
            setInterviewType(prev => [...prev, type])
        } else {
            const result = interviewType.filter(item => item != type);
            setInterviewType(result);
        }
    }






    

    return (
        <div className='p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200'>

            {/* Job Position */}
            <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                    <Briefcase className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                    <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>Job Position</h2>
                </div>
                <Input
                    placeholder="e.g. Full Stack Developer"
                    className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors"
                    onChange={(event) => onHandleInputChange('jobPosition', event.target.value)}
                />
            </div>





            {/* Job Description */}
            <div className='mt-6 space-y-3'>
                <div className='flex items-center gap-2'>
                    <FileText className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                    <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>Job Description</h2>
                </div>
                <Textarea
                    placeholder="Enter detailed job description, required skills, and responsibilities"
                    className="h-[180px] border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors resize-none"
                    onChange={(event) => onHandleInputChange('jobDescription', event.target.value)}
                />
            </div>



                    {/*Company Selection */}


<div className='mt-6 space-y-3'>
                <div className='flex items-center gap-2'>
                    <Tags className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                    <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>Select Company</h2>
                </div>
                <p className='text-xs text-gray-600 dark:text-gray-400'>Select Your Company</p>
                <div className='flex gap-2 flex-wrap'>
                    {companySelected.map((type, index) => (
                        <div
                            key={index}
                            className={`flex items-center   cursor-pointer gap-2 px-3 py-2 border rounded-xl transition-all duration-200 hover:scale-105 {true}
                                ? 'bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500 shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
                                }`}
                        
                        >
                            <type.icon className='h-4 w-4' />
                            <span className='text-xs'>{type.title}</span>
                        </div>
                    ))}
                </div>
                {companySelected.length > 0 && (
                    <div className='mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50'>
                        <p className='text-xs text-blue-700 dark:text-blue-300 font-medium'>
                            Selected: {companySelected.join(', ')}
                        </p>
                    </div>
                )}
            </div>



            {/* Interview Duration */}
            <div className='mt-6 space-y-3'>
                <div className='flex items-center gap-2'>
                    <Clock className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                    <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>Interview Duration</h2>
                </div>
                <Select onValueChange={(value) => onHandleInputChange('duration', value)}>
                    <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <SelectValue placeholder="Select Duration" className="text-gray-500 dark:text-gray-400" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                        <SelectItem value="5 min" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">5 min</SelectItem>
                        <SelectItem value="15 min" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">15 min</SelectItem>
                        <SelectItem value="30 min" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">30 min</SelectItem>
                        <SelectItem value="45 min" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">45 min</SelectItem>
                        <SelectItem value="60 min" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">60 min</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className='mt-6 space-y-3'>

                <div className='flex items-center gap-2'>
                    <Globe className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                    <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>Interview Language</h2>
                </div>
                <Select onValueChange={(value) => onHandleInputChange('language', value)}>
                    <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <SelectValue placeholder="Select Language" className="text-gray-500 dark:text-gray-400" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                        <SelectItem value="hindi" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">Hindi</SelectItem>
                        <SelectItem value="english" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">English</SelectItem>
                    </SelectContent>
                </Select>




            </div>





            {/* Interview Type */}
            <div className='mt-6 space-y-3'>
                <div className='flex items-center gap-2'>
                    <Tags className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                    <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>Interview Type</h2>
                </div>
                <p className='text-xs text-gray-600 dark:text-gray-400'>Select multiple types that apply to your interview</p>
                <div className='flex gap-2 flex-wrap'>
                    {InterviewType.map((type, index) => (
                        <div
                            key={index}
                            className={`flex items-center cursor-pointer gap-2 px-3 py-2 border rounded-xl transition-all duration-200 hover:scale-105 ${interviewType.includes(type.title)
                                ? 'bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500 shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
                                }`}
                            onClick={() => AddInterviewType(type.title)}
                        >
                            <type.icon className='h-4 w-4' />
                            <span className='text-sm font-medium'>{type.title}</span>
                        </div>
                    ))}
                </div>
                {interviewType.length > 0 && (
                    <div className='mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50'>
                        <p className='text-xs text-blue-700 dark:text-blue-300 font-medium'>
                            Selected: {interviewType.join(', ')}
                        </p>
                    </div>
                )}
            </div>

            {/* Generate Button */}
            <div className='mt-8 flex justify-end'>
                <Button
                    onClick={() => GoToNext()}
                    className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2 transition-all duration-200 hover:scale-105 hover:shadow-lg group'
                >
                    Generate Questions
                    <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200' />
                </Button>
            </div>
        </div>
    )
}

export default FormContainer