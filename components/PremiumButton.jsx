import { Variable } from 'lucide-react'
import React from 'react'

export const PremiumButton = ({ variant, label, onClick }) => {

    return (

        <button

            onClick={onClick}
            className={` ${variant !== "outline" ? "px-8 py-3 rounded-full bg-gradient-to-b from-white to-neutral-300 text-black font-semibold hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 w-full sm:w-auto max-w-xs sm:max-w-none" : "px-8 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto max-w-xs sm:max-w-none"}`}>



            {label}

        </button>




    )
}


