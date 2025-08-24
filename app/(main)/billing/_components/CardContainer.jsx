"use client"
import { Check, Star } from 'lucide-react';
import React, { useState } from 'react'

const CardContainer = ({ plans, getColorClasses }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${plan.popular
                                ? `ring-2 ${getColorClasses(plan.color, 'ring')} scale-105`
                                : 'hover:scale-102'
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span>Most Popular</span>
                                </div>
                            </div>
                        )}

                        {/* Gradient overlay for popular plan */}
                        {plan.popular && (
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10 rounded-2xl pointer-events-none"></div>
                        )}

                        <div className="relative p-8">
                            {/* Plan Header */}
                            <div className="text-center mb-8">
                                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${getColorClasses(plan.color, 'bgLight')} mb-6 shadow-lg`}>
                                    <div className={getColorClasses(plan.color, 'text')}>
                                        {plan.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{plan.name}</h3>
                                <div className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    ${plan.price}
                                    <span className="text-xl text-gray-500 dark:text-gray-400 font-normal">/month</span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-4 mb-8">
                                {plan.features.map((feature, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className={`p-1.5 rounded-full ${getColorClasses(plan.color, 'bg')} flex-shrink-0 mt-1 shadow-sm`}>
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Purchase Button */}
                            <button
                                onClick={() => setSelectedPlan(plan.id)}
                                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg transform hover:-translate-y-1 ${selectedPlan === plan.id
                                        ? `${getColorClasses(plan.color, 'bg')} text-white shadow-xl`
                                        : `bg-white dark:bg-gray-700 border-2 ${getColorClasses(plan.color, 'border')} ${getColorClasses(plan.color, 'text')} hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white dark:hover:from-blue-600 dark:hover:to-purple-700`
                                    }`}
                            >
                                {selectedPlan === plan.id ? '✓ Selected' : 'Choose Plan'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Purchase Confirmation */}
            {selectedPlan && (
                <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm border border-green-200 dark:border-green-700 rounded-2xl shadow-lg p-8 border-l-4 border-l-green-500 dark:border-l-green-400">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                            Ready to upgrade to {plans.find(p => p.id === selectedPlan)?.name}?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                            Click below to proceed with your purchase and unlock all features
                        </p>
                        <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default CardContainer