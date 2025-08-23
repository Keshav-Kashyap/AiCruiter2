import React from 'react'
import { MessageCircle, Tag, CheckCircle2, Brain } from 'lucide-react'

const QuestionListContainer = ({ questionList }) => {

    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'technical':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50';
            case 'behavioral':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700/50';
            case 'situational':
                return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700/50';
            case 'experience':
                return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700/50';
            default:
                return 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
        }
    };

    const getTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'technical':
                return <Brain className='w-3 h-3' />;
            case 'behavioral':
            case 'situational':
                return <MessageCircle className='w-3 h-3' />;
            default:
                return <Tag className='w-3 h-3' />;
        }
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center gap-3 p-6 pb-0'>
                <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center'>
                    <CheckCircle2 className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                    <h2 className='font-bold text-xl text-gray-900 dark:text-white'>
                        Generated Interview Questions
                    </h2>
                    <p className='text-sm text-gray-600 dark:text-gray-300'>
                        {questionList?.length} AI-powered questions ready for your interview
                    </p>
                </div>
            </div>

            {/* Questions List */}
            <div className='px-6 pb-6 space-y-4'>
                {questionList?.map((item, index) => (
                    <div
                        key={index}
                        className='group p-5 border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50/50 dark:bg-gray-700/30 hover:bg-white dark:hover:bg-gray-700/50 hover:shadow-md transition-all duration-200 hover:scale-[1.01]'
                    >
                        {/* Question Header */}
                        <div className='flex items-start justify-between gap-4 mb-3'>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0'>
                                    <span className='text-sm font-bold text-blue-600 dark:text-blue-400'>
                                        {index + 1}
                                    </span>
                                </div>
                                <div className='min-w-0 flex-1'>
                                    <h3 className='font-semibold text-gray-900 dark:text-white leading-relaxed'>
                                        {item.question}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Question Type Badge */}
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${getTypeColor(item?.type)}`}>
                                    {getTypeIcon(item?.type)}
                                    <span className='capitalize'>{item?.type || 'General'}</span>
                                </div>
                            </div>

                            {/* Question Difficulty Indicator (if available) */}
                            {item?.difficulty && (
                                <div className='flex items-center gap-1'>
                                    {[...Array(3)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 h-2 rounded-full ${i < (item.difficulty === 'easy' ? 1 : item.difficulty === 'medium' ? 2 : 3)
                                                ? 'bg-blue-500'
                                                : 'bg-gray-300 dark:bg-gray-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Summary */}
            <div className='px-6 pb-2'>
                <div className='flex items-center justify-between p-4 bg-blue-50/80 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50'>
                    <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center'>
                            <Brain className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                        </div>
                        <div>
                            <p className='text-sm font-semibold text-blue-900 dark:text-blue-200'>
                                AI-Generated Questions
                            </p>
                            <p className='text-xs text-blue-700 dark:text-blue-300'>
                                Tailored for your specific job requirements
                            </p>
                        </div>
                    </div>
                    <div className='text-right'>
                        <p className='text-lg font-bold text-blue-600 dark:text-blue-400'>
                            {questionList?.length}
                        </p>
                        <p className='text-xs text-blue-700 dark:text-blue-300'>
                            Questions
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionListContainer