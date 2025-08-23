import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = ({ loadingMessage, loadingDescription }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center space-y-4">
                <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full inline-block">
                    <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{loadingMessage || 'Loading...'}</h3>
                <p className="text-gray-500 dark:text-gray-400">{loadingDescription || 'Please wait...'}</p>
            </div>
        </div>
    )
}

export default Loading