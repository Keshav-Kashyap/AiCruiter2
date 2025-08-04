import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'


function CandidateFeedbackDiloage({ candidate }) {

    const feedback = candidate?.feedback?.feedback;
    console.log(feedback);



    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='text-primary'>View Report</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Feedback</DialogTitle>
                    <DialogDescription asChild>

                        <div className='mt-5'>

                            <div className='flex items-center justify-between'>

                                <div className='flex items-center gap-5'>
                                    <h2 className='bg-primary p-3 px-4.5   font-bold text-white rounded-full'> {candidate?.userName[0].toUpperCase()}</h2>
                                    <div >

                                        <h2 className='font-bold'>{candidate?.userName}</h2>
                                        <h2 className='text-sm text-gray-500' >  {candidate?.userEmail}  </h2>
                                    </div>
                                </div>

                                <div className='flex gap-3 items-center'>
                                    <h2 className='text-primary text-2xl font-bold'>6/10</h2>



                                </div>




                            </div>

                            <div className='mt-5'>

                                <h2 className='font-bold' >Skill Assesement</h2>

                                <div className='mt-3 grid grid-cols-2 gap-10'>
                                    <div >
                                        <h2 className='flex justify-between'>Technical Skills <span>{feedback.rating?.technicalSkills}/10</span></h2>

                                        <Progress className='mt-1' value={feedback.rating?.technicalSkills * 10} />
                                    </div>


                                    <div >
                                        <h2 className='flex justify-between'>Communication<span>{feedback.rating?.communication}/10</span></h2>

                                        <Progress className='mt-1' value={feedback.rating?.communication * 10} />
                                    </div>
                                    <div >
                                        <h2 className='flex justify-between'>Problem Solving <span>{feedback.rating?.problemSolving}/10</span></h2>

                                        <Progress className='mt-1' value={feedback.rating?.problemSolving * 10} />
                                    </div>
                                    <div >
                                        <h2 className='flex justify-between'> Experience <span>{feedback.rating?.experience}/10</span></h2>

                                        <Progress className='mt-1' value={feedback.rating?.experience * 10} />
                                    </div>



                                </div>


                            </div>

                            <div className='mt-5'>

                                <h2 className='font-bold'>Performance Summery</h2>

                                <div className='p-5 bg-secondary my-3 rounded-md'>
                                    <p >{feedback.summery}</p>
                                </div>

                            </div>


                            <div className={`p-5 mt-10 flex items-center justify-between rounded-md ${feedback?.Recommendation == 'Not Recommended' ? 'bg-red-100' : 'bg-green-100'}  `}>

                                <div>

                                    <h2 className={` font-bold ${feedback?.Recommendation == 'Not Recommended' ? 'text-red-700' : 'text-green-700'} `} > Recommendation Message: </h2>
                                    <p className={` mt-2 ${feedback?.Recommendation == 'Not Recommended' ? 'text-red-500' : 'text-green-500'} `}  >{feedback?.RecommendationMsg}</p>
                                </div>
                                <Button className={` ${feedback?.Recommendation == 'Not Recommended' ? 'bg-red-700 hover:bg-red-800 ' : 'bg-green-700 hover:bg-green-800'} `}> {feedback?.Recommendation} </Button>
                            </div>


                        </div>


                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )

}

export default CandidateFeedbackDiloage