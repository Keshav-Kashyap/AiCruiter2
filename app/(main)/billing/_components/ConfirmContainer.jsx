import React from 'react'

const ConfirmContainer = ({ selectedPlan }) => {
    return (
        <>
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

export default ConfirmContainer