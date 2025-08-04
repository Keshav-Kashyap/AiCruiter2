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
import { InterviewType } from '@/services/Constants'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

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
        <div className='p-5 bg-white rounded-xl '>


            <div>

                <h2 className='text-sm font-medium'>Job Position</h2>
                <Input placeholder="e.g. Full Stack Developer"
                    className="mt-2"
                    onChange={(event) => onHandleInputChange('jobPosition', event.target.value)}
                />

            </div>


            <div className='mt-5'>

                <h2 className='text-sm font-medium'>Job Description</h2>

                <Textarea placeholder="Enter details job description" className="h-[200px] mt-2" onChange={(event) => onHandleInputChange('jobDescription', event.target.value)} />

            </div>

            <div className='mt-5'>

                <h2 className='text-sm font-medium'>Interview Duration</h2>

                <Select onValueChange={(value) => onHandleInputChange('duration', value)}>
                    <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Select Duration" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5 min">5 min</SelectItem>
                        <SelectItem value="15 min">15 min</SelectItem>
                        <SelectItem value="30 min">30 min</SelectItem>
                        <SelectItem value="45 min">45 min</SelectItem>
                        <SelectItem value="60 min">60 min</SelectItem>
                    </SelectContent>
                </Select>


            </div>

            <div className='mt-5'>

                <h2 className='text-sm font-medium'>Interview Type</h2>

                <div className='flex gap-3 mt-3 flex-wrap'>
                    {InterviewType.map((type, index) => (
                        <div key={index} className={`flex items-center cursor-pointer gap-2 p-1 px-2 border border-gray-300 rounded-2xl transition-colors duration-200
  ${interviewType.includes(type.title)
                                ? 'bg-primary text-white hover:bg-blue-600'
                                : 'bg-white hover:bg-gray-100'}
`}


                            onClick={() => AddInterviewType(type.title)}

                        >
                            <type.icon className='h-4 w-4' />

                            <span>{type.title}</span>

                        </div>

                    ))}
                </div>

            </div>
            <div className='mt-7 flex justify-end' onClick={() => GoToNext()}>
                <Button>Generate Question <ArrowRight /></Button>
            </div>
        </div>
    )
}

export default FormContainer