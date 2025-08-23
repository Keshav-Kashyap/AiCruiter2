import { Calendar, Clock, MessageCircleQuestion, Briefcase, FileText, HelpCircle } from 'lucide-react'
import moment from 'moment'
import React from 'react'

function InterviewDetailContainer({ interviewDetail }) {
    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 mt-5">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{interviewDetail?.jobPosition}</h1>
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-full"></div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                            <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Duration</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{interviewDetail?.duration}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Created On</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{moment(interviewDetail?.created_at).format('MMM DD, YYYY')}</p>
                        </div>
                    </div>
                </div>

                {interviewDetail?.type && (
                    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                                <MessageCircleQuestion className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Type</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{JSON.parse(interviewDetail?.type)[0]}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Job Description Section */}
            <div className="p-5 rounded-lg border border-gray-200 dark:border-gray-700 mb-6 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Job Description</h2>
                </div>
                <div className="pl-8 border-l-4 border-orange-500 dark:border-orange-400">
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                        {interviewDetail?.jobDescription}
                    </p>
                </div>
            </div>

            {/* Interview Questions Section */}
            <div className="p-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-4">
                    <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Interview Questions</h2>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                        {interviewDetail?.questionList?.length || 0} Questions
                    </span>
                </div>

                <div className="space-y-3">
                    {interviewDetail?.questionList?.map((item, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-lg transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                        >
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-500 dark:bg-indigo-600 text-white">
                                    {index + 1}
                                </span>
                                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                                    {item?.question}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {(!interviewDetail?.questionList || interviewDetail.questionList.length === 0) && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No questions available</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InterviewDetailContainer