"use client";

const InterviewParticipantCard = ({ name, isActive, statusText = 'Speaking...', idleText = 'Listening', children }) => {
    return (
        <div className='bg-white flex items-center justify-center dark:bg-gray-800 rounded-xl h-65 shadow-lg border border-gray-200 dark:border-gray-700'>
            <div className='p-6 flex items-center flex-col gap-4'>
                {children}

                <div className='flex-1 min-w-0 items-center justify-center flex flex-col'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white truncate'>
                        {name}
                    </h3>
                    <div className='flex items-center gap-2 mt-1'>
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                        <span className='text-xs text-gray-600 dark:text-gray-400'>
                            {isActive ? statusText : idleText}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewParticipantCard;