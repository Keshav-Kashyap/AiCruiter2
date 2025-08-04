import { Button } from '@/components/ui/button'
import moment from 'moment'
import React from 'react'
import CandidateFeedbackDiloage from './CandidateFeedbackDiloage'


function CandidatList({ candidateList }) {
    // console.log(candidateList);
    return (
        <div className='mt-5'>
            <h2 className='font-bold text -lg'>Candidates({candidateList?.length})</h2>


            {candidateList?.map((candidate, index) => (
                <div key={index} className='p-5 mt-5 flex gap-3 justify-between items-center bg-white rounded-lg'>


                    <div className='flex items-center gap-5'>
                        <h2 className='bg-primary p-3 px-4.5   font-bold text-white rounded-full'> {candidate?.userName[0].toUpperCase()}</h2>
                        <div >

                            <h2 className='font-bold'>{candidate?.userName}</h2>
                            <h2 className='text-sm text-gray-500' >Completed On:{moment(candidate?.created_at).format('MMM DD, yy')}</h2>
                        </div>
                    </div>

                    <div className='flex gap-3 items-center'>
                        <h2 className='text-green-600'>6/10</h2>

                        <CandidateFeedbackDiloage candidate={candidate} />

                    </div>



                </div>
            ))}

        </div>
    )
}

export default CandidatList