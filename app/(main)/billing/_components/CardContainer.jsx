
"use client"
import { plans } from '@/services/Constants';
import { Check, Crown, Star, Users, Zap } from 'lucide-react';
import React, { useState } from 'react'


const CardContainer = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);



    const getColorClasses = (color, type = 'border') => {
        const colorMap = {
            blue: {
                border: 'border-blue-500',
                bg: 'bg-blue-500',
                bgLight: 'bg-blue-50',
                text: 'text-blue-600',
                hover: 'hover:bg-blue-600'
            },

        };
        return colorMap[color][type];
    };


    return (
        <>
            <div className="grid grid-cols-1  lg:grid-cols-2   gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                                    <Star className="w-4 h-4" />
                                    <span>Most Popular</span>
                                </div>
                            </div>
                        )}

                        <div className="p-8">
                            {/* Plan Header */}
                            <div className="text-center mb-6">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getColorClasses(plan.color, 'bgLight')} mb-4`}>
                                    <div className={getColorClasses(plan.color, 'text')}>
                                        {plan.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                                <div className="text-4xl font-bold text-gray-800">
                                    ${plan.price}
                                    <span className="text-lg text-gray-500 font-normal">/month</span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-3 mb-8">
                                {plan.features.map((feature, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className={`p-1 rounded-full ${getColorClasses(plan.color, 'bg')} flex-shrink-0 mt-0.5`}>
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-gray-700 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Purchase Button */}
                            <button
                                onClick={() => setSelectedPlan(plan.id)}
                                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${selectedPlan === plan.id
                                    ? `${getColorClasses(plan.color, 'bg')} text-white`
                                    : `border-2 ${getColorClasses(plan.color, 'border')} ${getColorClasses(plan.color, 'text')} hover:${getColorClasses(plan.color, 'bg')} `
                                    }`}
                            >
                                {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedPlan && (
                <div className="mt-12 bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Ready to upgrade to {plans.find(p => p.id === selectedPlan)?.name}?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Click below to proceed with your purchase
                        </p>
                        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            )}



        </>
    )
}

export default CardContainer