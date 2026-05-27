"use client";

const InterviewInfoPanel = ({ isCallActive, interviewInfo, languageLabel }) => {
    return (
        <div className='mt-8 text-center'>
            {!isCallActive ? (
                <div className='space-y-3'>
                    <p className='text-gray-700 dark:text-gray-300 font-medium'>
                        Interview for: {interviewInfo?.interviewData?.jobPosition || 'Loading...'}
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Make sure your microphone is working and you're in a quiet environment
                    </p>
                    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-blue-700 dark:text-blue-300'>
                            <div className='text-center'>
                                <strong>Professional Tips</strong>
                                <p className='mt-1'>Speak clearly and take your time</p>
                            </div>
                            <div className='text-center'>
                                <strong>Language</strong>
                                <p className='mt-1'>{languageLabel || 'English'}</p>
                            </div>
                            <div className='text-center'>
                                <strong>Duration</strong>
                                <p className='mt-1'>Max 30 minutes</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='space-y-2'>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Your interview is being professionally recorded and analyzed
                    </p>
                    <p className='text-xs text-gray-400 dark:text-gray-500'>
                        Use the mute button if you need a moment to think
                    </p>
                    <div className='flex justify-center items-center gap-4 mt-4'>
                        <div className='text-xs text-gray-500'>
                            Questions: {interviewInfo?.interviewData?.questionList?.length || 'Default'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewInfoPanel;