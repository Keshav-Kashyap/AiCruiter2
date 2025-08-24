import React from 'react'
import { Check, CreditCard, Sparkles } from 'lucide-react'

const ConfirmContainer = ({ selectedPlan, plans }) => {
    const selectedPlanData = plans?.find(p => p.id === selectedPlan);

    return (
        <>
            {selectedPlan && selectedPlanData && (
                <div className="mt-12 relative">
                    {/* Background glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 rounded-2xl blur-lg"></div>

                    <div className="relative bg-gradient-to-br from-white/90 to-green-50/50 dark:from-gray-800/90 dark:to-green-900/20 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-gray-200/50 dark:border-gray-700/50 border-l-4 border-l-green-500 dark:border-l-green-400">

                        {/* Success Icon */}
                        <div className="text-center mb-8">
                            <div className="relative inline-flex items-center justify-center">
                                {/* Animated rings */}
                                <div className="absolute w-20 h-20 bg-green-500/20 dark:bg-green-400/20 rounded-full animate-pulse"></div>
                                <div className="absolute w-16 h-16 bg-green-500/30 dark:bg-green-400/30 rounded-full animate-pulse delay-75"></div>

                                {/* Main icon */}
                                <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-full flex items-center justify-center shadow-lg">
                                    <Check className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-center space-y-6">
                            {/* Title with sparkles */}
                            <div className="flex items-center justify-center gap-3">
                                <Sparkles className="w-6 h-6 text-green-500 dark:text-green-400 animate-pulse" />
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    Ready to upgrade to {selectedPlanData.name}?
                                </h3>
                                <Sparkles className="w-6 h-6 text-green-500 dark:text-green-400 animate-pulse" />
                            </div>

                            {/* Plan details */}
                            <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-600/50 max-w-md mx-auto">
                                <div className="flex items-center justify-center space-x-4 mb-4">
                                    <div className="text-green-600 dark:text-green-400">
                                        {selectedPlanData.icon}
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                            ${selectedPlanData.price}
                                            <span className="text-lg text-gray-500 dark:text-gray-400 font-normal">/month</span>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedPlanData.features?.length} features included
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
                                You're just one click away from unlocking all the powerful features of our {selectedPlanData.name}.
                                Let's get you started!
                            </p>

                            {/* Payment Button */}
                            <div className="pt-4">
                                <button className="group relative inline-flex items-center justify-center">
                                    {/* Button glow effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>

                                    {/* Main button */}
                                    <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-green-600 dark:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800 text-white font-semibold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-3">
                                        <CreditCard className="w-5 h-5" />
                                        <span>Proceed to Payment</span>
                                        <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-200"></div>
                                        <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce delay-300"></div>
                                    </div>
                                </button>
                            </div>

                            {/* Security note */}
                            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-6">
                                <div className="w-3 h-3 bg-green-500/20 dark:bg-green-400/20 rounded-full flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full"></div>
                                </div>
                                <span>Secure payment • 30-day money back guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ConfirmContainer